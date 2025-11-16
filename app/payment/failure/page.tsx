"use client"

import { useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function PayfastFailurePage() {
  const params = useSearchParams()
  const router = useRouter()

  const data = useMemo(() => {
    const obj: Record<string, string> = {}
    params.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }, [params])

  const amount = data?.TXNAMT || data?.amount

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar50 via-white to-humsafar100">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-red-700 mb-2">Payment Failed</h1>
          <p className="text-sm text-gray-600 mb-4">
            Your PayFast payment did not complete.{" "}
            {amount ? `Amount attempted: Rs. ${amount}` : ""}
          </p>

          <div className="border rounded p-4 mb-4">
            <h2 className="font-medium text-gray-800 mb-2">Gateway Response</h2>
            <pre className="text-xs text-gray-700 overflow-auto max-h-64">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => router.push("/packages/payment?package=basic")}
              className="px-4 py-2 bg-humsafar-600 text-white rounded hover:bg-humsafar-700"
            >
              Try Again
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