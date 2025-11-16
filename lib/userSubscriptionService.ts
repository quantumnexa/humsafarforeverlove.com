import { supabase } from './supabaseClient'

export interface UserSubscription {
  id: string
  user_id: string
  subscription_status: string
  profile_status: string
  views_limit?: number
  created_at: string
  updated_at: string
  verified_badge?: boolean
  boost_profile?: boolean
  ss_url?: string
  payment_status?: string
  rejection_reason?: string
}

export interface PackageDetails {
  name: string
  price: number
  duration_months: number
  features: string[]
  limits: {
    contacts: number
  }
}

export interface AddonService {
  id: string
  name: string
  description: string
  price: number
  duration: string
  icon: string
}

// Package definitions based on your packages page
export const PACKAGES: Record<string, PackageDetails> = {
  free: {
    name: 'Free Membership',
    price: 0,
    duration_months: 0,
    features: [
      'Create profile',
      'Upload photos',
      'View limited matches',
      'Express interest (limited)',
      'Receive matches from premium users',
      'Basic search filters',
      'Mobile app access'
    ],
    limits: { contacts: 0 }
  },
  premium_lite: {
    name: 'Premium Lite',
    price: 5000,
    duration_months: 3,
    features: [
      '75 interests',
      '50 contacts access',
      'Chat access',
      'Advanced search filters',
      'Profile views tracking',
      'Priority customer support',
      'Mobile app premium features',
      'Read receipts'
    ],
    limits: { contacts: 50 }
  },
  premium_classic: {
    name: 'Premium Classic',
    price: 8000,
    duration_months: 6,
    features: [
      '150 interests',
      '100 contacts access',
      'Priority listing',
      'Advanced matching algorithm',
      'Unlimited chat',
      'Profile analytics',
      'Dedicated support',
      'Video call feature',
      'Profile boost (monthly)'
    ],
    limits: { contacts: 100 }
  },
  premium_plus: {
    name: 'Premium Plus',
    price: 13000,
    duration_months: 12,
    features: [
      '300 interests',
      '200 contacts access',
      'Spotlight profile',
      'Priority listing',
      'Advanced analytics',
      'Personalized matchmaker support',
      'Exclusive events access',
      'Profile verification',
      'Background check assistance',
      'Unlimited everything'
    ],
    limits: { contacts: 200 }
  },
  humsafar_select: {
    name: 'humsafar Select',
    price: 50000,
    duration_months: 0, // Custom duration
    features: [
      'Personalized human matchmaker',
      'Hand-picked profiles',
      'Background checks included',
      'Private search',
      'Exclusive member events',
      'Personal consultation sessions',
      'Family meeting coordination',
      'Wedding planning assistance',
      'Lifetime support',
      'Custom package creation'
    ],
    limits: { contacts: 999999 }
  }
}

// Add-on services based on your packages page
export const ADDON_SERVICES: AddonService[] = [
  {
    id: 'spotlight_profile',
    name: 'Spotlight Profile',
    description: 'Top search result placement for maximum visibility',
    price: 1500,
    duration: '7 days',
    icon: '🔦'
  },
  {
    id: 'boost_profile',
    name: 'Boost Profile',
    description: 'Increased visibility and profile views',
    price: 1000,
    duration: '1 month',
    icon: '🚀'
  },
  {
    id: 'verified_badge',
    name: 'Verified Badge',
    description: 'Blue checkmark for profile authenticity',
    price: 1000,
    duration: 'Lifetime',
    icon: '✅'
  },
  {
    id: 'privacy_shield',
    name: 'Privacy Shield',
    description: 'Enhanced privacy controls and anonymous browsing',
    price: 300,
    duration: 'Monthly',
    icon: '🛡️'
  },
  {
    id: 'direct_connect',
    name: 'Direct Connect',
    description: 'Message without expressing interest first',
    price: 0,
    duration: 'Included in Premium+',
    icon: '💬'
  }
]

