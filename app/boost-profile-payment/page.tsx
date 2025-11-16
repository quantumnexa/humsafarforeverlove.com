"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabaseClient"
import { UserSubscriptionService } from "@/lib/userSubscriptionService"
import { useRouter } from "next/navigation"
import { CheckCircle, Rocket, Zap, TrendingUp } from "lucide-react"

export default function BoostProfilePaymentPage() {
  const [loading, setLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userSubscription, setUserSubscription] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkUserAuth()
  }, [])

  const checkUserAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setCurrentUser(user)

      const subscription = await UserSubscriptionService.getCurrentUserSubscription()
      setUserSubscription(subscription)

      if (subscription?.boost_profile) {
        setPaymentSuccess(true)
      }
    } catch (error) {
      router.push('/auth')
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      // Redirect to PayFast gateway with addon context; success page will process flags
      const amount = 1000
      const successQuery = encodeURIComponent("addon=boost_profile")
      router.push(`/payfast?amount=${amount}&successQuery=${successQuery}`)
    } finally {
      setLoading(false)
    }
  }

  const goToProfiles = () => {
    router.push('/profiles')
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-humsafar50 to-white">
        <Header />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Successful! 🎉</h1>
              <p className="text-xl text-gray-600 mb-8">
                Your profile is boosted for one month. Enjoy increased visibility!
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Badge className="bg-humsafar-600 text-white text-lg px-4 py-2">
                    🚀 Boost Profile
                  </Badge>
                </div>
                <p className="text-gray-600">
                  Your profile will appear more prominently across search and recommendations for 1 month.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button 
                onClick={goToProfiles}
                className="bg-humsafar-600 hover:bg-humsafar-700 text-white px-8 py-3 text-lg"
              >
                View All Profiles
              </Button>
              <p className="text-sm text-gray-500">
                Boosted status applies immediately and lasts 30 days from activation.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-humsafar50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-humsafar-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Boost Profile</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Increase visibility and profile views with a 1-month boost
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Benefits */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-humsafar-600">
                      <TrendingUp className="w-5 h-5" />
                      Why Boost?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">More Visibility</h4>
                        <p className="text-sm text-gray-600">Appear higher in search and recommendations</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Zap className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">More Profile Views</h4>
                        <p className="text-sm text-gray-600">Get noticed by more potential matches</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Rocket className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">1-Month Duration</h4>
                        <p className="text-sm text-gray-600">One-time payment, boost valid for 30 days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-800">What You Get</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Priority placement for 1 month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Increased impressions across key pages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Better chances to get interests</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Payment */}
              <div className="space-y-6">
                <Card className="border-humsafar-200">
                  <CardHeader>
                    <CardTitle className="text-center text-humsafar-600">Boost Profile Package</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-humsafar-600 mb-2">Rs. 1000</div>
                      <div className="text-gray-600">One-time payment</div>
                      <div className="text-sm text-gray-500">Valid for 1 month</div>
                    </div>

                    <div className="mb-6">
                      <Badge className="bg-humsafar-600 text-white text-lg px-4 py-2 mb-3">
                        🚀 Boost Profile
                      </Badge>
                      <p className="text-sm text-gray-600">
                        Increase visibility and get more views for 30 days
                      </p>
                    </div>

                    <Button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full bg-humsafar-600 hover:bg-humsafar-700 text-white py-3 text-lg"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing Payment...
                        </div>
                      ) : (
                        'Pay Now & Boost Profile'
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 mt-3">
                      Secure payment processing • No recurring charges
                    </p>
                  </CardContent>
                </Card>

                {/* Current Status */}
                {userSubscription && (
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Current Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Package:</span>
                          <span className="font-medium">{userSubscription.subscription_status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Profile Status:</span>
                          <Badge 
                            variant={userSubscription.profile_status === 'approved' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {userSubscription.profile_status}
                          </Badge>
                        </div>
                        {userSubscription.boost_profile && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Boost Profile:</span>
                            <span className="font-medium text-green-600">
                              Active
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}