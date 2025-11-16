"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

function mapViews(amount?: number) {
  if (!amount || isNaN(amount)) return 0
  if (amount === 5000 || amount === 2500) return 20
  if (amount === 8000 || amount === 4000) return 35
  if (amount === 13000 || amount === 6500) return 55
  if (amount > 13000) return 55 + Math.max(0, Math.round((amount - 13000) / 200))
  return 0
}

export default function PayfastSuccessPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [saving, setSaving] = useState<boolean>(false)
  const [stored, setStored] = useState<boolean | null>(null)
  const [reason, setReason] = useState<string | undefined>(undefined)
  const [viewsReturned, setViewsReturned] = useState<number | undefined>(undefined)

  const data = useMemo(() => {
    const obj: Record<string, string> = {}
    params.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }, [params])

  useEffect(() => {
    const send = async () => {
      try {
        setSaving(true)
        const { data: auth } = await supabase.auth.getUser()
        const userId = auth?.user?.id || null
        const res = await fetch("/api/payfast/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ params: data, user_id: userId }),
        })
        const json = await res.json()
        setStored(Boolean(json?.stored))
        setReason(json?.reason)
        setViewsReturned(typeof json?.views === "number" ? json.views : undefined)
      } catch (e) {
        setStored(false)
        setReason("network_error")
      } finally {
        setSaving(false)
      }
    }
    send()
  }, [data])

  const amount = data?.TXNAMT || data?.amount || data?.transaction_amount
  const amountNum = amount ? Number(amount) : undefined
  const expectedViews = mapViews(amountNum)
  const viewsToShow = viewsReturned ?? expectedViews

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar50 via-white to-humsafar100">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-humsafar-700 mb-2">Payment Successful</h1>

          {viewsToShow > 0 ? (
            <p className="text-sm text-green-700 mb-4">
              You have received {viewsToShow} profile views.
            </p>
          ) : (
            <p className="text-sm text-gray-600 mb-4">Thank you! Your PayFast payment has completed.</p>
          )}

          {/* <div className="text-sm text-gray-600 mb-2">
            {saving && <span>Saving transaction...</span>}
            {!saving && stored === true && (
              <span className="text-green-700">Saved to database.</span>
            )}
            {!saving && stored === false && (
              <span className="text-red-700">
                Could not save transaction{reason ? ` (${reason})` : ""}.
              </span>
            )}
          </div> */}

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