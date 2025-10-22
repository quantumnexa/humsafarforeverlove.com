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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const params = (body?.params || {}) as Record<string, any>

    const amountRaw = params?.TXNAMT ?? params?.amount
    const amount = amountRaw ? Number(amountRaw) : null

    const record = {
      status: "success" as const,
      amount,
      currency: params?.CURRENCY_CODE ?? null,
      basket_id: params?.BASKET_ID ?? null,
      token: params?.TOKEN ?? null,
      order_date: params?.ORDER_DATE ?? null,
      merchant_id: params?.MERCHANT_ID ?? null,
      response_code: params?.RESPONSE_CODE ?? params?.PROCCODE ?? null,
      response_message: params?.RESPONSE_MESSAGE ?? params?.DESC ?? null,
      gateway_transaction_id: params?.TRANSACTION_ID ?? params?.TRANS_ID ?? null,
      raw_params: params,
      created_at: new Date().toISOString(),
    }

    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json(
        { ok: true, stored: false, reason: "service_role_missing" },
        { status: 200 }
      )
    }

    const { error } = await supabase.from("payfast_transactions").insert(record)
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, stored: true }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "unknown_error" },
      { status: 500 }
    )
  }
}