"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Eye, Lock, User, Phone, Mail, FileCheck, AlertTriangle, CheckCircle, Users, Camera, ArrowRight, UserCheck } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-humsafar-600 via-humsafar-700 to-humsafar-800 text-white py-20">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Security & Privacy</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-humsafar-100 bg-clip-text text-transparent">
              Security Measures
            </h1>
            
            <p className="text-xl text-humsafar-100 mb-8 leading-relaxed">
              Your safety and privacy are our top priorities. Learn about our comprehensive security measures and member visibility controls.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white text-humsafar-600 hover:bg-humsafar-50 font-semibold">
                <UserCheck className="w-5 h-5 mr-2" />
                View Security Features
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                Privacy Settings
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-200 flex-shrink-0" />
                <p className="text-green-100 text-sm font-medium">
                  <strong>Protected:</strong> Advanced security protocols ensure complete member safety
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-16" id="security-features">

        {/* Member Visibility Controls */}
        <Card className="border-0 shadow-xl bg-white mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Member Visibility Controls</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Profile Visibility */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-blue-700">Profile Visibility Settings</h3>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  Member Control
                </Badge>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You have complete control over who can view your profile and personal information. Customize your visibility preferences for maximum privacy.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-2 border-blue-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-700 mb-1">Public Visibility</h4>
                    <p className="text-gray-600 text-xs">Profile visible to all verified members</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-blue-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-700 mb-1">Private Mode</h4>
                    <p className="text-gray-600 text-xs">Only approved connections can view</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-blue-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-700 mb-1">Selective Sharing</h4>
                    <p className="text-gray-600 text-xs">Choose specific details to share</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Photo Protection */}
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Camera className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-purple-700">Photo Protection</h3>
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                  Watermarked
                </Badge>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                All profile photos are protected with advanced watermarking technology to prevent unauthorized downloading and misuse.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-600 mb-3">Protection Features</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Invisible watermarks on all photos</li>
                    <li>• Right-click protection enabled</li>
                    <li>• Screenshot detection alerts</li>
                    <li>• Download prevention technology</li>
                    <li>• Image tracking capabilities</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-600 mb-3">Privacy Options</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Blur photos for non-premium members</li>
                    <li>• Require approval before photo access</li>
                    <li>• Time-limited photo viewing</li>
                    <li>• Photo access logging</li>
                    <li>• Instant photo removal option</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confidentiality Measures */}
        <Card className="border-0 shadow-xl bg-white mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Confidentiality Measures</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Data Protection */}
            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-green-700">Data Protection</h3>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Your personal information is protected with military-grade encryption and stored in secure, compliant data centers.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-2 border-green-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-700 mb-1">256-bit Encryption</h4>
                    <p className="text-gray-600 text-xs">Bank-level security for all data transmission</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-green-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-700 mb-1">Secure Storage</h4>
                    <p className="text-gray-600 text-xs">ISO 27001 certified data centers</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-green-200 bg-white">
                  <CardContent className="p-4 text-center">
                    <FileCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-700 mb-1">Regular Audits</h4>
                    <p className="text-gray-600 text-xs">Third-party security assessments</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Staff Confidentiality */}
            <div className="bg-amber-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-semibold text-amber-700">Staff Confidentiality</h3>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                All staff members are bound by strict confidentiality agreements and undergo comprehensive background checks.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-600 mb-3">Staff Requirements</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Signed non-disclosure agreements</li>
                    <li>• Background verification checks</li>
                    <li>• Regular confidentiality training</li>
                    <li>• Limited access permissions</li>
                    <li>• Activity monitoring and logging</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-600 mb-3">Access Controls</h4>
                  <ul className="text-gray-700 space-y-1 text-sm">
                    <li>• Role-based access permissions</li>
                    <li>• Two-factor authentication required</li>
                    <li>• Session timeout controls</li>
                    <li>• IP address restrictions</li>
                    <li>• Audit trail maintenance</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Compliance */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-humsafar-600 to-humsafar-500 text-white mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Legal Compliance</h2>
              <p className="text-lg text-white/95 leading-relaxed mb-6">
                We strictly adhere to all applicable laws and regulations regarding data protection, privacy, and matrimonial services.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <Shield className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">Data Protection Laws</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Full compliance with Pakistan's data protection regulations and international privacy standards.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <FileCheck className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">Legal Documentation</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Comprehensive terms of service, privacy policies, and user agreements that meet legal requirements.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <Users className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-3">Member Rights</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Clear procedures for data access, correction, deletion, and complaint resolution as per legal requirements.
                </p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-white" />
                <h3 className="text-lg font-semibold">Compliance Certifications</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-white/90 space-y-1 text-sm">
                  <li>• ISO 27001 Information Security</li>
                  <li>• SOC 2 Type II Compliance</li>
                  <li>• GDPR Compliance Framework</li>
                </ul>
                <ul className="text-white/90 space-y-1 text-sm">
                  <li>• Regular legal compliance audits</li>
                  <li>• Industry best practice adherence</li>
                  <li>• Continuous monitoring and updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card className="border-0 shadow-xl bg-white mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Advanced Security Features</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-700 mb-4">Fraud Prevention</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-red-600" />
                    <span>AI-powered fake profile detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-red-600" />
                    <span>Document verification system</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-red-600" />
                    <span>Phone number verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-red-600" />
                    <span>Social media cross-verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-red-600" />
                    <span>Suspicious activity monitoring</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">Communication Security</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>End-to-end encrypted messaging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Secure file sharing system</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Message content filtering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Spam and harassment protection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Report and block functionality</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Security Concerns?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-humsafar-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-humsafar-700 mb-3">Report Security Issues</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any security concerns, notice suspicious activity, or need help with privacy settings, please contact our security team immediately.
              </p>
              <div className="bg-white rounded-lg p-4 border border-humsafar-200">
                <p className="text-gray-700">
                  <strong>Website:</strong> <span className="text-humsafar-600 font-semibold">www.humsafarforeverlove.com</span>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Security Team:</strong> Available 24/7 through our official website contact form
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Emergency Response:</strong> Immediate action on all security reports
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}