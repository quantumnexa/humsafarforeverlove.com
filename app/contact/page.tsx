"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  HeadphonesIcon,
  Users,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Auto-fill form data for logged in users
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Fetch user profile data
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('first_name, last_name, phone')
            .eq('user_id', user.id)
            .single()
          
          if (profile) {
            setFormData(prev => ({
              ...prev,
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              email: user.email || '',
              phone: profile.phone || ''
            }))
          } else {
            // If no profile data, at least fill email from auth
            setFormData(prev => ({
              ...prev,
              email: user.email || ''
            }))
          }
        }
      } catch (error) {
        // Silently handle error - user might not be logged in
        console.log('User not logged in or error fetching profile data')
      }
    }

    loadUserData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setErrorMessage('First name is required')
      return false
    }
    if (!formData.lastName.trim()) {
      setErrorMessage('Last name is required')
      return false
    }
    if (!formData.email.trim()) {
      setErrorMessage('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address')
      return false
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Phone number is required')
      return false
    }
    if (!formData.subject.trim()) {
      setErrorMessage('Subject is required')
      return false
    }
    if (!formData.message.trim()) {
      setErrorMessage('Message is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    
    if (!validateForm()) {
      setSubmitStatus('error')
      return
    }

    setIsLoading(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        alert('Email submitted successfully! We will get back to you soon.')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || 'Failed to send message')
      }
    } catch (error) {
      setSubmitStatus('error')
      const errorMsg = error instanceof Error ? error.message : 'Failed to send message. Please try again or contact us directly.'
      setErrorMessage(errorMsg)
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100">
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <HeadphonesIcon className="w-5 h-5 text-white" />
              <span className="text-white font-medium">24/7 Customer Support</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Get in Touch
              <span className="block text-white/60">
                We're Here to Help
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Have questions about finding your perfect life partner? Our dedicated support team is ready to assist you on your matrimonial journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-humsafar-600 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Send Message
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white bg-transparent text-white hover:bg-white hover:text-humsafar-600 font-semibold px-8 py-3 rounded-full backdrop-blur-sm"
                onClick={() => document.getElementById('contact-info')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Info
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-lg"></div>
        </div>
      </main>

      {/* About Humsafar Forever Love Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-humsafar-100 rounded-full px-6 py-2 mb-6">
                <HeadphonesIcon className="w-5 h-5 text-humsafar-600" />
                <span className="text-humsafar-600 font-medium">Trusted Matrimonial Service</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Get in Touch with
                <span className="block bg-gradient-to-r from-humsafar-600 to-humsafar-400 bg-clip-text text-transparent">
                  Humsafar Forever Love
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                At Humsafar Forever Love, we value open communication and believe in building trust with our members. Our reputation for dedicated customer service comes from our commitment to listening, understanding, and responding promptly.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-humsafar-50 to-white rounded-3xl p-8 md:p-12 shadow-xl">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Immediate Response Guarantee</h3>
                  <p className="text-lg text-gray-600 mb-6">
                    As soon as you contact us, one of our customer relations representatives will address your query at the earliest.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 bg-humsafar-50 rounded-xl p-3">
                      <Phone className="w-5 h-5 text-humsafar-600" />
                      <span className="text-humsafar-700 font-semibold">Call: +92 332 7355 681</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 bg-humsafar-50 rounded-xl p-3">
                      <MessageCircle className="w-5 h-5 text-humsafar-600" />
                      <span className="text-humsafar-700 font-semibold">WhatsApp: +92 332 7355 681</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 bg-humsafar-50 rounded-xl p-3">
                      <Mail className="w-5 h-5 text-humsafar-600" />
                      <span className="text-humsafar-700 font-semibold">Email: info@humsafarforeverlove.com</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visit Us in Person */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-humsafar-600 to-humsafar-500 text-white">
                <CardContent className="p-8 md:p-12">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Visit Us in Person</h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
                      <p className="text-sm text-white/90">R-552, block 16, Water Pump, FB Area, Gulberg Town, Karachi, Pakistan</p>
                    </div>
                    
                    {/* Business Hours */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-white" />
                        <p className="text-lg font-semibold text-white">Business Hours</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-white/90">Monday - Friday:</span>
                          <span className="text-white font-medium">9:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/90">Saturday:</span>
                          <span className="text-white font-medium">10:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/90">Sunday:</span>
                          <span className="text-red-200 font-medium">Closed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>


          </div>
        </section>

      {/* Contact Section */}
      <section id="contact-form" className="py-24 bg-gradient-to-br from-gray-50 via-white to-humsafar-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-humsafar-100 rounded-full px-6 py-2 mb-6">
                <MessageCircle className="w-5 h-5 text-humsafar-600" />
                <span className="text-humsafar-600 font-medium">Get In Touch</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Let's Start a
                <span className="block bg-gradient-to-r from-humsafar-600 to-humsafar-400 bg-clip-text text-transparent">
                  Conversation
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Whether you have questions about our services or need assistance with your matrimonial journey, we're here to help.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-8">
                    <CardTitle className="text-3xl text-gray-900 mb-2">Send us a Message</CardTitle>
                    <p className="text-lg text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <form onSubmit={handleSubmit}>
                      {submitStatus === 'success' && (
                        <div className="bg-green-50 border-l-4 border-green-400 rounded-xl p-6 mb-6 shadow-sm">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-green-800 font-semibold text-lg mb-2">Message Sent Successfully!</h3>
                              <p className="text-green-700 mb-3">Your message has been delivered to our team and a confirmation email has been sent to your inbox.</p>
                              <div className="text-sm text-green-600">
                                <p className="mb-1">✓ Our team has received your message</p>
                                <p className="mb-1">✓ Confirmation email sent to your address</p>
                                <p>✓ We'll respond within 24-48 hours</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {submitStatus === 'error' && errorMessage && (
                        <div className="bg-red-50 border-l-4 border-red-400 rounded-xl p-6 mb-6 shadow-sm">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-red-800 font-semibold text-lg mb-2">Error Sending Message</h3>
                              <p className="text-red-700 mb-3">{errorMessage}</p>
                              <div className="text-sm text-red-600">
                                <p className="mb-1">• Please check your internet connection</p>
                                <p className="mb-1">• Verify all required fields are filled correctly</p>
                                <p>• If the problem persists, contact us directly at info@humsafarforeverlove.com</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-800 mb-3">First Name *</label>
                          <Input 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter your first name" 
                            className="h-12 border-2 border-gray-200 focus:border-humsafar-400 focus:ring-2 focus:ring-humsafar-100 rounded-xl transition-all duration-200" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-800 mb-3">Last Name *</label>
                          <Input 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter your last name" 
                            className="h-12 border-2 border-gray-200 focus:border-humsafar-400 focus:ring-2 focus:ring-humsafar-100 rounded-xl transition-all duration-200" 
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-3">Email Address *</label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          className="h-12 border-2 border-gray-200 focus:border-humsafar-400 focus:ring-2 focus:ring-humsafar-100 rounded-xl transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-3">Phone Number *</label>
                        <Input 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number" 
                          className="h-12 border-2 border-gray-200 focus:border-humsafar-400 focus:ring-2 focus:ring-humsafar-100 rounded-xl transition-all duration-200" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-3">Subject *</label>
                        <Input 
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What is this regarding?" 
                          className="h-12 border-2 border-gray-200 focus:border-humsafar-400 focus:ring-2 focus:ring-humsafar-100 rounded-xl transition-all duration-200" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-3">Message *</label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us how we can help you on your matrimonial journey..."
                          rows={6}
                          className="border-2 border-gray-200 focus:border-humsafar-400 focus:ring-2 focus:ring-humsafar-100 rounded-xl transition-all duration-200 resize-none"
                          required
                        />
                      </div>
                      <Button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-gradient-to-r from-humsafar-600 to-humsafar-500 hover:from-humsafar-700 hover:to-humsafar-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div id="contact-info" className="lg:col-span-1 space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Contact</h3>
                  <p className="text-sm text-gray-600">Choose your preferred method</p>
                </div>
                
                <Card className="border-0 shadow-lg bg-gradient-to-br from-humsafar-50 to-white hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Phone Support</h3>
                      <p className="text-humsafar-600 font-semibold mb-2">+92 332 7355 681</p>
                      <p className="text-xs text-gray-600">Available 24/7</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-humsafar-50 to-white hover:shadow-xl transition-all duration-300">
                   <CardContent className="p-6">
                     <div className="text-center">
                       <div className="w-12 h-12 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                         <Mail className="w-6 h-6 text-white" />
                       </div>
                       <h3 className="text-lg font-bold text-gray-900 mb-2">Email Support</h3>
                       <p className="text-humsafar-600 font-semibold mb-2 text-sm">info@humsafarforeverlove.com</p>
                       <p className="text-xs text-gray-600">Response within 24 hours</p>
                     </div>
                   </CardContent>
                 </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-humsafar-50 to-white hover:shadow-xl transition-all duration-300">
                   <CardContent className="p-6">
                     <div className="text-center">
                       <div className="w-12 h-12 bg-gradient-to-br from-humsafar-500 to-humsafar-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
                         <MapPin className="w-6 h-6 text-white" />
                       </div>
                       <h3 className="text-lg font-bold text-gray-900 mb-2">Visit Office</h3>
                       <p className="text-humsafar-600 font-semibold mb-2 text-sm">Karachi, Pakistan</p>
                       <p className="text-xs text-gray-600">Mon-Fri: 9AM-6PM</p>
                     </div>
                   </CardContent>
                 </Card>
              </div>
            </div>
          </div>
        </section>

      <Footer />
    </div>
  )
}
