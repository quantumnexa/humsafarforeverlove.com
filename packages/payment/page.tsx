"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, CreditCard, Shield, Clock, Star, Crown, Zap, Upload, Building, Smartphone, Copy, X, Sparkles, Users } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { UserSubscriptionService } from "@/lib/userSubscriptionService"
import { supabase } from "@/lib/supabaseClient"

// Discount config
const DISCOUNT_ACTIVE = true
const DISCOUNT_PERCENT = 50
const DISCOUNT_LABEL = "Limited time discount applied"
const applyDiscount = (price: number) =>
  DISCOUNT_ACTIVE ? Math.round(price * (100 - DISCOUNT_PERCENT) / 100) : price

interface Package {
  id: string
  name: string
  price: number
  duration: string
  profileViews: number
  features: string[]
  addOns: string[]
  icon: any
  isUnlimited?: boolean
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get('package')
  
  const [packageDetails, setPackageDetails] = useState<Package | null>(null)
  const [loading, setLoading] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState("")
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string>('')
  const [screenshotUploadError, setScreenshotUploadError] = useState<string>('')
  const [paymentError, setPaymentError] = useState<string>('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bank' | 'jazzcash' | 'payfast'>('payfast')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [checkingGuard, setCheckingGuard] = useState(true)
  const [hasVerifiedBadge, setHasVerifiedBadge] = useState<boolean>(false)
  const [hasBoostProfile, setHasBoostProfile] = useState<boolean>(false)
  const [includeVerifiedBadge, setIncludeVerifiedBadge] = useState<boolean>(false)
  const [includeBoostProfile, setIncludeBoostProfile] = useState<boolean>(false)

  const packages: Record<string, Package> = {
    basic: {
      id: "basic",
      name: "Basic Package",
      price: 5000,
      duration: "Lifetime",
      profileViews: 10,
      features: [
        "10 contacts access",
        "Advanced search filters",
        "Profile views tracking",
        "Priority customer support",
        "Mobile app premium features",
        "Read receipts"
      ],
      addOns: [],
      icon: Star
    },
    standard: {
      id: "standard",
      name: "Standard Package",
      price: 8000,
      duration: "Lifetime",
      profileViews: 20,
      features: [
        "20 contacts access",
        "Priority listing",
        "Advanced matching algorithm",
        "Profile analytics",
        "Dedicated support",
        "Profile boost (monthly)"
      ],
      addOns: [],
      icon: Crown
    },
    premium: {
      id: "premium",
      name: "Premium Package",
      price: 13000,
      duration: "Lifetime",
      profileViews: 30,
      features: [
        "30 contacts access",
        "Spotlight profile",
        "Priority listing",
        "Advanced analytics",
        "Personalized matchmaker support",
        "Exclusive events access",
        "Profile verification",
        "Background check assistance",
        "Unlimited everything"
      ],
      addOns: [],
      icon: Zap
    },
    bronze: {
      id: "bronze",
      name: "Bronze",
      price: 50000,
      duration: "Lifetime",
      profileViews: 50,
      features: [
        "50 profile views",
        "Offline matchmaking support",
        "Priority customer support",
        "In-person introductions (where available)",
      ],
      addOns: ["Matchmaker Assistance"],
      icon: Users
    },
    silver: {
      id: "silver",
      name: "Silver",
      price: 200000,
      duration: "Lifetime",
      profileViews: 100,
      features: [
        "100 profile views",
        "Offline matchmaking with dedicated coordinator",
        "Priority listing",
        "Shortlisted profiles by team",
      ],
      addOns: ["Matchmaker Assistance"],
      icon: Shield
    },
    gold: {
      id: "gold",
      name: "Gold",
      price: 500000,
      duration: "Lifetime",
      profileViews: 200,
      features: [
        "200 profile views",
        "Premium offline matchmaking",
        "Personalized meetings scheduling",
        "Background check assistance",
      ],
      addOns: ["Matchmaker Assistance"],
      icon: Crown
    },
    diamond: {
      id: "diamond",
      name: "Diamond",
      price: 1000000,
      duration: "Lifetime",
      profileViews: 0,
      isUnlimited: true,
      features: [
        "Unlimited views",
        "Elite offline matchmaking",
        "Dedicated matchmaker",
        "Exclusive events access",
      ],
      addOns: ["Matchmaker Assistance"],
      icon: Sparkles
    }
    ,
    weekly1: {
      id: "weekly1",
      name: "Basic",
      price: 1000,
      duration: "1 Week",
      profileViews: 3,
      features: [
        "Connect with 3 profiles",
        "Verified profiles access",
        "Basic support"
      ],
      addOns: [],
      icon: Star
    },
    weekly2: {
      id: "weekly2",
      name: "Standard",
      price: 2000,
      duration: "1 Week",
      profileViews: 7,
      features: [
        "Connect with 7 profiles",
        "Priority listing",
        "Standard support"
      ],
      addOns: [],
      icon: Crown
    },
    weekly3: {
      id: "weekly3",
      name: "Premium",
      price: 3000,
      duration: "1 Week",
      profileViews: 12,
      features: [
        "Connect with 12 profiles",
        "Spotlight profile",
        "Priority support"
      ],
      addOns: [],
      icon: Zap
    }
  }

  // Fetch subscription to gate add-on CTAs
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const subscription = await UserSubscriptionService.getCurrentUserSubscription()
        setHasVerifiedBadge(Boolean(subscription?.verified_badge))
        setHasBoostProfile(Boolean(subscription?.boost_profile))
      } catch (e) {
        setHasVerifiedBadge(false)
        setHasBoostProfile(false)
      }
    }
    fetchSubscription()
  }, [])
  useEffect(() => {
    const init = async () => {
      if (packageId && packages[packageId]) {
        setPackageDetails(packages[packageId])
      } else {
        router.push('/packages')
        return
      }

      // Ensure user auth so add-on state reflects actual purchases
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth')
          return
        }
        setCurrentUser(user)
      } catch (e) {
        // If auth fails, redirect to auth
        router.push('/auth')
        return
      } finally {
        setCheckingGuard(false)
      }
    }
    init()
  }, [packageId, router])

  // Removed checkPaymentError function - no admin policy complications needed

  // Removed clearPaymentError function - simplified flow

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Reset previous errors
      setScreenshotUploadError('')
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setScreenshotUploadError('File size should be less than 5MB')
        return
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        setScreenshotUploadError('Please upload an image file')
        return
      }
      
      setPaymentScreenshot(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setScreenshotPreview(previewUrl)
    }
  }

  const removeScreenshot = () => {
    setPaymentScreenshot(null)
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview)
      setScreenshotPreview('')
    }
    setScreenshotUploadError('')
  }

  const uploadScreenshotToStorage = async (file: File, userId: string): Promise<string | null> => {
    try {
      // No DB/storage upload. Return local object URL for preview/submission.
      const url = URL.createObjectURL(file)
      return url
    } catch (error) {
      setScreenshotUploadError('Upload error: ' + (error instanceof Error ? error.message : 'Unknown error'))
      return null
    }
  }

  const handlePayment = async () => {
    if (!packageDetails) return

    // Check if screenshot is uploaded
    if (!paymentScreenshot) {
      alert('Please upload payment screenshot before proceeding.')
      return
    }

    setLoading(true)
    try {
      // Clear any previous upload errors
      setScreenshotUploadError('')

      // Use local URL instead of uploading to storage/DB
      const screenshotUrl = await uploadScreenshotToStorage(paymentScreenshot, currentUser?.id || 'local-user')
      if (!screenshotUrl) {
        alert('Failed to process payment screenshot. Please try again.')
        setLoading(false)
        return
      }

      // No DB write. Simulate success and navigate.
      alert(`Payment submitted! Screenshot captured locally. You will receive ${packageDetails.isUnlimited ? 'Unlimited' : packageDetails.profileViews} profile views once processed by admin.`)
      router.push('/dashboard')
    } catch (error) {
      console.error('Payment processing error:', error)
      alert(`Payment processing error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (!packageDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-humsafar50 via-white to-humsafar100">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-humsafar-600 mx-auto"></div>
          <p className="mt-4 text-humsafar-600">Loading package details...</p>
        </div>
        <Footer />
      </div>
    )
  }

  const IconComponent = packageDetails.icon
  const VERIFIED_BADGE_PRICE = 1000
  const BOOST_PROFILE_PRICE = 1000
  const discountedPackagePrice = applyDiscount(packageDetails.price)
  const addonsTotal = (includeVerifiedBadge ? VERIFIED_BADGE_PRICE : 0) + (includeBoostProfile ? BOOST_PROFILE_PRICE : 0)
  const finalTotal = discountedPackagePrice + addonsTotal

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar50 via-white to-humsafar100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-humsafar-800 mb-4">
              Complete Your Purchase
            </h1>
            <p className="text-xl text-humsafar-600">
              You're just one step away from unlocking premium features
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Package Summary */}
            <Card className="h-fit">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <IconComponent className="w-16 h-16 text-humsafar-600" />
                </div>
                <CardTitle className="text-2xl text-humsafar-800">
                  {packageDetails.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  {packageDetails.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center bg-humsafar-50 rounded-lg p-4">
                  {DISCOUNT_ACTIVE ? (
                    <>
                      <div className="text-sm text-gray-500 line-through">
                        Rs. {packageDetails.price.toLocaleString()}
                      </div>
                      <div className="text-4xl font-bold text-humsafar-600">
                        Rs. {applyDiscount(packageDetails.price).toLocaleString()}
                      </div>
                      <div className="text-green-600 text-sm">
                        {DISCOUNT_LABEL} ({DISCOUNT_PERCENT}% OFF)
                      </div>
                    </>
                  ) : (
                    <div className="text-4xl font-bold text-humsafar-600">
                      Rs. {packageDetails.price.toLocaleString()}
                    </div>
                  )}
                  <div className="text-humsafar-600">
                    One-time payment
                  </div>
                </div>

                {/* Profile Views */}
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  {packageDetails.isUnlimited ? (
                    <>
                      <div className="text-2xl font-bold text-blue-600">
                        Unlimited Profile Views
                      </div>
                      <div className="text-blue-600 text-sm">
                        Per month (unlimited package)
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-blue-600">
                        {packageDetails.profileViews} Profile Views
                      </div>
                      <div className="text-blue-600 text-sm">
                        {packageDetails.duration}
                      </div>
                    </>
                  )}
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold text-humsafar-700 mb-3">Package Features:</h3>
                  <ul className="space-y-2">
                    {packageDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-humsafar-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Optional Add-ons (Paid) */}
                <div>
                  <h3 className="font-semibold text-humsafar-700 mb-3">Optional Add-ons (Paid):</h3>
                  <p className="text-sm text-humsafar-600">Verified Badge and Boost Profile are available separately for Rs. 1000 each.</p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {hasVerifiedBadge ? (
                      <Button disabled className="bg-gray-300 text-gray-600 cursor-not-allowed">
                        Verified Badge Active
                      </Button>
                    ) : (
                      <Button
                        onClick={() => router.push('/verified-badge-payment')}
                        className="bg-humsafar-600 hover:bg-humsafar-700 text-white"
                      >
                        Buy Verified Badge
                      </Button>
                    )}
                    {hasBoostProfile ? (
                      <Button disabled className="bg-gray-300 text-gray-600 cursor-not-allowed">
                        Boost Profile Active
                      </Button>
                    ) : (
                      <Button
                        onClick={() => router.push('/boost-profile-payment')}
                        className="bg-humsafar-600 hover:bg-humsafar-700 text-white"
                      >
                        Buy Boost Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-humsafar-800">
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Enter your payment details below to complete your purchase.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Package Summary */}
                <div className="bg-humsafar-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-humsafar-700">Package:</span>
                    <span className="font-semibold">{packageDetails.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-humsafar-700">Duration:</span>
                    <span className="font-semibold">{packageDetails.duration}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-humsafar-700">Package Price:</span>
                      {DISCOUNT_ACTIVE ? (
                        <div className="text-right">
                          <div className="text-sm text-gray-500 line-through">Rs. {packageDetails.price.toLocaleString()}</div>
                          <div className="text-xl font-bold text-humsafar-600">Rs. {discountedPackagePrice.toLocaleString()}</div>
                          <div className="text-xs text-green-600">{DISCOUNT_LABEL} ({DISCOUNT_PERCENT}% OFF)</div>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-humsafar-600">Rs. {packageDetails.price.toLocaleString()}</span>
                      )}
                    </div>
                    {addonsTotal > 0 && (
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-humsafar-700">Add-ons Total:</span>
                          <span className="font-semibold">Rs. {addonsTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-humsafar-700">Final Total:</span>
                      <span className="text-2xl font-bold text-humsafar-600">Rs. {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Select Add-ons */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-humsafar-700 mb-3">Add-ons</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={includeVerifiedBadge}
                          onCheckedChange={(checked) => setIncludeVerifiedBadge(Boolean(checked))}
                          disabled={hasVerifiedBadge}
                        />
                        <span className="text-sm">Verified Badge</span>
                      </div>
                      <span className="text-sm font-semibold">Rs. {VERIFIED_BADGE_PRICE}</span>
                    </label>
                    {hasVerifiedBadge && (
                      <div className="text-xs text-gray-500">Already active on your account</div>
                    )}
                    <label className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={includeBoostProfile}
                          onCheckedChange={(checked) => setIncludeBoostProfile(Boolean(checked))}
                          disabled={hasBoostProfile}
                        />
                        <span className="text-sm">Boost Profile (1 month)</span>
                      </div>
                      <span className="text-sm font-semibold">Rs. {BOOST_PROFILE_PRICE}</span>
                    </label>
                    {hasBoostProfile && (
                      <div className="text-xs text-gray-500">Already active on your account</div>
                    )}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-humsafar-700 mb-3">Choose Payment Method:</h3>
                  
                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-1 gap-4">
                    {/* PayFast first */}
                    <button
                      onClick={() => setSelectedPaymentMethod('payfast')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selectedPaymentMethod === 'payfast' 
                          ? 'border-humsafar-500 bg-humsafar-50' 
                          : 'border-gray-200 hover:border-humsafar-300'
                      }`}
                    >
                      <CreditCard className="w-8 h-8 mx-auto mb-2 text-humsafar-600" />
                      <div className="text-sm font-medium">PayFast</div>
                      <div className="text-xs text-gray-500">Gateway Checkout</div>
                    </button>
                  </div>

                  {/* Bank Transfer Details */}
                  {selectedPaymentMethod === 'bank' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-800 mb-3">
                        <Building className="w-5 h-5" />
                        <span className="font-semibold">Faysal Bank Limited - Traditional Bank Transfer</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Bank Name:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Faysal Bank Limited</span>
                            <button onClick={() => copyToClipboard('Faysal Bank Limited')} className="text-blue-600 hover:text-blue-800">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Branch:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Dastagir</span>
                            <button onClick={() => copyToClipboard('Dastagir')} className="text-blue-600 hover:text-blue-800">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Account No:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">3612 4440 0000 2409</span>
                            <button onClick={() => copyToClipboard('3612 4440 0000 2409')} className="text-blue-600 hover:text-blue-800">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Account Title:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Humsafar Forever Love</span>
                            <button onClick={() => copyToClipboard('Humsafar Forever Love')} className="text-blue-600 hover:text-blue-800">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-white rounded border">
                        <h4 className="font-medium text-gray-800 mb-2">How to Transfer:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Visit any Faysal Bank branch</li>
                          <li>• Use online banking or mobile app</li>
                          <li>• ATM transfer service</li>
                          <li>• Inter-bank transfer from other banks</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* PayFast Details */}
                  {selectedPaymentMethod === 'payfast' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <Button
                        type="button"
                        onClick={() => {
                          if (!packageDetails) return
                          const amount = finalTotal
                          router.push(`/payfast?amount=${amount}`)
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Pay with PayFast
                      </Button>
                      <div className="mt-3 text-sm text-green-800">
                       PayFast is a secure online payment gateway in Pakistan. You will be redirected to the PayFast checkout page, where you can easily make payments using your debit or credit card. We never store your card details.
                      </div>
                      <div className="mt-1 text-xs text-green-700">
                        For more information: <a href="/payfast" className="underline text-green-700 hover:text-green-800">PayFast details</a>
                      </div>
                    </div>
                  )}
                  {/* JazzCash Details */}
                  {selectedPaymentMethod === 'jazzcash' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-800 mb-3">
                        <Smartphone className="w-5 h-5" />
                        <span className="font-semibold">JazzCash - Mobile Wallet Transfer</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Service:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">JazzCash Mobile Wallet</span>
                            <button onClick={() => copyToClipboard('JazzCash Mobile Wallet')} className="text-green-600 hover:text-green-800">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Account No:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">0332 7355 681</span>
                            <button onClick={() => copyToClipboard('0332 7355 681')} className="text-green-600 hover:text-green-800">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Account Title:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Humsafar Forever Love</span>
                            <button onClick={() => copyToClipboard('Humsafar Forever Love')} className="text-green-600 hover:text-green-800">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-white rounded border">
                        <h4 className="font-medium text-gray-800 mb-2">How to Transfer:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Use JazzCash mobile app</li>
                          <li>• Dial *786# from Jazz number</li>
                          <li>• Visit JazzCash agent</li>
                          <li>• Online transfer from other wallets</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Error Alert */}
                {paymentError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-800 mb-1">Payment Screenshot Issue</h3>
                        <p className="text-sm text-red-700">{paymentError}</p>
                        <button
                          onClick={() => setPaymentError('')}
                          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                        >
                          Dismiss and upload new screenshot
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Instructions (hidden for PayFast) */}
                {selectedPaymentMethod !== 'payfast' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-3">Payment Instructions</h4>
                    <div className="space-y-2 text-sm text-yellow-700">
                      <div className="flex items-start gap-2">
                        <span className="font-medium bg-yellow-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                        <span>Choose your preferred payment method from the options above</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium bg-yellow-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                        <span>Transfer the amount using the provided account details</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium bg-yellow-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                        <span>Take a screenshot or note the transaction ID</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium bg-yellow-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">4</span>
                        <span>Upload payment screenshot below and submit</span>
                      </div>
                    </div>
                  </div>
                )}

               {/* Screenshot Upload (hidden for PayFast) */}
                {selectedPaymentMethod !== 'payfast' && (
                  <div className="space-y-2">
                    <Label className="text-humsafar-700">
                      Upload Payment Screenshot <span className="text-red-500">*</span>
                    </Label>
                    
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-humsafar-200 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="screenshot-upload"
                      />
                      <label htmlFor="screenshot-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto text-humsafar-400 mb-4" />
                        <div className="text-humsafar-600 font-medium mb-2">
                          {paymentScreenshot ? paymentScreenshot.name : 'Click to upload payment screenshot'}
                        </div>
                        <div className="text-sm text-humsafar-500">
                          PNG, JPG up to 5MB
                        </div>
                      </label>
                    </div>

                    {/* Error Display */}
                    {screenshotUploadError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                        <X className="w-4 h-4" />
                        {screenshotUploadError}
                      </div>
                    )}

                    {/* Success Message */}
                    {paymentScreenshot && !screenshotUploadError && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <Check className="w-4 h-4" />
                        Screenshot uploaded successfully
                      </div>
                    )}

                    {/* Preview */}
                    {screenshotPreview && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-humsafar-700 text-sm">Preview:</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeScreenshot}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                        <div className="border rounded-lg p-2 bg-gray-50">
                          <img
                            src={screenshotPreview}
                            alt="Payment Screenshot Preview"
                            className="max-w-full h-auto max-h-64 mx-auto rounded"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Security Guidelines (hidden for PayFast) */}
                {selectedPaymentMethod !== 'payfast' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-semibold">Security Guidelines</span>
                    </div>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Always verify account details before transfer</li>
                      <li>• Keep transaction receipts safe</li>
                      <li>• Never share your banking credentials</li>
                      <li>• Use secure internet connections</li>
                    </ul>
                  </div>
                )}

                {/* After Payment Notice (hidden for PayFast) */}
                {selectedPaymentMethod !== 'payfast' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">After Payment</span>
                    </div>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Upload payment screenshot above</li>
                      <li>• Include your registered phone number in transaction details</li>
                      <li>• Mention the service you're paying for</li>
                      <li>• Allow 24-48 hours for verification</li>
                    </ul>
                  </div>
                )}

                {/* Proceed Button (hidden for PayFast) */}
                {selectedPaymentMethod !== 'payfast' && (
                  <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-humsafar-600 hover:bg-humsafar-700 text-white font-semibold py-3 text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Submit Payment Confirmation
                      </div>
                    )}
                  </Button>
                )}

                {/* Terms */}
                <div className="text-center text-sm text-humsafar-500">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back to Packages */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => router.push('/packages')}
              className="border-humsafar-200 text-humsafar-600 hover:bg-humsafar-50"
            >
              ← Back to Packages
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

