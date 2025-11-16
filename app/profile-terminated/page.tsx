"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, LogOut, Mail } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ProfileTerminatedPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // If not authenticated, redirect to login
        router.push('/auth')
        return
      }

      setUser(user)
      
      // Verify that the user's profile is actually terminated
      const { data: subscriptionData } = await supabase
        .from("user_subscriptions")
        .select("profile_status")
        .eq("user_id", user.id)
        .single()
      
      // If profile is not terminated, redirect to home
      if (subscriptionData?.profile_status !== 'terminated') {
        router.push('/')
        return
      }
      
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@humsafarforeverlove.com?subject=Profile Termination Appeal'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-humsafar-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[500px]">
          <Card className="max-w-md w-full border-red-200 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-700">
                Profile Terminated
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Your profile has been terminated
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-700 mb-4">
                  Your profile access has been restricted due to policy violations or administrative action.
                </p>
                <p className="text-sm text-gray-600">
                  If you believe this is an error, please contact our support team for assistance.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={handleContactSupport}
                  className="w-full bg-humsafar-600 hover:bg-humsafar-700 text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
              
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  For questions about our policies, visit our{" "}
                  <a href="/terms" className="text-humsafar-600 hover:underline">
                    Terms of Service
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}