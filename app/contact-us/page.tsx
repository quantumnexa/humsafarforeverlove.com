"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Clock, MapPin, MessageCircle, Send, Headphones } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Phone className="w-5 h-5 text-white" />
              <span className="text-white font-medium">We're Here to Help</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Contact Us
              <span className="block text-white/60">
                24/7 Support Available
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Have questions about our matrimonial services? Need help with your profile or membership? Our dedicated support team is available 24/7 to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-humsafar-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg"
              >
                Call Now: +92 300 1234567
                <Phone className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white bg-transparent text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 rounded-full backdrop-blur-sm"
              >
                Send Email
                <Mail className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-lg"></div>
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Phone Support */}
          <Card className="border-rose-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-rose-100 p-3 rounded-full w-fit mx-auto mb-2">
                <Phone className="h-6 w-6 text-rose-500" />
              </div>
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>Call us directly for immediate assistance</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <Badge className="bg-rose-500 text-white text-lg px-4 py-2">
                  📞 +92 332 7355 681
                </Badge>
                <p className="text-sm text-gray-600">
                  Available 24/7 for all your queries
                </p>
              </div>
              <Button className="w-full bg-rose-500 hover:bg-rose-600">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
            </CardContent>
          </Card>

          {/* Email Support */}
          <Card className="border-rose-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="bg-rose-100 p-3 rounded-full w-fit mx-auto mb-2">
                <Mail className="h-6 w-6 text-rose-500" />
              </div>
              <CardTitle>Email Support</CardTitle>
              <CardDescription>Send us detailed information about your query</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="border-rose-500 text-rose-500 text-sm px-3 py-1">
                  📧 support@humsafarforeverlove.com
                </Badge>
                <p className="text-sm text-gray-600">
                  We respond within 2-4 hours
                </p>
              </div>
              <Button variant="outline" className="w-full border-rose-500 text-rose-500 hover:bg-rose-50">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>

          {/* 24/7 Helpline */}
          <Card className="border-rose-200 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader className="text-center">
              <div className="bg-rose-100 p-3 rounded-full w-fit mx-auto mb-2">
                <Headphones className="h-6 w-6 text-rose-500" />
              </div>
              <CardTitle>24/7 Helpline</CardTitle>
              <CardDescription>Round-the-clock support for urgent matters</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <Badge className="bg-green-500 text-white text-sm px-3 py-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Always Available
                </Badge>
                <p className="text-sm text-gray-600">
                  Emergency support and technical assistance
                </p>
              </div>
              <Button className="w-full bg-green-500 hover:bg-green-600">
                <Headphones className="h-4 w-4 mr-2" />
                Get Help Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-rose-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-rose-500" />
                <span>Send us a Message</span>
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    First Name
                  </label>
                  <Input placeholder="Enter your first name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Last Name
                  </label>
                  <Input placeholder="Enter your last name" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email Address
                </label>
                <Input type="email" placeholder="Enter your email address" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Phone Number
                </label>
                <Input type="tel" placeholder="Enter your phone number" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Subject
                </label>
                <Input placeholder="What is this regarding?" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Message
                </label>
                <Textarea 
                  placeholder="Please describe your query in detail..."
                  rows={5}
                />
              </div>
              <Button className="w-full bg-rose-500 hover:bg-rose-600">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information Details */}
          <div className="space-y-6">
            <Card className="border-rose-200">
              <CardHeader>
                <CardTitle>Office Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-rose-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Address</h4>
                    <p className="text-gray-600 text-sm">
                      Humsafar Forever Love<br />
                      Matchmaking Services<br />
                      Pakistan
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-rose-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Business Hours</h4>
                    <p className="text-gray-600 text-sm">
                      24/7 Support Available<br />
                      Emergency assistance anytime
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-200">
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Phone Calls</span>
                  <Badge className="bg-green-100 text-green-800">
                    Immediate
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Email Support</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    2-4 Hours
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Contact Form</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    4-6 Hours
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Emergency Issues</span>
                  <Badge className="bg-red-100 text-red-800">
                    Priority
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-200">
              <CardHeader>
                <CardTitle>What We Can Help With</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Account registration and setup</li>
                  <li>• Profile verification issues</li>
                  <li>• Payment and billing questions</li>
                  <li>• Technical support and troubleshooting</li>
                  <li>• Matchmaking service inquiries</li>
                  <li>• Privacy and security concerns</li>
                  <li>• Membership upgrades and changes</li>
                  <li>• General questions about our services</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Contact Banner */}
        <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-humsafar-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Need Immediate Assistance?
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Our support team is standing by to help you
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-rose-500" />
                <span className="font-semibold text-gray-800">+92 332 7355 681</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-rose-500" />
                <span className="font-semibold text-gray-800">support@humsafarforeverlove.com</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button className="bg-rose-500 hover:bg-rose-600">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
              <Button variant="outline" className="border-rose-500 text-rose-500 hover:bg-rose-50">
                <Mail className="h-4 w-4 mr-2" />
                Email Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}