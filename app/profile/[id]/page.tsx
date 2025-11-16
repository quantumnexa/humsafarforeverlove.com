"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, GraduationCap, Briefcase, ArrowLeft, User, Heart, Users, Settings, CheckCircle, Lock, Share2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import ProfileGallery from "@/components/profile/profile-gallery"
import ProfileViewTracker from "@/components/profile/profile-view-tracker"
import { supabase } from "@/lib/supabaseClient"

function capitalizeWords(input: string): string {
  return input
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return ""
  if (Array.isArray(value)) {
    const joined = value
      .filter((v) => v !== null && v !== undefined && String(v).trim() !== "")
      .map((v) => capitalizeWords(String(v)))
      .join(", ")
    return joined
  }
  const str = String(value).trim()
  if (!str) return ""
  return capitalizeWords(str)
}

// Format profile data for WhatsApp sharing
function formatProfileForWhatsApp(profile: any, images: any[]) {
  if (!profile) return "";
  
  // Get main image URL if available
  const mainImage = Array.isArray(images) && images.length > 0 
    ? images.find(img => img.is_main)?.image_url || images[0]?.image_url 
    : null;
  
  // Start with image if available - format for WhatsApp preview
  let message = "";
  if (mainImage) {
    // Ensure URL is absolute for WhatsApp preview
    const imageUrl = mainImage.startsWith('http') ? mainImage : `${window.location.origin}${mainImage.startsWith('/') ? '' : '/'}${mainImage}`;
    message += `${imageUrl}\n\n`;
  }
  
  // Personal Info Section
  message += "*Personal Information*\n";
  const name = profile.full_name || 
    [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(" ") || 
    profile.display_name || 
    profile.username || 
    "Unnamed";
  
  message += `*Name:* ${name}\n`;
  if (profile.age) message += `*Age:* ${profile.age}\n`;
  if (profile.gender) message += `*Gender:* ${profile.gender}\n`;
  if (profile.phone) message += `*Phone:* ${profile.phone}\n`;
  if (profile.email) message += `*Email:* ${profile.email}\n`;
  if (profile.date_of_birth) message += `*Date of Birth:* ${profile.date_of_birth}\n`;
  if (profile.marital_status) message += `*Marital Status:* ${profile.marital_status}\n`;
  if (profile.height) message += `*Height:* ${profile.height}\n`;
  if (profile.religion) message += `*Religion:* ${profile.religion}\n`;
  if (profile.sect) message += `*Sect:* ${profile.sect}\n`;
  if (profile.caste) message += `*Caste:* ${profile.caste}\n`;
  if (profile.mother_tongue) message += `*Mother Tongue:* ${profile.mother_tongue}\n`;
  if (profile.nationality) message += `*Nationality:* ${profile.nationality}\n`;
  if (profile.ethnicity) message += `*Ethnicity:* ${profile.ethnicity}\n`;
  
  // Location & Career
  message += "\n*Location & Career*\n";
  if (profile.city) message += `*City:* ${profile.city}\n`;
  if (profile.country) message += `*Country:* ${profile.country}\n`;
  if (profile.education) message += `*Education:* ${profile.education}\n`;
  if (profile.field_of_study) message += `*Field of Study:* ${profile.field_of_study}\n`;
  if (profile.profession || profile.working_as) message += `*Profession:* ${profile.profession || profile.working_as}\n`;
  if (profile.occupation) message += `*Occupation:* ${profile.occupation}\n`;
  if (profile.employment_status) message += `*Employment Status:* ${profile.employment_status}\n`;
  if (profile.annual_income) message += `*Annual Income:* ${profile.annual_income}\n`;
  
  // Family Information
  message += "\n*Family Information*\n";
  if (profile.brothers) message += `*Brothers:* ${profile.brothers}\n`;
  if (profile.brothers_married) message += `*Brothers Married:* ${profile.brothers_married}\n`;
  if (profile.sisters) message += `*Sisters:* ${profile.sisters}\n`;
  if (profile.sisters_married) message += `*Sisters Married:* ${profile.sisters_married}\n`;
  if (profile.family_type) message += `*Family Type:* ${profile.family_type}\n`;
  if (profile.family_values) message += `*Family Values:* ${profile.family_values}\n`;
  
  // Partner Preferences
  message += "\n*Partner Preferences*\n";
  if (profile.partner_age_from) message += `*Partner Age From:* ${profile.partner_age_from}\n`;
  if (profile.partner_age_to) message += `*Partner Age To:* ${profile.partner_age_to}\n`;
  if (profile.partner_education) message += `*Partner Education:* ${profile.partner_education}\n`;
  if (profile.partner_religion) message += `*Partner Religion:* ${profile.partner_religion}\n`;
  if (profile.partner_location) message += `*Partner Location:* ${profile.partner_location}\n`;
  if (profile.partner_marital_status) message += `*Partner Marital Status:* ${profile.partner_marital_status}\n`;
  
  // Bio/About & Interests
  message += "\n*About & Interests*\n";
  if (profile.bio || profile.about) message += `*About:* ${profile.bio || profile.about}\n`;
  if (profile.looking_for) message += `*Looking For:* ${profile.looking_for}\n`;
  if (profile.hobbies) message += `*Hobbies:* ${profile.hobbies}\n`;
  if (profile.additional_info) message += `*Additional Info:* ${profile.additional_info}\n`;
  
  // Profile ID
  message += "\n*Profile ID:* " + (profile.user_id || profile.id || "").toString().substring(0, 8).toUpperCase();
  
  return message;
}

// Handle WhatsApp sharing
function handleWhatsAppShare(profile: any, images: any[]) {
  const formattedText = formatProfileForWhatsApp(profile, images);
  const encodedText = encodeURIComponent(formattedText);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
}

function DetailsGrid({ data, fields }: { data: any; fields: Array<{ label: string; key: string }> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 text-sm">
      {fields.map(({ label, key }) => {
        const formatted = formatValue(data?.[key])
        if (!formatted) return null
        return (
          <div key={key}>
            <span className="text-gray-500">{label}:</span> <span className="font-medium">{formatted}</span>
          </div>
        )
      })}
    </div>
  )
}

function HobbiesDisplay({ hobbies }: { hobbies: string }) {
  if (!hobbies) return null

  // Function to get emoji for each hobby
  const getHobbyEmoji = (hobby: string): string => {
    const hobbyLower = hobby.toLowerCase()
    if (hobbyLower.includes('art') || hobbyLower.includes('design')) return '🎨'
    if (hobbyLower.includes('technology') || hobbyLower.includes('tech')) return '🤖'
    if (hobbyLower.includes('reading')) return '📚'
    if (hobbyLower.includes('cooking')) return '👨‍🍳'
    if (hobbyLower.includes('travel')) return '✈️'
    if (hobbyLower.includes('sports')) return '⚽'
    if (hobbyLower.includes('music')) return '🎵'
    if (hobbyLower.includes('gardening')) return '🌱'
    if (hobbyLower.includes('movies')) return '🎬'
    if (hobbyLower.includes('shopping')) return '🛍️'
    if (hobbyLower.includes('dancing')) return '💃'
    if (hobbyLower.includes('badminton')) return '🏸'
    if (hobbyLower.includes('camping')) return '⛺'
    if (hobbyLower.includes('coding')) return '💻'
    if (hobbyLower.includes('cricket')) return '🏏'
    if (hobbyLower.includes('hiking')) return '🥾'
    if (hobbyLower.includes('junk food')) return '🍔'
    if (hobbyLower.includes('soccer') || hobbyLower.includes('football')) return '⚽'
    if (hobbyLower.includes('friends')) return '🤝'
    if (hobbyLower.includes('tv') || hobbyLower.includes('television')) return '📺'
    return '🎯' // default emoji
  }

  // Parse hobbies - they might be comma-separated or in an array
  let hobbyList: string[] = []
  if (Array.isArray(hobbies)) {
    hobbyList = hobbies
  } else if (typeof hobbies === 'string') {
    // Handle different separators
    hobbyList = hobbies
      .split(/[,&]/)
      .map(h => h.trim())
      .filter(h => h.length > 0)
  }

  if (hobbyList.length === 0) return null

  return (
    <div className="space-y-3">
      <span className="text-gray-500 text-sm">Hobbies:</span>
      <div className="flex flex-wrap gap-2">
        {hobbyList.map((hobby, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-humsafar-300 hover:bg-humsafar-50 transition-colors"
          >
            <span className="text-base">{getHobbyEmoji(hobby)}</span>
            <span>{hobby.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CareerDisplay({ data }: { data: any }) {

  // Get career information
  const careerInfo = [
    { key: 'education', label: 'Education' },
    { key: 'field_of_study', label: 'Field of Study' },
    { key: 'custom_field_of_study', label: 'Custom Field' },
    { key: 'college', label: 'College' },
    { key: 'working_with', label: 'Employment Type' },
    { key: 'annual_income', label: 'Annual Income' },
    { key: 'occupation', label: 'Occupation' },
  ]

  // Filter out empty values and create tags
  const careerTags = careerInfo
    .map(({ key, label }) => {
      const value = data?.[key]
      if (!value || String(value).trim() === '') return null
      
      return {
        key,
        label: formatValue(value),
        originalLabel: label
      }
    })
    .filter((tag): tag is NonNullable<typeof tag> => tag !== null)

  if (careerTags.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Education and Career</h3>
              <div className="flex flex-wrap gap-3">
                     {careerTags.map((tag) => (
             <div
               key={tag.key}
               className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-humsafar-500 rounded-lg text-sm font-medium text-gray-800"
             >
               <span>{tag.originalLabel}:</span>
               <span className="font-semibold">{tag.label}</span>
             </div>
           ))}
        </div>
    </div>
  )
}

function BasicDisplay({ data }: { data: any }) {

  // Get basic information
  const basicInfo = [
    { key: 'full_name', label: 'Full Name', isCombined: true, combineKeys: ['first_name', 'middle_name', 'last_name'] },
    { key: 'phone', label: 'Phone', isPhone: true },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'nationality', label: 'Nationality' },
    { key: 'ethnicity', label: 'Ethnicity' },
    { key: 'address', label: 'Address', isCombined: true, combineKeys: ['area', 'city', 'state', 'country'] },
    { key: 'willing_to_relocate', label: 'Willing To Relocate' },
  ]

  // Get marital status information
  const maritalInfo = [
    { key: 'marital_status', label: 'Marital Status' },
    { key: 'have_children', label: 'Have Children' },
    { key: 'want_children', label: 'Want Children' },
  ]

  // Get faith and ethnicity information
  const faithInfo = [
    { key: 'religion', label: 'Religion' },
    { key: 'sect', label: 'Sect' },
    { key: 'caste', label: 'Caste' },
    { key: 'mother_tongue', label: 'Mother Tongue' },
  ]

  // Get physical appearance information (without icons)
  const physicalInfo = [
    { key: 'height', label: 'Height' },
    { key: 'weight', label: 'Weight', isWeight: true },
    { key: 'body_type', label: 'Body Type' },
    { key: 'complexion', label: 'Complexion' },
    { key: 'eye_color', label: 'Eye Color' },
    { key: 'hair_color', label: 'Hair Color' },
  ]

  // Filter out empty values and create tags
  const basicTags = basicInfo
    .map(({ key, label, isCombined, combineKeys, isPhone }) => {
      let value: string | null = null
      
      if (isCombined && combineKeys) {
        // Handle combined fields
        if (key === 'full_name') {
          const firstName = data?.['first_name']
          const middleName = data?.['middle_name']
          const lastName = data?.['last_name']
          if (firstName || middleName || lastName) {
            value = [firstName, middleName, lastName].filter(Boolean).join(' ')
          }
        } else if (key === 'address') {
          const area = data?.['area']
          const city = data?.['city']
          const state = data?.['state']
          const country = data?.['country']
          const addressParts = [area, city, state, country].filter(Boolean)
          if (addressParts.length > 0) {
            value = addressParts.join(', ')
          }
        }
      } else {
        // Handle regular fields
        value = data?.[key]
      }
      
      if (!value || String(value).trim() === '') return null
      
      // Phone number without country code
      // Removed +92 prefix as requested
      
      return {
        key,
        label: formatValue(value),
        originalLabel: label
      }
    })
    .filter((tag): tag is NonNullable<typeof tag> => tag !== null)

  // Filter out empty values and create physical appearance tags (without icons)
  const physicalTags = physicalInfo
    .map(({ key, label, isWeight }) => {
      const value = data?.[key]
      if (!value || String(value).trim() === '') return null
      
      // Add kg unit to weight
      let displayValue = value
      if (isWeight && value) {
        displayValue = `${value} kg`
      }
      
      return {
        key,
        label: formatValue(displayValue),
        originalLabel: label
      }
    })
    .filter((tag): tag is NonNullable<typeof tag> => tag !== null)

  // Filter out empty values and create faith and ethnicity tags
  const faithTags = faithInfo
    .map(({ key, label }) => {
      const value = data?.[key]
      if (!value || String(value).trim() === '') return null
      
      return {
        key,
        label: formatValue(value),
        originalLabel: label
      }
    })
    .filter((tag): tag is NonNullable<typeof tag> => tag !== null)

  // Filter out empty values and create marital status tags
  const maritalTags = maritalInfo
    .map(({ key, label }) => {
      const value = data?.[key]
      if (!value || String(value).trim() === '') return null
      
      return {
        key,
        label: formatValue(value),
        originalLabel: label
      }
    })
    .filter((tag): tag is NonNullable<typeof tag> => tag !== null)

  if (basicTags.length === 0) return null

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
        <div className="flex flex-wrap gap-3">
                     {basicTags.map((tag) => (
             <div
               key={tag.key}
               className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-humsafar-500 rounded-lg text-sm font-medium text-gray-800"
             >
               <span>{tag.originalLabel}:</span>
               <span className="font-semibold">{tag.label}</span>
             </div>
           ))}
        </div>
      </div>

      {faithTags.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Faith and Ethnicity</h3>
          <div className="flex flex-wrap gap-3">
                         {faithTags.map((tag) => (
               <div
                 key={tag.key}
                 className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-humsafar-500 rounded-lg text-sm font-medium text-gray-800"
               >
                 <span>{tag.originalLabel}:</span>
                 <span className="font-semibold">{tag.label}</span>
               </div>
             ))}
          </div>
        </div>
      )}

      {maritalTags.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Marital Status</h3>
          <div className="flex flex-wrap gap-3">
                         {maritalTags.map((tag) => (
               <div
                 key={tag.key}
                 className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-humsafar-500 rounded-lg text-sm font-medium text-gray-800"
               >
                 <span>{tag.originalLabel}:</span>
                 <span className="font-semibold">{tag.label}</span>
               </div>
             ))}
          </div>
        </div>
      )}

      {physicalTags.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Physical Appearance</h3>
          <div className="flex flex-wrap gap-3">
                         {physicalTags.map((tag) => (
               <div
                 key={tag.key}
                 className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-humsafar-500 rounded-lg text-sm font-medium text-gray-800"
               >
                 <span>{tag.originalLabel}:</span>
                 <span className="font-semibold">{tag.label}</span>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  )
}

function LifestyleDisplay({ data }: { data: any }) {
  // Get lifestyle information
  const lifestyleInfo = [
    { key: 'diet', label: 'Diet' },
    { key: 'drink', label: 'Drink' },
    { key: 'smoke', label: 'Smoke' },
    { key: 'living_situation', label: 'Living Situation' },
    { key: 'religious_values', label: 'Religious Values' },
    { key: 'read_quran', label: 'Read Quran' },
    { key: 'hafiz_quran', label: 'Hafiz e Quran' },
    { key: 'polygamy', label: 'Polygamy Support' },
  ]

  // Filter out empty values and create tags
  const lifestyleTags = lifestyleInfo
    .map(({ key, label }) => {
      const value = data?.[key]
      if (!value || String(value).trim() === '') return null
      
      return {
        key,
        label: formatValue(value),
        originalLabel: label
      }
    })
    .filter((tag): tag is NonNullable<typeof tag> => tag !== null)

  if (lifestyleTags.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Lifestyle</h3>
      <div className="flex flex-wrap gap-3">
        {lifestyleTags.map((tag) => (
          <div
            key={tag.key}
            className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-humsafar-500 rounded-lg text-sm font-medium text-gray-800"
          >
            <span>{tag.originalLabel}:</span>
            <span className="font-semibold">{tag.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FamilyDisplay({ data }: { data: any }) {
  // Get family information (without icons)
  const familyInfo = [
    { key: 'father_occupation', label: 'Father Occupation' },
    { key: 'mother_occupation', label: 'Mother Occupation' },
    { key: 'brothers', label: 'Brothers' },
    { key: 'brothers_married', label: 'Brothers Married' },
    { key: 'sisters', label: 'Sisters' },
    { key: 'sisters_married', label: 'Sisters Married' },

    { key: 'family_values', label: 'Family Values' },
    { key: 'house_ownership', label: 'House Ownership' },
    { key: 'house_owner', label: 'House Owner' },
  ]

  // Filter out empty values and create tags
  const familyTags = familyInfo
    .map(({ key, label }) => {
      const value = data?.[key]
      if (!value || String(value).trim() === '') return null
      
      return {
        key,
        label: formatValue(value),
        originalLabel: label
      }
    })
    .filter((tag): tag is NonNullable<typeof tag> => tag !== null)

  if (familyTags.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Family Information</h3>
      <div className="flex flex-wrap gap-3">
                 {familyTags.map((tag) => (
           <div
             key={tag.key}
             className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-humsafar-500 rounded-lg text-sm font-medium text-gray-800"
           >
             <span>{tag.originalLabel}:</span>
             <span className="font-semibold">{tag.label}</span>
           </div>
         ))}
      </div>
    </div>
  )
}

function PartnerDisplay({ data, profile }: { data: any; profile: any }) {
  
  // Debug: Log the data being passed
  // PartnerDisplay Debug data

  // Get partner information with range handling
  const partnerInfo = [
    { key: 'partner_age_range', label: 'Age Range', isRange: true, fromKey: 'partner_age_from', toKey: 'partner_age_to' },
    { key: 'partner_height_range', label: 'Height Range', isRange: true, fromKey: 'partner_height_from', toKey: 'partner_height_to' },
    { key: 'partner_education', label: 'Education' },
    { key: 'partner_occupation', label: 'Occupation' },
    { key: 'partner_income', label: 'Income' },
    { key: 'partner_location', label: 'Location' },
    { key: 'partner_religion', label: 'Religion' },
    { key: 'partner_sect', label: 'Sect' },
    { key: 'partner_marital_status', label: 'Marital Status' },
    { key: 'partner_have_children', label: 'Have Children' },
    { key: 'partner_religious_values', label: 'Religious Values' },
    { key: 'partner_hijab', label: 'Hijab Preference' },
    { key: 'partner_polygamy', label: 'Polygamy Preference' },
  ]

  // Add user's own polygamy and hijab for male users
  if (profile?.gender === 'male') {
    partnerInfo.push(
      { key: 'polygamy', label: 'Polygamy Support' },
      { key: 'wear_hijab', label: 'Wear Hijab' }
    )
  }

  // Filter out empty values and create tags with range handling
  const partnerTags = partnerInfo
    .map(({ key, label, isRange, fromKey, toKey }) => {
      let value = null
      let displayLabel = label

      if (isRange && fromKey && toKey) {
        const fromValue = data?.[fromKey]
        const toValue = data?.[toKey]
        if (fromValue && toValue) {
          value = `${fromValue} - ${toValue}`
        } else if (fromValue) {
          value = `From ${fromValue}`
        } else if (toValue) {
          value = `Up to ${toValue}`
        }
      } else {
        value = data?.[key]
      }

      // Special handling for boolean fields like wear_hijab
      if (key === 'wear_hijab' || key === 'polygamy') {
        if (value === null || value === undefined || value === '') return null
        // Convert to readable format
        if (typeof value === 'boolean') {
          value = value ? 'Yes' : 'No'
        } else if (value === 'yes') {
          value = 'Yes'
        } else if (value === 'no') {
          value = 'No'
        }
      } else if (!value || String(value).trim() === '') {
        return null
      }
      
      return {
        key,
        label: formatValue(value),
        originalLabel: displayLabel
      }
    })
    .filter((tag): tag is NonNullable<typeof tag> => tag !== null)

  if (partnerTags.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Partner Preferences</h3>
      <div className="flex flex-wrap gap-3">
        {partnerTags.map((tag) => (
          <div
            key={tag.key}
            className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-humsafar-500 rounded-lg text-sm font-medium text-gray-800"
          >
            <span>{tag.originalLabel}:</span>
            <span className="font-semibold">{tag.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [images, setImages] = useState<any>(null)
  const [details, setDetails] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [id, setId] = useState<string | null>(null)
  
  useEffect(() => {
    params.then(resolvedParams => {
      setId(resolvedParams.id)
    })
  }, [params])

  useEffect(() => {
    checkAuthentication()
  }, [])

  useEffect(() => {
    if (authChecked && id) {
      if (currentUser) {
        fetchProfileData()
      } else {
        setLoading(false)
      }
    }
  }, [authChecked, currentUser, id])

  const checkAuthentication = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    } catch (error) {
      // Error checking authentication
    } finally {
      setAuthChecked(true)
    }
  }

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      // Try to find the profile by user_id
      let result = await supabase.from("user_profiles").select("*").eq("user_id", id).maybeSingle()
      if (result.data) {
        setProfile(result.data)
        setError(result.error)
        // Found profile using user_id
        
        // If we found a profile, fetch images and details
        const userIdForImages = result.data.user_id
        // Using userIdForImages
        
        const [imagesResult, profileResult, subscriptionResult] = await Promise.all([
          supabase.from("user_images").select("id,image_url,is_main").eq("user_id", userIdForImages).order("uploaded_at", { ascending: true }),
          supabase.from("user_profiles").select("*").eq("user_id", userIdForImages).maybeSingle(),
          supabase.from("user_subscriptions").select("verified_badge").eq("user_id", userIdForImages).maybeSingle(),
        ])
        
        // Process images to construct proper public URLs
        if (imagesResult.data && imagesResult.data.length > 0) {
          const processedImages = imagesResult.data.map((img: any) => ({
            ...img,
            image_url: img.image_url && img.image_url !== '/placeholder.jpg' 
              ? (img.image_url.startsWith('http') 
                  ? img.image_url 
                  : `https://kzmfreck4dxcc4cifgls.supabase.co/storage/v1/object/public/humsafar-user-images/${img.image_url}`)
              : '/placeholder.jpg'
          }))
          setImages(processedImages)
        } else {
          setImages(imagesResult.data)
        }
        
        setDetails(profileResult.data)
        const subscription = subscriptionResult.data
        
        // Add verified badge status to profile data
         if (subscription && subscription.verified_badge) {
           setProfile((prev: any) => ({ ...prev, verified: subscription.verified_badge }))
         }
         
         setError(imagesResult.error || profileResult.error || subscriptionResult.error)
       }
     } catch (e) {
       // Error in profile fetching
       setError(e)
     } finally {
       setLoading(false)
     }
   }

   // Show loading state
   if (loading) {
     return (
       <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
         <Header />
         <div className="container mx-auto px-4 py-8">
           <div className="flex justify-center items-center min-h-[400px]">
             <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-humsafar-600 mx-auto mb-4"></div>
               <p className="text-gray-600">Loading profile...</p>
             </div>
           </div>
         </div>
         <Footer />
       </div>
     )
   }

   // Show login prompt for non-authenticated users
   if (!currentUser) {
     return (
       <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
         <Header />
         <div className="container mx-auto px-4 py-8">
           <div className="mb-6">
             <Link href="/profiles" legacyBehavior>
               <Button
                 variant="outline"
                 className="border-humsafar-600 text-humsafar-600 hover:bg-humsafar-600 hover:text-white bg-transparent"
               >
                 <ArrowLeft className="w-4 h-4 mr-2" />
                 Back to Profiles
               </Button>
             </Link>
           </div>
           
           <div className="flex justify-center items-center min-h-[400px]">
             <Card className="max-w-md w-full border-humsafar-100">
               <CardContent className="p-8 text-center">
                 <Lock className="w-16 h-16 text-humsafar-600 mx-auto mb-4" />
                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
                 <p className="text-gray-600 mb-6">
                   Please login to view detailed profiles and connect with potential matches.
                 </p>
                 <Link href="/auth" legacyBehavior>
                   <Button className="w-full bg-humsafar-600 hover:bg-humsafar-700 text-white">
                     Login to Continue
                   </Button>
                 </Link>
               </CardContent>
             </Card>
           </div>
         </div>
         <Footer />
       </div>
     )
   }

  const d: any = details || {}

  const basicFields = [
    { label: "First Name", key: "first_name" },
    { label: "Last Name", key: "last_name" },
    { label: "Phone", key: "phone" },
    { label: "Age", key: "age" },
    { label: "Gender", key: "gender" },
    { label: "Religion", key: "religion" },
    { label: "Sect", key: "sect" },
    { label: "Caste", key: "caste" },
    { label: "Mother Tongue", key: "mother_tongue" },
    { label: "Marital Status", key: "marital_status" },
    { label: "Nationality", key: "nationality" },
    { label: "Ethnicity", key: "ethnicity" },
    { label: "Height", key: "height" },
    { label: "Weight", key: "weight" },
    { label: "Body Type", key: "body_type" },
    { label: "Complexion", key: "complexion" },
    { label: "Eye Color", key: "eye_color" },
    { label: "Hair Color", key: "hair_color" },
    { label: "Country", key: "country" },
    { label: "State", key: "state" },
    { label: "City", key: "city" },
    { label: "Area", key: "area" },
    { label: "Willing To Relocate", key: "willing_to_relocate" },
  ]

  const lifestyleFields = [
    { label: "Diet", key: "diet" },
    { label: "Drink", key: "drink" },
    { label: "Smoke", key: "smoke" },
    { label: "Living Situation", key: "living_situation" },
    { label: "Religious Values", key: "religious_values" },
    { label: "Attend Religious Services", key: "attend_religious_services" },
    { label: "Read Quran", key: "read_quran" },
  ]

  const careerFields = [
    { label: "Education", key: "education" },
    { label: "College", key: "college" },
    { label: "Working With", key: "working_with" },
    { label: "Working As", key: "working_as" },
    { label: "Employment Status", key: "employment_status" },
    { label: "Annual Income", key: "annual_income" },
    { label: "Occupation", key: "occupation" },
  ]

  const familyFields = [
    { label: "Father Occupation", key: "father_occupation" },
    { label: "Mother Occupation", key: "mother_occupation" },
    { label: "Brothers", key: "brothers" },
    { label: "Brothers Married", key: "brothers_married" },
    { label: "Sisters", key: "sisters" },
    { label: "Sisters Married", key: "sisters_married" },
    { label: "Family Type", key: "family_type" },
    { label: "Family Values", key: "family_values" },
    { label: "Have Children", key: "have_children" },
    { label: "Want Children", key: "want_children" },
    { label: "House Ownership", key: "house_ownership" },
    { label: "House Owner", key: "house_owner" },
  ]

  const partnerFields = [
    { label: "Age Range", key: "partner_age_range", isRange: true, fromKey: "partner_age_from", toKey: "partner_age_to" },
    { label: "Height Range", key: "partner_height_range", isRange: true, fromKey: "partner_height_from", toKey: "partner_height_to" },
    { label: "Education", key: "partner_education" },
    { label: "Occupation", key: "partner_occupation" },
    { label: "Income", key: "partner_income" },
    { label: "Location", key: "partner_location" },
    { label: "Religion", key: "partner_religion" },
    { label: "Sect", key: "partner_sect" },
    { label: "Marital Status", key: "partner_marital_status" },
    { label: "Have Children", key: "partner_have_children" },
    { label: "Religious Values", key: "partner_religious_values" },
    { label: "Hijab Preference", key: "partner_hijab" },
    { label: "Polygamy Preference", key: "partner_polygamy" },
    { label: "Polygamy Support", key: "polygamy" },
    { label: "Wear Hijab", key: "wear_hijab" },
  ]

  // Show loading while waiting for params to resolve
  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-humsafar-50 to-white">
      {currentUser && <ProfileViewTracker profileUserId={profile?.user_id || id} />}
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/profiles" legacyBehavior>
            <Button
              variant="outline"
              className="border-humsafar-600 text-humsafar-600 hover:bg-humsafar-600 hover:text-white bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profiles
            </Button>
          </Link>
        </div>

       
          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-1">

               
              <ProfileGallery
                images={images as any}
                personName={[profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(' ') || "Profile image"}
                isPremium={!!profile.premium}
                isVerified={Boolean((profile as any)?.verified_badge || (profile as any)?.verified)}
              />
            </div>

            <div className="lg:col-span-2">
              <Card className="border-humsafar-100 h-full">
                <CardContent className="p-6 h-full">
                  <>
                    {/* User ID Display */}
                    <div className="text-center mb-4">
                      <span className="text-xl font-mono bg-gray-100 px-5 py-3 rounded text-gray-700 font-bold">
                        {(profile.user_id || profile.id)?.toString().substring(0, 8).toUpperCase()}
                      </span>
                    </div>
                    
                    {(() => {
                      const name =
                        profile.full_name ||
                        [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(" ") ||
                        profile.display_name ||
                        profile.username ||
                        "Unnamed"
                      const age = formatValue(d?.age || profile.age)
                      const isVerified = Boolean(profile?.verified ?? (profile as any)?.is_verified ?? (d as any)?.verified)
                      return (
                         <div className="flex items-center justify-between mb-1">
                           <div className="flex items-center gap-3 flex-wrap">
                          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
                             {age ? (
                               <span className="text-xl font-semibold text-humsafar-600">{age}</span>
                          ) : null}
                           </div>
                                                     {isVerified && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-7 h-7 text-humsafar-600" />
                                <span className="text-humsafar-600 font-bold text-base">Verified</span>
                              </div>
                            )}
                        </div>
                      )
                    })()}

                  {(() => {
                    const city = formatValue(d?.city || profile.city)
                    const country = formatValue(d?.country || (profile as any)?.country || (profile as any)?.nationality)
                    if (!city && !country) return null
                
                    const locationText = [city, country].filter(Boolean).map((s) => String(s).toUpperCase()).join(", ")
                    return (
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="tracking-wider font-medium">{locationText}</span>
                     
                      </div>
                    )
                  })()}

                  {(d?.about || profile.bio) ? (
                    <div className="mt-2 mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                      <p className="text-gray-700 leading-relaxed">{formatValue(d?.about || profile.bio)}</p>
                    </div>
                  ) : null}
                  
                  <div className="mb-6">
                    <Button 
                      onClick={() => handleWhatsAppShare(profile, images as any[])}
                      className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share on WhatsApp
                    </Button>
                  </div>

                                     <Tabs defaultValue="basic" className="w-full">
                                           <TabsList className="grid w-full grid-cols-5 mb-6 bg-humsafar-500 p-1 rounded-lg">
                        <TabsTrigger value="basic" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-humsafar-500 data-[state=active]:shadow-sm"><User className="w-4 h-4"/>Basic</TabsTrigger>
                        <TabsTrigger value="lifestyle" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-humsafar-500 data-[state=active]:shadow-sm"><Heart className="w-4 h-4"/>Lifestyle</TabsTrigger>
                        <TabsTrigger value="career" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-humsafar-500 data-[state=active]:shadow-sm"><GraduationCap className="w-4 h-4"/>Career</TabsTrigger>
                        <TabsTrigger value="family" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-humsafar-500 data-[state=active]:shadow-sm"><Users className="w-4 h-4"/>Family</TabsTrigger>
                        <TabsTrigger value="partner" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-humsafar-500 data-[state=active]:shadow-sm"><Settings className="w-4 h-4"/>Partner</TabsTrigger>
                      </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <BasicDisplay data={d} />
                    </TabsContent>
                    <TabsContent value="lifestyle" className="space-y-4">
                      <LifestyleDisplay data={d} />
                      <HobbiesDisplay hobbies={d?.hobbies} />
                    </TabsContent>
                    <TabsContent value="career" className="space-y-4">
                      <CareerDisplay data={d} />
                    </TabsContent>
                    <TabsContent value="family" className="space-y-4">
                      <FamilyDisplay data={d} />
                    </TabsContent>
                    <TabsContent value="partner" className="space-y-4">
                      <PartnerDisplay data={{...d, ...profile}} profile={profile} />
                    </TabsContent>
                  </Tabs>
                </>
                </CardContent>
              </Card>
            </div>
          </div>
       
      </div>
      <Footer />
    </div>
  );
}


