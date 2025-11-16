"use client"

import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Shield, AlertTriangle, Scale, Users, Lock, ArrowRight, BookOpen } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <FileText className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Legal Agreement</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Terms of Use
              <span className="block text-white/60">
                Service Agreement
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Read our comprehensive terms and conditions for using Humsafar Forever Love matrimonial services. Understanding these terms ensures a safe and secure experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-humsafar-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg"
                onClick={() => document.getElementById('terms-content')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Read Terms
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white bg-transparent text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 rounded-full backdrop-blur-sm"
              >
                Download PDF
                <BookOpen className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-lg"></div>
        </div>

        <div id="terms-content">

        {/* Service Agreement */}
        <Card className="mb-8 border-humsafar-200">
          <CardHeader className="bg-humsafar-50">
            <CardTitle className="flex items-center gap-3 text-humsafar-600">
              <FileText className="w-6 h-6" />
              Service Agreement
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Humsafar Forever Love provides secure and private matrimonial services to help individuals find their life partners through verified profiles and professional matchmaking assistance.
            </p>
          </CardContent>
        </Card>

        {/* Main Terms */}
        <Card className="mb-8 border-humsafar-200">
          <CardHeader className="bg-humsafar-50">
            <CardTitle className="flex items-center gap-3 text-humsafar-600">
              <Scale className="w-6 h-6" />
              Main Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-humsafar-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-humsafar-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-humsafar-600 mb-2">Eligibility</h3>
                  <p className="text-gray-700">Users must be 18+ years old and legally competent to enter into matrimonial agreements.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-humsafar-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <FileText className="w-4 h-4 text-humsafar-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-humsafar-600 mb-2">Term</h3>
                  <p className="text-gray-700">Members can cancel their subscription anytime. However, no refunds will be provided for unused services.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-humsafar-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-4 h-4 text-humsafar-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-humsafar-600 mb-2">Non-Commercial Use</h3>
                  <p className="text-gray-700">This platform is strictly for personal matrimonial purposes only. Commercial use is prohibited.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-humsafar-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <AlertTriangle className="w-4 h-4 text-humsafar-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-humsafar-600 mb-2">Responsibilities</h3>
                  <p className="text-gray-700">Members must not create fake or multiple profiles, engage in harassment, or misuse the platform in any way.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-humsafar-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Lock className="w-4 h-4 text-humsafar-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-humsafar-600 mb-2">Privacy</h3>
                  <p className="text-gray-700">Personal details and contact information are shown only with explicit member consent.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Terms */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-humsafar-200">
            <CardHeader className="bg-humsafar-50">
              <CardTitle className="text-humsafar-600">Content Policy</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700">No offensive, illegal, or inappropriate content is allowed on the platform.</p>
            </CardContent>
          </Card>
          
          <Card className="border-humsafar-200">
            <CardHeader className="bg-humsafar-50">
              <CardTitle className="text-humsafar-600">Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700">No guarantee of marriage is provided. Members use the service at their own risk.</p>
            </CardContent>
          </Card>
          
          <Card className="border-humsafar-200">
            <CardHeader className="bg-humsafar-50">
              <CardTitle className="text-humsafar-600">Liability</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700">Platform liability is limited to the membership fee paid by the member.</p>
            </CardContent>
          </Card>
          
          <Card className="border-humsafar-200">
            <CardHeader className="bg-humsafar-50">
              <CardTitle className="text-humsafar-600">Jurisdiction</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700">All legal matters fall under the jurisdiction of Karachi, Pakistan.</p>
            </CardContent>
          </Card>
        </div>

        {/* Important Policies */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Child Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 font-medium">Zero tolerance policy for any content or behavior that endangers minors.</p>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Indemnity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 font-medium">Members agree to indemnify and hold the platform harmless from any claims or damages.</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12 p-6 bg-humsafar-50 rounded-lg border border-humsafar-200">
          <p className="text-gray-600">
            By using our services, you agree to these terms and conditions. 
            <br />
            For questions, contact us at <span className="font-semibold text-humsafar-600">info@humsafarforeverlove.com</span>
          </p>
        </div>
        </div>
      </main>
      </Suspense>
      
      <Footer />
    </div>
  )
}