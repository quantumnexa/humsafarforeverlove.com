"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Headphones, Clock, MessageCircle, Phone, Mail, Shield, Users, Zap } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TechnicalSupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Headphones className="w-5 h-5 text-white" />
              <span className="text-white font-medium">24/7 Customer Support</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Technical Support
              <span className="block text-white/60">
                Always Here to Help
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Get instant help with sign-up, profile access, and technical issues. Our dedicated support team is available 24/7 to ensure your matrimonial journey is smooth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-humsafar-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg"
              >
                Get Support Now
                <MessageCircle className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white bg-transparent text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 rounded-full backdrop-blur-sm"
              >
                Call Us: +92 300 1234567
                <Phone className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-lg"></div>
        </div>

        {/* Support Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-rose-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-rose-500" />
                <CardTitle className="text-lg">24/7 Availability</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Round-the-clock support available every day of the year for all your technical needs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-rose-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-rose-500" />
                <CardTitle className="text-lg">Sign-up Assistance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get help with account creation, profile setup, and verification process.
              </p>
            </CardContent>
          </Card>

          <Card className="border-rose-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-rose-500" />
                <CardTitle className="text-lg">Access Issues</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Resolve login problems, password resets, and account access difficulties.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Support Channels */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            How to Reach Us
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-rose-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Phone className="h-6 w-6 text-rose-500" />
                  <CardTitle>Phone Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Helpline</Badge>
                  <span className="font-semibold">+92 332 7355 681</span>
                </div>
                <p className="text-gray-600">
                  Call us directly for immediate assistance with technical issues.
                </p>
                <Button className="w-full bg-rose-500 hover:bg-rose-600">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="border-rose-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Mail className="h-6 w-6 text-rose-500" />
                  <CardTitle>Email Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Email</Badge>
                  <span className="font-semibold">support@humsafarforeverlove.com</span>
                </div>
                <p className="text-gray-600">
                  Send us detailed information about your technical issues.
                </p>
                <Button variant="outline" className="w-full border-rose-500 text-rose-500 hover:bg-rose-50">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Common Issues */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Common Technical Issues We Help With
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Account Registration",
              "Profile Verification",
              "Login Problems",
              "Password Reset",
              "Photo Upload Issues",
              "Payment Processing",
              "Mobile App Issues",
              "Browser Compatibility",
              "Connection Problems"
            ].map((issue, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-rose-200">
                <Zap className="h-4 w-4 text-rose-500" />
                <span className="text-gray-700">{issue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Response Time */}
        <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-humsafar-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Our Response Commitment
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4">
                <MessageCircle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-gray-600">Immediate Response</p>
              </div>
              <div className="p-4">
                <Mail className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-gray-600">Within 2-4 Hours</p>
              </div>
              <div className="p-4">
                <Shield className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                <h3 className="font-semibold">Critical Issues</h3>
                <p className="text-gray-600">Priority Handling</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}