import { supabase } from './supabaseClient'

export interface Package {
  id: string
  name: string
  description?: string
  price: number
  duration_months: number
  is_popular: boolean
  features: string[]
  color_scheme: string
  priority: number
  created_at: string
  updated_at: string
}

export interface AddonService {
  id: string
  addon_key: string
  name: string
  description: string
  price: number
  duration_type: 'hours' | 'days' | 'months' | 'lifetime' | 'included'
  duration_value: number
  icon: string
  included_in_packages: string[]
  features: string[]
  color_scheme: string
  priority: number
  created_at: string
  updated_at: string
}

export class PackageService {
  // Get all active packages
  static async getAllPackages(): Promise<Package[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true })
        .order('price', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      // Error fetching packages
      return []
    }
  }

  // Get package by key
  static async getPackageByKey(packageKey: string): Promise<Package | null> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', packageKey)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      // Error fetching package
      return null
    }
  }

  // Get popular packages
  static async getPopularPackages(): Promise<Package[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .eq('is_popular', true)
        .order('priority', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      // Error fetching popular packages
      return []
    }
  }

  // Get all active add-on services
  static async getAllAddons(): Promise<AddonService[]> {
    try {
      const { data, error } = await supabase
        .from('addon_services')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true })
        .order('price', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      // Error fetching add-ons
      return []
    }
  }

  // Get add-on by key
  static async getAddonByKey(addonKey: string): Promise<AddonService | null> {
    try {
      const { data, error } = await supabase
        .from('addon_services')
        .select('*')
        .eq('addon_key', addonKey)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      // Error fetching add-on
      return null
    }
  }

  // Get add-ons included in a specific package
  static async getAddonsForPackage(packageKey: string): Promise<AddonService[]> {
    try {
      const { data, error } = await supabase
        .from('addon_services')
        .select('*')
        .eq('is_active', true)
        .contains('included_in_packages', [packageKey])
        .order('priority', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      // Error fetching package add-ons
      return []
    }
  }

  // Get available add-ons for a user (not included in their package)
  static async getAvailableAddonsForUser(packageKey: string): Promise<AddonService[]> {
    try {
      const { data, error } = await supabase
        .from('addon_services')
        .select('*')
        .eq('is_active', true)
        .not('included_in_packages', 'cs', [packageKey])
        .order('priority', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      // Error fetching available add-ons
      return []
    }
  }

  // Get package comparison data
  static async getPackageComparison(): Promise<Package[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      // Error fetching package comparison
      return []
    }
  }

  // Get add-on pricing summary
  static async getAddonPricingSummary(): Promise<{
    totalAddons: number
    totalPrice: number
    addonsByDuration: Record<string, AddonService[]>
  }> {
    try {
      const addons = await this.getAllAddons()
      
      const totalPrice = addons.reduce((sum, addon) => sum + addon.price, 0)
      
      const addonsByDuration = addons.reduce((acc, addon) => {
        const duration = addon.duration_type
        if (!acc[duration]) acc[duration] = []
        acc[duration].push(addon)
        return acc
      }, {} as Record<string, AddonService[]>)

      return {
        totalAddons: addons.length,
        totalPrice,
        addonsByDuration
      }
    } catch (error) {
      // Error calculating addon pricing
      return {
        totalAddons: 0,
        totalPrice: 0,
        addonsByDuration: {}
      }
    }
  }

  // Get package recommendations based on user needs
  static async getPackageRecommendations(
    needsContacts: boolean,
    budget: number
  ): Promise<Package[]> {
    try {
      let query = supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)

      // Filter by budget
      if (budget > 0) {
        query = query.lte('price', budget)
      }

      const { data, error } = await query
        .order('price', { ascending: true })
        .order('priority', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      // Error getting package recommendations
      return []
    }
  }

  // Get featured packages (popular + best value)
  static async getFeaturedPackages(): Promise<Package[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .or('is_popular.eq.true,priority.lt.3')
        .order('priority', { ascending: true })
        .limit(3)

      if (error) throw error
      return data || []
    } catch (error) {
      // Error fetching featured packages
      return []
    }
  }

  // Get add-on bundles (combinations that work well together)
  static async getAddonBundles(): Promise<{
    name: string
    addons: AddonService[]
    totalPrice: number
    savings: number
    description: string
  }[]> {
    try {
      const addons = await this.getAllAddons()
      
      // Define some logical bundles
      const bundles = [
        {
          name: 'Visibility Boost',
          addonKeys: ['spotlight_profile', 'boost_profile'],
          description: 'Maximum profile visibility and reach'
        },
        {
          name: 'Trust & Privacy',
          addonKeys: ['verified_badge', 'privacy_shield'],
          description: 'Build trust while maintaining privacy'
        },
        {
          name: 'Premium Experience',
          addonKeys: ['spotlight_profile', 'verified_badge', 'privacy_shield'],
          description: 'Complete premium profile enhancement'
        }
      ]

      return bundles.map(bundle => {
        const bundleAddons = addons.filter(addon => 
          bundle.addonKeys.includes(addon.addon_key)
        )
        
        const totalPrice = bundleAddons.reduce((sum, addon) => sum + addon.price, 0)
        const savings = totalPrice * 0.1 // 10% bundle discount

        return {
          name: bundle.name,
          addons: bundleAddons,
          totalPrice: totalPrice - savings,
          savings,
          description: bundle.description
        }
      })
    } catch (error) {
      // Error creating addon bundles
      return []
    }
  }
}