"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Globe, Shield, Heart, Star, Zap, ArrowRight, Trophy } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function HowWeStandOutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
      </section>

        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Trophy className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Our Excellence</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              How We Stand Out
              <span className="block text-white/60">
                Our Unique Approach
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover what makes Humsafar Forever Love the preferred choice for matrimonial services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-humsafar-600 hover:bg-humsafar-50 font-semibold">
                <Star className="w-5 h-5 mr-2" />
                Our Features
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                Success Stories
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      
      <main className="container mx-auto px-4 py-16" id="features">

        {/* Main Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Dedicated Matchmaker Staff */}
          <Card className="border-humsafar-200 hover:shadow-lg transition-shadow">
            <CardHeader className="bg-humsafar-50">
              <CardTitle className="flex items-center gap-3 text-humsafar-600">
                <Users className="w-6 h-6" />
                Dedicated Matchmaker Staff
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Our team of <span className="font-semibold text-humsafar-600">professional matchmakers</span> work personally with each Premium and Premium Plus member to find the most suitable matches.
                </p>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm">Personal consultation and profile analysis</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm">Hand-picked recommendations based on compatibility</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm">Ongoing support throughout your journey</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Guidance */}
          <Card className="border-humsafar-200 hover:shadow-lg transition-shadow">
            <CardHeader className="bg-humsafar-50">
              <CardTitle className="flex items-center gap-3 text-humsafar-600">
                <Globe className="w-6 h-6" />
                Personalized Guidance for All
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We provide <span className="font-semibold text-humsafar-600">specialized guidance</span> for both overseas and local Pakistanis, understanding unique cultural and geographical needs.
                </p>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm">Cultural sensitivity and understanding</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm">Cross-border matchmaking expertise</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm">Time zone and communication flexibility</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy & Technology */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Privacy-Focused Approach */}
          <Card className="border-humsafar-200 hover:shadow-lg transition-shadow">
            <CardHeader className="bg-humsafar-50">
              <CardTitle className="flex items-center gap-3 text-humsafar-600">
                <Shield className="w-6 h-6" />
                Privacy-Focused, No Awkward Encounters
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Say goodbye to <span className="font-semibold text-humsafar-600">awkward rishta aunties</span> and uncomfortable family meetings. We maintain complete confidentiality and dignity.
                </p>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm">Your details remain hidden until you choose to share</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm">No pressure or uncomfortable situations</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm">Professional and respectful process</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tradition & Modern Tech */}
          <Card className="border-humsafar-200 hover:shadow-lg transition-shadow">
            <CardHeader className="bg-humsafar-50">
              <CardTitle className="flex items-center gap-3 text-humsafar-600">
                <Zap className="w-6 h-6" />
                Perfect Blend of Tradition & Modern Tech
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We combine <span className="font-semibold text-humsafar-600">traditional values</span> with cutting-edge technology to create the most effective matchmaking experience.
                </p>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm">Advanced compatibility algorithms</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm">Respect for cultural and family values</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-humsafar-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600 text-sm">Modern communication tools and platforms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us */}
        <Card className="mb-8 border-humsafar-200">
          <CardHeader className="bg-humsafar-50">
            <CardTitle className="flex items-center gap-3 text-humsafar-600">
              <Star className="w-6 h-6" />
              Why Families Trust Us
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-humsafar-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-humsafar-600" />
                </div>
                <h3 className="font-semibold text-humsafar-600 mb-2">Genuine Care</h3>
                <p className="text-gray-700 text-sm">We treat every member like family, with genuine care and attention to their happiness.</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-humsafar-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-humsafar-600" />
                </div>
                <h3 className="font-semibold text-humsafar-600 mb-2">Trusted Process</h3>
                <p className="text-gray-700 text-sm">Our verified and transparent process has earned the trust of thousands of families.</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-humsafar-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-humsafar-600" />
                </div>
                <h3 className="font-semibold text-humsafar-600 mb-2">Proven Results</h3>
                <p className="text-gray-700 text-sm">Our success stories speak for themselves - countless happy marriages and satisfied families.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center p-8 bg-gradient-to-r from-humsafar-500 to-humsafar-600 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
          <p className="text-humsafar-100 mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied members who found their life partners through our trusted and professional matchmaking service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="secondary" className="bg-white text-humsafar-600 px-4 py-2">
              ✓ Verified Profiles
            </Badge>
            <Badge variant="secondary" className="bg-white text-humsafar-600 px-4 py-2">
              ✓ Complete Privacy
            </Badge>
            <Badge variant="secondary" className="bg-white text-humsafar-600 px-4 py-2">
              ✓ Professional Support
            </Badge>
          </div>
        </div>
        </main>
      
      <Footer />
    </div>
  )
}