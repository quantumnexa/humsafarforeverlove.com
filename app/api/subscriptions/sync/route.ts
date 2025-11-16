import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

function packageLabel(pkg?: string) {
  const p = (pkg || "").toLowerCase()
  if (p.includes("premium")) return "Premium Package"
  if (p.includes("standard")) return "Standard Package"
  if (p.includes("basic")) return "Basic Package"
  return "Basic Package"
}

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "service_role_missing" },
      { status: 500 }
    )
  }

  try {
    const body = await req.json().catch(() => ({})) as { user_id?: string }
    const userId = body?.user_id

    // Fetch accepted payments; optionally restrict to a single user
    let query = supabase
      .from("payments")
      .select("user_id, views_limit, package_type, created_at")
      .eq("payment_status", "accepted")

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: payments, error } = await query
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      )
    }

    if (!payments || payments.length === 0) {
      return NextResponse.json(
        { ok: true, updated: 0, reason: "no_accepted_payments_found" },
        { status: 200 }
      )
    }

    // Aggregate views per user and pick latest package_type
    type PayRow = { user_id: string; views_limit: number; package_type?: string; created_at?: string }
    const byUser = new Map<string, { totalViews: number; latestPkg?: string; latestAt?: number }>()

    for (const row of payments as PayRow[]) {
      const key = row.user_id
      const existing = byUser.get(key)
      const createdAt = row.created_at ? new Date(row.created_at).getTime() : 0
      if (!existing) {
        byUser.set(key, {
          totalViews: Number(row.views_limit || 0),
          latestPkg: row.package_type,
          latestAt: createdAt,
        })
      } else {
        existing.totalViews += Number(row.views_limit || 0)
        if ((createdAt || 0) > (existing.latestAt || 0)) {
          existing.latestPkg = row.package_type
          existing.latestAt = createdAt
        }
      }
    }

    // Upsert into user_subscriptions; set subscription_status from latest package
    let updatedCount = 0
    const errors: Array<{ user_id: string; error: string }> = []

    for (const [uid, agg] of Array.from(byUser.entries())) {
      // Check if subscription exists
      const { data: sub, error: subErr } = await supabase
        .from("user_subscriptions")
        .select("user_id")
        .eq("user_id", uid)
        .limit(1)
        .single()

      if (subErr && subErr.code !== "PGRST116") {
        errors.push({ user_id: uid, error: subErr.message })
        continue
      }

      if (sub) {
        const { error: updErr } = await supabase
          .from("user_subscriptions")
          .update({
            views_limit: agg.totalViews,
            subscription_status: packageLabel(agg.latestPkg),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", uid)
        if (updErr) {
          errors.push({ user_id: uid, error: updErr.message })
        } else {
          updatedCount += 1
          // Reset profile views for this user so new/updated package starts fresh
          const { error: delErr } = await supabase
            .from("profile_views")
            .delete()
            .eq("viewer_user_id", uid)
          if (delErr) {
            errors.push({ user_id: uid, error: `reset_views_failed: ${delErr.message}` })
          }
        }
      } else {
        const { error: insErr } = await supabase
          .from("user_subscriptions")
          .insert({
            user_id: uid,
            views_limit: agg.totalViews,
            subscription_status: packageLabel(agg.latestPkg),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        if (insErr) {
          errors.push({ user_id: uid, error: insErr.message })
        } else {
          updatedCount += 1
          // Reset profile views for this user on initial subscription creation
          const { error: delErr } = await supabase
            .from("profile_views")
            .delete()
            .eq("viewer_user_id", uid)
          if (delErr) {
            errors.push({ user_id: uid, error: `reset_views_failed: ${delErr.message}` })
          }
        }
      }
    }

    return NextResponse.json(
      { ok: true, updated: updatedCount, errors },
      { status: 200 }
    )
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "unknown_error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  // Convenience: allow GET to run sync without body
  return POST(req)
}