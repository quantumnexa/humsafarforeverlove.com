"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Smartphone, Copy, CheckCircle, CreditCard, Banknote, ArrowRight, Shield } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function BankDetailsPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <CreditCard className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Secure Payment Options</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Bank Details
              <span className="block text-white/60">
                Safe & Secure Payments
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Choose from our trusted payment methods including bank transfer and JazzCash. All transactions are secure and your financial information is protected.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-humsafar-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg"
                onClick={() => document.getElementById('payment-methods')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Payment Methods
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white bg-transparent text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 rounded-full backdrop-blur-sm"
              >
                Security Info
                <Shield className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-lg"></div>
        </div>

        {/* Payment Methods */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Faysal Bank */}
          <Card className="border-rose-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Building2 className="h-8 w-8 text-rose-500" />
                <div>
                  <CardTitle className="text-2xl">Faysal Bank Limited</CardTitle>
                  <CardDescription>Traditional Bank Transfer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Bank Name:</span>
                  <span className="text-gray-900">Faysal Bank Limited</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Branch:</span>
                  <span className="text-gray-900">Dastagir</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Account No:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 font-mono">3612 4440 0000 2409</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard('3612444000002409')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Account Title:</span>
                  <span className="text-gray-900">Humsafar Forever Love</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">How to Transfer:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Visit any Faysal Bank branch</li>
                  <li>• Use online banking or mobile app</li>
                  <li>• ATM transfer service</li>
                  <li>• Inter-bank transfer from other banks</li>
                </ul>
              </div>

              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Secure & Verified
              </Badge>
            </CardContent>
          </Card>

          {/* JazzCash */}
          <Card className="border-rose-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Smartphone className="h-8 w-8 text-rose-500" />
                <div>
                  <CardTitle className="text-2xl">JazzCash</CardTitle>
                  <CardDescription>Mobile Wallet Transfer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Service:</span>
                  <span className="text-gray-900">JazzCash Mobile Wallet</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Account No:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 font-mono">0332 7355 681</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard('03327355681')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Account Title:</span>
                  <span className="text-gray-900">Humsafar Forever Love</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">How to Transfer:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use JazzCash mobile app</li>
                  <li>• Dial *786# from Jazz number</li>
                  <li>• Visit JazzCash agent</li>
                  <li>• Online transfer from other wallets</li>
                </ul>
              </div>

              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Smartphone className="h-3 w-3 mr-1" />
                Instant Transfer
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Payment Instructions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Payment Instructions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-rose-200 text-center">
              <CardHeader>
                <Banknote className="h-8 w-8 text-rose-500 mx-auto" />
                <CardTitle className="text-lg">Step 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Choose your preferred payment method from the options above
                </p>
              </CardContent>
            </Card>

            <Card className="border-rose-200 text-center">
              <CardHeader>
                <CreditCard className="h-8 w-8 text-rose-500 mx-auto" />
                <CardTitle className="text-lg">Step 2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Transfer the amount using the provided account details
                </p>
              </CardContent>
            </Card>

            <Card className="border-rose-200 text-center">
              <CardHeader>
                <Copy className="h-8 w-8 text-rose-500 mx-auto" />
                <CardTitle className="text-lg">Step 3</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Take a screenshot or note the transaction ID
                </p>
              </CardContent>
            </Card>

            <Card className="border-rose-200 text-center">
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-rose-500 mx-auto" />
                <CardTitle className="text-lg">Step 4</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Send payment confirmation to our support team
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notes */}
        <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-humsafar-50 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Important Payment Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Security Guidelines:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Always verify account details before transfer</li>
                  <li>• Keep transaction receipts safe</li>
                  <li>• Never share your banking credentials</li>
                  <li>• Use secure internet connections</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">After Payment:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Send payment proof to support team</li>
                  <li>• Include your registered phone number</li>
                  <li>• Mention the service you're paying for</li>
                  <li>• Allow 24-48 hours for verification</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact for Payment Issues */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-center">
              Need Help with Payment?
            </CardTitle>
            <CardDescription className="text-center">
              Contact our support team for assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <p className="font-semibold">Phone Support</p>
                <p className="text-rose-600">+92 332 7355 681</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Email Support</p>
                <p className="text-rose-600">support@humsafarforeverlove.com</p>
              </div>
            </div>
            <Button className="bg-rose-500 hover:bg-rose-600">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}