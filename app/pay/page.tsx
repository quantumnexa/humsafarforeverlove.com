'use client';
import React from "react";
import { useRouter } from "next/navigation";

export default function PayPage() {
  const router = useRouter();

  const goToCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff7f2",
      }}
    >
      <h1 style={{ color: "#f37100", marginBottom: "15px" }}>
        Humsafar Forever Love 💖
      </h1>
      <p style={{ color: "#444", fontSize: "18px", marginBottom: "30px" }}>
        Proceed to secure checkout to complete your payment.
      </p>
      <button
        onClick={goToCheckout}
        style={{
          backgroundColor: "#f37100",
          color: "white",
          padding: "12px 30px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          transition: "transform 0.2s ease",
        }}
        onMouseOver={(e) => ((e.target as HTMLButtonElement).style.transform = "scale(1.05)")}
        onMouseOut={(e) => ((e.target as HTMLButtonElement).style.transform = "scale(1)")}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