export class UserSubscriptionService {
  // Get current user's subscription
  static async getCurrentUserSubscription(): Promise<UserSubscription | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No subscription found, create default free subscription
          return await this.createDefaultSubscription(user.id)
        }
        throw error
      }

      return data
    } catch (error) {
      // Error getting user subscription
      return null
    }
  }

  // Create default free subscription for new users
  static async createDefaultSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      // Creating default subscription for user
      
      // Simplest possible approach - only include absolutely required fields
      const minimalData = {
        user_id: userId,
        subscription_status: 'free',
        profile_status: 'pending',
        views_limit: 0
      }
      
      // Using minimal subscription data
      
      // First attempt - direct SQL query
      try {
        // Attempting direct SQL query
        const { data: sqlData, error: sqlError } = await supabase
          .from('user_subscriptions')
          .insert(minimalData)
          .select()
          .single()
        
        if (sqlError) {
          // SQL insert failed
          throw sqlError
        }
        
        // Successfully created subscription with SQL insert
        return sqlData
      } catch (sqlError) {
        // Error with SQL insert
        
        // Second attempt - try with delay to ensure user is fully created
        try {
          // Attempting insert with delay
          // Wait for 2 seconds to ensure user is fully created in the database
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const { data: delayData, error: delayError } = await supabase
            .from('user_subscriptions')
            .insert(minimalData)
            .select()
            .single()
            
          if (delayError) {
            // Delayed insert failed
            throw delayError
          }
          
          // Successfully created subscription with delayed insert
          return delayData
        } catch (delayError) {
          // Error with delayed insert
          
          // Third attempt - try with upsert instead of insert
          try {
            // Attempting upsert operation
            const { data: upsertData, error: upsertError } = await supabase
              .from('user_subscriptions')
              .upsert(minimalData)
              .select()
              .single()
              
            if (upsertError) {
              // Upsert failed
              throw upsertError
            }
            
            // Successfully created subscription with upsert
            return upsertData
          } catch (upsertError) {
            // All insertion attempts failed
            
            // Create a dummy object to return so the signup process can continue
            // Returning dummy subscription object to allow signup to continue
            return {
              id: 'dummy-' + Date.now(),
              user_id: userId,
              subscription_status: 'free',
              profile_status: 'pending',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as UserSubscription
          }
        }
      }
    } catch (error) {
      // Unexpected error in createDefaultSubscription
      
      // Return a dummy object as last resort to allow signup to continue
      return {
        id: 'dummy-' + Date.now(),
        user_id: userId,
        subscription_status: 'free',
        profile_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserSubscription
    }
  }

  // Upgrade user subscription
  static async upgradeSubscription(
    packageType: keyof typeof PACKAGES,
    addons: string[] = []
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      const packageDetails = PACKAGES[packageType]
      if (!packageDetails) return false

      // Calculate addon costs
      const addonCosts = addons.map(addonId => {
        const addon = ADDON_SERVICES.find(a => a.id === addonId)
        return addon ? addon.price : 0
      }).reduce((sum, cost) => sum + cost, 0)

      const totalPrice = packageDetails.price + addonCosts

      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          subscription_status: packageType,
          views_limit: 0
        })

      if (error) throw error
      return true
    } catch (error) {
      // Error upgrading subscription
      throw error
    }
  }

  // Add addon to current subscription
  static async addAddon(addonId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      const addon = ADDON_SERVICES.find(a => a.id === addonId)
      if (!addon) return false

      // Get current subscription
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('subscription_status')
        .eq('user_id', user.id)
        .single()

      if (!subscription) return false

      // Update subscription: set boolean flags for known addons and reflect status suffix
      const updatePayload: Record<string, any> = {
        subscription_status: `${subscription.subscription_status}_with_${addonId}`,
        updated_at: new Date().toISOString()
      }

      if (addonId === 'verified_badge') {
        updatePayload.verified_badge = true
      }
      if (addonId === 'boost_profile') {
        updatePayload.boost_profile = true
      }

      const { error } = await supabase
        .from('user_subscriptions')
        .update(updatePayload)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (error) {
      // Error adding addon
      throw error
    }
  }



  // Check if user can view contact details
  static async canViewContacts(): Promise<boolean> {
    try {
      const subscription = await this.getCurrentUserSubscription()
      if (!subscription) return false

      return subscription.subscription_status !== 'free'
    } catch (error) {
      // Error checking contact access
      return false
    }
  }

  // Get subscription status for display
  static async getSubscriptionStatus(): Promise<{
    status: string
    package: string
    canViewContacts: boolean
    remainingContacts: number
  }> {
    try {
      const subscription = await this.getCurrentUserSubscription()
      if (!subscription) {
        return {
          status: 'No subscription',
          package: 'None',
          canViewContacts: false,
          remainingContacts: 0
        }
      }

      return {
        status: subscription.subscription_status,
        package: subscription.subscription_status,
        canViewContacts: subscription.subscription_status !== 'free',
        remainingContacts: subscription.views_limit || 0
      }
    } catch (error) {
      // Error getting subscription status
      return {
        status: 'Error',
        package: 'Unknown',
        canViewContacts: false,
        remainingContacts: 0
      }
    }
  }
}