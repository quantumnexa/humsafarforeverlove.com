import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

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

// Admin profile creation endpoint
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

    // Get profile data from request body
    const profileData = await request.json();

    // Validate required fields
    if (!profileData.first_name || !profileData.email) {
      return NextResponse.json(
        { error: 'First name and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', profileData.email)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Generate random password for authentication
    const randomPassword = `Pass${Math.random().toString(36).substring(2, 15)}!123`;

    // Create and auto-confirm user via Service Role (no confirmation email sent)
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: profileData.email,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        first_name: profileData.first_name,
        middle_name: profileData.middle_name,
        last_name: profileData.last_name,
        phone: profileData.phone,
        gender: profileData.gender,
        date_of_birth: profileData.date_of_birth,
        age: profileData.age,
        city: profileData.city,
      },
    });

    if (createError) {
      return NextResponse.json(
        { error: `Failed to create user: ${createError.message}` },
        { status: 500 }
      );
    }

    if (!authData.user?.id) {
      return NextResponse.json(
        { error: 'Failed to get user ID from auth' },
        { status: 500 }
      );
    }

    // Prepare profile data with all fields from the database structure
    const profileToInsert = {
      user_id: authData.user!.id, // Use the actual user ID from auth
      first_name: profileData.first_name || null,
      middle_name: profileData.middle_name || null,
      last_name: profileData.last_name || null,
      email: profileData.email || null,
      phone: profileData.phone || null,
      date_of_birth: profileData.date_of_birth || null,
      age: profileData.age || null,
      gender: profileData.gender || null,
      city: profileData.city || null,
      country: profileData.country || null,
      religion: profileData.religion || null,
      sect: profileData.sect || null,
      caste: profileData.caste || null,
      mother_tongue: profileData.mother_tongue || null,
      marital_status: profileData.marital_status || null,
      nationality: profileData.nationality || null,
      ethnicity: profileData.ethnicity || null,
      height: profileData.height || null,
      weight: profileData.weight || null,
      body_type: profileData.body_type || null,
      complexion: profileData.complexion || null,
      eye_color: profileData.eye_color || null,
      hair_color: profileData.hair_color || null,
      wear_hijab: profileData.wear_hijab === 'not_applicable' ? null : (profileData.wear_hijab === 'yes' ? true : profileData.wear_hijab === 'no' ? false : null),
      state: profileData.state || null,
      area: profileData.area || null,
      diet: profileData.diet || null,
      drink: profileData.drink === 'yes' ? true : profileData.drink === 'no' ? false : null,
      smoke: profileData.smoke === 'yes' ? true : profileData.smoke === 'no' ? false : null,
      living_situation: profileData.living_situation || null,
      religious_values: profileData.religious_values || null,
      read_quran: profileData.read_quran || null,
      hafiz_quran: profileData.hafiz_quran === 'yes' ? true : profileData.hafiz_quran === 'no' ? false : null,
      polygamy: profileData.polygamy === 'yes' ? true : profileData.polygamy === 'no' ? false : null,
      education: profileData.education || null,
      field_of_study: profileData.field_of_study || null,
      custom_field_of_study: profileData.custom_field_of_study || null,
      college: profileData.college || null,
      working_with: profileData.working_with || null,
      annual_income: profileData.annual_income || null,
      occupation: profileData.occupation || null,
      father_occupation: profileData.father_occupation || null,
      mother_occupation: profileData.mother_occupation || null,
      brothers: profileData.brothers || null,
      brothers_married: profileData.brothers_married || null,
      sisters: profileData.sisters || null,
      sisters_married: profileData.sisters_married || null,
      family_values: profileData.family_values || null,
      have_children: profileData.have_children === 'yes' ? true : profileData.have_children === 'no' ? false : null,
      want_children: profileData.want_children === 'yes' ? true : profileData.want_children === 'no' ? false : null,
      house_ownership: profileData.house_ownership || null,
      house_owner: profileData.house_owner || null,
      partner_age_from: profileData.partner_age_from || null,
      partner_age_to: profileData.partner_age_to || null,
      partner_height_from: profileData.partner_height_from || null,
      partner_height_to: profileData.partner_height_to || null,
      partner_education: profileData.partner_education || null,
      partner_occupation: profileData.partner_occupation || null,
      partner_income: profileData.partner_income || null,
      partner_location: profileData.partner_location || null,
      partner_religion: profileData.partner_religion || null,
      partner_sect: profileData.partner_sect || null,
      partner_marital_status: profileData.partner_marital_status || null,
      partner_have_children: profileData.partner_have_children === 'yes' ? true : profileData.partner_have_children === 'no' ? false : null,
      partner_religious_values: profileData.partner_religious_values || null,
      partner_wear_hijab: profileData.partner_wear_hijab === 'not_applicable' ? null : (profileData.partner_wear_hijab === 'yes' ? true : profileData.partner_wear_hijab === 'no' ? false : null),
      partner_polygamy: profileData.partner_polygamy === 'yes' ? true : profileData.partner_polygamy === 'no' ? false : null,
      about: profileData.about || null,
      looking_for: profileData.looking_for || null,
      hobbies: profileData.hobbies ? profileData.hobbies.split(',').map((hobby: string) => hobby.trim()) : null,
      additional_info: profileData.additional_info || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert profile into user_profiles table
    const { data: insertedProfile, error: profileError } = await supabase
      .from('user_profiles')
      .insert([profileToInsert])
      .select()
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to create profile', details: profileError.message },
        { status: 500 }
      );
    }

    // Create subscription entry with default values
    const subscriptionData = {
      user_id: authData.user!.id, // Use the actual user ID from auth
      subscription_status: 'free', // Always set to free
      profile_status: 'approved', // Always set to approved
      views_limit: 0, // Always set to 0
      verified_badge: false, // Always set to false
      boost_profile: false, // Always set to false
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert([subscriptionData]);

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      // If subscription creation fails, we should clean up the profile and user
      await supabase.from('user_profiles').delete().eq('user_id', authData.user!.id);
      return NextResponse.json(
        { error: 'Failed to create subscription', details: subscriptionError.message },
        { status: 500 }
      );
    }

    // Handle image uploads if provided
    if (profileData.images && Array.isArray(profileData.images) && profileData.images.length > 0) {
      const imageInserts = profileData.images.map((imageUrl: string, index: number) => ({
        user_id: authData.user!.id, // Use the actual user ID from auth
        image_url: imageUrl,
        is_main: index === 0, // First image is main
        uploaded_at: new Date().toISOString(),
      }));

      const { error: imageError } = await supabaseAdmin
        .from('user_images')
        .insert(imageInserts);

      if (imageError) {
        console.error('Error uploading images:', imageError);
        // Note: We don't fail the entire operation if images fail
        // The profile is still created successfully
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      data: {
        user_id: authData.user!.id, // Use the actual user ID from auth
        profile: insertedProfile,
        auth_credentials: {
          email: profileData.email,
          password: randomPassword,
          note: 'User auto-confirmed via admin; no email confirmation required.'
        }
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