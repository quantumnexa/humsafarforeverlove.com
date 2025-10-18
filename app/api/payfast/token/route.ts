import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const merchant_id = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID
    const secured_key = process.env.NEXT_PUBLIC_PAYFAST_SECURE_KEY

    if (!merchant_id || !secured_key) {
      return NextResponse.json(
        { error: 'Missing PayFast environment variables' },
        { status: 500 }
      )
    }

    const basket_id = `ORDER-${Date.now()}`
    const amount = 500 // example amount; adjust as needed

    const params = new URLSearchParams({
      MERCHANT_ID: merchant_id,
      SECURED_KEY: secured_key,
      BASKET_ID: basket_id,
      TXNAMT: String(amount),
      CURRENCY_CODE: 'PKR',
    })

    const response = await fetch(
      'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      }
    )

    const data = await response
      .json()
      .catch(async () => ({ raw: await response.text() }))

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to get access token', details: data },
        { status: response.status || 500 }
      )
    }

    return NextResponse.json({ ...data, basket_id, amount })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Unexpected error' },
      { status: 500 }
    )
  }
}
