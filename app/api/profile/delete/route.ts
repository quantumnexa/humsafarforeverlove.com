import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { createClient } from '@supabase/supabase-js'

// Create a service role client for admin operations
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

export async function DELETE(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]

    // Verify the user's session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    const userId = user.id

    // Get request body to check for confirmation
    const body = await request.json()
    const { confirmDeletion, reason } = body

    if (!confirmDeletion) {
      return NextResponse.json(
        { error: 'Deletion confirmation required' },
        { status: 400 }
      )
    }

    // Start the deletion process
    console.log(`Starting complete profile deletion for user: ${userId}`)

    // Step 1: Get all user images before deletion for storage cleanup
    const { data: userImages, error: imagesError } = await supabase
      .from('user_images')
      .select('image_url')
      .eq('user_id', userId)

    if (imagesError) {
      console.error('Error fetching user images:', imagesError)
    }

    // Step 2: Delete from user_images table
    const { error: deleteImagesError } = await supabase
      .from('user_images')
      .delete()
      .eq('user_id', userId)

    if (deleteImagesError) {
      console.error('Error deleting user images records:', deleteImagesError)
      return NextResponse.json(
        { error: 'Failed to delete user images records' },
        { status: 500 }
      )
    }

    // Step 3: Delete from user_subscriptions table
    const { error: deleteSubscriptionError } = await supabase
      .from('user_subscriptions')
      .delete()
      .eq('user_id', userId)

    if (deleteSubscriptionError) {
      console.error('Error deleting user subscription:', deleteSubscriptionError)
      return NextResponse.json(
        { error: 'Failed to delete user subscription' },
        { status: 500 }
      )
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

    if (deleteViewsAsViewerError || deleteViewsAsViewedError) {
      console.error('Error deleting profile views:', { deleteViewsAsViewerError, deleteViewsAsViewedError })
    }

    // Step 5: Delete from user_profiles table
    const { error: deleteProfileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId)

    if (deleteProfileError) {
      console.error('Error deleting user profile:', deleteProfileError)
      return NextResponse.json(
        { error: 'Failed to delete user profile' },
        { status: 500 }
      )
    }

    // Step 6: Delete images from storage
    if (userImages && userImages.length > 0) {
      const imagePaths = userImages
        .map(img => img.image_url)
        .filter(url => url && url !== '/placeholder.jpg' && !url.startsWith('http'))

      if (imagePaths.length > 0) {
        const { error: storageDeleteError } = await supabaseAdmin.storage
          .from('humsafar-user-images')
          .remove(imagePaths)

        if (storageDeleteError) {
          console.error('Error deleting images from storage:', storageDeleteError)
          // Don't fail the entire operation if storage cleanup fails
        } else {
          console.log(`Deleted ${imagePaths.length} images from storage`)
        }
      }
    }

    // Step 7: Delete user from Supabase Auth (this should be last)
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteAuthError) {
      console.error('Error deleting user from auth:', deleteAuthError)
      return NextResponse.json(
        { error: 'Failed to delete user authentication' },
        { status: 500 }
      )
    }

    // Log the deletion for audit purposes
    console.log(`Successfully deleted complete profile for user: ${userId}`, {
      reason: reason || 'No reason provided',
      timestamp: new Date().toISOString(),
      deletedImages: userImages?.length || 0
    })

    return NextResponse.json({
      success: true,
      message: 'Profile and all associated data have been permanently deleted',
      deletedData: {
        profile: true,
        subscription: true,
        images: userImages?.length || 0,
        profileViews: true,
        authentication: true
      }
    })

  } catch (error) {
    console.error('Unexpected error during profile deletion:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during deletion' },
      { status: 500 }
    )
  }
}

// Optional: Add a GET endpoint to check what data would be deleted
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    const userId = user.id

    // Get counts of data that would be deleted
    const [profileCount, subscriptionCount, imagesCount, viewsAsViewerCount, viewsAsViewedCount] = await Promise.all([
      supabase.from('user_profiles').select('user_id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('user_subscriptions').select('user_id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('user_images').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('profile_views').select('id', { count: 'exact' }).eq('viewer_user_id', userId),
      supabase.from('profile_views').select('id', { count: 'exact' }).eq('viewed_profile_user_id', userId)
    ])

    return NextResponse.json({
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
    })

  } catch (error) {
    console.error('Error checking deletion preview:', error)
    return NextResponse.json(
      { error: 'Failed to preview deletion data' },
      { status: 500 }
    )
  }
}