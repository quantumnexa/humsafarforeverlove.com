"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle, Heart, Star, Award, ArrowRight, Target } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function MatchGuaranteePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Our Commitment</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Match Guarantee
              <span className="block text-white/60">
                Quality Assured
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              We stand behind our matchmaking service with confidence and guarantee quality matches for our premium members.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-humsafar-600 hover:bg-humsafar-50 font-semibold">
                <Target className="w-5 h-5 mr-2" />
                View Guarantee
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                Success Stories
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-200 flex-shrink-0" />
                <p className="text-green-100 text-sm font-medium">
                  <strong>Guaranteed:</strong> Quality matches or your money back policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <main className="container mx-auto px-4 py-16" id="guarantee-details">
        
        {/* Guarantee Promise */}
        <Card className="border-0 shadow-xl bg-white mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Our Match Guarantee Promise</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-700 mb-3">Premium & Premium Plus Members</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We guarantee that our Premium and Premium Plus members will receive quality matches within their specified criteria and preferences.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Quality Matches</h4>
                    <p className="text-sm text-gray-600">Verified profiles matching your criteria</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Personal Support</h4>
                    <p className="text-sm text-gray-600">Dedicated matchmaker assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guarantee Terms */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-humsafar-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-humsafar-600">
                <Award className="w-6 h-6" />
                Guarantee Coverage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">Minimum 5 quality matches within 3 months</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">Matches based on your specified preferences</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">Verified and genuine profiles only</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">Personal matchmaker consultation included</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-orange-600">
                <Star className="w-6 h-6" />
                Success Commitment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">Continuous support until you find your match</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">Regular profile updates and improvements</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">Feedback and guidance throughout the process</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 text-sm">Money-back policy if terms are not met</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 bg-gradient-to-r from-humsafar-500 to-humsafar-600 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience Our Guarantee?</h2>
          <p className="text-humsafar-100 mb-6 max-w-2xl mx-auto">
            Join our Premium or Premium Plus membership and experience our guaranteed matchmaking service with complete confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="secondary" className="bg-white text-humsafar-600 px-4 py-2">
              ✓ Quality Guaranteed
            </Badge>
            <Badge variant="secondary" className="bg-white text-humsafar-600 px-4 py-2">
              ✓ Money Back Policy
            </Badge>
            <Badge variant="secondary" className="bg-white text-humsafar-600 px-4 py-2">
              ✓ Personal Support
            </Badge>
          </div>
        </div>
        </main>
      
      <Footer />
    </div>
  )
}