"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Save, Loader2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabaseClient"
import { calculateAge } from "@/lib/utils"

export default function EditProfilePage() {
  const [loading, setLoading] = useState(false)
  const [fetchingProfile, setFetchingProfile] = useState(true)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }



      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setProfile(profileData)
      }
    } catch (err) {
      setError('Failed to fetch profile')
    } finally {
      setFetchingProfile(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError("Please login first")
        setLoading(false)
        return
      }

      const dateOfBirth = formData.get('dateOfBirth') as string
      const calculatedAge = calculateAge(dateOfBirth)

      const profileData = {
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        phone: formData.get('phone') as string,
        date_of_birth: dateOfBirth,
        age: calculatedAge,
        gender: formData.get('gender') as string,
        city: formData.get('city') as string,
        education: formData.get('education') as string,
        occupation: formData.get('profession') as string,
        about: formData.get('bio') as string,
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', user.id)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      router.push('/')
    } catch (err) {
      setError('An error occurred while updating your profile')
      setLoading(false)
    }
  }

  if (fetchingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-humsafar-100">
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading your profile...</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-humsafar-100">
              <CardContent className="p-8 text-center">
                <p className="text-red-500">Profile not found. Please create a profile first.</p>
                <Link href="/profile/create" className="mt-4 inline-block" legacyBehavior>
                  <Button className="bg-humsafar-500 hover:bg-humsafar-600">
                    Create Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-humsafar-500 hover:text-humsafar-600"
              legacyBehavior>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card className="border-humsafar-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Update Your Profile
              </CardTitle>
              <CardDescription>
                Update your matrimonial profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      defaultValue={profile.first_name || ''} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      defaultValue={profile.last_name || ''} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      defaultValue={profile.phone || ''} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input 
                      id="dateOfBirth" 
                      name="dateOfBirth" 
                      type="date" 
                      max={new Date().toISOString().split('T')[0]}
                      defaultValue={profile.date_of_birth || ''} 
                      required 
                    />
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
                        <SelectValue placeholder="Select your city" />
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
                    <Input 
                      id="education" 
                      name="education" 
                      defaultValue={profile.education || ''} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input 
                      id="profession" 
                      name="profession" 
                      defaultValue={profile.profession || ''} 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    defaultValue={profile.bio || ''} 
                    rows={4}
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-humsafar-500 hover:bg-humsafar-600" 
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Updating Profile..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}