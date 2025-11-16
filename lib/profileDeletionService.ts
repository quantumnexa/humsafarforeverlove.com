import { supabase } from './supabaseClient'
import { createClient } from '@supabase/supabase-js'

// Create a service role client for admin operations (storage deletion)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export interface DeletionResult {
  success: boolean
  message: string
  deletedData: {
    profile: boolean
    subscription: boolean
    images: number
    profileViews: boolean
    authentication: boolean
    storage: boolean
  }
  errors?: string[]
}

export interface DeletionPreview {
  userId: string
  dataToDelete: {
    profile: number
    subscription: number
    images: number
    profileViewsAsViewer: number
    profileViewsAsViewed: number
    authentication: number
  }
  warning: string
}

export class ProfileDeletionService {
  
  /**
   * Get a preview of what data would be deleted for a user
   */
  static async getDeletePreview(userId: string): Promise<DeletionPreview> {
    try {
      // Get counts of data that would be deleted
      const [profileCount, subscriptionCount, imagesCount, viewsAsViewerCount, viewsAsViewedCount] = await Promise.all([
        supabase.from('user_profiles').select('user_id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_subscriptions').select('user_id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_images').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('profile_views').select('id', { count: 'exact' }).eq('viewer_user_id', userId),
        supabase.from('profile_views').select('id', { count: 'exact' }).eq('viewed_profile_user_id', userId)
      ])

      return {
        userId,
        dataToDelete: {
          profile: profileCount.count || 0,
          subscription: subscriptionCount.count || 0,
          images: imagesCount.count || 0,
          profileViewsAsViewer: viewsAsViewerCount.count || 0,
          profileViewsAsViewed: viewsAsViewedCount.count || 0,
          authentication: 1
        },
        warning: 'This action is irreversible. All data will be permanently deleted.'
      }
    } catch (error) {
      console.error('Error getting deletion preview:', error)
      throw new Error('Failed to preview deletion data')
    }
  }

  /**
   * Delete all user images from Supabase storage
   */
  static async deleteUserImagesFromStorage(userImages: { image_url: string }[]): Promise<{ success: boolean, deletedCount: number, errors: string[] }> {
    const errors: string[] = []
    let deletedCount = 0

    if (!userImages || userImages.length === 0) {
      return { success: true, deletedCount: 0, errors: [] }
    }

    try {
      // Filter out placeholder images and external URLs
      const imagePaths = userImages
        .map(img => img.image_url)
        .filter(url => url && url !== '/placeholder.jpg' && !url.startsWith('http'))

      if (imagePaths.length === 0) {
        return { success: true, deletedCount: 0, errors: [] }
      }

      // Delete images from storage in batches (Supabase has limits)
      const batchSize = 50
      for (let i = 0; i < imagePaths.length; i += batchSize) {
        const batch = imagePaths.slice(i, i + batchSize)
        
        const { error: storageDeleteError } = await supabaseAdmin.storage
          .from('humsafar-user-images')
          .remove(batch)

        if (storageDeleteError) {
          console.error(`Error deleting batch ${i}-${i + batch.length}:`, storageDeleteError)
          errors.push(`Failed to delete images batch ${i}-${i + batch.length}: ${storageDeleteError.message}`)
        } else {
          deletedCount += batch.length
        }
      }

      return {
        success: errors.length === 0,
        deletedCount,
        errors
      }

    } catch (error) {
      console.error('Unexpected error during storage cleanup:', error)
      errors.push(`Unexpected storage cleanup error: ${error}`)
      return { success: false, deletedCount, errors }
    }
  }

