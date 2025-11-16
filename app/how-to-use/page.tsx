"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPlus, Shield, User, MessageCircle, CheckCircle, Star, Zap, Heart, BookOpen, ArrowRight, Play, Clock, Lock } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <BookOpen className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Step-by-Step Guide</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              How to Use
              <span className="block text-white/60">
                Humsafar Forever Love
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Follow our simple three-step process to create your profile, connect with matches, and find your perfect life partner through our trusted platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-humsafar-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg"
                onClick={() => document.getElementById('steps-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white bg-transparent text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 rounded-full backdrop-blur-sm"
              >
                Watch Tutorial
                <Play className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-lg"></div>
        </div>

        {/* Process Steps */}
        <div id="steps-section" className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Getting Started in 3 Easy Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <Card className="border-rose-200 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-4 left-4">
                <Badge className="bg-rose-500 text-white text-lg px-3 py-1">Step 1</Badge>
              </div>
              <CardHeader className="pt-8">
                <div className="flex items-center space-x-2 mb-2">
                  <UserPlus className="h-6 w-6 text-rose-500" />
                  <CardTitle className="text-xl">Register & Verify</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Create your account</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Verify email & phone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Complete identity verification</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Quick and secure registration process with identity verification for your safety.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-rose-200 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-4 left-4">
                <Badge className="bg-rose-500 text-white text-lg px-3 py-1">Step 2</Badge>
              </div>
              <CardHeader className="pt-8">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-6 w-6 text-rose-500" />
                  <CardTitle className="text-xl">Create Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Add personal details</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Upload photos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Set preferences</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Build a comprehensive profile with photos, details, and your match preferences.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-rose-200 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-4 left-4">
                <Badge className="bg-rose-500 text-white text-lg px-3 py-1">Step 3</Badge>
              </div>
              <CardHeader className="pt-8">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="h-6 w-6 text-rose-500" />
                  <CardTitle className="text-xl">Communicate with Matchmaker</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Connect with dedicated matchmaker</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Receive personalized matches</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Get ongoing guidance</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Work directly with our expert matchmakers for personalized service and guidance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Process Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Our Process Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-rose-200 text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-rose-500 mx-auto mb-2" />
                <CardTitle>Simple & Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Complete registration and profile setup in just minutes with our streamlined process.
                </p>
              </CardContent>
            </Card>

            <Card className="border-rose-200 text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-rose-500 mx-auto mb-2" />
                <CardTitle>Secure & Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All profiles are verified for authenticity and security to ensure genuine connections.
                </p>
              </CardContent>
            </Card>

            <Card className="border-rose-200 text-center">
              <CardHeader>
                <Lock className="h-12 w-12 text-rose-500 mx-auto mb-2" />
                <CardTitle>Confidential</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your privacy is protected with complete confidentiality throughout the process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Steps */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Detailed Process Guide
          </h2>
          <div className="space-y-6">
            <Card className="border-rose-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-rose-500" />
                  <span>Registration & Verification</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">What You Need:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Valid email address</li>
                      <li>• Phone number</li>
                      <li>• Identity document (CNIC/Passport)</li>
                      <li>• Recent photograph</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Process:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Fill registration form</li>
                      <li>• Verify email and phone</li>
                      <li>• Upload identity document</li>
                      <li>• Wait for verification (24-48 hours)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-rose-500" />
                  <span>Profile Creation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Personal Information:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Basic details (age, location, etc.)</li>
                      <li>• Education and profession</li>
                      <li>• Family background</li>
                      <li>• Lifestyle preferences</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Match Preferences:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Age range preference</li>
                      <li>• Location preferences</li>
                      <li>• Education requirements</li>
                      <li>• Other specific criteria</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-rose-500" />
                  <span>Matchmaker Communication</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">What to Expect:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Dedicated matchmaker assignment</li>
                      <li>• Initial consultation call</li>
                      <li>• Regular match recommendations</li>
                      <li>• Ongoing support and guidance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Communication Channels:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Phone calls</li>
                      <li>• WhatsApp messages</li>
                      <li>• Email updates</li>
                      <li>• In-person meetings (if needed)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-humsafar-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Ready to Start Your Journey?
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Join thousands of successful matches with our proven process
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600">
              <UserPlus className="h-5 w-5 mr-2" />
              Start Registration Now
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}