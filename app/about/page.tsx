"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  HeadphonesIcon,
  Users,
  Globe,
  Heart,
  Shield,
  Award,
  Target,
  CheckCircle,
  Building,
  FileText
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function AboutPage() {
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
              <span className="text-white font-medium">Trusted Since Inception</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              About Us
              <span className="block text-white/60">
                Humsafar Forever Love
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Trusted Matrimonial & Matchmaking Service Across Pakistan and Beyond. Connecting hearts with dignity, privacy, and genuine care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-humsafar-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg"
                onClick={() => document.getElementById('our-mission')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Our Mission
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white bg-transparent text-white hover:bg-white hover:text-humsafar-600 font-semibold px-8 py-3 rounded-full backdrop-blur-sm"
                onClick={() => document.getElementById('company-info')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Company Info
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/20 rounded-full blur-lg"></div>
        </div>
      </main>

      {/* Company Information Section */}
      <section id="company-info" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-humsafar-100 rounded-full px-6 py-2 mb-6">
              <Building className="w-5 h-5 text-humsafar-600" />
              <span className="text-humsafar-600 font-medium">Registered & Trusted</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Company
              <span className="block bg-gradient-to-r from-humsafar-600 to-humsafar-400 bg-clip-text text-transparent">
                Information
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Humsafar Forever Love is a legally registered and trusted matrimonial service committed to helping you find your life partner.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-humsafar-50 to-white rounded-3xl p-8 md:p-12 shadow-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Official Registration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-humsafar-50 rounded-xl p-4">
                    <span className="text-gray-700 font-medium">Company Name:</span>
                    <span className="text-humsafar-700 font-semibold">HUMSAFAR FOREVER LOVE</span>
                  </div>
                  <div className="flex items-center justify-between bg-humsafar-50 rounded-xl p-4">
                    <span className="text-gray-700 font-medium">NTN Number:</span>
                    <span className="text-humsafar-700 font-semibold">H047702-2</span>
                  </div>
                  <div className="flex items-center justify-between bg-humsafar-50 rounded-xl p-4">
                    <span className="text-gray-700 font-medium">Status:</span>
                    <span className="text-humsafar-700 font-semibold">Sole Proprietorship (Registered)</span>
                  </div>
                  <div className="flex items-center justify-between bg-humsafar-50 rounded-xl p-4">
                    <span className="text-gray-700 font-medium">Website:</span>
                    <span className="text-humsafar-700 font-semibold">www.humsafarforeverlove.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Vision */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-humsafar-600 to-humsafar-500 text-white">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                    <p className="text-lg text-white/95 leading-relaxed">
                      Created with the vision of helping individuals find their life partners with dignity, privacy, and genuine care. We provide a modern yet culturally respectful approach to matchmaking.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Globe className="w-5 h-5 text-white" />
                      <p className="text-lg font-semibold text-white">Our Reach</p>
                    </div>
                    <p className="text-white/90">
                      Serving clients across Pakistan with a growing international presence, connecting hearts beyond borders.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section id="our-mission" className="py-24 bg-gradient-to-br from-gray-50 via-white to-humsafar-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-humsafar-100 rounded-full px-6 py-2 mb-6">
              <Heart className="w-5 h-5 text-humsafar-600" />
              <span className="text-humsafar-600 font-medium">Our Mission</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Making Matrimony
              <span className="block bg-gradient-to-r from-humsafar-600 to-humsafar-400 bg-clip-text text-transparent">
                Meaningful & Safe
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Our mission is to make the journey of finding a spouse easier, safer, and more meaningful. We focus on quality over quantity, ensuring every profile is carefully considered.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Mission Statement */}
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">Our Mission</CardTitle>
                </div>
                <p className="text-lg text-gray-600">
                  We believe that marriage is not just about compatibility, but about companionship, respect, and shared values.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-humsafar-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Focus on personal values, lifestyle choices, and education background</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-humsafar-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Careful consideration of relationship goals and compatibility</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-humsafar-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Professional guidance throughout your matrimonial journey</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-humsafar-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Connecting like-minded individuals with shared life visions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What We Believe */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-humsafar-50 to-white">
              <CardHeader className="pb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">What We Believe</CardTitle>
                </div>
                <p className="text-lg text-gray-600">
                  Because everyone deserves not just a partner, but a Forever Love.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-humsafar-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-humsafar-700 mb-3">Quality Over Quantity</h4>
                  <p className="text-gray-700">
                    We carefully curate profiles to ensure meaningful connections rather than overwhelming choices.
                  </p>
                </div>
                <div className="bg-humsafar-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-humsafar-700 mb-3">Cultural Respect</h4>
                  <p className="text-gray-700">
                    Modern approach while maintaining respect for traditional values and cultural preferences.
                  </p>
                </div>
                <div className="bg-humsafar-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-humsafar-700 mb-3">Lifelong Partnership</h4>
                  <p className="text-gray-700">
                    We focus on creating lasting relationships built on mutual respect and shared values.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-humsafar-100 rounded-full px-6 py-2 mb-6">
              <Award className="w-5 h-5 text-humsafar-600" />
              <span className="text-humsafar-600 font-medium">What Sets Us Apart</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose
              <span className="block bg-gradient-to-r from-humsafar-600 to-humsafar-400 bg-clip-text text-transparent">
                Humsafar Forever Love
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              At Humsafar Forever Love, we pride ourselves on providing exceptional service that goes beyond traditional matchmaking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Personalized Matchmaking */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-humsafar-50 to-white hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Personalized Matchmaking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dedicated match coordinators to understand and fulfill your preferences with personalized attention.
                </p>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-humsafar-50 to-white hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy & Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your data and identity remain confidential at every stage with our robust security measures.
                </p>
              </CardContent>
            </Card>

            {/* Diverse Reach */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-humsafar-50 to-white hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Diverse Reach</h3>
                <p className="text-gray-600 leading-relaxed">
                  Serving clients across Pakistan with a growing international presence for global connections.
                </p>
              </CardContent>
            </Card>

            {/* Exclusive Database */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-humsafar-50 to-white hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Exclusive Database</h3>
                <p className="text-gray-600 leading-relaxed">
                  Verified and accomplished individuals seeking serious and reliable life partners.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  )
}