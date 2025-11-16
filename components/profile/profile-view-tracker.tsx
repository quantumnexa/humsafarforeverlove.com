'use client'

import { useEffect } from 'react'
import { ProfileViewService } from '@/lib/profileViewService'
import { supabase } from '@/lib/supabaseClient'

interface ProfileViewTrackerProps {
  profileUserId: string
}

export default function ProfileViewTracker({ profileUserId }: ProfileViewTrackerProps) {
  useEffect(() => {
    const recordView = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          return
        }

        // Don't track if user is viewing their own profile
        if (user.id === profileUserId) {
          return
        }

        // Record the profile view
        const result = await ProfileViewService.recordProfileView(profileUserId)
        
        if (result.success) {
          // Profile view recorded successfully
        } else {
          // Failed to record profile view
        }
      } catch (error) {
        // Error recording profile view
      }
    }

    recordView()
  }, [profileUserId])

  // This component doesn't render anything visible
  return null
}