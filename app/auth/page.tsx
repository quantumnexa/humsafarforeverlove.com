"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabaseClient"
import { calculateAge } from "@/lib/utils"
import { UserSubscriptionService } from "@/lib/userSubscriptionService"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const [signupEmail, setSignupEmail] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  // Check if user is already logged in and redirect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Don't check auth if user is currently in the middle of login/signup
        if (loading || isRedirecting) {
          return
        }
        
        const { data: { session } } = await supabase.auth.getSession()
        
        // Only redirect if we have a valid, non-expired session
        if (session?.user && session?.access_token) {
          // Check if token is expired
          const expiresAt = session.expires_at
          const now = Math.floor(Date.now() / 1000)
          
          if (expiresAt && expiresAt > now) {
            // Check if email is verified
            if (session.user.email_confirmed_at) {
              router.push("/")
            } else {
              // Show email confirmation modal for unverified users
              setSignupEmail(session.user.email || "")
              setShowEmailConfirmation(true)
            }
          } else {
            // Clear expired session
            await supabase.auth.signOut()
          }
        }
      } catch (error) {
        // If there's an error checking auth, allow access to the page
      }
    }
    checkAuth()
  }, [router, loading, isRedirecting])

  // Google Sign In handler
  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/dashboard`
        }
      })
      
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      
      // The redirect will happen automatically
      
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.")
      setLoading(false)
    }
  }

  // Test Supabase connection
  const testSupabaseConnection = async () => {
    try {
      // Check if environment variables are set
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        return false
      }
      
      const { data, error } = await supabase.from("user_profiles").select("count").limit(1)
      
      if (error) {
        return false
      }
      
      return true
    } catch (err) {
      return false
    }
  }

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    // Add timeout protection to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setError("Login is taking too long. Please try again.")
    }, 30000) // 30 seconds timeout
    
    try {
      // First test Supabase connection
      const isConnected = await testSupabaseConnection()
      if (!isConnected) {
        clearTimeout(timeoutId)
        setLoading(false)
        setError("Cannot connect to authentication service. Please check your internet connection and try again.")
        return
      }
      
      const form = e.target as HTMLFormElement
      const email = (form.email as HTMLInputElement).value
      const password = (form.password as HTMLInputElement).value
      const remember = (form.remember as any)?.checked === true
      
      console.log("🔐 Attempting login for:", email)
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      // Clear timeout since we got a response
      clearTimeout(timeoutId)
      
      if (error) {
        console.error("❌ Login error:", error)
        setError(error.message)
        setLoading(false)
        return
      }

      // Check if email is verified
      if (!data.user?.email_confirmed_at) {
        console.log("⚠️ Email not verified")
        setError("Please verify your email address before logging in. Check your inbox for the verification link.")
        setLoading(false)
        return
      }

      console.log("✅ Login successful, user:", data.user?.id)

      // If user opted to be remembered, persist the current session manually
      if (remember && data.session) {
        try {
          const storageKey = 'sb-auth-token'
          localStorage.setItem(storageKey, JSON.stringify(data.session))
        } catch (_) {}
      }
      
      // Successful login
      setLoading(false)
      setIsRedirecting(true)
      // Wait for auth state to be properly updated before redirecting
      setTimeout(async () => {
        try {
          // Double-check that we still have a valid session before redirecting
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            router.push("/dashboard")
          } else {
            console.log("⚠️ Session not found after login, staying on auth page")
            setIsRedirecting(false)
          }
        } catch (error) {
          console.error("Error checking session after login:", error)
          setIsRedirecting(false)
        }
      }, 500)
    } catch (err) {
      // Clear timeout since we got an error
      clearTimeout(timeoutId)
      console.error("💥 Unexpected login error:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  // Signup handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const form = e.target as HTMLFormElement
    const firstName = (form.firstName as HTMLInputElement).value
    const middleName = (form.middleName as HTMLInputElement).value
    const lastName = (form.lastName as HTMLInputElement).value
    const email = (form.signupEmail as HTMLInputElement).value
    const phone = (form.phone as HTMLInputElement).value
    const gender = (form.gender as HTMLInputElement).value || (form.gender as any).dataset.value
    const dateOfBirth = (form.dateOfBirth as HTMLInputElement).value
    const city = (form.city as HTMLInputElement).value || (form.city as any).dataset.value
    const password = (form.signupPassword as HTMLInputElement).value
    const confirmPassword = (form.confirmPassword as HTMLInputElement).value
    
    // Validate date of birth (user must be at least 18 years old)
    if (dateOfBirth) {
      const age = calculateAge(dateOfBirth)
      if (age < 18) {
        setError("You must be at least 18 years old to register")
        setLoading(false)
        return
      }
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }
    
    // Create user in Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          phone,
          gender,
          date_of_birth: dateOfBirth,
          age: dateOfBirth ? calculateAge(dateOfBirth) : null,
          city,
        },
      },
    })
    
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }
    
    // Insert profile data directly into 'user_profiles' table
    // Make sure user is authenticated before inserting
    if (data.user?.id) {
      const { error: profileError } = await supabase.from("user_profiles").insert([
        {
          user_id: data.user.id,
          email,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          phone,
          gender,
          date_of_birth: dateOfBirth,
          age: dateOfBirth ? calculateAge(dateOfBirth) : null,
          city,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      
      if (profileError) {
        console.error('Profile creation error:', profileError)
        setError(`Profile creation failed: ${profileError.message}`)
        setLoading(false)
        return
      }
      
      // Create default free subscription for the new user
      console.log('Creating subscription for user ID:', data.user.id)
      try {
        const subscription = await UserSubscriptionService.createDefaultSubscription(data.user.id)
        
        if (!subscription) {
          console.error('Warning: Failed to create default subscription')
          // Continue anyway as the profile was created successfully
        } else {
          console.log('Subscription created successfully:', subscription.id)
          
          // Verify subscription was actually created
          const { data: checkData, error: checkError } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', data.user.id)
            .single()
            
          if (checkError) {
            console.error('Error verifying subscription:', checkError)
          } else if (checkData) {
            console.log('Verified subscription exists in database:', checkData.id)
          } else {
            console.error('Subscription verification failed: No record found')
          }
        }
      } catch (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError)
        // Continue anyway as the profile was created successfully
      }
    } else {
      console.error('No user ID available for profile creation')
      setError('User authentication failed')
      setLoading(false)
      return
    }
    
    // Show email confirmation instead of redirecting
    setLoading(false)
    setSignupEmail(email)
    setShowEmailConfirmation(true)
    
    // Clear any existing errors
    setError("")
  }

  // Check email verification status
  const checkEmailVerification = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email_confirmed_at) {
        // Email is verified, redirect to homepage
        router.push("/")
      } else {
        // Email not verified yet
        setError("Email not verified yet. Please check your inbox and click the verification link.")
      }
    } catch (error) {
      console.error("Error checking email verification:", error)
      setError("Error checking verification status. Please try again.")
    }
  }

  // Resend verification email
  const resendVerificationEmail = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: signupEmail,
      })
      
      if (error) {
        setError(error.message)
      } else {
        setError("") // Clear any existing errors
        // Show success message
        setSuccessMessage("Verification email sent! Please check your inbox.")
        setTimeout(() => setSuccessMessage(""), 5000)
      }
    } catch (error) {
      console.error("Error resending verification email:", error)
      setError("Failed to resend verification email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
      <Header />
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md text-humsfar-500">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full text-humsafar-500">
            <TabsList className="grid w-full grid-cols-2 bg-humsafar-500 text-white">
              <TabsTrigger 
                value="login" 
                className={`transition-all duration-200 ${activeTab === "login" ? "bg-white text-humsafar-600 font-semibold shadow-md" : "hover:bg-humsafar-400"}`}
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className={`transition-all duration-200 ${activeTab === "signup" ? "bg-humsafar-600 text-white font-semibold shadow-md" : "hover:bg-humsafar-400"}`}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            {/* Login Tab */}
            <TabsContent value="login">
              <Card className="border-humsafar-100">
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          placeholder="Enter your email" 
                          className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-12 pr-12 py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300"
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" name="remember" />
                        <Label htmlFor="remember" className="text-sm">
                          Remember me
                        </Label>
                      </div>
                      <Link href="/forgot-password" className="text-sm text-humsafar-500 hover:text-humsafar-600">
                        Forgot password?
                      </Link>
                    </div>
                    {error && activeTab === "login" && (
                      <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                        <div className="font-medium mb-1">Login Error:</div>
                        <div>{error}</div>
                        {error.includes("Cannot connect") && (
                          <div className="mt-2 text-xs text-red-600">
                            This usually means:
                            <ul className="list-disc list-inside mt-1">
                              <li>Internet connection issue</li>
                              <li>Supabase service temporarily down</li>
                              <li>Configuration problem</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    <Button type="submit" className="w-full bg-humsafar-500 hover:bg-humsafar-600" disabled={loading || isRedirecting}>
                      {loading ? "Signing In..." : isRedirecting ? "Redirecting..." : "Sign In"}
                    </Button>
                    
                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    
                    {/* Google Sign In Button */}
                    <Button 
                      type="button"
                      onClick={handleGoogleSignIn}
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-50 py-3"
                      disabled={loading || isRedirecting}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {loading ? "Signing in..." : "Sign in with Google"}
                    </Button>
                    
                    {/* Email Verification Reminder */}
                    
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <button
                        onClick={() => setActiveTab("signup")}
                        className="text-humsafar-500 hover:text-humsafar-600 font-medium"
                      >
                        Sign up here
                      </button>
                    </p>
                  </div>
                  
                 
                </CardContent>
              </Card>
            </TabsContent>
            {/* Signup Tab */}
            <TabsContent value="signup">
              <Card className="border-humsafar-100">
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Join thousands of people finding love</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            placeholder="First name" 
                            className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="middleName" className="text-sm font-medium text-gray-700">Middle Name</Label>
                        <Input 
                          id="middleName" 
                          name="middleName" 
                          placeholder="Middle name" 
                          className="py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300" 
                        />
                      </div>
                      
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName" 
                          placeholder="Last name" 
                          className="py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300" 
                          required 
                        />
                      </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail" className="text-sm font-medium text-gray-700">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                        <Input 
                          id="signupEmail" 
                          name="signupEmail" 
                          type="email" 
                          placeholder="Enter your email" 
                          className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                        <Input 
                          id="phone" 
                          name="phone" 
                          type="tel" 
                          placeholder="+92 332 7355681" 
                          className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                          Date of Birth
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                          <Input 
                            id="dateOfBirth" 
                            name="dateOfBirth" 
                            type="date" 
                            className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300" 
                            max={new Date().toISOString().split('T')[0]}
                            required 
                          />

                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
                        <Select name="gender" required>
                          <SelectTrigger className="py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                        <Input 
                          id="city" 
                          name="city" 
                          placeholder="Enter your city" 
                          className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword" className="text-sm font-medium text-gray-700">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                        <Input
                          id="signupPassword"
                          name="signupPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-12 pr-12 py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 hover:text-humsafar-600 transition-colors"
                        >
                          {showPassword ?  <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 h-5 w-5" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="pl-12 pr-12 py-3 border-2 border-gray-200 focus:border-humsafar-500 focus:ring-2 focus:ring-humsafar-100 rounded-lg transition-all duration-200 hover:border-gray-300"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-humsafar-500 hover:text-humsafar-600 transition-colors"
                        >
                          {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                         
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-humsafar-500 hover:text-humsafar-600">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-humsafar-500 hover:text-humsafar-600">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {error && activeTab === "signup" && (
                      <div className="text-red-500 text-sm">{error}</div>
                    )}
                    <Button type="submit" className="w-full bg-humsafar-500 hover:bg-humsafar-600" disabled={loading || isRedirecting}>
                      {loading ? "Creating Account..." : isRedirecting ? "Redirecting..." : "Create Account"}
                    </Button>
                    
                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    
                    {/* Google Sign Up Button */}
                    <Button 
                      type="button"
                      onClick={handleGoogleSignIn}
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-50 py-3"
                      disabled={loading || isRedirecting}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {loading ? "Signing up..." : "Sign up with Google"}
                    </Button>
                    
                    {/* Email Verification Info */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-700">
                          <p className="font-medium mb-1">Email Verification Required</p>
                          <p>After signing up, you'll receive a verification email. You must verify your email before you can log in.</p>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <button
                        onClick={() => setActiveTab("login")}
                        className="text-humsafar-500 hover:text-humsafar-600 font-medium"
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Email Confirmation Modal */}
          {showEmailConfirmation && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email!</h2>
                
                {/* Message */}
                <p className="text-gray-600 mb-6">
                  We've sent a verification link to <span className="font-semibold text-humsafar-600">{signupEmail}</span>
                </p>

                {/* Instructions */}
                <div className="bg-humsafar-50 rounded-lg p-4 mb-6 text-left">
                  <h4 className="font-semibold text-gray-800 mb-2">Next Steps:</h4>
                  <ol className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="w-5 h-5 bg-humsafar-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                      Check your email inbox (and spam folder)
                    </li>
                    <li className="flex items-start">
                      <span className="w-5 h-5 bg-humsafar-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                      Click the verification link in the email
                    </li>
                    <li className="flex items-start">
                      <span className="w-5 h-5 bg-humsafar-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                      Come back here and click "I've Verified My Email"
                    </li>
                  </ol>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-green-700 text-sm">{successMessage}</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={checkEmailVerification}
                    className="w-full bg-humsafar-500 hover:bg-humsafar-600 text-white py-3"
                  >
                    I've Verified My Email
                  </Button>
                  
                  <Button
                    onClick={resendVerificationEmail}
                    variant="outline"
                    disabled={loading}
                    className="w-full border-humsafar-500 text-humsafar-600 hover:bg-humsafar-50 py-3"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-humsafar-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Resending...</span>
                      </div>
                    ) : (
                      "Resend Verification Email"
                    )}
                  </Button>

                  <Button
                    onClick={() => {
                      setShowEmailConfirmation(false)
                      setActiveTab("login")
                      setError("")
                      setSuccessMessage("")
                    }}
                    variant="ghost"
                    className="w-full text-gray-500 hover:text-gray-700 py-3"
                  >
                    Back to Login
                  </Button>
                </div>

                {/* Help Text */}
                <p className="text-xs text-gray-500 mt-6">
                  Didn't receive the email? Check your spam folder or try resending.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
