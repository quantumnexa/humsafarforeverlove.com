'use client';
import React from "react";

export default function Checkout() {
  const handlePayNow = async () => {
    const tokenRes = await fetch("/api/payfast/token");
    const tokenData = await tokenRes.json();

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction";

    const fields = {
      MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID,
      MERCHANT_NAME: "Humsafar Forever Love",
      TOKEN: tokenData.ACCESS_TOKEN,
      TXNAMT: tokenData.amount,
      BASKET_ID: tokenData.basket_id,
      ORDER_DATE: new Date().toISOString().slice(0, 10),
      SUCCESS_URL: "https://humsafarforeverlove.com/payment/success",
      FAILURE_URL: "https://humsafarforeverlove.com/payment/failure",
      CUSTOMER_EMAIL_ADDRESS: "test@user.com",
      CUSTOMER_MOBILE_NO: "03001234567",
      TXNDESC: "Humsafar Premium Plan",
      PROCCODE: "00",
      VERSION: "1.0",
      SIGNATURE: "randomstring123",
    };

    for (const key in fields) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = fields[key as keyof typeof fields];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Checkout</h2>
      <p>Proceed to PayFast Secure Payment</p>
      <button
        onClick={handlePayNow}
        style={{
          backgroundColor: "#f37100",
          color: "white",
          padding: "10px 25px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Pay with PayFast
      </button>
    </div>
  );
}
