import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

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
);

// Admin image upload endpoint for profiles
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Admin Image Upload API Called');
    
    // Get admin authorization from headers
    const adminAuth = request.headers.get('admin-auth');
    if (!adminAuth) {
      console.log('❌ No admin auth header found');
      return NextResponse.json(
        { error: 'Admin authorization required' },
        { status: 401 }
      );
    }

    // Verify admin session
    let adminSession;
    try {
      adminSession = JSON.parse(adminAuth);
      console.log('✅ Admin session parsed:', { id: adminSession.id, email: adminSession.email });
      if (!adminSession.id || !adminSession.email) {
        throw new Error('Invalid admin session');
      }
    } catch (error) {
      console.log('❌ Invalid admin auth:', error);
      return NextResponse.json(
        { error: 'Invalid admin authorization' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const isMain = formData.get('isMain') === 'true';

    console.log('📋 Form data received:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      userId,
      isMain
    });

    if (!file || !userId) {
      console.log('❌ Missing file or userId');
      return NextResponse.json(
        { error: 'File and userId are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log('❌ File too large:', file.size);
      return NextResponse.json(
        { error: 'File size too large. Maximum 5MB allowed' },
        { status: 400 }
      );
    }

    // Check if user exists
    console.log('🔍 Checking if user exists:', userId);
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (userError || !userProfile) {
      console.log('❌ User not found:', userError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    console.log('✅ User found');

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${userId}/${fileName}`;

    console.log('📁 File path generated:', filePath);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    console.log('🔄 Starting upload to Supabase Storage...');
    
    // Upload to Supabase Storage using admin client
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('humsafar-user-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image', details: uploadError.message },
        { status: 500 }
      );
    }

    console.log('✅ Upload successful:', uploadData);

    // Get public URL using admin client
    const { data: urlData } = supabaseAdmin.storage
      .from('humsafar-user-images')
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // If this is set as main image, update existing main images to false
    if (isMain) {
      await supabaseAdmin
        .from('user_images')
        .update({ is_main: false })
        .eq('user_id', userId);
    }

    // Insert image record into database using admin client to bypass RLS
    const { data: imageRecord, error: dbError } = await supabaseAdmin
      .from('user_images')
      .insert([
        {
          user_id: userId,
          image_url: imageUrl,
          is_main: isMain,
          uploaded_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Clean up uploaded file if database insert fails using admin client
      await supabaseAdmin.storage
        .from('humsafar-user-images')
        .remove([filePath]);
      
      return NextResponse.json(
        { error: 'Failed to save image record', details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        id: imageRecord.id,
        image_url: imageUrl,
        is_main: isMain,
        uploaded_at: imageRecord.uploaded_at,
      },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get images for a user
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    // Get user images
    const { data: images, error: imagesError } = await supabase
      .from('user_images')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: true });

    if (imagesError) {
      return NextResponse.json(
        { error: 'Failed to fetch images', details: imagesError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: images || [],
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete an image
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

    const { imageId } = await request.json();

    if (!imageId) {
      return NextResponse.json(
        { error: 'imageId is required' },
        { status: 400 }
      );
    }

    // Get image record
    const { data: imageRecord, error: fetchError } = await supabase
      .from('user_images')
      .select('*')
      .eq('id', imageId)
      .single();

    if (fetchError || !imageRecord) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Extract file path from URL
    const urlParts = imageRecord.image_url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${imageRecord.user_id}/${fileName}`;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('humsafar-user-images')
      .remove([filePath]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('user_images')
      .delete()
      .eq('id', imageId);

    if (dbError) {
      return NextResponse.json(
        { error: 'Failed to delete image record', details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}