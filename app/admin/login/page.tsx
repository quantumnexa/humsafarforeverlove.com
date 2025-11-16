"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

// Admin credentials
const ADMIN_CREDENTIALS = {
  id: "bde3629a-4a19-418a-813b-fdf51176da30",
  email: "info@humsafarforeverlove.com"
}

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const form = e.target as HTMLFormElement
      const email = (form.email as HTMLInputElement).value
      const password = (form.password as HTMLInputElement).value
      
      // First check if this is the admin email
      if (email !== ADMIN_CREDENTIALS.email) {
        setError("Access denied. This is not an admin account.")
        setLoading(false)
        return
      }
      
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setError(`Authentication failed: ${error.message}`)
        setLoading(false)
        return
      }
      
      // Verify this is the admin user by checking the user ID
      if (data.user?.id !== ADMIN_CREDENTIALS.id) {
        setError("Access denied. This account does not have admin privileges.")
        // Sign out the non-admin user
        await supabase.auth.signOut()
        setLoading(false)
        return
      }
      
      localStorage.setItem('admin_session', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        loginTime: new Date().toISOString()
      }))
      
      // Redirect to admin dashboard
      router.push("/admin/dashboard")
      
    } catch (err) {
      console.error('Admin login error:', err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-humsafar-200">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img 
                src="/humsafar-logo.png" 
                alt="Humsafar Forever Love" 
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Secure Admin Access</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-humsafar-50">
        <div className="w-full max-w-md">
          <Card className="border-humsafar-50 shadow-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-humsafar-100">
                <Shield className="h-6 w-6 text-humsafar-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-humsafar-600">Admin Login</CardTitle>
              <CardDescription>Sign in to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Admin Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="Enter admin email" 
                      className="pl-12 pr-4 py-3 border border-gray-100 focus:border-humsafar-400 focus:ring-2 focus:ring-humsafar-50 rounded-lg transition-all duration-200 hover:border-gray-200" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Admin Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      className="pl-12 pr-12 py-3 border border-gray-100 focus:border-humsafar-400 focus:ring-2 focus:ring-humsafar-50 rounded-lg transition-all duration-200 hover:border-gray-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 hover:text-humsafar-600 transition-colors"
                    >
                      {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <div className="text-[#ee406d] text-sm bg-[#ee406d]/5 p-3 rounded-lg border border-[#ee406d]/20">
                    <div className="font-medium mb-1">Authentication Error:</div>
                    <div>{error}</div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-humsafar-500 hover:bg-humsafar-600" 
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In as Admin"}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Not an admin?{" "}
                  <button
                    onClick={() => router.push("/auth")}
                    className="text-humsafar-500 hover:text-humsafar-600 font-medium"
                  >
                    Go to user login
                  </button>
                </p>
              </div>
              

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
