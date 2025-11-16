"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Save } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabaseClient"
import { calculateAge } from "@/lib/utils"
import { UserSubscriptionService } from "@/lib/userSubscriptionService"

export default function CreateProfilePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

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
        user_id: user.id,
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        email: user.email,
        phone: formData.get('phone') as string,
        date_of_birth: dateOfBirth,
        age: calculatedAge,
        gender: formData.get('gender') as string,
        city: formData.get('city') as string,
        education: formData.get('education') as string,
        occupation: formData.get('profession') as string,
        about: formData.get('bio') as string,
      }

      const { error: insertError } = await supabase
        .from('user_profiles')
        .upsert([profileData])

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }
      
      // Create default free subscription for the new user
      // Creating subscription for user ID
      try {
        const subscription = await UserSubscriptionService.createDefaultSubscription(user.id)
        
        if (!subscription) {
          // Warning: Failed to create default subscription
          // Continue anyway as the profile was created successfully
        } else {
          // Subscription created successfully
          
          // Verify subscription was actually created
          const { data: checkData, error: checkError } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single()
            
          if (checkError) {
            // Error verifying subscription
          } else if (checkData) {
            // Verified subscription exists in database
          } else {
            // Subscription verification failed: No record found
          }
        }
      } catch (subscriptionError) {
        // Error creating subscription
        // Continue anyway as the profile was created successfully
      }

      router.push('/')
    } catch (err) {
      setError('An error occurred while creating your profile')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/" legacyBehavior>
              <a className="inline-flex items-center text-humsafar-500 hover:text-humsafar-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </a>
            </Link>
          </div>

          <Card className="border-humsafar-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Create Your Profile
              </CardTitle>
              <CardDescription>
                Fill in your details to create your matrimonial profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+92 332 7355681" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input 
                      id="dateOfBirth" 
                      name="dateOfBirth" 
                      type="date" 
                      max={new Date().toISOString().split('T')[0]}
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select name="gender" required>
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
                    <Select name="city" required>
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
                    <Input id="education" name="education" placeholder="e.g., Masters in Computer Science" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input id="profession" name="profession" placeholder="e.g., Software Engineer" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    placeholder="Tell us about yourself..." 
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
                  {loading ? "Creating Profile..." : "Create Profile"}
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