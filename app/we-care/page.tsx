"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Phone,
  Mail,
  Heart,
  Shield,
  Users,
  Clock,
  CheckCircle,
  Star,
  Award,
  Headphones,
  ArrowRight,
  MessageCircle,
  Target,
  Globe
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function WeCarePage() {
  const careFeatures = [
    {
      icon: Heart,
      title: "Personalized Matchmaking",
      description: "Our dedicated team works personally with each member to understand their unique preferences and find compatible matches."
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "We prioritize your privacy with advanced security measures and strict verification processes for all profiles."
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Our customer care team is available round the clock to assist you with any queries or concerns."
    },
    {
      icon: Clock,
      title: "Timely Updates",
      description: "Regular profile updates and match suggestions to keep your matrimonial journey active and engaging."
    },
    {
      icon: CheckCircle,
      title: "Verified Profiles",
      description: "All profiles undergo thorough verification to ensure authenticity and build trust in our community."
    },
    {
      icon: Star,
      title: "Success Stories",
      description: "We celebrate every successful match and maintain long-term relationships with our members."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Heart className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Your Happiness Matters</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              We Care
              <span className="block text-white/60">
                About Your Journey
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              At Humsafar Forever Love, we understand that finding the right life partner is one of the most important decisions you'll make. That's why we're committed to providing exceptional care and support throughout your matrimonial journey.
            </p>
          </div>
        </div>

        {/* Care Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How We Care For You
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our commitment goes beyond just matchmaking. We provide comprehensive care and support at every step.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {careFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index} className="border-humsafar-200 hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-humsafar-100 rounded-full flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-humsafar-600" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 text-center">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Commitment to You
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Quality Over Quantity
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We believe in providing quality matches rather than overwhelming you with countless options. Our team carefully curates profiles that align with your preferences and values.
                  </p>
                  
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Continuous Support
                  </h3>
                  <p className="text-gray-600">
                    From profile creation to your wedding day and beyond, we're here to support you. Our relationship doesn't end when you find your match – we celebrate your success as our own.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Transparent Process
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We maintain complete transparency in our matchmaking process. You'll always know what we're doing to help you find your perfect match.
                  </p>
                  
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Cultural Sensitivity
                  </h3>
                  <p className="text-gray-600">
                    We understand and respect cultural values and traditions. Our matchmaking process takes into account your cultural background and family expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-humsafar-600">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Need Support? We're Here for You
              </h2>
              <p className="text-xl text-humsafar-100 mb-8">
                Have questions or need assistance? Our caring support team is always ready to help you on your matrimonial journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="bg-white text-humsafar-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Contact Us
                </a>
                <a 
                  href="/technical-support" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-humsafar-600 transition-colors"
                >
                  Technical Support
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}