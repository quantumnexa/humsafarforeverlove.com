export default async function FailurePage({
  searchParams,
}: {
  searchParams: Promise<{
    err_code?: string
    err_msg?: string
  }>
}) {
  const params = await searchParams
  const err_code = params?.err_code
  const err_msg = params?.err_msg

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>❌ Payment Failed</h1>
      <p>Error Code: {err_code || "UNKNOWN"}</p>
      <p>Message: {err_msg || "Payment could not be processed"}</p>
    </div>
  )
}
