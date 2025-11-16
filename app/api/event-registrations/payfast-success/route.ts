import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({})) as Record<string, any>
    const registration_id = String(body.registration_id || "").trim()
    const params = (body.params || {}) as Record<string, any>

    if (!registration_id) {
      return NextResponse.json({ ok: false, error: "missing_registration_id" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ ok: false, error: "service_role_missing" }, { status: 500 })
    }

    const amountRaw = params?.TXNAMT ?? params?.amount ?? params?.transaction_amount
    const amount = amountRaw ? Number(amountRaw) : null
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

    // Store PayFast audit
    const { error: auditError } = await supabase.from("payfast_transactions").insert(record)
    if (auditError) {
      console.error("[Event PayFast] Audit insert failed:", auditError)
    }

    // Update registration to paid
    const { error: updError } = await supabase
      .from("event_registrations")
      .update({
        payment_status: "paid",
        payment_method: "PayFast",
        updated_at: new Date().toISOString(),
      })
      .eq("registration_id", registration_id)

    if (updError) {
      return NextResponse.json({ ok: false, error: updError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unknown_error" }, { status: 500 })
  }
}