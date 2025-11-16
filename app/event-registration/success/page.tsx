"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function EventRegistrationSuccessPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const [updated, setUpdated] = useState<boolean | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)

  const data = useMemo(() => {
    const obj: Record<string, string> = {}
    params.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }, [params])

  const registrationId = data?.registration_id
  const source = (data?.source || "payfast").toLowerCase()

  useEffect(() => {
    const run = async () => {
      if (!registrationId) return
      // Only call PayFast success API when coming from PayFast
      if (source === "payfast" || source === "card") {
        try {
          setUpdating(true)
          const res = await fetch("/api/event-registrations/payfast-success", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ registration_id: registrationId, params: data }),
          })
          const json = await res.json()
          setUpdated(Boolean(json?.ok))
          if (!json?.ok) setError(json?.error || "update_failed")
        } catch (e: any) {
          setUpdated(false)
          setError(e?.message || "network_error")
        } finally {
          setUpdating(false)
        }
      } else {
        // Offline methods: don't mark paid here; show pending message
        setUpdated(null)
      }
    }
    run()
  }, [registrationId, source, data])

  const amount = data?.TXNAMT || data?.amount || data?.total

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar50 via-white to-humsafar100">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-green-700 mb-2">Registration Saved</h1>
          {source === "payfast" || source === "card" ? (
            <p className="text-sm text-gray-600 mb-4">
              {updated === true
                ? "Payment verified via PayFast. Your registration is confirmed."
                : updated === false
                ? "Payment processed but update failed. We will verify manually."
                : updating
                ? "Verifying payment..."
                : "Awaiting payment verification from PayFast."}
            </p>
          ) : (
            <p className="text-sm text-gray-600 mb-4">
              Your registration is pending payment verification ({source}). Our team will contact you.
            </p>
          )}

          <div className="border rounded p-4 mb-4">
            <h2 className="font-medium text-gray-800 mb-2">Details</h2>
            <div className="text-sm text-gray-700">
              <p><span className="font-semibold">Registration ID:</span> {registrationId || "N/A"}</p>
              {amount ? (<p><span className="font-semibold">Amount:</span> Rs. {amount}</p>) : null}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-humsafar-600 text-white rounded hover:bg-humsafar-700"
            >
              Go Home
            </button>
            <button
              onClick={() => router.push("/event-registration")}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              New Registration
            </button>
          </div>
          {error ? (
            <p className="text-xs text-red-600 mt-3">{error}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}