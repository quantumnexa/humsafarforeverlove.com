"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

import {
  Heart,
  Users,
  MapPin,
  GraduationCap,
  User,
  Grid,
  List,
  ArrowRight,
  Loader2,
  Eye,
  Calendar,
  Filter,
  X,
  Shield
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { UserSubscriptionService } from "@/lib/userSubscriptionService"
import { ProfileVisibilityService } from "@/lib/profileVisibilityService"
import { ProfileFilterService } from "@/lib/profileFilterService"
import { ProfileViewService } from "@/lib/profileViewService"
import { ViewedProfilesCart } from "@/components/viewed-profiles-cart"
import CustomAlert from "@/components/ui/custom-alert"
import { useCustomAlert } from "@/hooks/use-custom-alert"
import ProtectedImage from "@/components/ui/protected-image"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

const capitalizeText = (text: string | null | undefined): string => {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export default function ProfilesListingPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false)
  const [userViewStats, setUserViewStats] = useState<any>(null)
  const [viewedProfileIds, setViewedProfileIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showViewedOnly, setShowViewedOnly] = useState(false)
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState('All')
  const [selectedGender, setSelectedGender] = useState('All')
  const [showNoPackageDialog, setShowNoPackageDialog] = useState(false)
  
  const [selectedAgeFrom, setSelectedAgeFrom] = useState('From')
  const [selectedAgeTo, setSelectedAgeTo] = useState('To')
  const [searchTerm, setSearchTerm] = useState('')
  const profilesPerPage = 12
  
  // Custom alert hook
  const { isOpen, alertConfig, hideAlert, showError, showConfirm } = useCustomAlert()

  useEffect(() => {
    fetchProfiles()
    getCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchUserViewStats()
      fetchViewedProfiles()
    }
  }, [currentUser])

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
      
      // Check if user's profile is terminated
      if (user) {
        const { data: subscriptionData } = await supabase
          .from("user_subscriptions")
          .select("profile_status, verified_badge, views_limit, subscription_status")
          .eq("user_id", user.id)
          .single()
        
        if (subscriptionData?.profile_status === 'terminated') {
          router.push('/profile-terminated')
          return
        }

        // Set verified flag to hide promotion banner
        setIsVerifiedUser(Boolean(subscriptionData?.verified_badge))
      }
    } catch (error) {
      // Error getting current user
    }
  }

  const fetchUserViewStats = async () => {
    try {
      const stats = await ProfileViewService.getUserViewStats()
      if (stats.success) {
        setUserViewStats(stats.data)
      }
    } catch (error) {
      // Error fetching user view stats
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
    if (!currentUser) {
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

    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('views_limit, subscription_status')
      .eq('user_id', currentUser.id)
      .single()

    if (!subscription || (subscription.views_limit ?? 0) === 0 || (subscription.subscription_status || '').toLowerCase() === 'free') {
      setShowNoPackageDialog(true)
      return
    }

    const canView = await ProfileViewService.canUserViewMoreProfiles()
    if (!canView.success || !canView.canView) {
      showError(
        'You have reached your view limit. Upgrade your subscription to view more profiles.',
        'View Limit Reached'
      )
      return
    }

    // Record the view and navigate
    const result = await ProfileViewService.recordProfileView(profileId)
    if (result.success) {
      // Update local state
      setViewedProfileIds(prev => new Set(Array.from(prev).concat(profileId)))
      // Refresh stats
      fetchUserViewStats()
      // Navigate to profile
      window.location.href = `/profile/${profileId}`
    } else {
      showError(
        result.message || 'Failed to record profile view',
        'Error'
      )
    }
  }

  const fetchProfiles = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      // Get ALL profiles without interest limit restrictions
      const result = await ProfileFilterService.getFilteredProfiles({
          currentUserId: user?.id || null,
          excludeCurrentUser: true
        })
      
      const profilesData = result.profiles || []
      
      // Enhance profiles with images
      const enhancedProfiles = await Promise.all(
        profilesData.map(async (profile) => {
          try {
            // Get main image for each profile
            const { data: images } = await supabase
              .from('user_images')
              .select('image_url, is_main')
              .eq('user_id', profile.user_id || profile.id)
              .order('is_main', { ascending: false })
              .limit(1)
            
            const mainImage = images && images.length > 0 ? images[0].image_url : '/placeholder.jpg'
            
            return {
              ...profile,
              mainImage
            }
          } catch (error) {
            // Error fetching image for profile
            return {
              ...profile,
              mainImage: '/placeholder.jpg'
            }
          }
        })
      )
      
      setProfiles(enhancedProfiles)
    } catch (error) {
      // Error fetching profiles
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  const filteredProfiles = profiles.filter(profile => {
    // Filter by search term (only visible fields in profile cards)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      const age = (profile.age || '').toString().toLowerCase()
      const education = (profile.education || '').toLowerCase()
      const fieldOfStudy = (profile.field_of_study || '').toLowerCase()
      const city = (profile.city || '').toLowerCase()
      const religion = (profile.religion || '').toLowerCase()
      const maritalStatus = (profile.marital_status || '').toLowerCase()
      
      const matchesSearch = age.includes(searchLower) || 
                           education.includes(searchLower) || 
                           fieldOfStudy.includes(searchLower) || 
                           city.includes(searchLower) || 
                           religion.includes(searchLower) || 
                           maritalStatus.includes(searchLower)
      
      if (!matchesSearch) {
        return false
      }
    }
    
    // Filter by verified status if verifiedOnly is enabled
    // Note: verified flag comes from user_subscriptions as `verified_badge`
    if (verifiedOnly && !profile.verified_badge) {
      return false
    }
    
    // Filter by viewed profiles if showViewedOnly is enabled
    if (showViewedOnly && !viewedProfileIds.has(profile.user_id || profile.id)) {
      return false
    }
    
    // Filter by marital status (normalize to match DB values)
    if (selectedMaritalStatus !== 'All') {
      const status = (profile.marital_status || '').toLowerCase()
      if (status !== selectedMaritalStatus) {
        return false
      }
    }
    
    // Filter by gender (normalize to lowercase)
    if (selectedGender !== 'All') {
      const gender = (profile.gender || '').toLowerCase()
      if (gender !== selectedGender) {
        return false
      }
    }
    
    // City filter removed
    
    // Filter by age range
    if (selectedAgeFrom !== 'From' || selectedAgeTo !== 'To') {
      const profileAge = profile.age || 0
      const ageFrom = selectedAgeFrom !== 'From' ? parseInt(selectedAgeFrom) : 0
      const ageTo = selectedAgeTo !== 'To' ? parseInt(selectedAgeTo) : 100
      
      if (profileAge < ageFrom || profileAge > ageTo) {
        return false
      }
    }
    
    return true
  })
  
  // Pagination logic
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage)
  const startIndex = (currentPage - 1) * profilesPerPage
  const endIndex = startIndex + profilesPerPage
  const currentProfiles = filteredProfiles.slice(startIndex, endIndex)
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const ProfileCard = ({ profile }: { profile: any }) => {
    // Build full name
    let name = 'Unnamed'
    if (profile.first_name || profile.last_name) {
      const nameParts = [profile.first_name, profile.last_name].filter(Boolean)
      name = nameParts.map(part => capitalizeText(part)).join(' ')
    } else if (profile.display_name) {
      name = capitalizeText(profile.display_name)
    } else if (profile.username) {
      name = capitalizeText(profile.username)
    }

    // Education info
    let edu = 'Education not specified'
    if (profile.education && profile.field_of_study) {
      edu = `${capitalizeText(profile.education)} in ${capitalizeText(profile.field_of_study)}`
    } else if (profile.education) {
      edu = capitalizeText(profile.education)
    }

    const city = capitalizeText(profile.city || 'Location not specified')

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-humsafar-100 group flex flex-col h-full">
        <div className="relative bg-black">
          {profile.mainImage && profile.mainImage !== '/placeholder.jpg' ? (
            <ProtectedImage
              src={profile.mainImage}
              alt={name}
              width={400}
              height={400}
              className="w-full h-80 object-contain object-top group-hover:scale-105 transition-transform duration-300 bg-black"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder.jpg'
              }}
              priority={false}
            />
          ) : (
            <div className="w-full h-80 bg-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="text-center text-gray-400">
                <User className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">No Photo</p>
              </div>
            </div>
          )}
          {profile.premium && (
            <Badge className="absolute top-3 left-3 bg-humsafar-600 text-xs">Premium</Badge>
          )}
          {profile.verified_badge && (
            <span className="absolute top-3 right-3 z-10 pointer-events-none inline-flex items-center gap-1 rounded-full bg-humsafar-600 text-white text-xs px-2.5 py-1">
              <Shield className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
        
        <CardContent className="p-4 flex flex-col h-full">
          <div className="mb-3 flex-grow">
            {/* User ID Display */}
            <div className="text-center mb-3">
              <span className="inline-block bg-humsafar-100 text-humsafar-800 px-4 py-2 rounded-full text-lg font-bold">
                {(profile.user_id || profile.id)?.toString().substring(0, 8).toUpperCase()}
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
              onClick={() => handleViewProfile(profile.user_id || profile.id)}
              className={`w-full text-sm py-2 ${
                viewedProfileIds.has(profile.user_id || profile.id)
                  ? 'bg-gray-500 hover:bg-gray-600 text-white'
                  : 'bg-humsafar-600 hover:bg-humsafar-700 text-white'
              }`}
            >
              {viewedProfileIds.has(profile.user_id || profile.id) ? (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  View Again
                </>
              ) : (
                'View Profile'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden bg-humsafar-500 rounded-3xl mb-16 py-20 px-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Users className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Verified Profiles</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Featured Profiles
              <span className="block text-white/60">
                Find Your Perfect Match
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover verified and approved profiles with complete details. Connect with genuine people looking for meaningful relationships.
            </p>
          </div>
        </div>
      </main>



      {/* Search and Filters Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          {/* Verification Badge Promotion */}
          {!isVerifiedUser && (
            <div className="bg-gradient-to-r from-red-50 to-humsafar-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Stand out and build trust with a verified badge</h3>
                  </div>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => router.push('/verified-badge-payment')}>
                  Get Verified - Rs 1000
                </Button>
              </div>
            </div>
          )}
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by age, education, city, religion, or marital status..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1) // Reset to first page when searching
                  }}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-humsafar-500 focus:border-humsafar-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

          </div>



          {/* Advanced Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Left side - Filters Label and Dropdowns */}
              <div className="flex items-center gap-6 flex-wrap">
                {/* Filters Label */}
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-humsafar-600" />
                  <span className="font-medium text-gray-900">Filters</span>
                </div>
                
                {/* Dropdown Filter Controls */}
                <div className="flex items-center gap-4 flex-wrap">
                {/* Marital Status */}
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Marital Status</label>
                  <div className="relative">
                    <select 
                      className="w-32 px-3 py-2 pr-8 border border-gray-300 rounded-md focus:ring-humsafar-500 focus:border-humsafar-500 appearance-none bg-white text-sm"
                      value={selectedMaritalStatus}
                      onChange={(e) => setSelectedMaritalStatus(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="never_married">Never Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="single">Single</option>
                      <option value="widowed">Widowed</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Gender */}
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Gender</label>
                  <div className="relative">
                    <select 
                      className="w-24 px-3 py-2 pr-8 border border-gray-300 rounded-md focus:ring-humsafar-500 focus:border-humsafar-500 appearance-none bg-white text-sm"
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                
                
                {/* Age Range */}
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Age Range</label>
                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <select 
                        className="w-20 px-2 py-2 pr-7 border border-gray-300 rounded-md focus:ring-humsafar-500 focus:border-humsafar-500 text-sm appearance-none bg-white"
                        value={selectedAgeFrom}
                        onChange={(e) => setSelectedAgeFrom(e.target.value)}
                      >
                        <option>From</option>
                        <option>18</option>
                        <option>20</option>
                        <option>25</option>
                        <option>30</option>
                        <option>35</option>
                        <option>40</option>
                        <option>45</option>
                        <option>50</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-500 text-xs">to</span>
                    <div className="relative">
                      <select 
                        className="w-20 px-2 py-2 pr-7 border border-gray-300 rounded-md focus:ring-humsafar-500 focus:border-humsafar-500 text-sm appearance-none bg-white"
                        value={selectedAgeTo}
                        onChange={(e) => setSelectedAgeTo(e.target.value)}
                      >
                        <option>To</option>
                        <option>25</option>
                        <option>30</option>
                        <option>35</option>
                        <option>40</option>
                        <option>45</option>
                        <option>50</option>
                        <option>60</option>
                        <option>65</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                </div>
              </div>
              
              {/* Right side - Toggles and View Controls */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Verified Toggle */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-humsafar-600">Verified</span>
                  <Switch 
                    checked={verifiedOnly}
                    onCheckedChange={setVerifiedOnly}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-humsafar-500 data-[state=checked]:to-humsafar-700 data-[state=unchecked]:bg-humsafar-200 transition-all duration-300"
                  />
                </div>
                
                {/* Viewed Toggle */}
                {currentUser && userViewStats && userViewStats.views_limit > 0 && (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-humsafar-600">Viewed</span>
                    <Switch 
                      checked={showViewedOnly}
                      onCheckedChange={setShowViewedOnly}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-humsafar-500 data-[state=checked]:to-humsafar-700 data-[state=unchecked]:bg-humsafar-200 transition-all duration-300"
                    />
                  </div>
                )}
                
                {/* Grid/List View Toggle */}
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center gap-1 px-3 py-1 text-xs transition-all duration-200 ${
                      viewMode === "grid" 
                        ? "bg-humsafar-600 hover:bg-humsafar-700 text-white shadow-sm" 
                        : "text-gray-600 hover:bg-white hover:text-humsafar-600"
                    }`}
                  >
                    <Grid className="w-3 h-3" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1 px-3 py-1 text-xs transition-all duration-200 ${
                      viewMode === "list" 
                        ? "bg-humsafar-600 hover:bg-humsafar-700 text-white shadow-sm" 
                        : "text-gray-600 hover:bg-white hover:text-humsafar-600"
                    }`}
                  >
                    <List className="w-3 h-3" />
                    List
                  </Button>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Profile Visibility Stats */}
        {currentUser && userViewStats && userViewStats.views_limit > 0 && (
          <div className="bg-humsafar-600 rounded-lg p-4 mb-6 shadow-sm border border-humsafar-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 text-white">Your Subscription: {userViewStats.subscription_status}</h3>
                <p className="text-sm text-humsafar-100 flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Views used: <span className="font-bold">{userViewStats.views_this_month}/{userViewStats.views_limit}</span> this month
                </p>
              </div>
              <span className="text-sm font-medium text-white">
                {userViewStats.remaining_views} views remaining
              </span>
            </div>
            
            {/* Payment Pending Message */}
            {userViewStats.subscription_status.includes('Payment Pending') && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-yellow-100 font-medium text-sm">Payment Approval Required</p>
                    <p className="text-yellow-200 text-xs mt-1">
                      Your payment is pending admin approval. You cannot view profiles until your payment is approved. 
                      Your {userViewStats.views_limit} views will be available once approved.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Count Display */}
        <div className="mb-6 flex justify-between items-center">
          <div className="bg-white rounded-lg shadow-sm border border-humsafar-100 px-4 py-2 inline-block">
            <span className="text-humsafar-700 font-medium text-sm">
              Showing <span className="text-humsafar-600 font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredProfiles.length)}</span> of <span className="text-humsafar-600 font-semibold">{filteredProfiles.length}</span> profiles
            </span>
          </div>
          {currentUser && userViewStats && userViewStats.views_limit > 0 && <ViewedProfilesCart />}
        </div>


        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-4">
              <div className="w-12 h-12 border-4 border-humsafar-100 border-t-humsafar-600 rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Loading Profiles</h3>
              <p className="text-sm text-gray-500">Please wait...</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && currentProfiles.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No profiles found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}

        {/* Mobile-only Carousel */}
        {!loading && currentProfiles.length > 0 && (
          <div className="md:hidden">
            <Carousel opts={{ align: 'start', loop: false }}>
              <CarouselContent>
                {currentProfiles.map((profile) => (
                  <CarouselItem key={profile.user_id || profile.id} className="basis-[85%]">
                    <ProfileCard profile={profile} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}

        {/* Desktop/tablet Grid */}
        {!loading && currentProfiles.length > 0 && (
          <div className={`hidden md:grid gap-6 ${
            viewMode === "grid" 
              ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "md:grid-cols-1"
          }`}>
            {currentProfiles.map((profile) => (
              <ProfileCard key={profile.user_id || profile.id} profile={profile} />
            ))}
          </div>
        )}

        {/* Pagination */}
         {!loading && filteredProfiles.length > 0 && totalPages > 1 && (
           <div className="flex justify-center mt-12 mb-8">
             <div className="bg-white rounded-xl shadow-lg border border-humsafar-100 p-4">
               <Pagination>
                 <PaginationContent className="gap-2">
                   <PaginationItem>
                     <PaginationPrevious 
                       onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                       className={`
                         ${currentPage === 1 
                           ? "pointer-events-none opacity-50 bg-gray-100 text-gray-400" 
                           : "cursor-pointer bg-humsafar-50 hover:bg-humsafar-100 text-humsafar-700 hover:text-humsafar-800 border-humsafar-200"
                         }
                         rounded-lg px-4 py-2 transition-all duration-200 font-medium
                       `}
                     />
                   </PaginationItem>
                   
                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                     // Show first page, last page, current page, and pages around current page
                     if (
                       page === 1 ||
                       page === totalPages ||
                       (page >= currentPage - 1 && page <= currentPage + 1)
                     ) {
                       return (
                         <PaginationItem key={page}>
                           <PaginationLink
                             onClick={() => handlePageChange(page)}
                             isActive={currentPage === page}
                             className={`
                               cursor-pointer rounded-lg px-4 py-2 transition-all duration-200 font-medium
                               ${currentPage === page
                                 ? "bg-humsafar-600 text-white shadow-md hover:bg-humsafar-700"
                                 : "bg-humsafar-50 hover:bg-humsafar-100 text-humsafar-700 hover:text-humsafar-800 border-humsafar-200"
                               }
                             `}
                           >
                             {page}
                           </PaginationLink>
                         </PaginationItem>
                       )
                     } else if (
                       page === currentPage - 2 ||
                       page === currentPage + 2
                     ) {
                       return (
                         <PaginationItem key={page}>
                           <PaginationEllipsis className="text-humsafar-400" />
                         </PaginationItem>
                       )
                     }
                     return null
                   })}
                   
                   <PaginationItem>
                     <PaginationNext 
                       onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                       className={`
                         ${currentPage === totalPages 
                           ? "pointer-events-none opacity-50 bg-gray-100 text-gray-400" 
                           : "cursor-pointer bg-humsafar-50 hover:bg-humsafar-100 text-humsafar-700 hover:text-humsafar-800 border-humsafar-200"
                         }
                         rounded-lg px-4 py-2 transition-all duration-200 font-medium
                       `}
                     />
                   </PaginationItem>
                 </PaginationContent>
               </Pagination>
             </div>
           </div>
         )}

        {/* Total Profiles Count */}
        {!loading && filteredProfiles.length > 0 && (
          <div className="flex justify-center mt-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-humsafar-100 px-6 py-3">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-medium text-humsafar-700">{filteredProfiles.length}</span> total profiles found
              </p>
            </div>
          </div>
        )}

      </div>
      
      <Footer />
      
      <AlertDialog open={showNoPackageDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Active Package</AlertDialogTitle>
            <AlertDialogDescription>
              Choose a package to view full profiles..
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid md:grid-cols-3 gap-3 mt-2">
            <div className="border rounded-lg p-3">
              <div className="font-semibold">Basic</div>
              <div className="text-xs text-gray-600">10 profile views • Lifetime</div>
              <Button className="w-full mt-2 bg-humsafar-600 hover:bg-humsafar-700 text-white" onClick={() => router.push('/packages/payment?package=basic')}>Buy Basic</Button>
            </div>
            <div className="border rounded-lg p-3">
              <div className="font-semibold">Standard</div>
              <div className="text-xs text-gray-600">20 profile views • Lifetime</div>
              <Button className="w-full mt-2 bg-humsafar-600 hover:bg-humsafar-700 text-white" onClick={() => router.push('/packages/payment?package=standard')}>Buy Standard</Button>
            </div>
            <div className="border rounded-lg p-3">
              <div className="font-semibold">Premium</div>
              <div className="text-xs text-gray-600">30 profile views • Lifetime</div>
              <Button className="w-full mt-2 bg-humsafar-600 hover:bg-humsafar-700 text-white" onClick={() => router.push('/packages/payment?package=premium')}>Buy Premium</Button>
            </div>
          </div>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowNoPackageDialog(false)}>Stay Here</Button>
            <AlertDialogAction onClick={() => router.push('/packages')}>View All Packages</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
  )
}


