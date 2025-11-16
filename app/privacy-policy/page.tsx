import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Eye, UserCheck, FileText, Mail, Phone, Calendar } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
      <Header />
      {/* Hero Section */}
      <section className="py-16 bg-humsafar-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90 mb-8">Your privacy and security are our top priorities</p>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Last updated: January 2024
          </Badge>
        </div>
      </section>
      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Introduction */}
          <Card className="border-humsafar-100 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                <FileText className="h-6 w-6 text-humsafar-600" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Welcome to Humsafar.pk. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our matrimonial platform.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By using our services, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="border-humsafar-100 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-humsafar-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Basic details: Name, age, gender, contact information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Profile information: Education, profession, family details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Preferences: Partner preferences and lifestyle choices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Photos and documents for verification purposes</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Information</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Device information and IP address</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Browser type and operating system</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Usage patterns and interaction data</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="border-humsafar-100 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                <Eye className="h-6 w-6 text-humsafar-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Primary Uses</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Create and maintain your profile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Match you with compatible partners</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Facilitate communication between members</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Verify profiles for authenticity</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Secondary Uses</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Improve our services and user experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Send important updates and notifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Provide customer support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Ensure platform security and prevent fraud</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="border-humsafar-100 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                <Lock className="h-6 w-6 text-humsafar-600" />
                Data Security & Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-humsafar-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700 leading-relaxed">
                  We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-humsafar-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-humsafar-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">SSL Encryption</h3>
                  <p className="text-sm text-gray-600">All data transmission is encrypted using SSL technology</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-humsafar-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-humsafar-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Secure Storage</h3>
                  <p className="text-sm text-gray-600">Data stored in secure, access-controlled servers</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-humsafar-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <UserCheck className="h-8 w-8 text-humsafar-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Access Control</h3>
                  <p className="text-sm text-gray-600">Strict access controls and regular security audits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="border-humsafar-100 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Information Sharing & Disclosure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✓ We DO share information with:</h3>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Other verified members for matrimonial purposes</li>
                    <li>• Trusted service providers who assist in our operations</li>
                    <li>• Legal authorities when required by law</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">✗ We DO NOT share information with:</h3>
                  <ul className="space-y-1 text-red-700 text-sm">
                    <li>• Third-party advertisers or marketers</li>
                    <li>• Social media platforms without your consent</li>
                    <li>• Any unauthorized parties or individuals</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="border-humsafar-100 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Your Rights & Choices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">You have the right to:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Access your personal information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Update or correct your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Delete your account and data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Control your privacy settings</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Privacy Controls:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Hide your profile from specific users</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Control who can contact you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Manage photo visibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-humsafar-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Opt-out of marketing communications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-humsafar-100 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Contact Us About Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-humsafar-100 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-humsafar-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-sm text-humsafar-600">privacy@humsafar.pk</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-humsafar-100 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-humsafar-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Phone</p>
                    <p className="text-sm text-humsafar-600">+92 332 7355 681</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-humsafar-100 p-3 rounded-full">
                    <Calendar className="h-5 w-5 text-humsafar-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Response Time</p>
                    <p className="text-sm text-gray-600">Within 48 hours</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Link href="/contact">
                  <Button className="bg-humsafar-600 hover:bg-humsafar-700 text-white">
                    Contact Our Privacy Team
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Policy Updates */}
          <Card className="border-humsafar-100">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-humsafar-50 border border-humsafar-200 p-6 rounded-lg">
                <p className="text-humsafar-800 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <p className="text-humsafar-700 mt-4 font-medium">
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
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