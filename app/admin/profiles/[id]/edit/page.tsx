"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import AdminSidebar from "@/components/AdminSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Save, User } from "lucide-react"

interface AdminSession {
  id: string
  email: string
  loginTime: string
}

export default function AdminEditProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = (params?.id as string) || ""

  const [adminSession, setAdminSession] = useState<AdminSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    // Verify admin session
    const session = localStorage.getItem("admin_session")
    if (!session) {
      router.push("/admin/login")
      return
    }
    try {
      const parsed = JSON.parse(session)
      setAdminSession(parsed)
    } catch (e) {
      localStorage.removeItem("admin_session")
      router.push("/admin/login")
      return
    }

    fetchProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProfile = async () => {
    try {
      if (!userId) {
        setError("Invalid profile id")
        setFetching(false)
        return
      }
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single()
      if (error) {
        setError(error.message)
      } else {
        setProfile(data)
      }
    } catch (err) {
      setError("Failed to load profile")
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const dateOfBirth = (formData.get("dateOfBirth") as string) || profile?.date_of_birth || ""

    const updated = {
      first_name: (formData.get("firstName") as string) || "",
      last_name: (formData.get("lastName") as string) || "",
      phone: (formData.get("phone") as string) || "",
      date_of_birth: dateOfBirth,
      gender: (formData.get("gender") as string) || "",
      city: (formData.get("city") as string) || "",
      education: (formData.get("education") as string) || "",
      occupation: (formData.get("profession") as string) || "",
      about: (formData.get("bio") as string) || "",
    }

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(updated)
        .eq("user_id", userId)
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      router.push("/admin/profiles")
    } catch (err) {
      setError("Error updating profile")
      setLoading(false)
    }
  }

  if (!adminSession) {
    return <div className="flex min-h-screen"><AdminSidebar /><div className="p-8">Loading...</div></div>
  }

  if (fetching) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading profile...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-red-500">Profile not found.</p>
                <Button variant="outline" onClick={() => router.push("/admin/profiles")} className="mt-4">
                  Back to Profiles
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => router.push("/admin/profiles")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Profiles
            </Button>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><User className="h-5 w-5 mr-2" /> Update Profile</CardTitle>
              <CardDescription>Modify user profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" defaultValue={profile.first_name || ''} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" defaultValue={profile.last_name || ''} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={profile.phone || ''} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" name="dateOfBirth" type="date" max={new Date().toISOString().split('T')[0]} defaultValue={profile.date_of_birth || ''} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select name="gender" defaultValue={profile.gender || ''} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Select name="city" defaultValue={profile.city || ''} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="karachi">Karachi</SelectItem>
                        <SelectItem value="lahore">Lahore</SelectItem>
                        <SelectItem value="islamabad">Islamabad</SelectItem>
                        <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
                        <SelectItem value="faisalabad">Faisalabad</SelectItem>
                        <SelectItem value="multan">Multan</SelectItem>
                        <SelectItem value="peshawar">Peshawar</SelectItem>
                        <SelectItem value="quetta">Quetta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input id="education" name="education" defaultValue={profile.education || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input id="profession" name="profession" defaultValue={profile.occupation || profile.profession || ''} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About</Label>
                  <Textarea id="bio" name="bio" defaultValue={profile.about || profile.bio || ''} className="min-h-[100px]" />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => router.push('/admin/profiles')}>Cancel</Button>
                  <Button type="submit" className="bg-humsafar-600 hover:bg-humsafar-700" disabled={loading}>
                    {loading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>) : (<><Save className="h-4 w-4 mr-2" />Save Changes</>)}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
