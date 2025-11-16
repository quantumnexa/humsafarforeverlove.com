"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Users, MessageCircle, Shield, Clock, CheckCircle, ArrowRight, Crown } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function MatchMakingProcessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Heart className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Professional Matchmaking</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Match Making
              <span className="block text-white/60">
                Process
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover how Humsafar Forever Love connects hearts through our comprehensive and personalized matchmaking process with dedicated matchmakers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-humsafar-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg"
                onClick={() => document.getElementById('process-details')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn Our Process
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white bg-transparent text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 rounded-full backdrop-blur-sm"
              >
                Get Premium Service
                <Crown className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-lg"></div>
        </div>

        <div id="process-details">

        {/* Dedicated Matchmaker Service */}
        <Card className="mb-8 border-humsafar-200">
          <CardHeader className="bg-humsafar-50">
            <CardTitle className="flex items-center gap-3 text-humsafar-600">
              <Heart className="w-6 h-6" />
              Dedicated Matchmaker Service
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 mb-4">
              For every <Badge variant="secondary" className="bg-humsafar-100 text-humsafar-700">Premium</Badge> and <Badge variant="secondary" className="bg-humsafar-100 text-humsafar-700">Premium Plus</Badge> customer, a dedicated matchmaker personally finds and recommends suitable matches from time to time. This ensures true value for your investment.
            </p>
          </CardContent>
        </Card>

        {/* Recommended Matches */}
        <Card className="mb-8 border-humsafar-200">
          <CardHeader className="bg-humsafar-50">
            <CardTitle className="flex items-center gap-3 text-humsafar-600">
              <Users className="w-6 h-6" />
              Recommended Matches (Once a Month)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-humsafar-500 mt-0.5 flex-shrink-0" />
                Professional matchmaker sends new suitable matches once every month for 12 months.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-humsafar-500 mt-0.5 flex-shrink-0" />
                SMS notification is sent when new matches are updated.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-humsafar-500 mt-0.5 flex-shrink-0" />
                Login at <span className="font-semibold text-humsafar-600">HumsafarForeverLove.com</span> → Recommended Matches.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Preferred Matches */}
        <Card className="mb-8 border-humsafar-200">
          <CardHeader className="bg-humsafar-50">
            <CardTitle className="flex items-center gap-3 text-humsafar-600">
              <MessageCircle className="w-6 h-6" />
              Preferred Matches
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-humsafar-500 mt-0.5 flex-shrink-0" />
                System automatically generates preferred matches whenever a new compatible profile is found.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-humsafar-500 mt-0.5 flex-shrink-0" />
                Login → Preferred Matches.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* How to Connect */}
        <Card className="mb-8 border-humsafar-200">
          <CardHeader className="bg-humsafar-50">
            <CardTitle className="flex items-center gap-3 text-humsafar-600">
              <MessageCircle className="w-6 h-6" />
              How to Connect
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-humsafar-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <p className="text-gray-700">Open matches to view profiles (picture & contact details hidden).</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-humsafar-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <p className="text-gray-700">If interested, click <Badge className="bg-humsafar-500">CONNECT</Badge>.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-humsafar-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <p className="text-gray-700">Other member receives SMS/email.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-humsafar-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <p className="text-gray-700">If accepted, you receive their details.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-humsafar-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">5</div>
                  <p className="text-gray-700">You can then contact directly via call/SMS/email.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confidentiality Factor */}
        <Card className="mb-8 border-humsafar-200">
          <CardHeader className="bg-humsafar-50">
            <CardTitle className="flex items-center gap-3 text-humsafar-600">
              <Shield className="w-6 h-6" />
              Confidentiality Factor
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-humsafar-500 mt-0.5 flex-shrink-0" />
                Your picture, name & contact remain hidden.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-humsafar-500 mt-0.5 flex-shrink-0" />
                Only approved members can view your details.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Service Duration */}
        <Card className="mb-8 border-humsafar-200">
          <CardHeader className="bg-humsafar-50">
            <CardTitle className="flex items-center gap-3 text-humsafar-600">
              <Clock className="w-6 h-6" />
              Service Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-humsafar-50 rounded-lg border border-humsafar-200">
                <h3 className="text-xl font-semibold text-humsafar-600 mb-3">Premium (12 months)</h3>
                <p className="text-gray-700">Recommended + Preferred Matches.</p>
              </div>
              <div className="p-6 bg-humsafar-50 rounded-lg border border-humsafar-200">
                <h3 className="text-xl font-semibold text-humsafar-600 mb-3">Premium Plus (12 months)</h3>
                <p className="text-gray-700">Same, with matchmaker-prepared recommendations.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}