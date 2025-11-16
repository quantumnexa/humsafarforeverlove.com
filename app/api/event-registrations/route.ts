import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
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
    const body = await req.json().catch(() => ({})) as Record<string, any>

    // Extract fields
    const full_name = String(body.full_name || "").trim()
    const phone = String(body.phone || "").trim()
    const gender = String(body.gender || "").trim()
    const age = Number(body.age || 0)
    const city = String(body.city || "").trim()
    const area = String(body.area || "").trim() || null
    const income_pkr = body.income ? Number(String(body.income).replace(/,/g, "")) : null
    const profession = String(body.profession || "").trim()
    const profession_other = String(body.profession_other || "").trim() || null
    const registrant_is = String(body.registrant_is || "").trim()
    const marital_status = String(body.marital_status || "").trim()
    const adults = Number(body.adults || 0)
    const children = Number(body.children || 0)
    const payment_method = String(body.payment_method || "Card")

    // Basic validation
    if (!full_name || full_name.length < 2) {
      return NextResponse.json({ ok: false, error: "invalid_full_name" }, { status: 400 })
    }
    if (!phone) {
      return NextResponse.json({ ok: false, error: "invalid_phone" }, { status: 400 })
    }
    if (!gender || !age || age < 18 || age > 99 || !city || !profession || !registrant_is || !marital_status) {
      return NextResponse.json({ ok: false, error: "invalid_form_fields" }, { status: 400 })
    }
    if (!Number.isInteger(adults) || adults < 0 || !Number.isInteger(children) || children < 0) {
      return NextResponse.json({ ok: false, error: "invalid_attendees" }, { status: 400 })
    }

    // Pricing constants (50% discount applied)
    const ADULT_PRICE = 2500
    const CHILD_PRICE = 1000
    const adults_total = adults * ADULT_PRICE
    const children_total = children * CHILD_PRICE
    const amount_total = adults_total + children_total

    // IDs
    const registration_id = `HFL-${Math.floor(100000 + Math.random() * 900000)}`
    const transaction_id = `TX-${Date.now()}`

    // Insert
    const payload = {
      registration_id,
      full_name,
      phone,
      gender,
      age,
      city,
      area,
      income_pkr,
      profession,
      profession_other,
      registrant_is,
      marital_status,
      adults,
      children,
      adult_price: ADULT_PRICE,
      child_price: CHILD_PRICE,
      adults_total,
      children_total,
      amount_total,
      discount_percent: 50,
      discount_label: "Limited time discount applied",
      payment_method,
      // Do NOT mark as paid here. Await gateway callback.
      payment_status: "pending",
      transaction_id,
      source: "web_event_form",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("event_registrations").insert(payload)
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      {
        ok: true,
        registration_id,
        transaction_id,
        amount_total,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 })
  }
}