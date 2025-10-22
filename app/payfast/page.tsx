import React from "react"
import { headers } from "next/headers"
import AutoSubmit from "../../components/auto-submit"

function generateRandomString(length = 4) {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters[Math.floor(Math.random() * characters.length)]
  }
  return result
}

export default async function PaymentLiveePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const merchant_id = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || "236158"
  const secured_key =
    process.env.PAYFAST_SECURED_KEY ||
    process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY ||
    "Q3wan82UVtL5Y2r28eF6KgMh4Rdn"
  const currency_code = "PKR"

  const sp = searchParams ? await searchParams : undefined
  const amountParam = sp?.amount
  const amount =
    typeof amountParam === "string" && amountParam ? amountParam : "5"

  const basket_id = "001" + generateRandomString(4)

  // Compute site url for success/failure redirects using current request host
  const headersList = await headers()
  const host = headersList.get("host") ?? "humsafarforeverlove.com"
  const proto = headersList.get("x-forwarded-proto") ?? "https"
  const siteUrl = `${proto}://${host}`

  // Get Access Token from PayFast API
  let token = ""
  try {
    const tokenApiUrl =
      "https://ipg1.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken"
    const formBody = new URLSearchParams({
      MERCHANT_ID: merchant_id,
      SECURED_KEY: secured_key,
      BASKET_ID: basket_id,
      TXNAMT: amount,
      CURRENCY_CODE: currency_code,
    })

    const res = await fetch(tokenApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "NextJS PayFast Example",
      },
      body: formBody.toString(),
      cache: "no-store",
    })

    const payload = await res.json()
    token = payload?.ACCESS_TOKEN || ""
  } catch (e) {
    // swallow error; we'll render a visible message below
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Redirecting to PayFast...</h2>
      {!token ? (
        <div style={{ marginTop: 12, color: "#b91c1c" }}>
          <p>Unable to initialize PayFast. Missing access token.</p>
          <p>Please check merchant credentials and try again.</p>
        </div>
      ) : (
        <form
          className="form-inline"
          id="PayFast_payment_form"
          name="PayFast-payment-form"
          method="post"
          action="https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction"
        >
          {/* Hidden fields based on PHP example */}
          <input type="hidden" name="CURRENCY_CODE" value={currency_code} />
          <input type="hidden" name="MERCHANT_ID" value={merchant_id} />
          <input type="hidden" name="MERCHANT_NAME" value="Merchant Test" />
          <input type="hidden" name="TOKEN" value={token} />
          <input type="hidden" name="BASKET_ID" value={basket_id} />
          <input type="hidden" name="TXNAMT" value={amount} />
          <input
            type="hidden"
            name="ORDER_DATE"
            value={new Date().toISOString().slice(0, 19).replace("T", " ")}
          />
          <input
            type="hidden"
            name="SUCCESS_URL"
            value={`${siteUrl}/payment/success`}
          />
          <input
            type="hidden"
            name="FAILURE_URL"
            value={`${siteUrl}/payment/failure`}
          />
          <input
            type="hidden"
            name="CHECKOUT_URL"
            value={`${siteUrl}/payment/checkout`}
          />
          <input
            type="hidden"
            name="CUSTOMER_EMAIL_ADDRESS"
            value="someone234@gmai.com"
          />
          <input
            type="hidden"
            name="CUSTOMER_MOBILE_NO"
            value="03000000090"
          />
          <input
            type="hidden"
            name="SIGNATURE"
            value="SOME RANDOM-STRING"
          />
          <input
            type="hidden"
            name="VERSION"
            value="MERCHANT CART-0.1"
          />
          <input
            type="hidden"
            name="TXNDESC"
            value="Item Purchased from Cart"
          />
          <input type="hidden" name="PROCCODE" value="00" />
          <input type="hidden" name="TRAN_TYPE" value="ECOMM_PURCHASE" />
          <input type="hidden" name="STORE_ID" value="" />

          <noscript>
            <input type="submit" value="Proceed to PayFast" />
          </noscript>
        </form>
      )}

      {/* Auto-submit the form on load */}
+     <AutoSubmit formId="PayFast_payment_form" />
    </div>
  )
}