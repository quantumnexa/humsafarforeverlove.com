"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Heart, Shield, Target, Star, Award, Crown, Sparkles, Quote, ArrowRight, MessageCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CEONotePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-humsafar-600 via-humsafar-700 to-humsafar-800 text-white py-20">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Crown className="w-5 h-5" />
              <span className="font-medium">Message from Leadership</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-humsafar-100 bg-clip-text text-transparent">
              CEO's Note
            </h1>
            
            <p className="text-xl text-humsafar-100 mb-8 leading-relaxed">
              A personal message from our Chief Executive Officer about our vision, approach, and commitment to connecting true soulmates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white text-humsafar-600 hover:bg-humsafar-50 font-semibold">
                <MessageCircle className="w-5 h-5 mr-2" />
                Read Message
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                Our Vision
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="bg-humsafar-500/20 backdrop-blur-sm border border-humsafar-400/30 rounded-xl p-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-humsafar-200 flex-shrink-0" />
                <p className="text-humsafar-100 text-sm font-medium">
                  <strong>Our Promise:</strong> Hassle-free & personalized matchmaking with sincerity
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-16" id="ceo-message">

        {/* CEO Message */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-humsafar-600 to-humsafar-500 text-white mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Message from CEO</h2>
              <p className="text-lg text-white/90">Humsafar Forever Love</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <Quote className="w-8 h-8 text-white/70 mb-4" />
              <blockquote className="text-lg leading-relaxed text-white/95 italic mb-6">
                "At Humsafar Forever Love, we believe that finding your life partner should be a journey filled with hope, respect, and genuine connections. Our mission goes beyond simple matchmaking – we are dedicated to creating meaningful relationships that last a lifetime."
              </blockquote>
              
              <div className="text-right">
                <p className="text-white/90 font-semibold">— Chief Executive Officer</p>
                <p className="text-white/70 text-sm">Humsafar Forever Love</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vision */}
        <Card className="border-0 shadow-xl bg-white mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Our Vision</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Hassle-Free Matchmaking */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-blue-700">Hassle-Free Matchmaking</h3>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  Simplified Process
                </Badge>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We envision a world where finding your perfect life partner is effortless, enjoyable, and free from the complexities that often accompany traditional matchmaking processes.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-2 border-blue-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-700 mb-1">Streamlined Process</h4>
                    <p className="text-gray-600 text-xs">Simple steps from registration to marriage</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-blue-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-700 mb-1">Stress-Free Experience</h4>
                    <p className="text-gray-600 text-xs">Comfortable and relaxed environment</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-blue-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-700 mb-1">Professional Support</h4>
                    <p className="text-gray-600 text-xs">Expert guidance at every step</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Personalized Approach */}
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-purple-700">Personalized Matchmaking</h3>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Every individual is unique, and so should be their matchmaking journey. We believe in creating customized experiences that reflect your personality, values, and aspirations.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-600 mb-3">Individual Attention</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Dedicated personal matchmaker</li>
                    <li>• Customized matching strategy</li>
                    <li>• One-on-one consultations</li>
                    <li>• Personalized recommendations</li>
                    <li>• Tailored communication approach</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-600 mb-3">Understanding Your Needs</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Deep personality assessment</li>
                    <li>• Family background consideration</li>
                    <li>• Cultural and religious preferences</li>
                    <li>• Lifestyle compatibility analysis</li>
                    <li>• Future goals alignment</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approach */}
        <Card className="border-0 shadow-xl bg-white mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Our Approach</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Modern Approach */}
            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-green-700">Modern Methodology</h3>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  Contemporary
                </Badge>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We embrace modern technology and contemporary approaches while respecting traditional values, creating the perfect balance for today's matrimonial needs.
              </p>
              
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="border-2 border-green-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-700 mb-1">AI Matching</h4>
                    <p className="text-gray-600 text-xs">Advanced algorithms for compatibility</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-green-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-700 mb-1">Digital Platform</h4>
                    <p className="text-gray-600 text-xs">User-friendly online experience</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-green-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-700 mb-1">Human Touch</h4>
                    <p className="text-gray-600 text-xs">Personal guidance and support</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-green-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-700 mb-1">Quality Focus</h4>
                    <p className="text-gray-600 text-xs">Emphasis on meaningful connections</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-indigo-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-semibold text-indigo-700">Private & Secure Environment</h3>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Your privacy and security are our top priorities. We maintain the highest standards of confidentiality and data protection throughout your matrimonial journey.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <h4 className="font-semibold text-indigo-600 mb-3">Data Protection</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• End-to-end encryption</li>
                    <li>• Secure data storage</li>
                    <li>• Privacy controls</li>
                    <li>• Confidential communications</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <h4 className="font-semibold text-indigo-600 mb-3">Profile Security</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Verified member profiles</li>
                    <li>• Photo protection technology</li>
                    <li>• Anonymous browsing options</li>
                    <li>• Selective information sharing</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <h4 className="font-semibold text-indigo-600 mb-3">Safe Communication</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Secure messaging system</li>
                    <li>• Moderated interactions</li>
                    <li>• Report and block features</li>
                    <li>• 24/7 safety monitoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goal */}
        <Card className="border-0 shadow-xl bg-white mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Our Goal</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Connect True Soulmates */}
            <div className="bg-humsafar-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-humsafar-600" />
                <h3 className="text-xl font-semibold text-humsafar-700">Connect True Soulmates</h3>
                <Badge variant="outline" className="bg-humsafar-100 text-humsafar-700 border-humsafar-300">
                  Perfect Matches
                </Badge>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our ultimate goal is to connect individuals who are truly meant for each other – soulmates who will build beautiful, lasting relationships based on love, respect, and understanding.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-humsafar-200">
                  <h4 className="font-semibold text-humsafar-600 mb-3">Deep Compatibility</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Emotional compatibility assessment</li>
                    <li>• Shared values and beliefs</li>
                    <li>• Life goals alignment</li>
                    <li>• Personality complementarity</li>
                    <li>• Cultural and family harmony</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-humsafar-200">
                  <h4 className="font-semibold text-humsafar-600 mb-3">Lasting Relationships</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Foundation for lifelong partnership</li>
                    <li>• Mutual respect and understanding</li>
                    <li>• Shared vision for the future</li>
                    <li>• Strong communication skills</li>
                    <li>• Commitment to growth together</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sincerity in Service */}
            <div className="bg-yellow-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-semibold text-yellow-700">Sincerity in Everything We Do</h3>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Sincerity is at the heart of our service. We approach every interaction, every match, and every relationship with genuine care and authentic intentions.
              </p>
              
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="border-2 border-yellow-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Heart className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-yellow-700 mb-1">Genuine Care</h4>
                    <p className="text-gray-600 text-xs">Authentic concern for your happiness</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-yellow-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-yellow-700 mb-1">Honest Approach</h4>
                    <p className="text-gray-600 text-xs">Transparent and truthful service</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-yellow-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-yellow-700 mb-1">Dedicated Service</h4>
                    <p className="text-gray-600 text-xs">Committed to your success</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-yellow-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <User className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-yellow-700 mb-1">Personal Touch</h4>
                    <p className="text-gray-600 text-xs">Individual attention and care</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Closing Message */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-humsafar-600 to-humsafar-500 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-lg text-white/95 leading-relaxed mb-6">
                We invite you to be part of our mission to create meaningful, lasting relationships. Together, let's build a future where love finds its way to every heart.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-white/90 text-sm leading-relaxed">
                  <strong>Our Commitment:</strong> We promise to serve you with the highest level of professionalism, sincerity, and dedication. Your happiness is our success, and your trust is our greatest achievement.
                </p>
              </div>
              
              <div className="mt-6">
                <p className="text-white/90">
                  <strong>Website:</strong> <span className="text-white font-semibold">www.humsafarforeverlove.com</span>
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