"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Check, Star, Crown, Zap, Sparkles, Eye, Shield, Rocket, CheckCircle, ArrowRight, Gift, MessageCircle, Clock, Users, TrendingUp, Target, AlertCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PackagesPage() {
  const [selectedProfileViews, setSelectedProfileViews] = useState(0)
  const [hasPaymentUnderReview, setHasPaymentUnderReview] = useState(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(true)
  const [showUnderReviewDialog, setShowUnderReviewDialog] = useState(false)
  const [currentPackageId, setCurrentPackageId] = useState<string>("free")
  const [currentViewsLimit, setCurrentViewsLimit] = useState<number>(0)
  const router = useRouter()
  // Use app-wide Supabase client for consistent auth/session
  const DISCOUNT_ACTIVE = true
  const DISCOUNT_PERCENT = 50
  const DISCOUNT_LABEL = "Limited time discount applied"

  // UI declutter state
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({})
  const toggleFeatures = (id: string) => setExpandedFeatures(prev => ({ ...prev, [id]: !prev[id] }))

  // Check for payments under review
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: payments, error } = await supabase
            .from('payments')
            .select('payment_status')
            .eq('user_id', user.id)
            .in('payment_status', ['pending', 'under_review'])
            .order('created_at', { ascending: false })
            .limit(1)

          if (error) {
            console.error('Error checking payment status:', error)
            // Fail-safe: if we cannot verify, block purchasing to prevent bypass
            setHasPaymentUnderReview(true)
            setShowUnderReviewDialog(true)
          } else {
            const underReview = payments && payments.length > 0
            setHasPaymentUnderReview(underReview)
            if (underReview) {
              setShowUnderReviewDialog(true)
            }
          }
        }
      } catch (error) {
        console.error('Error in checkPaymentStatus:', error)
        // Fail-safe: block purchasing on unexpected errors
        setHasPaymentUnderReview(true)
        setShowUnderReviewDialog(true)
      } finally {
        setIsCheckingPayment(false)
      }
    }

    checkPaymentStatus()
  }, [supabase])


  // Detect current plan from subscription and last accepted payment
  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsCheckingPayment(false)
          return
        }

        // Read current subscription
        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select("views_limit, subscription_status, payment_status")
          .eq("user_id", user.id)
          .single()

        let pkgId = "free"
        let views = Number(sub?.views_limit || 0)
        const statusText = (sub?.subscription_status || "").toLowerCase()
        if (statusText.includes("premium")) pkgId = "premium"
        else if (statusText.includes("standard")) pkgId = "standard"
        else if (statusText.includes("basic")) pkgId = "basic"
        else {
          // Fallback by views limit
          if (views >= 30) pkgId = "premium"
          else if (views >= 20) pkgId = "standard"
          else if (views >= 10) pkgId = "basic"
        }

        // Check last accepted payment for explicit package_type
        const { data: lastPayment } = await supabase
          .from("payments")
          .select("package_type, payment_status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()
        if (lastPayment?.payment_status === "accepted") {
          const pt = (lastPayment.package_type || "").toLowerCase()
          if (pt === "premium" || pt === "standard" || pt === "basic") {
            pkgId = pt
          }
        }

        setCurrentPackageId(pkgId)
        setCurrentViewsLimit(views)
      } catch (err) {
        console.error("Error fetching current plan:", err)
      } finally {
        setIsCheckingPayment(false)
      }
    }
    fetchCurrentPlan()
  }, [])


  // Dynamic pricing calculation based on profile views - Lifetime access
  // Custom packages are priced higher to encourage standard package selection
  const calculatePrice = (views: number) => {
    // Handle 0 views case
    if (views === 0) return 0
    
    // Add premium for custom package (10-15% higher than standard packages)
    if (views <= 10) {
      // Standard Basic: Rs. 5,000 for 10 views, Custom: Rs. 5,500-6,000
      const basePrice = 5000
      const premium = Math.round(basePrice * 0.1) // 10% premium
      return basePrice + premium
    }
    if (views <= 20) {
      // Standard Standard: Rs. 8,000 for 20 views, Custom: Rs. 8,800-9,100
      const basePrice = 8000
      const premium = Math.round(basePrice * 0.15) // 15% premium
      return basePrice + premium
    }
    if (views <= 30) {
      // Standard Premium: Rs. 13,000 for 30 views, Custom: Rs. 14,300-15,000
      const basePrice = 13000
      const premium = Math.round(basePrice * 0.15) // 15% premium
      return basePrice + premium
    }
    // For views above 30, charge extra with premium
    const extraViews = views - 30
    const basePrice = 13000
    const premium = Math.round(basePrice * 0.15) // 15% premium on base
    return basePrice + premium + (extraViews * 250) // Rs. 250 per extra view (higher than standard Rs. 100)
  }
  
  const getDuration = (views: number) => {
    return "Lifetime Access"
  }

  const applyDiscount = (price: number) => {
    if (!DISCOUNT_ACTIVE) return price
    return Math.round(price * (100 - DISCOUNT_PERCENT) / 100)
  }

  const packages = [
    {
      id: "free",
      name: "Free Membership",
      price: 0,
      duration: "Forever",
      color: "gray",
      icon: Star,
      popular: false,
      profileViews: 0,
      mainFeatures: [
        "Create profile",
        "Upload photos", 
        "Browse profile cards only",
        "No expiry - Forever access",
      ],
      features: [
        "Create profile",
        "Upload photos",
        "Browse profile cards",
        "Basic search filters",
        "Mobile app access",
      ],
      limitations: [
        "Cannot view full profiles",
        "Cannot view contact details",
        "Cannot express interest",
        "Basic customer support",
      ],
      addOns: [],
    },
    {
      id: "basic",
      name: "Basic Package",
      price: 5000,
      duration: "Lifetime",
      color: "blue",
      icon: Star,
      popular: false,
      profileViews: 10,
      mainFeatures: [
        "10 profile views - Lifetime",
        "No expiry - Forever access",
      ],
      features: [
        "Create profile",
        "Upload photos",
        "10 profile views - Lifetime",
        "Profile views tracking",
        "Mobile app premium features",
      ],
      addOns: ["Verified Badge"],
    },
    {
      id: "standard",
      name: "Standard Package",
      price: 8000,
      duration: "Lifetime",
      color: "humsafar",
      icon: Crown,
      popular: true,
      profileViews: 20,
      mainFeatures: [
        "20 profile views - Lifetime",
        "No expiry - Forever access",
      ],
      features: [
        "Create profile",
        "Upload photos",
        "20 profile views - Lifetime",
        "Profile views tracking",
        "Mobile app premium features",
      ],
      addOns: ["Verified Badge", "Boost Profile"],
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 13000,
      duration: "Lifetime",
      color: "purple",
      icon: Zap,
      popular: false,
      profileViews: 30,
      mainFeatures: [
        "30 profile views - Lifetime",
        "No expiry - Forever access",
      ],
      features: [
        "Create profile",
        "Upload photos",
        "30 profile views - Lifetime",
        "Profile views tracking",
        "Mobile app premium features",
      ],
      addOns: ["Verified Badge", "Boost Profile"],
    },
  ]

  const offlinePackages = [
    {
      id: "bronze",
      name: "Bronze",
      price: 50000,
      duration: "Lifetime",
      color: "blue",
      icon: Users,
      popular: false,
      profileViews: "50 Profiles",
      features: [
        "50 profiles",
        "Offline matchmaking support",
        "Priority customer support",
        "In-person introductions (where available)",
      ],
      addOns: ["Matchmaker Assistance"],
    },
    {
      id: "silver",
      name: "Silver",
      price: 200000,
      duration: "Lifetime",
      color: "humsafar",
      icon: Shield,
      popular: false,
      profileViews: "100 Profiles",
      features: [
        "100 profiles",
        "Offline matchmaking with dedicated coordinator",
        "Priority listing",
        "Shortlisted profiles by team",
      ],
      addOns: ["Matchmaker Assistance"],
    },
    {
      id: "gold",
      name: "Gold",
      price: 500000,
      duration: "Lifetime",
      color: "purple",
      icon: Crown,
      popular: true,
      profileViews: "200 Profiles",
      features: [
        "200 profiles",
        "Premium offline matchmaking",
        "Personalized meetings scheduling",
        "Background check assistance",
      ],
      addOns: ["Matchmaker Assistance"],
    },
    {
      id: "diamond",
      name: "Diamond",
      price: 1000000,
      duration: "Lifetime",
      color: "humsafar",
      icon: Sparkles,
      popular: false,
      profileViews: "Unlimited Profiles",
      features: [
        "Unlimited Profiles",
        "Elite offline matchmaking",
        "Dedicated matchmaker",
        "Exclusive events access",
      ],
      addOns: ["Matchmaker Assistance"],
    },
  ]

  const addOnServices = [
    {
      name: "Verified Badge",
      price: 0,
      duration: "Included",
      description: "Blue checkmark for profile authenticity - Included in all packages, FREE in custom packages with 10+ views",
      icon: Shield,
      included: true,
    },
    {
      name: "Boost Profile",
      price: 500,
      duration: "24 hours",
      description: "Increased visibility and profile views - Available in Standard & Premium, FREE in custom packages with 30+ views",
      icon: Rocket,
      included: false,
    },

  ]

  const getColorClasses = (color: string, isPopular = false) => {
    const colors = {
      gray: {
        border: "border-gray-100",
        bg: "bg-gray-50",
        text: "text-gray-600",
        button: "bg-gray-600 hover:bg-gray-700",
        badge: "bg-gray-100 text-gray-800",
      },
      blue: {
        border: "border-blue-100",
        bg: "bg-blue-50",
        text: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700",
        badge: "bg-blue-100 text-blue-800",
      },
      humsafar: {
        border: isPopular ? "border-humsafar-500 ring-2 ring-humsafar-100" : "border-humsafar-100",
        bg: "bg-humsafar50",
        text: "text-humsafar-600",
        button: "bg-humsafar-600 hover:bg-humsafar700",
        badge: "bg-humsafar-100 text-humsafar-800",
      },
      purple: {
        border: "border-purple-100",
        bg: "bg-purple-50",
        text: "text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700",
        badge: "bg-purple-100 text-purple-800",
      },
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const handleChoosePlan = async (packageId: string) => {
    // Block actions during payment status check
    if (isCheckingPayment) {
      return
    }
    // Check if there's a payment under review
    if (hasPaymentUnderReview) {
      setShowUnderReviewDialog(true)
      return
    }
    // Use Next.js router for better navigation
    router.push(`/packages/payment?package=${packageId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Under Review Modal */}
        <AlertDialog open={showUnderReviewDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Payment Under Review</AlertDialogTitle>
              <AlertDialogDescription>
                Your previous payment is under review. Please wait until the review is complete before purchasing a new package.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowUnderReviewDialog(false)}>Okay</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* Payment Under Review Warning */}
        {hasPaymentUnderReview && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div>
                <p className="text-orange-800 font-medium">
                  Your previous payment is under review. Please wait before purchasing a new package.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-10 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Crown className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Premium Matrimonial Plans</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Choose Your Perfect
              <span className="block text-white/60">
                Matrimonial Plan
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Unlock premium features and connect with verified profiles to find your perfect life partner. 
              Choose from our flexible plans with additional benefits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-humsafar-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg"
                onClick={() => document.getElementById('packages-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View All Plans
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white bg-transparent text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 rounded-full backdrop-blur-sm"
                onClick={() => document.getElementById('profile-view-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How It Works
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-10 h-10 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/10 rounded-full blur-lg"></div>
        </div>

        {/* Dynamic Pricing Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Customize Your Package</h2>
              <p className="text-xl text-gray-600">Select the number of profile views you need and see the price update in real-time</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="p-8 shadow-lg border-2 border-humsafar-100">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Profile Views Selector */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Views</h3>
                      <p className="text-gray-600">Choose how many profiles you want to view - Lifetime access</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-700">Total Views:</span>
                        <span className="text-3xl font-bold text-humsafar-600">{selectedProfileViews}</span>
                      </div>
                      
                      <div className="px-2">
                        <Slider
                          value={[selectedProfileViews]}
                          onValueChange={(value) => setSelectedProfileViews(value[0])}
                          max={100}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>0 views</span>
                          <span>100 views</span>
                        </div>
                      </div>
                      
                      {/* Included Features */}
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                          <Gift className="w-4 h-4" />
                          Included Features
                        </h4>
                        <div className="space-y-2">
                          {selectedProfileViews >= 10 && (
                            <div className="flex items-center gap-2 text-sm text-green-700">
                              <Shield className="w-4 h-4" />
                              <span>Verified Badge - FREE</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Included</Badge>
                            </div>
                          )}
                          {selectedProfileViews >= 30 && (
                            <div className="flex items-center gap-2 text-sm text-green-700">
                              <Rocket className="w-4 h-4" />
                              <span>Boost Profile - FREE</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Included</Badge>
                            </div>
                          )}
                          {selectedProfileViews < 10 && (
                            <div className="text-sm text-gray-500">
                              Select 10+ views to unlock Verified Badge
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Price Display */}
                  <div className="text-center space-y-6">
                    <div className="bg-humsafar-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Package Price</h3>
                      <div className="text-sm text-gray-500 line-through">
                        Rs. {calculatePrice(selectedProfileViews).toLocaleString()}
                      </div>
                      <div className="text-5xl font-bold text-humsafar-600 mb-1">
                        Now Rs. {applyDiscount(calculatePrice(selectedProfileViews)).toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600 font-medium">{DISCOUNT_LABEL} (50% OFF)</div>
                      <div className="text-gray-600">
                        {getDuration(selectedProfileViews)}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Profile Views:</span>
                        <span className="font-semibold">{selectedProfileViews} Total</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Access:</span>
                        <span className="font-semibold">{getDuration(selectedProfileViews)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Price per view:</span>
                        <span className="font-semibold">Rs. {selectedProfileViews > 0 ? Math.round(applyDiscount(calculatePrice(selectedProfileViews)) / selectedProfileViews) : 0}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-humsafar-600 hover:bg-humsafar-700 text-white font-semibold py-3 rounded-lg"
                      size="lg"
                    >
                      Choose This Package
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Profile View System */}
        <section id="profile-view-section" className="py-16 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Smart Profile View System</h2>
              <p className="text-xl text-gray-600">Transparent and intelligent profile viewing with clear usage tracking</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* How It Works Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-humsafar-600 rounded-full flex items-center justify-center mb-6">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-humsafar-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Package Benefits</h4>
                        <p className="text-sm text-gray-600">Purchase packages to unlock profile views and premium features</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Examples Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-humsafar-600 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Examples</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-blue-800">Basic Package</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-blue-600">10</span>
                        </div>
                      </div>
                      <p className="text-sm text-blue-600">Total Profile Views: 10 - Lifetime</p>
                    </div>
                    
                    <div className="bg-humsafar-50 border border-humsafar-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-humsafar-800">Standard Package</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-humsafar-600" />
                          <span className="font-bold text-humsafar-600">20</span>
                        </div>
                      </div>
                      <p className="text-sm text-humsafar-600">Total Profile Views: 20 - Lifetime</p>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-purple-800">Premium Package</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-purple-600" />
                          <span className="font-bold text-purple-600">30</span>
                        </div>
                      </div>
                      <p className="text-sm text-purple-600">Total Profile Views: 30 - Lifetime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-humsafar-600 rounded-full flex items-center justify-center mb-6">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Benefits</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Transparent usage tracking</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Smart matching recommendations</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Privacy protection guaranteed</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">Real-time compatibility scoring</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>




        {/* Packages Grid */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div id="packages-section">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-humsafar-800 mb-4">
                  Online Packages
                </h2>
                <p className="text-lg text-humsafar-600 max-w-2xl mx-auto">
                  Select the plan that best fits your needs and start your journey to find your perfect match
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md text-green-700 font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>Limited time discount — 50% OFF on all packages</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {packages.map((pkg) => {
                const colors = getColorClasses(pkg.color, pkg.popular)
                const displayPrice = pkg.price
                const displayDuration = pkg.duration

                  return (
                    <Card
                      key={pkg.id}
                      className={`relative bg-white border shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden ${
                        pkg.popular ? "border-humsafar-300 shadow-lg" : "border-gray-100"
                      }`}
                    >
                      {/* Popular Badge */}
                      {pkg.popular && (
                        <div className="absolute top-0 left-0 right-0 bg-humsafar-600 text-white text-center py-2 text-sm font-medium">
                          Most Popular
                        </div>
                      )}

                      <CardHeader className={`text-center ${pkg.popular ? 'pt-12 pb-6' : 'pt-6 pb-6'}`}>
                        <div className="flex justify-center mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            pkg.popular ? 'bg-humsafar-600' : 'bg-humsafar-100'
                          }`}>
                            <pkg.icon className={`w-6 h-6 ${
                              pkg.popular ? 'text-white' : 'text-humsafar-600'
                            }`} />
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                          {pkg.name}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {pkg.duration}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Price */}
                        <div className="text-center border-b border-gray-100 pb-4">
                          {pkg.price > 0 && (
                            <div className="text-sm text-gray-500 line-through">
                              Rs. {pkg.price.toLocaleString()}
                            </div>
                          )}
                          <div className="text-xl font-bold text-gray-900 mb-1">
                            {pkg.price === 0 ? 'Free' : (
                              <>
                                <span className="text-xs font-medium text-gray-600 mr-1">Now</span>
                                Rs. {applyDiscount(displayPrice).toLocaleString()}
                              </>
                            )}
                          </div>
                          {pkg.price > 0 && (
                            <div className="text-xs text-green-600 font-medium">
                              {DISCOUNT_LABEL} (50% OFF)
                            </div>
                          )}
                          {pkg.price > 0 && (
                            <div className="text-sm text-gray-500">
                              per package
                            </div>
                          )}
                        </div>

                        {/* Profile Views */}
                        <div className="text-center bg-gray-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-humsafar-600 mb-1">
                            {pkg.profileViews}
                          </div>
                          <div className="text-xs text-gray-600">
                            Profile Views/Month
                          </div>
                        </div>
                           
                        {/* All Features */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-sm">All Features</h4>
                          <ul className="space-y-2">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Add-ons */}
                        {pkg.addOns.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Included Add-ons</h4>
                            <div className="flex flex-wrap gap-1">
                              {pkg.addOns.map((addon) => (
                                <Badge 
                                  key={addon} 
                                  className="bg-humsafar-100 text-humsafar-700 text-xs px-2 py-1 rounded"
                                >
                                  {addon}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Choose Plan Button */}
                        <Button
                          onClick={() => handleChoosePlan(pkg.id)}
                          className={`w-full font-medium py-2 rounded-lg transition-colors ${
                            (isCheckingPayment || hasPaymentUnderReview || currentPackageId === pkg.id)
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : pkg.popular 
                              ? 'bg-humsafar-600 hover:bg-humsafar-700 text-white'
                              : pkg.id === 'free'
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-humsafar-600 hover:bg-humsafar-700 text-white'
                          }`}
                          disabled={currentPackageId === pkg.id || isCheckingPayment || hasPaymentUnderReview}
                        >
                          {isCheckingPayment
                            ? "Checking status..."
                            : hasPaymentUnderReview 
                            ? "Payment Under Review" 
                            : currentPackageId === pkg.id
                            ? "Current Plan" 
                            : "Choose Plan"
                          }
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </section>


        {/* Offline Packages */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-humsafar-800 mb-2">Offline Packages</h2>
              <p className="text-lg text-humsafar-600 max-w-2xl mx-auto">Includes Matchmaker Assistance and offline matchmaking support</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offlinePackages.map((pkg) => {
                const colors = getColorClasses(pkg.color, pkg.popular)
                const displayPrice = pkg.price
                return (
                  <Card key={pkg.id} className={`relative bg-white border shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden ${pkg.popular ? "border-humsafar-300 shadow-lg" : "border-gray-100"}`}>
                    {pkg.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-humsafar-600 text-white text-center py-2 text-sm font-medium">Most Popular</div>
                    )}
                    <CardHeader className={`text-center ${pkg.popular ? 'pt-12 pb-6' : 'pt-6 pb-6'}`}>
                      <div className="flex justify-center mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${pkg.popular ? 'bg-humsafar-600' : 'bg-humsafar-100'}`}>
                          <pkg.icon className={`w-6 h-6 ${pkg.popular ? 'text-white' : 'text-humsafar-600'}`} />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</CardTitle>
                      <CardDescription className="text-gray-600">{pkg.duration} • Offline Service</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center border-b border-gray-100 pb-4">
                        <div className="text-sm text-gray-500 line-through">Rs. {pkg.price.toLocaleString()}</div>
                        <div className="text-xl font-bold text-gray-900 mb-1">
                          <span className="text-xs font-medium text-gray-600 mr-1">Now</span>
                          Rs. {applyDiscount(displayPrice).toLocaleString()}
                        </div>
                        <div className="text-xs text-green-600 font-medium">{DISCOUNT_LABEL} (50% OFF)</div>
                      </div>
                      <div className="text-center bg-gray-50 rounded-lg p-3">
                        <div className="text-xl font-bold text-humsafar-600 mb-1">{pkg.profileViews}</div>
                        <div className="text-xs text-gray-600">Profile Views</div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Features</h4>
                        <ul className="space-y-2">
                          {(expandedFeatures[pkg.id] ? pkg.features : pkg.features.slice(0, 4)).map((feature: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {pkg.features.length > 4 && (
                          <button
                            onClick={() => toggleFeatures(pkg.id)}
                            className="mt-2 text-xs font-medium text-humsafar-600 hover:text-humsafar-700"
                          >
                            {expandedFeatures[pkg.id] ? "Show less" : "Show all features"}
                          </button>
                        )}
                      </div>
                      {pkg.addOns.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Included Add-ons</h4>
                          <div className="flex flex-wrap gap-1">
                            {pkg.addOns.map((addon: string) => (
                              <Badge key={addon} className="bg-humsafar-100 text-humsafar-700 text-xs px-2 py-1 rounded">{addon}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button onClick={() => handleChoosePlan(pkg.id)} className="w-full bg-humsafar-600 hover:bg-humsafar-700 text-white font-medium py-2 rounded-lg">Choose Plan</Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

      {/* Add-ons Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-humsafar-600 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-humsafar-800 mb-4">
                Premium Add-on Services
              </h2>
              <p className="text-lg text-humsafar-600 max-w-2xl mx-auto">
                Enhance your matrimonial journey with our exclusive add-on services designed to maximize your success.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {addOnServices.map((addon, index) => (
                <Card key={addon.name} className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-humsafar-100 rounded-lg flex items-center justify-center">
                        <addon.icon className="w-8 h-8 text-humsafar-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">{addon.name}</CardTitle>
                    <CardDescription className="text-gray-600 text-sm">{addon.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <div className="mb-4 border-b border-gray-100 pb-4">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {addon.included ? "Included" : `Rs. ${addon.price}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {addon.duration}
                      </div>
                    </div>
                    {addon.included ? (
                      <Badge className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Included in All Packages
                      </Badge>
                    ) : (
                      <Badge className="bg-humsafar-100 text-humsafar-700 px-3 py-1 text-sm rounded">
                        <Crown className="w-4 h-4 mr-1" />
                        Standard & Premium Only
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      {/* FAQ Section */}
      <section className="py-10 bg-gradient-to-br from-humsafar-50 via-white to-humsafar-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-full mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-humsafar-800 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-humsafar-600 max-w-3xl mx-auto leading-relaxed">
              Get answers to common questions about our packages and services.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="group">
              <div className="bg-white rounded-2xl border-2 border-humsafar-100 hover:border-humsafar-300 transition-all duration-300 hover:shadow-xl p-6">
                <h3 className="text-xl font-bold text-humsafar-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-full flex items-center justify-center mr-3">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  How do profile views work?
                </h3>
                <p className="text-humsafar-600 leading-relaxed pl-11">
                  When you purchase a package, you get the specified number of profile views per month. 
                  For example, Basic package gives you 10 total profile views per month.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-2xl border-2 border-humsafar-100 hover:border-humsafar-300 transition-all duration-300 hover:shadow-xl p-6">
                <h3 className="text-xl font-bold text-humsafar-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-full flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  What happens when I reach my profile view limit?
                </h3>
                <p className="text-humsafar-600 leading-relaxed pl-11">
                  When you reach your monthly limit, you won't be able to view new profiles until 
                  the next month. You can still view profiles you've already seen before.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-2xl border-2 border-humsafar-100 hover:border-humsafar-300 transition-all duration-300 hover:shadow-xl p-6">
                <h3 className="text-xl font-bold text-humsafar-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-full flex items-center justify-center mr-3">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  Are add-ons included in packages?
                </h3>
                <p className="text-humsafar-600 leading-relaxed pl-11">
                  Verified Badge is included in all packages. Boost Profile and Spotlight Profile 
                  are available only in Standard and Premium packages.
                </p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-white rounded-2xl border-2 border-humsafar-100 hover:border-humsafar-300 transition-all duration-300 hover:shadow-xl p-6">
                <h3 className="text-xl font-bold text-humsafar-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  Can I view profiles without logging in?
                </h3>
                <p className="text-humsafar-600 leading-relaxed pl-11">
                  You need to create an account and purchase a package to view profiles. 
                  Free membership allows you to browse profile cards only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  )
}
