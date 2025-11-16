import { supabase } from './supabaseClient';

export interface ProfileView {
  id: string;
  viewer_user_id: string;
  viewed_profile_user_id: string;
  viewed_at: string;
  created_at: string;
}

export interface UserViewStats {
  subscription_status: string;
  views_limit: number;
  views_this_month: number; // Note: This represents total views, not monthly
  remaining_views: number;
}

export class ProfileViewService {
  /**
   * Record a profile view for the current user
   * @param viewedProfileUserId - The ID of the profile being viewed
   * @returns Promise with success status and message
   */
  static async recordProfileView(viewedProfileUserId: string): Promise<{
    success: boolean;
    message: string;
    data?: ProfileView;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          message: 'User not authenticated'
        };
      }

      // Prevent users from viewing their own profile
      if (user.id === viewedProfileUserId) {
        return {
          success: false,
          message: 'Cannot view your own profile'
        };
      }

      // Check if user can view more profiles
      const canView = await this.canUserViewMoreProfiles(user.id);
      if (!canView.success || !canView.canView) {
        return {
          success: false,
          message: canView.message || 'View limit exceeded for this month'
        };
      }

      // Check if profile was already viewed
      const { data: existingView } = await supabase
        .from('profile_views')
        .select('id')
        .eq('viewer_user_id', user.id)
        .eq('viewed_profile_user_id', viewedProfileUserId)
        .single();

      if (existingView) {
        return {
          success: false,
          message: 'Profile already viewed'
        };
      }

      // Record the view
      const { data, error } = await supabase
        .from('profile_views')
        .insert({
          viewer_user_id: user.id,
          viewed_profile_user_id: viewedProfileUserId
        })
        .select()
        .single();

      if (error) {
        // Error recording profile view
        return {
          success: false,
          message: `Failed to record profile view: ${error.message || 'Unknown error'}`
        };
      }

      return {
        success: true,
        message: 'Profile view recorded successfully',
        data
      };
    } catch (error) {
      // Error in recordProfileView
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Check if user can view more profiles
   * @param userId - The user ID to check (optional, uses current user if not provided)
   * @returns Promise with can view status and remaining views
   */
  static async canUserViewMoreProfiles(userId?: string): Promise<{
    success: boolean;
    canView: boolean;
    remainingViews: number;
    message?: string;
  }> {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return {
            success: false,
            canView: false,
            remainingViews: 0,
            message: 'User not authenticated'
          };
        }
        targetUserId = user.id;
      }

      // First check if user has any pending payment reviews
      const { data: paymentReviewData, error: reviewError } = await supabase
        .from('payments')
        .select('payment_status, views_limit, rejection_reason')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // If there's a payment review, check its status
      if (paymentReviewData && !reviewError) {
        if (paymentReviewData.payment_status === 'pending') {
          return {
            success: false,
            canView: false,
            remainingViews: 0,
            message: 'Payment is pending. Please wait for admin review.'
          };
        }
        
        if (paymentReviewData.payment_status === 'under_review') {
          return {
            success: false,
            canView: false,
            remainingViews: 0,
            message: 'Payment is under review by admin. Please wait for approval.'
          };
        }
        
        if (paymentReviewData.payment_status === 'rejected') {
          return {
            success: false,
            canView: false,
            remainingViews: 0,
            message: `Payment was rejected. Reason: ${paymentReviewData.rejection_reason || 'No reason provided'}`
          };
        }
        
        // If payment is accepted, continue to check user_subscriptions
      }

      // Get user's subscription info (only request existing columns)
      const { data: subscriptionData, error: subError } = await supabase
        .from('user_subscriptions')
        .select('views_limit')
        .eq('user_id', targetUserId)
        .single();

      if (subError || !subscriptionData) {
        // Error getting user subscription
        return {
          success: false,
          canView: false,
          remainingViews: 0,
          message: 'No subscription found'
        };
      }

      // Payment pending/under_review/rejected are already blocked via payments table above

      // Get user's total views count
      const { count: totalViews, error: viewsError } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('viewer_user_id', targetUserId);

      if (viewsError) {
        // Error counting user views
        return {
          success: false,
          canView: false,
          remainingViews: 0,
          message: `Failed to count views: ${viewsError.message || 'Unknown error'}`
        };
      }

      const remainingViews = Math.max(0, (subscriptionData.views_limit || 0) - (totalViews || 0));
      
      return {
        success: true,
        canView: remainingViews > 0,
        remainingViews,
        message: remainingViews > 0 ? `${remainingViews} views remaining` : 'View limit reached'
      };
    } catch (error) {
      // Error in canUserViewMoreProfiles
      return {
        success: false,
        canView: false,
        remainingViews: 0,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Get user's view statistics
   * @param userId - The user ID to get stats for (optional, uses current user if not provided)
   * @returns Promise with user view statistics
   */
  static async getUserViewStats(userId?: string): Promise<{
    success: boolean;
    data?: UserViewStats;
    message?: string;
  }> {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return {
            success: false,
            message: 'User not authenticated'
          };
        }
        targetUserId = user.id;
      }

      // First check payment reviews for current status
      const { data: paymentReview, error: reviewError } = await supabase
        .from('payments')
        .select('payment_status, views_limit, rejection_reason')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get user subscription info
      const { data: subscription, error: subError } = await supabase
        .from('user_subscriptions')
        .select('subscription_status, views_limit')
        .eq('user_id', targetUserId)
        .single();

      if (subError || !subscription) {
        // If no subscription but there's a payment review, show review status
        if (paymentReview && !reviewError) {
          let displayStatus = 'Package Purchase';
          if (paymentReview.payment_status === 'pending') {
            displayStatus += ' (Payment Pending)';
          } else if (paymentReview.payment_status === 'under_review') {
            displayStatus += ' (Under Review)';
          } else if (paymentReview.payment_status === 'rejected') {
            displayStatus += ' (Payment Rejected)';
          }

          return {
            success: true,
            data: {
              subscription_status: displayStatus,
              views_limit: paymentReview.views_limit || 0,
              views_this_month: 0,
              remaining_views: 0
            }
          };
        }

        return {
          success: false,
          message: 'No subscription found for user'
        };
      }

      // Check if views_limit is set
      if (subscription.views_limit === null || subscription.views_limit === undefined) {
        return {
          success: false,
          message: 'Views limit not set for user subscription'
        };
      }

      // Get total views count
      const { count: totalViews, error: viewsError } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('viewer_user_id', targetUserId);

      if (viewsError) {
        // Error counting profile views
        return {
          success: false,
          message: `Failed to count profile views: ${viewsError.message || 'Unknown error'}`
        };
      }

      const viewsLimit = subscription.views_limit;
      const currentViews = totalViews || 0;
      const remainingViews = Math.max(0, viewsLimit - currentViews);

      // Add payment review info to subscription status display (if available)
      let displayStatus = subscription.subscription_status;
      if (paymentReview && !reviewError) {
        if (paymentReview.payment_status === 'pending') {
          displayStatus += ' (Payment Pending)';
        } else if (paymentReview.payment_status === 'under_review') {
          displayStatus += ' (Under Review)';
        } else if (paymentReview.payment_status === 'accepted') {
          displayStatus += ' (Active)';
        } else if (paymentReview.payment_status === 'rejected') {
          displayStatus += ' (Payment Rejected)';
        }
      }

      return {
        success: true,
        data: {
          subscription_status: displayStatus,
          views_limit: viewsLimit,
          views_this_month: currentViews,
          remaining_views: remainingViews
        }
      };
    } catch (error) {
      // Error in getUserViewStats
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Get all profiles viewed by user
   * @param userId - The user ID to get viewed profiles for (optional, uses current user if not provided)
   * @returns Promise with list of viewed profiles
   */
  static async getViewedProfilesThisMonth(userId?: string): Promise<{
    success: boolean;
    data?: ProfileView[];
    message?: string;
  }> {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return {
            success: false,
            message: 'User not authenticated'
          };
        }
        targetUserId = user.id;
      }

      const { data, error } = await supabase
        .from('profile_views')
        .select('*')
        .eq('viewer_user_id', targetUserId)
        .order('viewed_at', { ascending: false });

      if (error) {
        // Error fetching viewed profiles
        return {
          success: false,
          message: 'Failed to fetch viewed profiles'
        };
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      // Error in getViewedProfilesThisMonth
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Check if a specific profile has been viewed by the user
   * @param viewedProfileUserId - The ID of the profile to check
   * @param userId - The user ID to check for (optional, uses current user if not provided)
   * @returns Promise with viewed status
   */
  static async hasUserViewedProfile(viewedProfileUserId: string, userId?: string): Promise<{
    success: boolean;
    hasViewed: boolean;
    viewedAt?: string;
    message?: string;
  }> {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return {
            success: false,
            hasViewed: false,
            message: 'User not authenticated'
          };
        }
        targetUserId = user.id;
      }

      const { data, error } = await supabase
        .from('profile_views')
        .select('viewed_at')
        .eq('viewer_user_id', targetUserId)
        .eq('viewed_profile_user_id', viewedProfileUserId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        // Error checking if profile was viewed
        return {
          success: false,
          hasViewed: false,
          message: 'Failed to check view status'
        };
      }

      return {
        success: true,
        hasViewed: !!data,
        viewedAt: data?.viewed_at
      };
    } catch (error) {
      // Error in hasUserViewedProfile
      return {
        success: false,
        hasViewed: false,
        message: 'An unexpected error occurred'
      };
    }
  }
}

export default ProfileViewService;
