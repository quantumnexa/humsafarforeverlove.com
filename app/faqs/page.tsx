"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { HelpCircle, ChevronDown, UserPlus, Crown, CreditCard, Bell, Phone, Mail, ArrowRight, MessageCircle } from "lucide-react"
import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function FAQsPage() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({})

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const faqSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <UserPlus className="h-5 w-5" />,
      faqs: [
        {
          question: "How do I sign up for Humsafar Forever Love?",
          answer: "Sign up → verify → create profile. Visit our registration page, fill in your basic details, verify your email and phone number, then complete your profile with photos and preferences."
        },
        {
          question: "What information do I need to provide during registration?",
          answer: "You need to add photos, personal details like age, education, profession, family background, and your match preferences including age range, location, and other criteria."
        },
        {
          question: "How long does the verification process take?",
          answer: "Profile verification typically takes 24-48 hours. We verify your identity documents and photos to ensure authenticity and safety for all members."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we maintain strict confidentiality and use advanced security measures to protect your personal information. Your privacy is our top priority."
        }
      ]
    },
    {
      id: "membership-plans",
      title: "Membership Plans",
      icon: <Crown className="h-5 w-5" />,
      faqs: [
        {
          question: "What membership plans do you offer?",
          answer: "We offer three membership plans: Free (basic features), Premium (enhanced matching and communication), and Premium Plus (full access with dedicated matchmaker support)."
        },
        {
          question: "What's included in the Free membership?",
          answer: "Free membership includes basic profile creation, limited match viewing, and basic search functionality. Perfect for getting started and exploring our platform."
        },
        {
          question: "What are the benefits of Premium membership?",
          answer: "Premium membership includes unlimited match viewing, advanced search filters, priority customer support, and enhanced communication features."
        },
        {
          question: "What makes Premium Plus special?",
          answer: "Premium Plus includes all Premium features plus dedicated matchmaker service, personalized match recommendations, and priority profile visibility."
        },
        {
          question: "Can I upgrade or downgrade my membership?",
          answer: "Yes, you can upgrade your membership at any time. Downgrades take effect at the end of your current billing cycle."
        }
      ]
    },
    {
      id: "payments",
      title: "Payments",
      icon: <CreditCard className="h-5 w-5" />,
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept Bank Transfer (Faysal Bank), JazzCash mobile wallet, and mobile/e-banking transfers for your convenience."
        },
        {
          question: "How do I make a bank transfer payment?",
          answer: "Transfer to Faysal Bank Limited, Dastagir Branch, Account No: 3612 4440 0000 2409, Title: Humsafar Forever Love. Send payment confirmation to our support team."
        },
        {
          question: "Can I pay through JazzCash?",
          answer: "Yes, you can transfer to JazzCash Account No: 0332 7355 681, Title: Humsafar Forever Love. Use the JazzCash app, dial *786#, or visit any JazzCash agent."
        },
        {
          question: "How long does payment verification take?",
          answer: "Payment verification typically takes 24-48 hours after we receive your payment confirmation. Your membership will be activated once verified."
        },
        {
          question: "Do you offer refunds?",
          answer: "We have a no-refunds policy, but we offer upgrade options and seasonal discounts. Please review our refund policy page for complete details."
        }
      ]
    },
    {
      id: "alerts",
      title: "Alerts & Notifications",
      icon: <Bell className="h-5 w-5" />,
      faqs: [
        {
          question: "What types of alerts will I receive?",
          answer: "You'll receive match updates when new compatible profiles are found, special offers and promotions, and guidance messages from your matchmaker."
        },
        {
          question: "How can I manage my notification preferences?",
          answer: "You can customize your alert preferences in your account settings. Choose which types of notifications you want to receive and how you want to receive them."
        },
        {
          question: "Can I turn off notifications?",
          answer: "Yes, you can disable specific types of notifications or all notifications in your account settings. However, we recommend keeping match alerts enabled."
        },
        {
          question: "How often will I receive match updates?",
          answer: "Match update frequency depends on your membership plan and match availability. Premium members receive priority notifications for new matches."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <HelpCircle className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Get Your Answers</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Frequently Asked
              <span className="block text-white/60">
                Questions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Find answers to common questions about our matrimonial services, membership plans, payments, and how our platform works to help you find your perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-humsafar-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg"
                onClick={() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse FAQs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white bg-transparent text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-3 rounded-full backdrop-blur-sm"
              >
                Contact Support
                <MessageCircle className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-lg"></div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6 mb-12">
          {faqSections.map((section) => (
            <Card key={section.id} className="border-rose-200">
              <Collapsible 
                open={openSections[section.id]} 
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-rose-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-rose-500">{section.icon}</div>
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                      </div>
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-500 transition-transform ${
                          openSections[section.id] ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {section.faqs.map((faq, index) => (
                        <div key={index} className="border-l-2 border-rose-200 pl-4">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {faq.question}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Quick Help Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Need More Help?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-rose-200 text-center">
              <CardHeader>
                <Phone className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                <CardTitle>Phone Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get immediate assistance with our 24/7 helpline
                </p>
                <Badge variant="secondary" className="mb-2">
                  +92 332 7355 681
                </Badge>
                <Button className="w-full bg-rose-500 hover:bg-rose-600">
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="border-rose-200 text-center">
              <CardHeader>
                <Mail className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Send us your detailed questions via email
                </p>
                <Badge variant="secondary" className="mb-2">
                  support@humsafarforeverlove.com
                </Badge>
                <Button variant="outline" className="w-full border-rose-500 text-rose-500 hover:bg-rose-50">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="border-rose-200 text-center">
              <CardHeader>
                <HelpCircle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Chat with our support team in real-time
                </p>
                <Badge variant="secondary" className="mb-2">
                  Available 24/7
                </Badge>
                <Button variant="outline" className="w-full border-rose-500 text-rose-500 hover:bg-rose-50">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Popular Topics */}
        <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-humsafar-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Popular Help Topics
            </CardTitle>
            <CardDescription className="text-center">
              Quick links to commonly searched topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "Account Registration",
                "Profile Verification",
                "Payment Methods",
                "Match Preferences",
                "Privacy Settings",
                "Membership Upgrade",
                "Technical Issues",
                "Matchmaker Service"
              ].map((topic, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="border-rose-200 text-gray-700 hover:bg-rose-100 justify-start"
                >
                  {topic}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}