import { supabase } from './supabaseClient'
import { ProfileFilterService } from './profileFilterService'

export interface ProfileVisibilityInfo {
  totalProfiles: number
  featuredProfiles: number
  userPackage: string | null
}

export class ProfileVisibilityService {
  // Get profiles based on user's login status and package
  static async getProfilesForUser(userId: string | null): Promise<any[]> {
    try {
      if (userId) {
        // Use ProfileFilterService for logged-in users
        const result = await ProfileFilterService.getFilteredProfiles({
          currentUserId: userId,
          excludeCurrentUser: true,
          isFeaturedSection: false
        })
        
        return result.profiles || []
      } else {
        // For anonymous users, return only featured profiles
        return await this.getFeaturedProfiles()
      }
    } catch (error) {
      // Error in getProfilesForUser
      // Fallback to featured profiles only
      return await this.getFeaturedProfiles()
    }
  }

  // Get only featured profiles (5 fixed profiles for all users)
  static async getFeaturedProfiles(): Promise<any[]> {
    try {
      // Use ProfileFilterService for featured profiles with approved status filtering
      const result = await ProfileFilterService.getFilteredProfiles({
        currentUserId: null, // No user context for anonymous featured profiles
        excludeCurrentUser: false, // No current user to exclude for anonymous
        maxProfiles: 5,
        isFeaturedSection: true
      })
      
      return result.profiles || []
    } catch (error) {
      // Error getting featured profiles
      return await this.getFallbackProfiles(5)
    }
  }

  // Get fallback profiles if featured system is not available
  static async getFallbackProfiles(limit: number): Promise<any[]> {
    try {
      // Use ProfileFilterService to get approved profiles only
      const result = await ProfileFilterService.getFilteredProfiles({
        currentUserId: null,
        excludeCurrentUser: false,
        maxProfiles: limit,
        isFeaturedSection: true
      })
      
      return result.profiles || []
    } catch (error) {
      // Error getting fallback profiles
      return []
    }
  }

  // Get user's profile visibility information
  static async getUserProfileVisibilityInfo(userId: string | null): Promise<ProfileVisibilityInfo> {
    try {
      let userPackage = null

      if (userId) {
        // Get user's subscription information
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('subscription_status')
          .eq('user_id', userId)
          .single()
        
        if (subscription) {
          userPackage = subscription.subscription_status
        }
      }

      // Get featured profiles count using ProfileFilterService
      const featuredResult = await ProfileFilterService.getFilteredProfiles({
        currentUserId: userId,
        excludeCurrentUser: userId ? true : false,
        maxProfiles: 5,
        isFeaturedSection: true
      })
      const featuredCount = featuredResult.profiles.length

      // Get total available profiles for the user
      const totalResult = await ProfileFilterService.getFilteredProfiles({
        currentUserId: userId,
        excludeCurrentUser: true,
        isFeaturedSection: false
      })

      const totalProfiles = totalResult.totalAvailable

      return {
        totalProfiles,
        featuredProfiles: featuredCount,
        userPackage
      }
    } catch (error) {
      // Error getting profile visibility info
      return {
        totalProfiles: 0,
        featuredProfiles: 0,
        userPackage: null
      }
    }
  }






}
