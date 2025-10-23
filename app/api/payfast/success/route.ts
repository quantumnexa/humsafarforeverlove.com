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

function mapViewsAndPackage(amount?: number) {
  if (!amount) return { views: 0, package_type: "basic" }
  if (amount === 5000) return { views: 20, package_type: "basic" }
  if (amount === 8000) return { views: 35, package_type: "standard" }
  if (amount === 13000) return { views: 55, package_type: "premium" }
  const baseViews = 55
  if (amount > 13000) {
    const extra = Math.max(0, Math.round((amount - 13000) / 200))
    return { views: baseViews + extra, package_type: "custom" }
  }
  return { views: 0, package_type: "basic" }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const params = (body?.params || {}) as Record<string, any>
    const userId = body?.user_id as string | undefined

    const amountRaw = params?.TXNAMT ?? params?.amount ?? params?.transaction_amount
    const amount = amountRaw ? Number(amountRaw) : null
    const { views, package_type } = mapViewsAndPackage(amount ?? undefined)

    const record = {
      status: "success" as const,
      amount,
      currency: params?.CURRENCY_CODE ?? params?.transaction_currency ?? null,
      basket_id: params?.BASKET_ID ?? params?.basket_id ?? null,
      token: params?.TOKEN ?? null,
      order_date: params?.ORDER_DATE ?? params?.order_date ?? null,
      merchant_id: params?.MERCHANT_ID ?? null,
      response_code: params?.RESPONSE_CODE ?? params?.PROCCODE ?? params?.err_code ?? null,
      response_message: params?.RESPONSE_MESSAGE ?? params?.DESC ?? params?.err_msg ?? null,
      gateway_transaction_id: params?.TRANSACTION_ID ?? params?.TRANS_ID ?? params?.transaction_id ?? null,
      raw_params: params,
      created_at: new Date().toISOString(),
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json(
        { ok: true, stored: false, reason: "service_role_missing", views },
        { status: 200 }
      )
    }

    // 1) Store raw gateway response for audit
    let auditStored = true
    let auditReason: string | undefined
    const { error: auditError } = await supabase.from("payfast_transactions").insert(record)
    if (auditError) {
      auditStored = false
      auditReason = auditError.message
      console.error("[PayFast] Audit insert failed:", auditError)
    }

    // 2) If we know the user, record payment and update subscription views
    let paymentStored = false
    let paymentReason: string | undefined
    let subscriptionUpdated = false
    if (userId) {
      const paymentInsert = {
        user_id: userId,
        amount: amount ?? 0,
        currency: record.currency ?? "PKR",
        views_limit: views,
        package_type,
        payment_method: "payfast",
        payment_status: "accepted", // Auto-accept on successful gateway callback
        notes: `PayFast txn: ${record.gateway_transaction_id || "n/a"}`,
        gateway_transaction_id: record.gateway_transaction_id || null,
        gateway_reference: record.basket_id || record.token || null,
        gateway_params: record.raw_params || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error: payError } = await supabase.from("payments").insert(paymentInsert)
      if (!payError) {
        paymentStored = true
        const { data: subscription } = await supabase
          .from("user_subscriptions")
          .select("user_id, views_limit, payment_status")
          .eq("user_id", userId)
          .single()

        if (subscription) {
          const current = Number(subscription.views_limit || 0)
          const { error: updErr } = await supabase
            .from("user_subscriptions")
            .update({
              views_limit: current + views,
              payment_status: "approved",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
          if (!updErr) subscriptionUpdated = true
          else console.error("[PayFast] Subscription update failed:", updErr)
        } else {
          const { error: insErr } = await supabase.from("user_subscriptions").insert({
            user_id: userId,
            views_limit: views,
            payment_status: "approved",
            subscription_status:
              package_type === "premium"
                ? "Premium Package"
                : package_type === "standard"
                ? "Standard Package"
                : "Basic Package",
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          })
          if (!insErr) subscriptionUpdated = true
          else console.error("[PayFast] Subscription insert failed:", insErr)
        }
      } else {
        paymentReason = payError.message
        console.error("[PayFast] Payment insert failed:", payError)
      }
    }

    return NextResponse.json(
      {
        ok: true,
        stored: auditStored || paymentStored,
        auditStored,
        paymentStored,
        subscriptionUpdated,
        views,
        package_type,
        user_id: userId || null,
        reason: paymentReason || auditReason,
      },
      { status: 200 }
    )
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "unknown_error" },
      { status: 500 }
    )
  }
}