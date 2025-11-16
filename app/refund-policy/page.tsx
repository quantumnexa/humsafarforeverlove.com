"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, ArrowUp, Percent, AlertTriangle, CheckCircle, XCircle, ArrowRight, FileText } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <CreditCard className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Payment Policy</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Refund Policy
              <span className="block text-white/60">
                Clear & Transparent
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Clear and transparent policy regarding registration fees, upgrades, and seasonal offers for our matrimonial services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-humsafar-600 hover:bg-humsafar-50 font-semibold">
                <FileText className="w-5 h-5 mr-2" />
                View Policy Details
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                Contact Support
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-200 flex-shrink-0" />
                <p className="text-red-100 text-sm font-medium">
                  <strong>Important:</strong> All registration fees are non-refundable and non-returnable
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <main className="container mx-auto px-4 py-16" id="policy-details">

        {/* No Refunds Policy */}
        <Card className="border-0 shadow-xl bg-white mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">No Refunds Policy</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-700 mb-3">Registration Fees</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All registration fees paid for our matrimonial services are <strong>non-refundable and non-returnable</strong> under any circumstances. This policy applies to all service packages including Basic, Premium, and Premium Plus memberships.
              </p>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-600 mb-2">This includes but is not limited to:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Initial registration and profile creation fees</li>
                  <li>• Monthly or annual subscription charges</li>
                  <li>• Premium feature activation costs</li>
                  <li>• Verification badge payments</li>
                  <li>• Any additional service charges</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-700 mb-3">Reason for Policy</h3>
              <p className="text-gray-700 leading-relaxed">
                This policy ensures the sustainability of our personalized matchmaking services, dedicated staff support, and continuous platform improvements. Once services are activated, resources are immediately allocated to your profile management and match coordination.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        <Card className="border-0 shadow-xl bg-white mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <ArrowUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Upgrade Options Available</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-700 mb-2">Basic → Premium</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Upgrade from Basic to Premium package to access enhanced features and priority matching services.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ArrowUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-700 mb-2">Premium → Premium Plus</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Upgrade to our highest tier for maximum visibility and dedicated matchmaker support.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-humsafar-200 bg-humsafar-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-humsafar-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ArrowUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-humsafar-700 mb-2">Direct Upgrade</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Skip tiers and upgrade directly from Basic to Premium Plus for comprehensive services.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Upgrade Benefits</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700 text-sm">Enhanced profile visibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700 text-sm">Priority customer support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700 text-sm">Advanced search filters</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700 text-sm">Dedicated matchmaker assistance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700 text-sm">Unlimited profile views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700 text-sm">Premium badge display</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Discounts */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-humsafar-600 to-humsafar-500 text-white mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Percent className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Seasonal Discounts</h2>
              <p className="text-lg text-white/95 leading-relaxed mb-6">
                Take advantage of special offers during festive seasons and promotional periods throughout the year.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">When Discounts Apply</h3>
                <ul className="text-white/90 space-y-2 text-sm">
                  <li>• Eid celebrations (Eid-ul-Fitr & Eid-ul-Adha)</li>
                  <li>• Wedding season promotions</li>
                  <li>• New Year special offers</li>
                  <li>• Anniversary celebrations</li>
                  <li>• Limited-time promotional campaigns</li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Discount Terms</h3>
                <ul className="text-white/90 space-y-2 text-sm">
                  <li>• Discounts apply to new registrations only</li>
                  <li>• Cannot be combined with other offers</li>
                  <li>• Valid for limited time periods</li>
                  <li>• Terms and conditions apply</li>
                  <li>• Subject to availability</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-white" />
                <h3 className="text-lg font-semibold">Important Note</h3>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Seasonal discounts are promotional offers and do not change our no-refund policy. All discounted payments remain non-refundable once services are activated.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Questions About Our Policy?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-humsafar-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-humsafar-700 mb-3">Contact Us</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about our refund policy, upgrade options, or seasonal discounts, please don't hesitate to reach out to our customer support team.
              </p>
              <div className="bg-white rounded-lg p-4 border border-humsafar-200">
                <p className="text-gray-700">
                  <strong>Website:</strong> <span className="text-humsafar-600 font-semibold">www.humsafarforeverlove.com</span>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Support:</strong> Available through our official website contact form
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}