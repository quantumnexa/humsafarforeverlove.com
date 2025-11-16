import { supabase } from './supabaseClient'

export interface ProfileFilterOptions {
  currentUserId?: string | null
  excludeCurrentUser?: boolean
  maxProfiles?: number
  isFeaturedSection?: boolean
}

export interface FilteredProfilesResult {
  profiles: any[]
  totalAvailable: number
}

export class ProfileFilterService {
  /**
   * Get filtered profiles based on the requirements:
   * 1. Only show profiles whose status is "approved" in user_subscription table
   * 2. In featured profiles section, exclude logged-in user's own profile
   */
  static async getFilteredProfiles(options: ProfileFilterOptions): Promise<FilteredProfilesResult> {
    const {
      currentUserId,
      excludeCurrentUser = true,
      maxProfiles,
      isFeaturedSection = false
    } = options

    try {
      // Step 1: Get all approved user IDs from user_subscriptions
      const { data: approvedSubscriptions, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('user_id')
        .eq('profile_status', 'approved')

      if (subscriptionError) {
        // Error fetching approved subscriptions
        return {
          profiles: [],
          totalAvailable: 0
        }
      }

      if (!approvedSubscriptions || approvedSubscriptions.length === 0) {
        // No approved subscriptions found
        return {
          profiles: [],
          totalAvailable: 0
        }
      }

      let approvedUserIds = approvedSubscriptions.map(sub => sub.user_id)
      
      // Step 2: Exclude current user if required (especially for featured section)
      if (excludeCurrentUser && currentUserId && (isFeaturedSection || true)) {
        approvedUserIds = approvedUserIds.filter(id => id !== currentUserId)
        // Excluded current user from results
      }

      if (approvedUserIds.length === 0) {
        return {
          profiles: [],
          totalAvailable: 0
        }
      }

      // Step 3: Determine how many profiles to fetch
      let profilesToFetch = approvedUserIds.length
      if (maxProfiles) {
        profilesToFetch = Math.min(maxProfiles, profilesToFetch)
      }

      // Step 4: Fetch profiles for approved users
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
        .in('user_id', approvedUserIds)
        .order('created_at', { ascending: false })
        .limit(profilesToFetch)

      if (profilesError) {
        // Error fetching profiles
        return {
          profiles: [],
          totalAvailable: 0
        }
      }

      if (!profilesData || profilesData.length === 0) {
        return {
          profiles: [],
          totalAvailable: 0
        }
      }

      // Step 5: Enhance profiles with images and additional data
      const enhancedProfiles = await this.enhanceProfilesWithImages(profilesData)

      // Step 6: Calculate completion percentage and sort
      const profilesWithCompletion = enhancedProfiles.map(profile => ({
        ...profile,
        completionPercentage: this.calculateProfileCompletion(profile)
      }))

      // Sort: in featured sections, prioritize verified badges first, then completion
      if (isFeaturedSection) {
        profilesWithCompletion.sort((a, b) => {
          const vA = a.verified_badge ? 1 : 0
          const vB = b.verified_badge ? 1 : 0
          if (vB !== vA) return vB - vA
          return b.completionPercentage - a.completionPercentage
        })
      } else {
        // Default: sort by completion percentage (highest first)
        profilesWithCompletion.sort((a, b) => b.completionPercentage - a.completionPercentage)
      }

      // Re-sort to prioritize Boost Profile on general listings (non-featured)
      if (!isFeaturedSection) {
        profilesWithCompletion.sort((a, b) => {
          const boostA = a.boost_profile ? 1 : 0
          const boostB = b.boost_profile ? 1 : 0
          if (boostB !== boostA) return boostB - boostA
          return b.completionPercentage - a.completionPercentage
        })
      }

      return {
        profiles: profilesWithCompletion,
        totalAvailable: approvedUserIds.length
      }

    } catch (error) {
      // Error in getFilteredProfiles
      return {
        profiles: [],
        totalAvailable: 0
      }
    }
  }



  /**
   * Enhance profiles with images and verified badge info
   */
  private static async enhanceProfilesWithImages(profiles: any[]): Promise<any[]> {
    return Promise.all(
      profiles.map(async (profile) => {
        let mainImage = '/placeholder.jpg'
        let verified_badge = false
        let boost_profile = false

        try {
          // Get main image
          const { data: images } = await supabase
            .from('user_images')
            .select('image_url, is_main')
            .eq('user_id', profile.user_id)
            .order('is_main', { ascending: false })
            .limit(1)

          if (images && images.length > 0) {
            mainImage = images[0].image_url
          }

          // Check for verified badge and boost flag
          const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('verified_badge, boost_profile')
            .eq('user_id', profile.user_id)
            .single()

          if (subscription) {
            if (subscription.verified_badge) verified_badge = subscription.verified_badge
            if (subscription.boost_profile) boost_profile = Boolean(subscription.boost_profile)
          }
        } catch (error) {
          // Error enhancing profile
        }

        return {
          ...profile,
          id: profile.user_id,
          mainImage,
          has_photos: mainImage !== '/placeholder.jpg',
          verified_badge,
          boost_profile
        }
      })
    )
  }

  /**
   * Calculate profile completion percentage
   */
  private static calculateProfileCompletion(profile: any): number {
    const fields = [
      'first_name', 'last_name', 'age', 'gender', 'city', 'religion',
      'sect', 'caste', 'mother_tongue', 'marital_status', 'nationality',
      'ethnicity', 'education', 'field_of_study'
    ]
    
    const filledFields = fields.filter(field => 
      profile[field] && profile[field].toString().trim() !== ''
    ).length
    
    const basePercentage = (filledFields / fields.length) * 80 // 80% for basic fields
    const photoBonus = profile.has_photos ? 20 : 0 // 20% for having photos
    
    return Math.min(100, basePercentage + photoBonus)
  }



  /**
   * Get approved user IDs only (utility function)
   */
  static async getApprovedUserIds(excludeUserId?: string): Promise<string[]> {
    try {
      const { data: approvedSubscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('user_id')
        .eq('profile_status', 'approved')

      if (error || !approvedSubscriptions) {
        // ProfileFilterService: Error fetching approved user IDs
        return []
      }

      let userIds = approvedSubscriptions.map(sub => sub.user_id)
      
      if (excludeUserId) {
        userIds = userIds.filter(id => id !== excludeUserId)
      }

      return userIds
    } catch (error) {
      // ProfileFilterService: Error in getApprovedUserIds
      return []
    }
  }
}