import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Users, Shield, CreditCard, AlertTriangle, Scale, UserCheck, Clock } from "lucide-react"
import Link from "next/link"

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-50">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-humsafar-600 to-humsafar-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Terms & Conditions</h1>
          </div>
          <p className="text-xl text-humsafar-100 max-w-3xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before using our matrimonial services. 
            By accessing or using Humsafar, you agree to be bound by these terms.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Last Updated: January 2024
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Version 2.1
            </Badge>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Acceptance of Terms */}
          <Card className="mb-8 border-humsafar-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-humsafar-50 to-humsafar-100">
              <CardTitle className="flex items-center text-2xl text-humsafar-800">
                <Scale className="h-6 w-6 mr-3 text-humsafar-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  By creating an account, accessing, or using any part of the Humsafar matrimonial platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
                </p>
                <div className="bg-humsafar-50 border border-humsafar-200 p-4 rounded-lg">
                  <p className="text-humsafar-800 font-medium">
                    If you do not agree to these terms, please do not use our services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card className="mb-8 border-humsafar-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-humsafar-50 to-humsafar-100">
              <CardTitle className="flex items-center text-2xl text-humsafar-800">
                <Users className="h-6 w-6 mr-3 text-humsafar-600" />
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Humsafar is an online matrimonial platform that facilitates connections between individuals seeking marriage partners. Our services include:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">Profile creation and management</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">Partner search and matching algorithms</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">Communication tools and messaging</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">Premium membership features</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">Verification and safety features</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card className="mb-8 border-humsafar-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-humsafar-50 to-humsafar-100">
              <CardTitle className="flex items-center text-2xl text-humsafar-800">
                <UserCheck className="h-6 w-6 mr-3 text-humsafar-600" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-humsafar-700 mb-3">Account Information</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Provide accurate, current, and complete information</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Maintain and update your profile information</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Keep your login credentials secure and confidential</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-humsafar-700 mb-3">Prohibited Activities</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Creating fake or misleading profiles</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Harassment, abuse, or inappropriate behavior</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Sharing personal contact information publicly</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Commercial solicitation or spam</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card className="mb-8 border-humsafar-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-humsafar-50 to-humsafar-100">
              <CardTitle className="flex items-center text-2xl text-humsafar-800">
                <CreditCard className="h-6 w-6 mr-3 text-humsafar-600" />
                Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-humsafar-50 p-4 rounded-lg border border-humsafar-100">
                    <h4 className="font-semibold text-humsafar-700 mb-2">Subscription Plans</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Monthly and annual billing options</li>
                      <li>• Automatic renewal unless cancelled</li>
                      <li>• Pro-rated refunds for early cancellation</li>
                    </ul>
                  </div>
                  <div className="bg-humsafar-50 p-4 rounded-lg border border-humsafar-100">
                    <h4 className="font-semibold text-humsafar-700 mb-2">Payment Processing</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Secure payment gateway integration</li>
                      <li>• Multiple payment methods accepted</li>
                      <li>• All transactions are encrypted</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-humsafar-50 border border-humsafar-200 p-4 rounded-lg">
                  <p className="text-humsafar-800 font-medium">
                    Refund Policy: Refunds are processed within 7-14 business days according to our refund policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data Protection */}
          <Card className="mb-8 border-humsafar-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-humsafar-50 to-humsafar-100">
              <CardTitle className="flex items-center text-2xl text-humsafar-800">
                <Shield className="h-6 w-6 mr-3 text-humsafar-600" />
                Privacy & Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. We collect, use, and protect your personal information in accordance with our Privacy Policy and applicable data protection laws.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-humsafar-50 p-4 rounded-lg border border-humsafar-100">
                    <h4 className="font-semibold text-humsafar-700 mb-2">Data Collection</h4>
                    <p className="text-sm text-gray-700">We collect only necessary information for providing our matrimonial services effectively.</p>
                  </div>
                  <div className="bg-humsafar-50 p-4 rounded-lg border border-humsafar-100">
                    <h4 className="font-semibold text-humsafar-700 mb-2">Data Security</h4>
                    <p className="text-sm text-gray-700">Industry-standard security measures protect your personal and sensitive information.</p>
                  </div>
                </div>
                <div className="text-center">
                  <Link href="/privacy-policy" legacyBehavior>
                    <Button className="bg-humsafar-600 hover:bg-humsafar-700 text-white">
                      Read Full Privacy Policy
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card className="mb-8 border-humsafar-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-humsafar-50 to-humsafar-100">
              <CardTitle className="flex items-center text-2xl text-humsafar-800">
                <AlertTriangle className="h-6 w-6 mr-3 text-humsafar-600" />
                Disclaimers & Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-humsafar-50 border border-humsafar-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-humsafar-700 mb-2">Service Availability</h4>
                  <p className="text-humsafar-800 text-sm">
                    We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service availability.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-humsafar-700">Important Disclaimers:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Humsafar is a platform to facilitate introductions; we do not guarantee successful matches</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Users are responsible for verifying information provided by other users</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">We are not liable for any offline interactions or relationships formed through our platform</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">Service features and pricing may change with reasonable notice</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="mb-8 border-humsafar-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-humsafar-50 to-humsafar-100">
              <CardTitle className="flex items-center text-2xl text-humsafar-800">
                <Clock className="h-6 w-6 mr-3 text-humsafar-600" />
                Account Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-humsafar-700 mb-3">User Termination</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">You may delete your account at any time</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">Data deletion follows our retention policy</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-humsafar-700 mb-3">Platform Termination</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">We may suspend accounts for policy violations</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">Notice will be provided when possible</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8 border-humsafar-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-humsafar-50 to-humsafar-100">
              <CardTitle className="flex items-center text-2xl text-humsafar-800">
                <FileText className="h-6 w-6 mr-3 text-humsafar-600" />
                Questions About Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact our legal team.
                </p>
                <div className="space-y-2">
                  <p className="text-humsafar-600 font-medium">legal@humsafar.com</p>
                  <p className="text-humsafar-600 font-medium">+92 (21) 1234-5678</p>
                </div>
                <Link href="/contact" legacyBehavior>
                  <Button className="bg-humsafar-600 hover:bg-humsafar-700 text-white mt-4">
                    Contact Legal Team
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Updates Notice */}
          <Card className="border-humsafar-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-humsafar-800">
                <AlertTriangle className="h-6 w-6 mr-3 text-humsafar-600" />
                Terms Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-humsafar-50 border border-humsafar-200 p-6 rounded-lg">
                <p className="text-humsafar-800 leading-relaxed">
                  We may update these Terms and Conditions from time to time to reflect changes in our services or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the new Terms on this page and updating the "Last updated" date.
                </p>
                <p className="text-humsafar-700 mt-4 font-medium">
                  Continued use of our services after any changes constitutes acceptance of the new terms.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}