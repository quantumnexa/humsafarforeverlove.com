"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ShoppingCart,
  Eye,
  Heart,
  Users,
  MapPin,
  GraduationCap,
  User,
  Calendar,
  X,
  History
} from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { ProfileViewService } from "@/lib/profileViewService"
import ProtectedImage from "@/components/ui/protected-image"

const capitalizeText = (text: string | null | undefined): string => {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

interface ViewedProfile {
  id: string
  viewer_user_id: string
  viewed_profile_user_id: string
  viewed_at: string
  profile?: any
}

export default function ViewedProfilesCart() {
  const [viewedProfiles, setViewedProfiles] = useState<ViewedProfile[]>([])
  const [profilesWithDetails, setProfilesWithDetails] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    getCurrentUser()
    fetchViewedProfiles()
    // Debug: Check if we have any user profiles in database
    checkDatabaseData()
  }, [])

  const checkDatabaseData = async () => {
    try {
      // Check current user first
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      // Check user_profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, first_name, last_name, city, education')
        .limit(5)
      
      // Check profile_views table
      const { data: views, error: viewsError } = await supabase
        .from('profile_views')
        .select('*')
        .limit(5)
      
      // Check user_subscriptions table
      const { data: subscriptions, error: subsError } = await supabase
        .from('user_subscriptions')
        .select('user_id, subscription_status, views_limit')
        .limit(5)
      
    } catch (error) {
      // Error checking database data
    }
  }

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    } catch (error) {
      // Error getting current user
    }
  }

  const fetchViewedProfiles = async () => {
    if (!currentUser) return
    
    try {
      setLoading(true)
      
      // Get viewed profiles from our service
      const result = await ProfileViewService.getViewedProfilesThisMonth()
      // Viewed profiles result
      
      if (result.success && result.data) {
        setViewedProfiles(result.data)
        
        // Get the user IDs of viewed profiles
        const viewedUserIds = result.data.map(view => view.viewed_profile_user_id)
        
        if (viewedUserIds.length === 0) {
          setProfilesWithDetails([])
          return
        }
        
        // Use the same approach as normal profile cards - fetch from user_profiles with proper selection
         const { data: profilesData, error: profilesError } = await supabase
           .from('user_profiles')
           .select(`
             user_id,
             first_name,
             middle_name,
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
           .in('user_id', viewedUserIds)
        
        if (profilesError) {
          setProfilesWithDetails([])
          return
        }
        
        // Enhance profiles with images (same as normal profile cards)
        const enhancedProfiles = await Promise.all(
          (profilesData || []).map(async (profile) => {
            try {
              // Get main image for each profile
              const { data: images } = await supabase
                .from('user_images')
                .select('image_url, is_main')
                .eq('user_id', profile.user_id)
                .order('is_main', { ascending: false })
                .limit(1)
              
              const mainImage = images && images.length > 0 ? images[0].image_url : '/placeholder.jpg'
              
              // Find the corresponding view record to get viewed_at timestamp
              const viewRecord = result.data?.find(view => view.viewed_profile_user_id === profile.user_id)
              
              return {
                ...viewRecord,
                profile: {
                  ...profile,
                  mainImage
                }
              }
            } catch (error) {
              const viewRecord = result.data?.find(view => view.viewed_profile_user_id === profile.user_id)
              return {
                ...viewRecord,
                profile: {
                  ...profile,
                  mainImage: '/placeholder.jpg'
                }
              }
            }
          })
        )
        
        setProfilesWithDetails(enhancedProfiles.filter(p => p.profile))
      }
    } catch (error) {
      // Error fetching viewed profiles
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCart = () => {
    setIsOpen(true)
    fetchViewedProfiles()
  }

  const ProfileCard = ({ viewedProfile }: { viewedProfile: any }) => {
    const profile = viewedProfile.profile
    if (!profile) return null

    // Build full name
    let name = 'Unnamed'
    if (profile.first_name || profile.middle_name || profile.last_name) {
      const nameParts = [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean)
      name = nameParts.map((part: string) => capitalizeText(part)).join(' ')
    }

    // Education info
    let edu = 'Education not specified'
    if (profile.education && profile.field_of_study) {
      edu = `${capitalizeText(profile.education)} in ${capitalizeText(profile.field_of_study)}`
    } else if (profile.education) {
      edu = capitalizeText(profile.education)
    }

    const city = capitalizeText(profile.city || 'Location not specified')
    const viewedDate = new Date(viewedProfile.viewed_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-humsafar-100 group">
        <div className="flex">
          {/* Profile Image */}
          <div className="relative w-24 h-24 flex-shrink-0">
            {profile.mainImage && profile.mainImage !== '/placeholder.jpg' ? (
              <ProtectedImage
                src={profile.mainImage}
                alt={name}
                width={96}
                height={96}
                className="w-full h-full object-cover rounded-full border-2 border-humsafar-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder.jpg'
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-humsafar-100 to-humsafar-200 flex items-center justify-center rounded-full border-2 border-humsafar-200">
                <User className="w-8 h-8 text-humsafar-400" />
              </div>
            )}
            {profile.verified && (
              <Badge className="absolute -top-1 -right-1 bg-green-600 text-xs px-1 py-0 rounded-full">✓</Badge>
            )}
          </div>
          
          {/* Profile Info */}
          <CardContent className="p-3 flex-1">
            {/* User ID Display */}
            <div className="text-center mb-3">
              <span className="inline-block bg-humsafar-100 text-humsafar-800 px-4 py-2 rounded-full text-lg font-bold">
                {(profile.user_id || profile.id)?.toString().substring(0, 8).toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-1 mb-2 text-gray-600 text-xs">
              {profile.age && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-humsafar-500" />
                  <span className="text-gray-700 text-xs font-medium">Age:</span>
                  <span className="text-gray-600 text-xs">{profile.age} years</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-humsafar-500" />
                <span className="text-gray-700 text-xs font-medium">Location:</span>
                <span className="text-gray-600 text-xs">{city}</span>
              </div>
              <div className="flex items-start gap-1">
                <GraduationCap className="w-3 h-3 text-humsafar-500 mt-0.5" />
                <div className="flex-1">
                  <span className="text-gray-700 text-xs font-medium">Education:</span>
                  <span className="text-gray-600 text-xs ml-1">{edu}</span>
                </div>
              </div>
              {profile.religion && (
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-humsafar-500" />
                  <span className="text-gray-700 text-xs font-medium">Religion:</span>
                  <span className="text-gray-600 text-xs">{capitalizeText(profile.religion)}</span>
                </div>
              )}
              {profile.marital_status && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-humsafar-500" />
                  <span className="text-gray-700 text-xs font-medium">Status:</span>
                  <span className="text-gray-600 text-xs">{capitalizeText(profile.marital_status)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-humsafar-500" />
                <span className="text-gray-700 text-xs font-medium">Viewed:</span>
                <span className="text-gray-500 text-xs">{viewedDate}</span>
              </div>
            </div>

            <Link href={`/profile/${profile.user_id}`}>
              <Button size="sm" className="w-full bg-humsafar-600 hover:bg-humsafar-700 text-white text-xs py-1">
                View Again
              </Button>
            </Link>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleOpenCart}
          variant="outline"
          className="relative bg-humsafar-600 hover:bg-humsafar-700 border-humsafar-600 hover:border-humsafar-700"
        >
          <History className="w-4 h-4 mr-2 text-white" />
          <span className="text-white">Viewed Profiles</span>
          {viewedProfiles.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-humsafar-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {viewedProfiles.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-humsafar-700">
            <History className="w-5 h-5" />
            Your Viewed Profiles This Month
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-humsafar-100 border-t-humsafar-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading your viewed profiles...</p>
            </div>
          ) : profilesWithDetails.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No profiles viewed yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start browsing profiles to see them here
              </p>
              <Button 
                onClick={() => setIsOpen(false)}
                className="bg-humsafar-600 hover:bg-humsafar-700 text-white"
              >
                Browse Profiles
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                  You have viewed {profilesWithDetails.length} profile{profilesWithDetails.length !== 1 ? 's' : ''} this month
                </p>
              </div>
              
              {profilesWithDetails.map((viewedProfile) => (
                <ProfileCard key={viewedProfile.id} viewedProfile={viewedProfile} />
              ))}
            </div>
          )}
        </ScrollArea>
        
        {!loading && profilesWithDetails.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Total viewed this month: {profilesWithDetails.length}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-humsafar-600 border-humsafar-200 hover:bg-humsafar-50"
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { ViewedProfilesCart }