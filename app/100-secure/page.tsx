"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Lock,
  Eye,
  UserCheck,
  FileCheck,
  CheckCircle2,
  Fingerprint,
  ArrowRight,
  MessageCircle,
  Target,
  Globe
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function SecurePage() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Advanced Encryption",
      description: "All your personal data is protected with military-grade 256-bit SSL encryption, ensuring complete privacy and security."
    },
    {
      icon: UserCheck,
      title: "Profile Verification",
      description: "Multi-step verification process including ID verification, phone verification, and photo authentication."
    },
    {
      icon: Lock,
      title: "Secure Payment Gateway",
      description: "PCI DSS compliant payment processing with secure tokenization to protect your financial information."
    },
    {
      icon: Eye,
      title: "Privacy Controls",
      description: "Complete control over who can view your profile, photos, and contact information with granular privacy settings."
    },
    {
      icon: FileCheck,
      title: "Document Security",
      description: "All uploaded documents are encrypted and stored securely with restricted access and automatic deletion policies."
    },
    {
      icon: Fingerprint,
      title: "Biometric Authentication",
      description: "Optional biometric login for enhanced security using fingerprint or face recognition on supported devices."
    }
  ]

  const certifications = [
    { name: "ISO 27001", description: "Information Security Management" },
    { name: "PCI DSS", description: "Payment Card Industry Data Security" },
    { name: "GDPR Compliant", description: "General Data Protection Regulation" },
    { name: "SOC 2 Type II", description: "Service Organization Control" }
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
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Maximum Security</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              100% Secure
              <span className="block text-white/60">
                Platform
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              We implement the highest security standards in the industry to protect your personal information, ensuring a safe and trustworthy matrimonial experience.
            </p>
          </div>
        </div>

        {/* Security Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Security Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive security infrastructure protects every aspect of your matrimonial journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-humsafar-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-humsafar-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry Certifications
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We maintain the highest industry standards and certifications to ensure your data security.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="border-2 border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors">
                <CardContent className="text-center p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-humsafar-500 to-humsafar-600 border-0 text-white">
            <CardContent className="p-12">
              <Shield className="w-16 h-16 mx-auto mb-6 text-white/80" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Trust is Our Priority
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                We understand that matrimonial platforms handle the most sensitive personal information. That's why we've invested heavily in creating a fortress of security around your data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-humsafar-600 hover:bg-white/90">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Security Team
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <FileCheck className="w-5 h-5 mr-2" />
                  View Security Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}