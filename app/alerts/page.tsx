"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Settings, Mail, MessageSquare, Smartphone, CheckCircle, ArrowRight, BellRing } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ShaadeeAlertsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Bell className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Notifications</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Alerts & Notifications
              <span className="block text-white/60">
                Stay Connected
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Stay updated with new matches and important updates through our notification system
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-humsafar-600 hover:bg-humsafar-50 font-semibold">
                <BellRing className="w-5 h-5 mr-2" />
                Manage Alerts
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                Notification Settings
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      
        <div className="container mx-auto px-4 py-16" id="alerts-info">

        {/* Main Alert Information */}
        <Card className="mb-8 border-humsafar-200">
          <CardHeader className="bg-humsafar-50">
            <CardTitle className="flex items-center gap-3 text-humsafar-600">
              <Bell className="w-6 h-6" />
              New Match Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Members receive <span className="font-semibold text-humsafar-600">instant alerts</span> whenever new compatible matches are found based on their preferences and criteria.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg border border-humsafar-100">
                <div className="w-12 h-12 bg-humsafar-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-humsafar-600" />
                </div>
                <h3 className="font-semibold text-humsafar-600 mb-2">Email Alerts</h3>
                <p className="text-gray-700 text-sm">Detailed match information sent to your email</p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-humsafar-100">
                <div className="w-12 h-12 bg-humsafar-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-humsafar-600" />
                </div>
                <h3 className="font-semibold text-humsafar-600 mb-2">SMS Notifications</h3>
                <p className="text-gray-700 text-sm">Quick alerts sent directly to your mobile</p>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg border border-humsafar-100">
                <div className="w-12 h-12 bg-humsafar-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-humsafar-600" />
                </div>
                <h3 className="font-semibold text-humsafar-600 mb-2">App Notifications</h3>
                <p className="text-gray-700 text-sm">Real-time push notifications on your device</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Types */}
        <Card className="mb-8 border-humsafar-200">
          <CardHeader className="bg-humsafar-50">
            <CardTitle className="flex items-center gap-3 text-humsafar-600">
              <CheckCircle className="w-6 h-6" />
              Types of Alerts You'll Receive
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-humsafar-100">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-humsafar-600 mb-1">New Recommended Matches</h3>
                  <p className="text-gray-700 text-sm">Monthly curated matches from your dedicated matchmaker</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-humsafar-100">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-humsafar-600 mb-1">New Preferred Matches</h3>
                  <p className="text-gray-700 text-sm">System-generated matches based on compatibility</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-humsafar-100">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-humsafar-600 mb-1">Connection Requests</h3>
                  <p className="text-gray-700 text-sm">When someone shows interest in your profile</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-humsafar-100">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-humsafar-600 mb-1">Profile Updates</h3>
                  <p className="text-gray-700 text-sm">Important updates about your account and matches</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preference Management */}
        <Card className="mb-8 border-humsafar-200">
          <CardHeader className="bg-humsafar-50">
            <CardTitle className="flex items-center gap-3 text-humsafar-600">
              <Settings className="w-6 h-6" />
              Manage Your Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                You have complete control over your notification preferences. 
                <span className="font-semibold text-humsafar-600">Customize or stop alerts anytime</span> according to your needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-lg border border-humsafar-100">
                <h3 className="font-semibold text-humsafar-600 mb-3">Notification Settings</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Choose notification frequency
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Select preferred communication method
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Set quiet hours for notifications
                  </li>
                </ul>
              </div>
              
              <div className="p-6 bg-white rounded-lg border border-humsafar-100">
                <h3 className="font-semibold text-humsafar-600 mb-3">Easy Management</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    One-click unsubscribe option
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Pause notifications temporarily
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Update preferences anytime
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Button className="bg-humsafar-600 hover:bg-humsafar-700 text-white px-8 py-2">
                <Settings className="w-4 h-4 mr-2" />
                Manage Alert Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center p-6 bg-humsafar-50 rounded-lg border border-humsafar-200">
          <p className="text-gray-600">
            Need help with notifications? Contact our support team at 
            <span className="font-semibold text-humsafar-600">info@humsafarforeverlove.com</span>
          </p>
        </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}