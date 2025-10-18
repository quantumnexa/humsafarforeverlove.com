export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    transaction_id?: string
    err_code?: string
    err_msg?: string
  }>
}) {
  const params = await searchParams
  const transaction_id = params?.transaction_id
  const err_code = params?.err_code
  const err_msg = params?.err_msg

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>🎉 Payment Successful</h1>
      <p>Transaction ID: {transaction_id || "N/A"}</p>
      <p>Status: {err_msg || "Success"}</p>
      <p>Code: {err_code || "0"}</p>
    </div>
  )
}
