export interface HumsafarProfile {
  user_id: string // Primary key
  first_name: string | null
  middle_name?: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  date_of_birth: string | null
  gender: string | null
  city: string | null
  country: string | null
  age?: number | null
  education?: string | null
  occupation?: string | null
  marital_status?: string | null
  religion?: string | null
  sect?: string | null
  height?: string | null
  working_as?: string | null
  annual_income?: string | null
  employment_status?: string | null
  brothers?: number | null
  brothers_married?: number | null
  sisters?: number | null
  sisters_married?: number | null
  family_type?: string | null
  family_values?: string | null
  partner_age_from?: number | null
  partner_age_to?: number | null
  partner_education?: string | null
  partner_religion?: string | null
  partner_location?: string | null
  partner_marital_status?: string | null
  looking_for?: string | null
  about?: string | null
  hobbies?: string | null
  created_at: string
  updated_at: string
  image_url?: string
  profile_status?: string // Added from user_subscriptions table
}

export interface PromoCode {
  id: string
  code: string
  discount_percentage: number
  max_uses: number
  current_uses: number
  valid_from: string
  valid_until: string
  is_active: boolean
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  status: string
  payment_method: string
  created_at: string
  refunded_at?: string
}

export interface Matchmaker {
  id: string
  user_id: string
  name: string
  email: string
  phone: string
  is_active: boolean
  assigned_profiles: number
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  reported_profile_id: string
  reason: string
  status: string
  created_at: string
  resolved_at?: string
}

export interface AnalyticsData {
  totalUsers: number
  totalRevenue: number
  conversionRate: number
  activeProfiles: number
  monthlyGrowth: number
  topCities: Array<{ city: string; count: number }>
  monthlyStats: Array<{ month: string; users: number; revenue: number }>
}

