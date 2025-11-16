import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Admin profile deletion endpoint
export async function DELETE(request: NextRequest) {
  try {
    // Get admin authorization from headers
    const adminAuth = request.headers.get('admin-auth');
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Admin authorization required' },
        { status: 401 }
      );
    }

    // Verify admin session
    let adminSession;
    try {
      adminSession = JSON.parse(adminAuth);
      if (!adminSession.id || !adminSession.email) {
        throw new Error('Invalid admin session');
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid admin authorization' },
        { status: 401 }
      );
    }

    // Get user ID from request body
    const { userId, reason } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!reason || reason.trim().length < 10) {
      return NextResponse.json(
        { error: 'Deletion reason is required (minimum 10 characters)' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('user_id, email, first_name, last_name')
      .eq('user_id', userId)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Admin action logging removed as per user request

    // Start deletion process
    const deletionResults = {
      userProfile: false,
      userImages: false,
      userSubscriptions: false,
      userViews: false,
      userInteractions: false,
      storageImages: false
    };

    // 1. Delete user images from storage
    try {
      const { data: images } = await supabase
        .from('user_images')
        .select('image_url')
        .eq('user_id', userId);

      if (images && images.length > 0) {
        const imageUrls = images
          .map(img => img.image_url)
          .filter(url => url && !url.includes('placeholder'));

        for (const imageUrl of imageUrls) {
          try {
            const fileName = imageUrl.split('/').pop();
            if (fileName) {
              await supabase.storage
                .from('humsafar-user-images')
                .remove([fileName]);
            }
          } catch (error) {
            console.error(`Failed to delete image ${imageUrl}:`, error);
          }
        }
      }
      deletionResults.storageImages = true;
    } catch (error) {
      console.error('Error deleting storage images:', error);
    }

    // 2. Delete user images records
    try {
      const { error } = await supabase
        .from('user_images')
        .delete()
        .eq('user_id', userId);
      
      if (!error) deletionResults.userImages = true;
    } catch (error) {
      console.error('Error deleting user images:', error);
    }

    // 3. Delete user subscriptions
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .delete()
        .eq('user_id', userId);
      
      if (!error) deletionResults.userSubscriptions = true;
    } catch (error) {
      console.error('Error deleting user subscriptions:', error);
    }

    // 4. Delete user profile views
    try {
      const { error: viewerError } = await supabase
        .from('profile_views')
        .delete()
        .eq('viewer_id', userId);

      const { error: viewedError } = await supabase
        .from('profile_views')
        .delete()
        .eq('viewed_profile_id', userId);
      
      if (!viewerError && !viewedError) deletionResults.userViews = true;
    } catch (error) {
      console.error('Error deleting profile views:', error);
    }

    // 5. Delete user interactions (likes, matches, etc.)
    try {
      // Delete as sender
      const { error: senderError } = await supabase
        .from('user_interactions')
        .delete()
        .eq('sender_id', userId);

      // Delete as receiver
      const { error: receiverError } = await supabase
        .from('user_interactions')
        .delete()
        .eq('receiver_id', userId);
      
      if (!senderError && !receiverError) deletionResults.userInteractions = true;
    } catch (error) {
      console.error('Error deleting user interactions:', error);
    }

    // 6. Finally, delete user profile
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);
      
      if (!error) deletionResults.userProfile = true;
    } catch (error) {
      console.error('Error deleting user profile:', error);
    }

    // Calculate success rate
    const totalOperations = Object.keys(deletionResults).length;
    const successfulOperations = Object.values(deletionResults).filter(Boolean).length;
    const successRate = (successfulOperations / totalOperations) * 100;

    return NextResponse.json({
      success: successRate === 100,
      message: successRate === 100 
        ? 'Profile deleted successfully by admin'
        : `Profile partially deleted (${successRate.toFixed(1)}% success rate)`,
      deletionResults,
      successRate,
      adminAction: {
        performedBy: adminSession.email,
        targetUser: userProfile.email,
        reason: reason,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Admin profile deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error during profile deletion' },
      { status: 500 }
    );
  }
}

// Get deletion preview for admin
export async function POST(request: NextRequest) {
  try {
    // Get admin authorization from headers
    const adminAuth = request.headers.get('admin-auth');
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Admin authorization required' },
        { status: 401 }
      );
    }

    // Verify admin session
    let adminSession;
    try {
      adminSession = JSON.parse(adminAuth);
      if (!adminSession.id || !adminSession.email) {
        throw new Error('Invalid admin session');
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid admin authorization' },
        { status: 401 }
      );
    }

    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user profile info
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('user_id, email, first_name, last_name, created_at')
      .eq('user_id', userId)
      .single();

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Count data to be deleted
    const [
      { count: imagesCount },
      { count: subscriptionsCount },
      { count: viewsCount },
      { count: interactionsCount }
    ] = await Promise.all([
      supabase.from('user_images').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('profile_views').select('*', { count: 'exact', head: true }).or(`viewer_id.eq.${userId},viewed_profile_id.eq.${userId}`),
      supabase.from('user_interactions').select('*', { count: 'exact', head: true }).or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    ]);

    return NextResponse.json({
      userInfo: {
        name: `${userProfile.first_name} ${userProfile.last_name}`,
        email: userProfile.email,
        joinDate: userProfile.created_at
      },
      dataToDelete: {
        profileData: 1,
        images: imagesCount || 0,
        subscriptions: subscriptionsCount || 0,
        profileViews: viewsCount || 0,
        interactions: interactionsCount || 0
      },
      totalRecords: 1 + (imagesCount || 0) + (subscriptionsCount || 0) + (viewsCount || 0) + (interactionsCount || 0)
    });

  } catch (error) {
    console.error('Admin deletion preview error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}