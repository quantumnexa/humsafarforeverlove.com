"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function PayfastSuccessPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [saved, setSaved] = useState<null | { ok: boolean; reason?: string }>(null)

  const data = useMemo(() => {
    const obj: Record<string, string> = {}
    params.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }, [params])

  useEffect(() => {
    // Send success payload to backend for storage
    const send = async () => {
      try {
        const res = await fetch("/api/payfast/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ params: data }),
        })
        const json = await res.json()
        setSaved({ ok: res.ok, reason: json?.reason })
      } catch (e) {
        setSaved({ ok: false, reason: "network_error" })
      }
    }
    send()
  }, [data])

  const amount = data?.TXNAMT || data?.amount

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar50 via-white to-humsafar100">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-green-700 mb-2">Payment Successful</h1>
          <p className="text-sm text-gray-600 mb-4">
            Thank you! Your PayFast payment has completed.{" "}
            {amount ? `Amount: Rs. ${amount}` : ""}
          </p>

          <div className="border rounded p-4 mb-4">
            <h2 className="font-medium text-gray-800 mb-2">Gateway Response</h2>
            <pre className="text-xs text-gray-700 overflow-auto max-h-64">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            {saved === null && <span>Saving transaction...</span>}
            {saved?.ok && <span className="text-green-700">Saved to database.</span>}
            {saved && !saved.ok && (
              <span className="text-red-700">
                Could not save transaction{saved?.reason ? ` (${saved.reason})` : ""}.
              </span>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-humsafar-600 text-white rounded hover:bg-humsafar-700"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push("/packages")}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Back to Packages
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}