"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Users,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  CheckCircle,
  ArrowRight,
  MapPin,
  GraduationCap,
  Briefcase,
  User,
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AnimatedCounterSection from "@/components/animated-counter"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { ProfileFilterService } from "@/lib/profileFilterService"
import { ProfileViewService } from "@/lib/profileViewService"
import CustomAlert from "@/components/ui/custom-alert"
import { useCustomAlert } from "@/hooks/use-custom-alert"
import ProtectedImage from "@/components/ui/protected-image"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

// Helper function to capitalize text
const capitalizeText = (text: string | null | undefined): string => {
  if (!text) return ''
  return text.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [featuredProfiles, setFeaturedProfiles] = useState<any[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState<boolean>(true)
  const [isClient, setIsClient] = useState(false)
  const [viewedProfileIds, setViewedProfileIds] = useState<Set<string>>(new Set())
  
  // Custom alert hook
  const { isOpen, alertConfig, hideAlert, showError, showConfirm } = useCustomAlert()

  // Note: suppressHydrationWarning is used throughout this component to prevent
  // hydration mismatches caused by browser extensions (like Bitdefender) that
  // inject attributes like 'bis_skin_checked' into the DOM after server rendering

  useEffect(() => {
    setIsClient(true)
    
    // Check user authentication
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        // Fetch viewed profiles for authenticated users
        fetchViewedProfiles()
      }
    } catch (error) {
      // Error checking authentication
    }
  }

  const fetchViewedProfiles = async () => {
    try {
      const result = await ProfileViewService.getViewedProfilesThisMonth()
      if (result.success && result.data) {
        const viewedIds = new Set(result.data.map(view => view.viewed_profile_user_id))
        setViewedProfileIds(viewedIds)
      }
    } catch (error) {
      // Error fetching viewed profiles
    }
  }

  const handleViewProfile = async (profileId: string) => {
    if (!user) {
      // For non-authenticated users, show login prompt
      showConfirm(
        'Please login to view profiles. Would you like to go to the login page?',
        () => {
          window.location.href = '/auth'
        },
        'Login Required'
      )
      return
    }

    // Check if already viewed
    if (viewedProfileIds.has(profileId)) {
      // Already viewed, just navigate
      window.location.href = `/profile/${profileId}`
      return
    }

    // Check if user can view more profiles
    const canView = await ProfileViewService.canUserViewMoreProfiles()
    if (!canView.success || !canView.canView) {
      showError(
        `You have reached your view limit. ${canView.message || 'Upgrade your subscription to view more profiles.'}`,
        'View Limit Reached'
      )
      return
    }

    // Record the view and navigate
    const result = await ProfileViewService.recordProfileView(profileId)
    if (result.success) {
      // Update local state
      setViewedProfileIds(prev => new Set(Array.from(prev).concat(profileId)))
      // Navigate to profile
      window.location.href = `/profile/${profileId}`
    } else {
      showError(
        result.message || 'Failed to record profile view',
        'Error'
      )
    }
  }


  const heroSlides = [
    {
      id: 1,
      title: "Find Your Perfect Life Partner",
      subtitle: "Join thousands of successful matches on Pakistan's most trusted matrimonial platform",
      image: "/wedding-couple-hero-1.jpg",
      cta: "Start Your Journey",
    },
    {
      id: 2,
      title: "Verified Profiles, Genuine Connections",
      subtitle: "Every profile is verified for authenticity and security",
      image: "/wedding-couple-hero-2.jpg",
      cta: "Browse Profiles",
    },
    {
      id: 3,
      title: "Success Stories That Inspire",
      subtitle: "Over 50,000 happy couples found their soulmate through humsafar",
      image: "/wedding-couple-hero-3.jpg",
      cta: "Read Stories",
    },
  ]

  const stats = [
    { label: "Active Members", value: "2.5M+", icon: Users },
    { label: "Success Stories", value: "50K+", icon: Heart },
    { label: "Verified Profiles", value: "95%", icon: Shield },
    { label: "Average Rating", value: "4.8", icon: Star },
  ]

  const features = [
    {
      title: "Advanced Matching",
      description: "AI-powered compatibility matching based on preferences, values, and lifestyle",
      icon: Heart,
    },
    {
      title: "Verified Profiles",
      description: "Every profile goes through rigorous verification for authenticity",
      icon: Shield,
    },
    {
      title: "Privacy Protection",
      description: "Your personal information is secure with our advanced privacy controls",
      icon: CheckCircle,
    },
    {
      title: "24/7 Support",
      description: "Our dedicated support team is available round the clock to help you",
      icon: Users,
    },
  ]

  const successStories = [
    {
      id: 1,
      names: "Ahmed & Fatima",
      location: "Karachi",
      story:
        "We found each other through humsafar and couldn't be happier. The platform made it so easy to connect with like-minded people.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop&crop=faces",
      date: "Married in 2023",
    },
    {
      id: 2,
      names: "Hassan & Ayesha",
      location: "Lahore",
      story: "After months of searching, we found our perfect match. humsafar's matching algorithm really works!",
      image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop&crop=faces",
      date: "Married in 2024",
    },
    {
      id: 3,
      names: "Ali & Zara",
      location: "Islamabad",
      story: "From the first conversation to our wedding day, everything felt perfect. Thank you humsafar!",
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop&crop=faces",
      date: "Married in 2024",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const currentUserId = user?.id

  // Helper function to calculate profile completion percentage
  const calculateProfileCompletion = (profile: any): number => {
    const fields = [
      'first_name', 'last_name', 'email', 'phone', 'age', 'gender', 
      'city', 'religion', 'sect', 'caste', 'mother_tongue', 
      'marital_status', 'nationality', 'ethnicity', 'education', 'field_of_study'
    ]
    
    let completedFields = 0
    fields.forEach(field => {
      if (profile[field] && profile[field].toString().trim() !== '') {
        completedFields++
      }
    })
    
    // Add bonus for having photos
    if (profile.has_photos) {
      completedFields += 2 // Photos are worth more
    }
    
    return Math.round((completedFields / (fields.length + 2)) * 100)
  }

  const fetchFeatured = useCallback(async () => {
    try {
      // Starting to fetch featured profiles
      
      // Use the new ProfileFilterService to get filtered profiles
      const result = await ProfileFilterService.getFilteredProfiles({
        currentUserId,
        excludeCurrentUser: true, // Always exclude current user from featured section
        maxProfiles: 4, // Show max 4 on homepage
        isFeaturedSection: true
      })
      
      // ProfileFilterService returned profiles
      // Total available approved profiles
      
      if (result.profiles.length > 0) {
        // Completion percentages
      }
      
      setFeaturedProfiles(result.profiles)
      // Step 1: Get all approved user IDs from user_subscriptions
      const { data: approvedSubscriptions, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('user_id')
        .eq('profile_status', 'approved')
      
      if (subscriptionError) {
        // Error fetching approved subscriptions
        
        // Fallback: Try to get some profiles if subscription query fails
        // Trying fallback due to subscription error
        let query = supabase
          .from('user_profiles')
          .select(`
            user_id,
            first_name,
            last_name,
            email,
            phone,
            age,
            gender,
            city,
            religion,
            sect,
            caste,
            mother_tongue,
            marital_status,
            nationality,
            ethnicity,
            education,
            field_of_study,
            created_at,
            updated_at
          `)
        
        // Only filter out current user if they are logged in
        if (currentUserId) {
          query = query.neq('user_id', currentUserId)
        }
        
        const { data: fallbackProfiles, error: fallbackError } = await query
          .order('created_at', { ascending: false })
          .limit(4)
        
        if (fallbackError) {
          // Fallback also failed
          
          setLoadingFeatured(false)
          return
        }
        
        if (fallbackProfiles && fallbackProfiles.length > 0) {
          // Fallback successful! Found profiles
          const fallbackFinalProfiles = await Promise.all(
            fallbackProfiles.map(async (profile) => {
              let mainImage = '/placeholder.jpg'
              try {
                const { data: images } = await supabase
                  .from('user_images')
                  .select('image_url, is_main')
                  .eq('user_id', profile.user_id)
                  .order('is_main', { ascending: false })
                  .limit(1)
                
                if (images && images.length > 0) {
                  mainImage = images[0].image_url
                }
              } catch (error) {
                // No images found for fallback user
              }
              
              return {
                ...profile,
                id: profile.user_id,
                mainImage,
                has_photos: mainImage !== '/placeholder.jpg'
              }
            })
          )
          
          // Calculate completion percentage and sort by highest completion first
          const fallbackWithCompletion = fallbackFinalProfiles.map(profile => ({
            ...profile,
            completionPercentage: calculateProfileCompletion(profile)
          }))
          
          // Sort by completion percentage (highest first)
          fallbackWithCompletion.sort((a, b) => b.completionPercentage - a.completionPercentage)
          
          // Fallback profiles sorted by completion
          // Completion percentages
          
          setFeaturedProfiles(fallbackWithCompletion)
          setLoadingFeatured(false)
          return
        }
        
        setFeaturedProfiles([])
        setLoadingFeatured(false)
        return
      }
      
      if (!approvedSubscriptions || approvedSubscriptions.length === 0) {
        // No approved subscriptions found
        
        // Fallback: Try to get some profiles if no approved subscriptions
        // Trying fallback due to no approved subscriptions
        const { data: fallbackProfiles, error: fallbackError } = await supabase
          .from('user_profiles')
          .select(`
            user_id,
            first_name,
            last_name,
            email,
            phone,
            age,
            gender,
            city,
            religion,
            sect,
            caste,
            mother_tongue,
            marital_status,
            nationality,
            ethnicity,
            education,
            field_of_study,
            created_at,
            updated_at
          `)
          .order('created_at', { ascending: false })
          .limit(4)
        
        if (fallbackError) {
          // Fallback also failed
          setFeaturedProfiles([])
          setLoadingFeatured(false)
          return
        }
        
        if (fallbackProfiles && fallbackProfiles.length > 0) {
          // Fallback successful! Found profiles
          const fallbackFinalProfiles = await Promise.all(
            fallbackProfiles.map(async (profile) => {
              let mainImage = '/placeholder.jpg'
              try {
                const { data: images } = await supabase
                  .from('user_images')
                  .select('image_url, is_main')
                  .eq('user_id', profile.user_id)
                  .order('is_main', { ascending: false })
                  .limit(1)
                
                if (images && images.length > 0) {
                  mainImage = images[0].image_url
                }
              } catch (error) {
                // No images found for fallback user
              }
              
              return {
                ...profile,
                id: profile.user_id,
                mainImage,
                has_photos: mainImage !== '/placeholder.jpg'
              }
            })
          )
          
          // Calculate completion percentage and sort by highest completion first
          const fallbackWithCompletion = fallbackFinalProfiles.map(profile => ({
            ...profile,
            completionPercentage: calculateProfileCompletion(profile)
          }))
          
          // Sort by completion percentage (highest first)
          fallbackWithCompletion.sort((a, b) => b.completionPercentage - a.completionPercentage)
          
          // Fallback profiles sorted by completion
          // Completion percentages
          
          setFeaturedProfiles(fallbackWithCompletion)
          setLoadingFeatured(false)
          return
        }
        
        setFeaturedProfiles([])
        setLoadingFeatured(false)
        return
      }
      
      const approvedUserIds = approvedSubscriptions.map(sub => sub.user_id)
      // Found approved user IDs
      
      // Step 2: Fetch profiles for approved users from user_profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select(`
          user_id,
          first_name,
          last_name,
          email,
          phone,
          age,
          gender,
          city,
          religion,
          sect,
          caste,
          mother_tongue,
          marital_status,
          nationality,
          ethnicity,
          education,
          field_of_study,
          created_at,
          updated_at
        `)
        .in('user_id', approvedUserIds)
        .order('created_at', { ascending: false })
      
      if (profilesError) {
        // Error fetching profiles
        setLoadingFeatured(false)
        return
      }
      
      if (!profilesData || profilesData.length === 0) {
        // No profiles found for approved users
        setFeaturedProfiles([])
        setLoadingFeatured(false)
        return
      }
      
      // Found approved profiles
      
      // Step 3: Process profiles and add images
      const finalProfiles = await Promise.all(
        profilesData.map(async (profile) => {
          // Try to get profile image
          let mainImage = '/placeholder.jpg'
          
          try {
            const { data: images } = await supabase
              .from('user_images')
              .select('image_url, is_main')
              .eq('user_id', profile.user_id)
              .order('is_main', { ascending: false })
              .limit(1)
            
            if (images && images.length > 0) {
              // Construct proper public URL for Supabase storage
              const imageUrl = images[0].image_url
              if (imageUrl && imageUrl !== '/placeholder.jpg') {
                // Check if imageUrl is already a full URL
                if (imageUrl.startsWith('http')) {
                  mainImage = imageUrl
                } else {
                  mainImage = `https://kzmfreck4dxcc4cifgls.supabase.co/storage/v1/object/public/humsafar-user-images/${imageUrl}`
                }
              }
            }
          } catch (error) {
            // No images found for user
          }
          
          return {
            ...profile,
            id: profile.user_id,
            mainImage,
            has_photos: mainImage !== '/placeholder.jpg'
          }
        })
      )
      
      // Step 4: Calculate completion percentage and sort by highest completion first
      const profilesWithCompletion = finalProfiles.map(profile => ({
        ...profile,
        completionPercentage: calculateProfileCompletion(profile)
      }))
      
      // Sort by completion percentage (highest first)
      profilesWithCompletion.sort((a, b) => b.completionPercentage - a.completionPercentage)
      
      // Final result: approved profiles sorted by completion
      // Completion percentages
      
      setFeaturedProfiles(profilesWithCompletion.slice(0, 4)) // Show max 4 on homepage
      setLoadingFeatured(false)
      
    } catch (error: any) {
      // Error in fetchFeatured
      setFeaturedProfiles([])
      setLoadingFeatured(false)
    }
  }, [currentUserId])

  useEffect(() => {
    fetchFeatured()
  }, [fetchFeatured])

  return (
    <div className="min-h-screen bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100" suppressHydrationWarning>
      <Header />
      {/* Hero Section with Slider */}
      <main className="container mx-auto px-4 py-8">
        <section className="relative h-[600px] overflow-hidden rounded-3xl" suppressHydrationWarning>
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
              }`}
            >
              <div className="h-full relative rounded-3xl">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1600px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">{slide.title}</h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">{slide.subtitle}</p>
                    <Button size="lg" className="bg-humsafar-600 hover:bg-humsafar-700 text-lg px-8 py-3">
                      {slide.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2" role="tablist" aria-label="Hero slides">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={index === currentSlide}
                role="tab"
              />
            ))}
          </div>
        </section>
      </main>
      
      {/* Animated Counter Section */}
      <AnimatedCounterSection />
      
      {/* Dashboard Section - Only for authenticated users */}
      {/* {user && (
        <section className="py-12 bg-gradient-to-r from-humsafar-50 to-humsafar-50" suppressHydrationWarning>
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto border-humsafar-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome Back!
                </h2>
                <p className="text-gray-600 mb-6">
                  Access your dashboard to manage your profile, view matches, and more
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button className="bg-humsafar-500 hover:bg-humsafar-600 text-white px-8 py-3">
                      <User className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )} */}
      {/* Quick Search Section */}
      <section className="py-16 bg-gray-50" suppressHydrationWarning>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Match</h2>
            <p className="text-xl text-gray-600">Search from thousands of verified profiles</p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Looking for" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">Bride</SelectItem>
                    <SelectItem value="groom">Groom</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-25">18-25 years</SelectItem>
                    <SelectItem value="26-30">26-30 years</SelectItem>
                    <SelectItem value="31-35">31-35 years</SelectItem>
                    <SelectItem value="36-40">36-40 years</SelectItem>
                    <SelectItem value="40+">40+ years</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="karachi">Karachi</SelectItem>
                    <SelectItem value="lahore">Lahore</SelectItem>
                    <SelectItem value="islamabad">Islamabad</SelectItem>
                    <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
                    <SelectItem value="faisalabad">Faisalabad</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="bg-humsafar-600 hover:bg-humsafar-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              <div className="text-center">
                <Link
                  href="/profiles"
                  className="text-humsafar-600 hover:text-humsafar-700 font-medium">
                  Advanced Search <ArrowRight className="h-4 w-4 inline ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Featured Profiles Section */}
      <section className="py-16 bg-white" suppressHydrationWarning>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Profiles</h2>
            <p className="text-xl text-gray-600">Discover verified profiles of potential life partners</p>
          </div>
          {/* Loading & Empty states */}
          {loadingFeatured && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-4">
                <div className="w-12 h-12 border-4 border-humsafar-100 border-t-humsafar-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-humsafar-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Loading Profiles</h3>
                <p className="text-sm text-gray-500">Please wait...</p>
              </div>
              <div className="flex space-x-1 mt-3">
                <div className="w-1.5 h-1.5 bg-humsafar-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-humsafar-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-humsafar-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          {!loadingFeatured && featuredProfiles.length === 0 && (
            <div className="text-center text-gray-600 py-8">
              <p className="text-lg mb-2">No verified profiles to display at the moment.</p>
            </div>
          )}

          {/* Mobile-only Carousel */}
          {!loadingFeatured && featuredProfiles.length > 0 && (
            <div className="md:hidden mb-12">
              <Carousel opts={{ align: 'start', loop: false }}>
                <CarouselContent>
                  {featuredProfiles.map((profile) => {
                    let name = 'Unnamed'
                    if (profile.first_name || profile.last_name) {
                      const nameParts = [profile.first_name, profile.last_name].filter(Boolean)
                      name = nameParts.map(part => capitalizeText(part)).join(' ')
                    } else if (profile.display_name) {
                      name = capitalizeText(profile.display_name)
                    } else if (profile.username) {
                      name = capitalizeText(profile.username)
                    }

                    let edu = 'Education not specified'
                    if (profile.education && profile.field_of_study) {
                      edu = `${capitalizeText(profile.education)} in ${capitalizeText(profile.field_of_study)}`
                    } else if (profile.education) {
                      edu = capitalizeText(profile.education)
                    } else if (profile.degree) {
                      edu = capitalizeText(profile.degree)
                    } else if (profile.qualification) {
                      edu = capitalizeText(profile.qualification)
                    }
                    const city = capitalizeText(profile.city || profile.location || profile.current_city || 'Location not specified')

                    return (
                      <CarouselItem key={profile.id} className="basis-[85%]">
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow border-humsafar-100 group flex flex-col h-full min-h-[400px]">
                          <div className="relative bg-black">
                            {profile.mainImage && profile.mainImage !== '/placeholder.jpg' ? (
                              <ProtectedImage
                                src={profile.mainImage}
                                alt={name}
                                width={400}
                                height={400}
                                className="w-full h-80 object-contain object-top transition-transform duration-300 bg-black"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = '/placeholder.jpg'
                                }}
                                priority={true}
                              />
                            ) : (
                              <div className="w-full h-80 bg-gray-100 flex items-center justify-center transition-transform duration-300">
                                <div className="text-center text-gray-400">
                                  <User className="w-12 h-12 mx-auto mb-2" />
                                  <p className="text-sm">No Photo</p>
                                </div>
                              </div>
                            )}
                            {profile.premium && <Badge className="absolute top-3 left-3 bg-humsafar-600 text-xs">Premium</Badge>}
                            {profile.verified_badge && (
                        <span className="absolute top-3 right-3 z-10 pointer-events-none inline-flex items-center gap-1 rounded-full bg-humsafar-600 text-white text-[10px] px-2.5 py-1"><Shield className="w-3 h-3" />Verified</span>
                            )}
                          </div>
                          <CardContent className="p-4 flex flex-col h-full">
                            <div className="mb-3 flex-grow">
                              <div className="text-center mb-3">
                                <span className="inline-block bg-humsafar-100 text-humsafar-800 px-4 py-2 rounded-full text-lg font-bold">
                                  {profile.id.substring(0, 8).toUpperCase()}
                                </span>
                              </div>
                              <div className="space-y-1 mb-3 text-gray-600 text-sm">
                                {profile.age && (
                                  <div className="flex items-center">
                                    <span className="text-gray-700 text-sm font-medium w-20 mr-2">Age:</span>
                                    <Calendar className="w-3 h-3 text-humsafar-500 mr-2" />
                                    <span className="text-gray-600 text-sm">{profile.age} years</span>
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <span className="text-gray-700 text-sm font-medium w-20 mr-2">Education:</span>
                                  <GraduationCap className="w-3 h-3 text-humsafar-500 mr-2" />
                                  <span className="text-gray-600 text-sm truncate">{edu}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-gray-700 text-sm font-medium w-20 mr-2">Location:</span>
                                  <MapPin className="w-3 h-3 text-humsafar-500 mr-2" />
                                  <span className="text-gray-600 text-sm">{city}</span>
                                </div>
                                {profile.religion && (
                                  <div className="flex items-center">
                                    <span className="text-gray-700 text-sm font-medium w-20 mr-2">Religion:</span>
                                    <User className="w-3 h-3 text-humsafar-500 mr-2" />
                                    <span className="text-gray-600 text-sm">{capitalizeText(profile.religion)}</span>
                                  </div>
                                )}
                                {profile.marital_status && (
                                  <div className="flex items-center">
                                    <span className="text-gray-700 text-sm font-medium w-20 mr-2">Status:</span>
                                    <Heart className="w-3 h-3 text-humsafar-500 mr-2" />
                                    <span className="text-gray-600 text-sm">{capitalizeText(profile.marital_status)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-auto">
                              <Button 
                                onClick={() => handleViewProfile(profile.id)}
                                className={`w-full text-sm py-2 ${
                                  viewedProfileIds.has(profile.id)
                                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                                    : 'bg-humsafar-600 hover:bg-humsafar-700 text-white'
                                }`}
                              >
                                {viewedProfileIds.has(profile.id) ? 'View Again' : 'View Profile'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
              </Carousel>
            </div>
          )}

          {/* Desktop/tablet Grid */}
          {!loadingFeatured && featuredProfiles.length > 0 && (
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {featuredProfiles.map((profile) => {
                let name = 'Unnamed'
                if (profile.first_name || profile.last_name) {
                  const nameParts = [profile.first_name, profile.last_name].filter(Boolean)
                  name = nameParts.map(part => capitalizeText(part)).join(' ')
                } else if (profile.display_name) {
                  name = capitalizeText(profile.display_name)
                } else if (profile.username) {
                  name = capitalizeText(profile.username)
                }

                let edu = 'Education not specified'
                if (profile.education && profile.field_of_study) {
                  edu = `${capitalizeText(profile.education)} in ${capitalizeText(profile.field_of_study)}`
                } else if (profile.education) {
                  edu = capitalizeText(profile.education)
                } else if (profile.degree) {
                  edu = capitalizeText(profile.degree)
                } else if (profile.qualification) {
                  edu = capitalizeText(profile.qualification)
                }
                const city = capitalizeText(profile.city || profile.location || profile.current_city || 'Location not specified')

                return (
                  <Card
                    key={profile.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow border-humsafar-100 group flex flex-col h-full min-h-[400px]"
                  >
                    <div className="relative">
                      {profile.mainImage && profile.mainImage !== '/placeholder.jpg' ? (
                      <ProtectedImage
                        src={profile.mainImage}
                        alt={name}
                        width={400}
                        height={400}
                        className="w-full h-80 object-contain object-top transition-transform duration-300 bg-black"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder.jpg'
                        }}
                        priority={true}
                        />
                      ) : (
                        <div className="w-full h-80 bg-gray-100 flex items-center justify-center transition-transform duration-300">
                          <div className="text-center text-gray-400">
                            <User className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm">No Photo</p>
                          </div>
                        </div>
                      )}
                      {profile.premium && <Badge className="absolute top-3 left-3 bg-humsafar-600 text-xs">Premium</Badge>}
                      {profile.verified_badge && (
                        <span className="absolute top-3 right-3 z-10 pointer-events-none inline-flex items-center gap-1 rounded-full bg-humsafar-600 text-white text-[10px] px-2.5 py-1"><Shield className="w-3 h-3" />Verified</span>
                      )}
                    </div>
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="mb-3 flex-grow">
                        <div className="text-center mb-3">
                          <span className="inline-block bg-humsafar-100 text-humsafar-800 px-4 py-2 rounded-full text-lg font-bold">
                            {profile.id.substring(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <div className="space-y-1 mb-3 text-gray-600 text-sm">
                          {profile.age && (
                            <div className="flex items-center">
                              <span className="text-gray-700 text-sm font-medium w-20 mr-2">Age:</span>
                              <Calendar className="w-3 h-3 text-humsafar-500 mr-2" />
                              <span className="text-gray-600 text-sm">{profile.age} years</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <span className="text-gray-700 text-sm font-medium w-20 mr-2">Education:</span>
                            <GraduationCap className="w-3 h-3 text-humsafar-500 mr-2" />
                            <span className="text-gray-600 text-sm truncate">{edu}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-700 text-sm font-medium w-20 mr-2">Location:</span>
                            <MapPin className="w-3 h-3 text-humsafar-500 mr-2" />
                            <span className="text-gray-600 text-sm">{city}</span>
                          </div>
                          {profile.religion && (
                            <div className="flex items-center">
                              <span className="text-gray-700 text-sm font-medium w-20 mr-2">Religion:</span>
                              <User className="w-3 h-3 text-humsafar-500 mr-2" />
                              <span className="text-gray-600 text-sm">{capitalizeText(profile.religion)}</span>
                            </div>
                          )}
                          {profile.marital_status && (
                            <div className="flex items-center">
                              <span className="text-gray-700 text-sm font-medium w-20 mr-2">Status:</span>
                              <Heart className="w-3 h-3 text-humsafar-500 mr-2" />
                              <span className="text-gray-600 text-sm">{capitalizeText(profile.marital_status)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Button 
                          onClick={() => handleViewProfile(profile.id)}
                          className={`w-full text-sm py-2 ${
                            viewedProfileIds.has(profile.id)
                              ? 'bg-gray-500 hover:bg-gray-600 text-white'
                              : 'bg-humsafar-600 hover:bg-humsafar-700 text-white'
                          }`}
                        >
                          {viewedProfileIds.has(profile.id) ? 'View Again' : 'View Profile'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <div className="text-center">
            <Link href="/profiles" legacyBehavior>
              <Button size="lg" className="bg-humsafar-600 hover:bg-humsafar-700 text-white px-8 py-3">
                See More Profiles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Stats Section */}
     
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white via-humsafar-25 to-white relative" suppressHydrationWarning>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-humsafar-100 to-humsafar-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-humsafar-100 to-humsafar-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">Why Choose humsafar?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>Pakistan's most trusted matrimonial platform with cutting-edge features</p>
          </div>

          {/* Mobile-only Carousel for Features */}
          <div className="md:hidden">
            <Carousel opts={{ align: 'start', loop: false }}>
              <CarouselContent>
                {features.map((feature, index) => (
                  <CarouselItem key={index} className="basis-[85%]">
                    <Card 
                      className="text-center group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:transform hover:scale-105 animate-fade-in-up overflow-hidden relative"
                      style={{animationDelay: `${0.4 + index * 0.15}s`}}
                    >
                      {/* Card Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-humsafar-100/20 to-humsafar-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <CardContent className="p-8 relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-humsafar-100 to-humsafar-200 rounded-2xl mb-6 group-hover:from-humsafar-200 group-hover:to-humsafar-300 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                          <feature.icon className="h-10 w-10 text-humsafar-600 group-hover:text-humsafar-700 transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-humsafar-700 transition-colors duration-300">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{feature.description}</p>
                        
                        {/* Hover Arrow */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <div className="w-8 h-0.5 bg-humsafar-400 mx-auto rounded-full"></div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Desktop/tablet Grid for Features */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:transform hover:scale-105 animate-fade-in-up overflow-hidden relative"
                style={{animationDelay: `${0.4 + index * 0.15}s`}}
              >
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-humsafar-100/20 to-humsafar-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-humsafar-100 to-humsafar-200 rounded-2xl mb-6 group-hover:from-humsafar-200 group-hover:to-humsafar-300 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <feature.icon className="h-10 w-10 text-humsafar-600 group-hover:text-humsafar-700 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-humsafar-700 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{feature.description}</p>
                  
                  {/* Hover Arrow */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="w-8 h-0.5 bg-humsafar-400 mx-auto rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-humsafar-50 via-white to-humsafar-100 relative overflow-hidden" suppressHydrationWarning>
        {/* Floating Hearts Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-humsafar-200 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="absolute top-40 right-20 text-humsafar-300 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="absolute bottom-32 left-1/4 text-humsafar-200 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>Real couples, real love stories that inspire millions</p>
          </div>

          {/* Mobile-only Carousel for Success Stories */}
          <div className="md:hidden">
            <Carousel opts={{ align: 'start', loop: false }}>
              <CarouselContent>
                {successStories.map((story, index) => (
                  <CarouselItem key={story.id} className="basis-[85%]">
                    <Card 
                      className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:transform hover:scale-105 animate-fade-in-up relative"
                      style={{animationDelay: `${0.4 + index * 0.2}s`}}
                    >
                      {/* Card Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                      
                      <div className="aspect-video bg-gradient-to-br from-humsafar-100 to-humsafar-200 relative overflow-hidden">
                        <Image
                          src={story.image || "/placeholder.svg"}
                          alt={story.names}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <CardContent className="p-8 relative">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-humsafar-700 transition-colors duration-300">{story.names}</h3>
                          <Badge 
                            variant="outline" 
                            className="text-humsafar-600 border-humsafar-600 bg-humsafar-50 group-hover:bg-humsafar-100 group-hover:border-humsafar-700 transition-all duration-300"
                          >
                            {story.location}
                          </Badge>
                        </div>
                        
                        <div className="relative mb-6">
                          <div className="absolute -left-2 -top-2 text-humsafar-300 text-4xl font-serif">"</div>
                          <p className="text-gray-600 italic leading-relaxed pl-6 group-hover:text-gray-700 transition-colors duration-300">
                            {story.story}
                          </p>
                          <div className="absolute -right-2 -bottom-2 text-humsafar-300 text-4xl font-serif rotate-180">"</div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                          <Calendar className="h-4 w-4 mr-2 text-humsafar-500" />
                          {story.date}
                        </div>
                        
                        {/* Bottom Accent Line */}
                        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-humsafar-400 to-humsafar-600 group-hover:w-full transition-all duration-500 ease-out"></div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Desktop/tablet Grid for Success Stories */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card 
                key={story.id} 
                className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:transform hover:scale-105 animate-fade-in-up relative"
                style={{animationDelay: `${0.4 + index * 0.2}s`}}
              >
                {/* Card Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                
                <div className="aspect-video bg-gradient-to-br from-humsafar-100 to-humsafar-200 relative overflow-hidden">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.names}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <CardContent className="p-8 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-humsafar-700 transition-colors duration-300">{story.names}</h3>
                    <Badge 
                      variant="outline" 
                      className="text-humsafar-600 border-humsafar-600 bg-humsafar-50 group-hover:bg-humsafar-100 group-hover:border-humsafar-700 transition-all duration-300"
                    >
                      {story.location}
                    </Badge>
                  </div>
                  
                  <div className="relative mb-6">
                    <div className="absolute -left-2 -top-2 text-humsafar-300 text-4xl font-serif">"</div>
                    <p className="text-gray-600 italic leading-relaxed pl-6 group-hover:text-gray-700 transition-colors duration-300">
                      {story.story}
                    </p>
                    <div className="absolute -right-2 -bottom-2 text-humsafar-300 text-4xl font-serif rotate-180">"</div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                    <Calendar className="h-4 w-4 mr-2 text-humsafar-500" />
                    {story.date}
                  </div>
                  
                  {/* Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-humsafar-400 to-humsafar-600 group-hover:w-full transition-all duration-500 ease-out"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/success-stories" legacyBehavior>
              <Button
                size="lg"
                className="bg-gradient-to-r from-humsafar-600 to-humsafar-700 hover:from-humsafar-700 hover:to-humsafar-800 text-white px-10 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group animate-fade-in-up"
                style={{animationDelay: '1s'}}
              >
                <span className="mr-3">View All Success Stories</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* CTA Section */}
    
      <Footer />
      
      {/* Custom Alert Component */}
      <CustomAlert
        isOpen={isOpen}
        onClose={hideAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        showConfirm={alertConfig.showConfirm}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
        autoClose={alertConfig.autoClose}
        autoCloseDelay={alertConfig.autoCloseDelay}
      />
    </div>
  );
}
