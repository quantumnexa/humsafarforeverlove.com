'use client';
import React from "react";

export default function Checkout() {
  const handlePayNow = async () => {
    try {
      // Step 1: get token from our backend API
      const tokenRes = await fetch("/api/payfast/token");
      const tokenData = await tokenRes.json();

      // Step 2: create a form dynamically
      const form = document.createElement("form");
      form.method = "POST";

      // ✅ now use env variables (NOT hardcoded)
      form.action = process.env.NEXT_PUBLIC_PAYFAST_TRANSACTION_URL;

      // Step 3: form fields
      const fields = {
        MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID,
        MERCHANT_NAME: process.env.NEXT_PUBLIC_MERCHANT_NAME,
        TOKEN: tokenData.ACCESS_TOKEN,
        TXNAMT: tokenData.amount,
        BASKET_ID: tokenData.basket_id,
        ORDER_DATE: new Date().toISOString().slice(0, 10),
        SUCCESS_URL: process.env.NEXT_PUBLIC_RETURN_URL,
        FAILURE_URL: process.env.NEXT_PUBLIC_CANCEL_URL,
        CUSTOMER_EMAIL_ADDRESS: "test@user.com",
        CUSTOMER_MOBILE_NO: "03001234567",
        TXNDESC: "Humsafar Premium Plan",
        PROCCODE: "00",
        VERSION: "1.0",
        SIGNATURE: "randomstring123",
      };

      // Step 4: add hidden inputs
      for (const key in fields) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      }

      // Step 5: submit
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("PayFast error:", err);
      alert("Something went wrong, please try again.");
    }
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