  /**
   * Complete user profile deletion including all related data and storage
   */
  static async deleteCompleteProfile(userId: string, reason?: string): Promise<DeletionResult> {
    const errors: string[] = []
    let deletedImageCount = 0
    let storageCleanupSuccess = false

    try {
      console.log(`Starting complete profile deletion for user: ${userId}`)

      // Step 1: Get all user images before deletion for storage cleanup
      const { data: userImages, error: imagesError } = await supabase
        .from('user_images')
        .select('image_url')
        .eq('user_id', userId)

      if (imagesError) {
        console.error('Error fetching user images:', imagesError)
        errors.push(`Failed to fetch user images: ${imagesError.message}`)
      }

      // Step 2: Delete from user_images table
      const { error: deleteImagesError } = await supabase
        .from('user_images')
        .delete()
        .eq('user_id', userId)

      if (deleteImagesError) {
        console.error('Error deleting user images records:', deleteImagesError)
        errors.push(`Failed to delete user images records: ${deleteImagesError.message}`)
      }

      // Step 3: Delete from user_subscriptions table
      const { error: deleteSubscriptionError } = await supabase
        .from('user_subscriptions')
        .delete()
        .eq('user_id', userId)

      if (deleteSubscriptionError) {
        console.error('Error deleting user subscription:', deleteSubscriptionError)
        errors.push(`Failed to delete user subscription: ${deleteSubscriptionError.message}`)
      }

      // Step 4: Delete from profile_views table (both as viewer and viewed)
      const { error: deleteViewsAsViewerError } = await supabase
        .from('profile_views')
        .delete()
        .eq('viewer_user_id', userId)

      const { error: deleteViewsAsViewedError } = await supabase
        .from('profile_views')
        .delete()
        .eq('viewed_profile_user_id', userId)

      if (deleteViewsAsViewerError) {
        console.error('Error deleting profile views as viewer:', deleteViewsAsViewerError)
        errors.push(`Failed to delete profile views as viewer: ${deleteViewsAsViewerError.message}`)
      }

      if (deleteViewsAsViewedError) {
        console.error('Error deleting profile views as viewed:', deleteViewsAsViewedError)
        errors.push(`Failed to delete profile views as viewed: ${deleteViewsAsViewedError.message}`)
      }

      // Step 5: Delete from user_profiles table
      const { error: deleteProfileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId)

      if (deleteProfileError) {
        console.error('Error deleting user profile:', deleteProfileError)
        errors.push(`Failed to delete user profile: ${deleteProfileError.message}`)
      }

      // Step 6: Delete images from storage
      if (userImages && userImages.length > 0) {
        const storageResult = await this.deleteUserImagesFromStorage(userImages)
        deletedImageCount = storageResult.deletedCount
        storageCleanupSuccess = storageResult.success
        
        if (!storageResult.success) {
          errors.push(...storageResult.errors)
        }
      } else {
        storageCleanupSuccess = true // No images to delete
      }

      // Step 7: Delete user from Supabase Auth (this should be last)
      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId)

      if (deleteAuthError) {
        console.error('Error deleting user from auth:', deleteAuthError)
        errors.push(`Failed to delete user authentication: ${deleteAuthError.message}`)
      }

      // Log the deletion for audit purposes
      console.log(`Profile deletion completed for user: ${userId}`, {
        reason: reason || 'No reason provided',
        timestamp: new Date().toISOString(),
        deletedImages: deletedImageCount,
        errors: errors.length,
        success: errors.length === 0
      })

      const success = errors.length === 0

      return {
        success,
        message: success 
          ? 'Profile and all associated data have been permanently deleted'
          : 'Profile deletion completed with some errors',
        deletedData: {
          profile: !deleteProfileError,
          subscription: !deleteSubscriptionError,
          images: deletedImageCount,
          profileViews: !deleteViewsAsViewerError && !deleteViewsAsViewedError,
          authentication: !deleteAuthError,
          storage: storageCleanupSuccess
        },
        errors: errors.length > 0 ? errors : undefined
      }

    } catch (error) {
      console.error('Unexpected error during profile deletion:', error)
      return {
        success: false,
        message: 'An unexpected error occurred during deletion',
        deletedData: {
          profile: false,
          subscription: false,
          images: deletedImageCount,
          profileViews: false,
          authentication: false,
          storage: storageCleanupSuccess
        },
        errors: [`Unexpected error: ${error}`]
      }
    }
  }

  /**
   * Soft delete - mark profile as terminated instead of permanent deletion
   */
  static async softDeleteProfile(userId: string, reason?: string): Promise<{ success: boolean, message: string }> {
    try {
      // Update subscription status to terminated
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({ 
          profile_status: 'terminated',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error soft deleting profile:', updateError)
        return {
          success: false,
          message: `Failed to terminate profile: ${updateError.message}`
        }
      }

      console.log(`Profile soft deleted (terminated) for user: ${userId}`, {
        reason: reason || 'No reason provided',
        timestamp: new Date().toISOString()
      })

      return {
        success: true,
        message: 'Profile has been terminated successfully'
      }

    } catch (error) {
      console.error('Unexpected error during soft deletion:', error)
      return {
        success: false,
        message: 'An unexpected error occurred during profile termination'
      }
    }
  }
}