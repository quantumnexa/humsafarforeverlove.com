import { createClient } from "@supabase/supabase-js"

function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export default async function AdminViewProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabaseServerClient()
  const resolved = await params
  const userId = resolved.id

  if (!supabase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border rounded-lg p-6 max-w-md text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Server key missing</h1>
          <p className="text-sm text-gray-600">SUPABASE_SERVICE_ROLE_KEY is not configured. Admin view cannot load.</p>
        </div>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("user_id, first_name, last_name, email, phone, age, gender, city, religion, marital_status, education, field_of_study")
    .eq("user_id", userId)
    .maybeSingle()

  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("subscription_status, profile_status, verified_badge, boost_profile, views_limit, updated_at")
    .eq("user_id", userId)
    .maybeSingle()

  const { data: images } = await supabase
    .from("user_images")
    .select("image_url, is_main")
    .eq("user_id", userId)
    .order("is_main", { ascending: false })
    .limit(1)

  let mainImage = "/placeholder.jpg"
  const baseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "")
  if (images && images.length > 0) {
    const imageUrl = images[0].image_url
    if (imageUrl) {
      mainImage = imageUrl.startsWith("http")
        ? imageUrl
        : `${baseUrl}/storage/v1/object/public/humsafar-user-images/${imageUrl}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-humsafar-600 mb-4">Admin: View Profile</h1>

          {!profile ? (
            <p className="text-sm text-gray-600">Profile not found.</p>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {mainImage && mainImage !== "/placeholder.jpg" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mainImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400 text-sm">No Photo</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-900">
                    {profile.first_name} {profile.last_name}
                  </div>
                  <div className="text-sm text-gray-600">ID: {profile.user_id}</div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                    <div>Email: {profile.email}</div>
                    {profile.phone && <div>Phone: {profile.phone}</div>}
                    {profile.age && <div>Age: {profile.age}</div>}
                    {profile.gender && <div>Gender: {profile.gender}</div>}
                    {profile.city && <div>City: {profile.city}</div>}
                    {profile.religion && <div>Religion: {String(profile.religion)}</div>}
                    {profile.marital_status && <div>Status: {String(profile.marital_status)}</div>}
                    {profile.education && <div>Education: {String(profile.education)}</div>}
                    {profile.field_of_study && <div>Field: {String(profile.field_of_study)}</div>}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">Subscription</h2>
                {subscription ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                    <div>Subscription: {subscription.subscription_status}</div>
                    <div>Profile Status: {subscription.profile_status}</div>
                    <div>Views Limit: {subscription.views_limit}</div>
                    <div>Verified Badge: {subscription.verified_badge ? "Yes" : "No"}</div>
                    <div>Boost Profile: {subscription.boost_profile ? "Yes" : "No"}</div>
                    <div>Updated: {subscription.updated_at ? new Date(subscription.updated_at).toLocaleString() : "—"}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">No subscription found.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
