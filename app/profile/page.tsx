"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Edit, Loader2, Share2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabaseClient"

export default function ViewProfilePage() {
  const [fetchingProfile, setFetchingProfile] = useState(true)
  const [error, setError] = useState("")
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  
  // Function to format profile data for WhatsApp sharing
  const formatProfileForWhatsApp = (profile: any) => {
    if (!profile) return ""
    
    const profileData = [
      `*Profile Details*`,
      `-------------------`,
      `*Name:* ${[profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(' ')}`,
      `*Age:* ${profile.age} years`,
      `*Gender:* ${profile.gender}`,
      `*Phone:* ${profile.phone}`,
      `*Email:* ${profile.email}`,
      `*City:* ${profile.city}`,
      `*Education:* ${profile.education}`,
      `*Profession:* ${profile.profession}`,
      profile.bio ? `*About:* ${profile.bio}` : '',
    ].filter(Boolean).join('\n')
    
    return encodeURIComponent(profileData)
  }
  
  // Function to handle WhatsApp sharing
  const handleWhatsAppShare = () => {
    const formattedProfile = formatProfileForWhatsApp(profile)
    const whatsappUrl = `https://wa.me/?text=${formattedProfile}`
    window.open(whatsappUrl, '_blank')
  }

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
                <p className="text-red-500 mb-4">Profile not found. Please create a profile first.</p>
                <Link href="/profile/create" legacyBehavior>
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
          <div className="mb-6 flex justify-between items-center">
            <Link
              href="/"
              className="inline-flex items-center text-humsafar-500 hover:text-humsafar-600"
              legacyBehavior>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <Link href="/profile/edit" legacyBehavior>
              <Button className="bg-humsafar-500 hover:bg-humsafar-600">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>

          <Card className="border-humsafar-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Your Profile
              </CardTitle>
              <CardDescription>
                Your matrimonial profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {[profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(' ')}</p>
                    <p><span className="font-medium">Age:</span> {profile.age} years</p>
                    <p><span className="font-medium">Gender:</span> {profile.gender}</p>
                    <p><span className="font-medium">Phone:</span> {profile.phone}</p>
                    <p><span className="font-medium">Email:</span> {profile.email}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Location & Career</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">City:</span> {profile.city}</p>
                    <p><span className="font-medium">Education:</span> {profile.education}</p>
                    <p><span className="font-medium">Profession:</span> {profile.profession}</p>
                  </div>
                </div>
              </div>

              {profile.bio && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">About Me</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}