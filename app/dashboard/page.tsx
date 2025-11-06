"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Upload, X, Eye, User, Heart, GraduationCap, Users, Settings, ImageIcon, Check, Trash2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ProfileDeletionDialog } from "@/components/profile-deletion-dialog"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { calculateAge } from "@/lib/utils"

// Supabase storage bucket for profile photos
const PROFILE_PHOTOS_BUCKET = "humsafar-user-images"
const MAX_FILE_MB = 4
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/jpg"]) // mirror bucket rules

type UserImage = {
  id: number
  image_url: string
  is_main: boolean
  display_url?: string
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("photos")

  // Debug: Log current tab
  const [photos, setPhotos] = useState<UserImage[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSavingAll, setIsSavingAll] = useState(false)
  const [isPhotoOperation, setIsPhotoOperation] = useState(false)
  const [isRefreshingPhotos, setIsRefreshingPhotos] = useState(false)
  const [photoSuccessMessage, setPhotoSuccessMessage] = useState<string | null>(null)
  const [consentOpen, setConsentOpen] = useState(false)
  
  // Add payment status state
  const [paymentStatus, setPaymentStatus] = useState<{
    status: 'pending' | 'under_review' | 'accepted' | 'rejected' | null;
    package_type?: string;
    views_limit?: number;
    created_at?: string;
    rejection_reason?: string;
  } | null>(null)
  
  const [profileData, setProfileData] = useState({
    // Basic Information
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    religion: "",
    sect: "",
    caste: "",
    motherTongue: "",
    maritalStatus: "",
    nationality: "",
    ethnicity: "",

    // Physical Appearance
    height: "",
    weight: "",
    bodyType: "",
    complexion: "",
    eyeColor: "",
    hairColor: "",
    wearHijab: "",

    // Location
    country: "",
    state: "",
    area: "",

    // Lifestyle
    diet: "",
    drink: "",
    smoke: "",
    livingSituation: "",
    religiousValues: "",
    readQuran: "",
    hafizQuran: "",
    polygamy: "",

    // Education & Career
    education: "",
    fieldOfStudy: "",
    customFieldOfStudy: "",
    college: "",
    workingWith: "",
    annualIncome: "",
    occupation: "",

    // Family
    fatherOccupation: "",
    motherOccupation: "",
    brothers: "",
    brothersMarried: "",
    sisters: "",
    sistersMarried: "",
    familyType: "",
    familyValues: "",
    haveChildren: "",
    wantChildren: "",
    houseOwnership: "",
    houseOwner: "",

    // Partner Preferences
    partnerAgeFrom: "",
    partnerAgeTo: "",
    partnerHeightFrom: "",
    partnerHeightTo: "",
    partnerEducation: "",
    partnerOccupation: "",
    partnerIncome: "",
    partnerLocation: "",
    partnerReligion: "",
    partnerSect: "",
    partnerMaritalStatus: "",
    partnerHaveChildren: "",
    partnerReligiousValues: "",
    partnerWearHijab: "",
    partnerPolygamy: "",

    // About & Interests
    about: "",
    lookingFor: "",
    hobbies: [] as string[],
    additionalInfo: "",
  })

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        alert("Please login first to access the dashboard")
        router.push("/auth")
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      // Check if user's profile is terminated
      const { data: subscriptionData } = await supabase
        .from("user_subscriptions")
        .select("profile_status")
        .eq("user_id", session.user.id)
        .single()

      if (subscriptionData?.profile_status === "terminated") {
        router.push("/profile-terminated")
        return
      }

      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (photoSuccessMessage) {
      const timer = setTimeout(() => {
        setPhotoSuccessMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [photoSuccessMessage])

  // Ensure database consistency when component mounts
  useEffect(() => {
    if (userId) {
      ensureSingleMainPhoto()
      fetchPaymentStatus()
    }
  }, [userId])

  // Fetch payment status for current user
  const fetchPaymentStatus = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('payments')
        .select('payment_status, package_type, views_limit, created_at, rejection_reason')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching payment status:', error)
        return
      }

      if (data) {
        setPaymentStatus({
          status: data.payment_status,
          package_type: data.package_type,
          views_limit: data.views_limit,
          created_at: data.created_at,
          rejection_reason: data.rejection_reason
        })
      }
    } catch (error) {
      console.error('Error fetching payment status:', error)
    }
  }

  // Do NOT early-return before hooks; UI is gated inside JSX at the top of the return

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleHobbyToggle = (hobby: string) => {
    setProfileData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby) ? prev.hobbies.filter((h) => h !== hobby) : [...prev.hobbies, hobby],
    }))
  }

  // Draft persistence in localStorage
  const DRAFT_KEY = "user_profile_draft"
  const saveDraftToStorage = (data = profileData) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    } catch (_) {}
  }
  const loadDraftFromStorage = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        return parsed
      }
    } catch (_) {}
    return null
  }
  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch (_) {}
  }

  // Auto-save to local storage whenever profileData changes
  useEffect(() => {
    if (userId && Object.keys(profileData).length > 0) {
      const timeoutId = setTimeout(() => {
        saveDraftToStorage()
      }, 1000) // Auto-save after 1 second of no typing

      return () => clearTimeout(timeoutId)
    }
  }, [profileData, userId])

  // Fetch current user and existing photos
  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const uid = sessionData.session?.user?.id ?? null

      if (uid) {
        // Set userId for profile view tracking
        setUserId(uid)
      }

      if (!uid) return

      const initialProfileState = {
        // Basic Information
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        city: "",
        religion: "",
        sect: "",
        caste: "",
        motherTongue: "",
        maritalStatus: "",
        nationality: "",
        ethnicity: "",

        // Physical Appearance
        height: "",
        weight: "",
        bodyType: "",
        complexion: "",
        eyeColor: "",
        hairColor: "",
        wearHijab: "",

        // Location
        country: "",
        state: "",
        area: "",

        // Lifestyle
        diet: "",
        drink: "",
        smoke: "",
        livingSituation: "",
        religiousValues: "",
        readQuran: "",
        hafizQuran: "",
        polygamy: "",

        // Education & Career
        education: "",
        fieldOfStudy: "",
        customFieldOfStudy: "",
        college: "",
        workingWith: "",
        workingAs: "",
        employmentStatus: "",
        annualIncome: "",
        occupation: "",

        // Family
        fatherOccupation: "",
        motherOccupation: "",
        brothers: "",
        brothersMarried: "",
        sisters: "",
        sistersMarried: "",
        familyType: "",
        familyValues: "",
        haveChildren: "",
        wantChildren: "",
        houseOwnership: "",
        houseOwner: "",

        // Partner Preferences
        partnerAgeFrom: "",
        partnerAgeTo: "",
        partnerHeightFrom: "",
        partnerHeightTo: "",
        partnerEducation: "",
        partnerOccupation: "",
        partnerIncome: "",
        partnerLocation: "",
        partnerReligion: "",
        partnerSect: "",
        partnerMaritalStatus: "",
        partnerHaveChildren: "",
        partnerReligiousValues: "",
        partnerWearHijab: "",
        partnerPolygamy: "",

        // About & Interests
        about: "",
        lookingFor: "",
        hobbies: [] as string[],
        additionalInfo: "",
      }

      // Load profile data from user_profiles table
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", uid)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        // Error fetching profile from DB
      }

      // If no profile exists, create one for Google OAuth users
      if (profileError && profileError.code === "PGRST116") {
        // Get user data from Supabase Auth
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          // Extract available data from Google OAuth
          const firstName = user.user_metadata?.full_name?.split(" ")[0] || user.user_metadata?.first_name || ""
          const lastName =
            user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || user.user_metadata?.last_name || ""
          const email = user.email || ""

          // Create basic profile entry
          const { error: createError } = await supabase.from("user_profiles").insert([
            {
              user_id: uid,
              email: email,
              first_name: firstName,
              last_name: lastName,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])

          if (createError) {
            // Error creating profile
          } else {
            // Try to create default subscription
            try {
              const { UserSubscriptionService } = await import("@/lib/userSubscriptionService")
              await UserSubscriptionService.createDefaultSubscription(uid)
            } catch (subscriptionError) {
              // Error creating default subscription
            }

            // Reload profile data after creation
            const { data: newProfile } = await supabase.from("user_profiles").select("*").eq("user_id", uid).single()

            if (newProfile) {
              const profile = newProfile
            }
          }
        }
      }

      // 3. Use profile data directly
      let finalProfileState = { ...initialProfileState }

      if (profile) {
        finalProfileState = {
          ...initialProfileState,
          // Basic Information (from profile)
          firstName: profile?.first_name ?? initialProfileState.firstName,
          middleName: profile?.middle_name ?? initialProfileState.middleName,
          lastName: profile?.last_name ?? initialProfileState.lastName,
          phone: profile?.phone ?? initialProfileState.phone,
          dateOfBirth: profile?.date_of_birth ?? initialProfileState.dateOfBirth,
          gender: profile?.gender ?? initialProfileState.gender,
          city: profile?.city ?? initialProfileState.city,
          // Additional basic info from profile
          religion: profile?.religion ?? initialProfileState.religion,
          sect: profile?.sect ?? initialProfileState.sect,
          caste: profile?.caste ?? initialProfileState.caste,
          motherTongue: profile?.mother_tongue ?? initialProfileState.motherTongue,
          maritalStatus: profile?.marital_status ?? initialProfileState.maritalStatus,
          nationality: profile?.nationality ?? initialProfileState.nationality,
          ethnicity: profile?.ethnicity ?? initialProfileState.ethnicity,
          // Physical Appearance
          height: profile?.height ?? initialProfileState.height,
          weight: profile?.weight ?? initialProfileState.weight,
          bodyType: profile?.body_type ?? initialProfileState.bodyType,
          complexion: profile?.complexion ?? initialProfileState.complexion,
          eyeColor: profile?.eye_color ?? initialProfileState.eyeColor,
          hairColor: profile?.hair_color ?? initialProfileState.hairColor,
          wearHijab: profile?.wear_hijab ?? initialProfileState.wearHijab,
          // Location
          country: profile?.country ?? initialProfileState.country,
          state: profile?.state ?? initialProfileState.state,
          area: profile?.area ?? initialProfileState.area,
          // Lifestyle
          diet: profile?.diet ?? initialProfileState.diet,
          drink: profile?.drink ?? initialProfileState.drink,
          smoke: profile?.smoke ?? initialProfileState.smoke,
          livingSituation: profile?.living_situation ?? initialProfileState.livingSituation,
          religiousValues: profile?.religious_values ?? initialProfileState.religiousValues,
          readQuran: profile?.read_quran ?? initialProfileState.readQuran,
          hafizQuran: profile?.hafiz_quran ?? initialProfileState.hafizQuran,
          polygamy: profile?.polygamy ?? initialProfileState.polygamy,
          // Education & Career
          education: profile?.education ?? initialProfileState.education,
          fieldOfStudy: profile?.field_of_study ?? initialProfileState.fieldOfStudy,
          customFieldOfStudy: profile?.custom_field_of_study ?? initialProfileState.customFieldOfStudy,
          college: profile?.college ?? initialProfileState.college,
          workingWith: profile?.working_with ?? initialProfileState.workingWith,
          annualIncome: profile?.annual_income ?? initialProfileState.annualIncome,
          occupation: profile?.occupation ?? initialProfileState.occupation,
          // Family
          fatherOccupation: profile?.father_occupation ?? initialProfileState.fatherOccupation,
          motherOccupation: profile?.mother_occupation ?? initialProfileState.motherOccupation,
          brothers: profile?.brothers ?? initialProfileState.brothers,
          brothersMarried: profile?.brothers_married ?? initialProfileState.brothersMarried,
          sisters: profile?.sisters ?? initialProfileState.sisters,
          sistersMarried: profile?.sisters_married ?? initialProfileState.sistersMarried,
          familyType: profile?.family_type ?? initialProfileState.familyType,
          familyValues: profile?.family_values ?? initialProfileState.familyValues,
          haveChildren: profile?.have_children ?? initialProfileState.haveChildren,
          wantChildren: profile?.want_children ?? initialProfileState.wantChildren,
          houseOwnership: profile?.house_ownership ?? initialProfileState.houseOwnership,
          houseOwner: profile?.house_owner ?? initialProfileState.houseOwner,
          // Partner Preferences
          partnerAgeFrom: profile?.partner_age_from ?? initialProfileState.partnerAgeFrom,
          partnerAgeTo: profile?.partner_age_to ?? initialProfileState.partnerAgeTo,
          partnerHeightFrom: profile?.partner_height_from ?? initialProfileState.partnerHeightFrom,
          partnerHeightTo: profile?.partner_height_to ?? initialProfileState.partnerHeightTo,
          partnerEducation: profile?.partner_education ?? initialProfileState.partnerEducation,
          partnerOccupation: profile?.partner_occupation ?? initialProfileState.partnerOccupation,
          partnerIncome: profile?.partner_income ?? initialProfileState.partnerIncome,
          partnerLocation: profile?.partner_location ?? initialProfileState.partnerLocation,
          partnerReligion: profile?.partner_religion ?? initialProfileState.partnerReligion,
          partnerSect: profile?.partner_sect ?? initialProfileState.partnerSect,
          partnerMaritalStatus: profile?.partner_marital_status ?? initialProfileState.partnerMaritalStatus,
          partnerHaveChildren: profile?.partner_have_children ?? initialProfileState.partnerHaveChildren,
          partnerReligiousValues: profile?.partner_religious_values ?? initialProfileState.partnerReligiousValues,
          partnerWearHijab: profile?.partner_wear_hijab ?? initialProfileState.partnerWearHijab,
          partnerPolygamy: profile?.partner_polygamy ?? initialProfileState.partnerPolygamy,
          // About & Interests
          about: profile?.about ?? initialProfileState.about,
          lookingFor: profile?.looking_for ?? initialProfileState.lookingFor,
          hobbies: Array.isArray(profile?.hobbies) ? profile.hobbies : initialProfileState.hobbies,
          additionalInfo: profile?.additional_info ?? initialProfileState.additionalInfo,
        }
        clearDraft() // Clear local storage if data was found in DB
      } else {
        // If no profile data in DB, try loading from local storage
        const draft = loadDraftFromStorage()
        if (draft) {
          finalProfileState = { ...initialProfileState, ...draft }
        }
      }

      // 2. Prefill basic info from signup profile (user_profiles table) if available,
      //    but only if the corresponding field wasn't already set by detailed profile or draft.
      const { data: basicProfile, error: basicProfileError } = await supabase
        .from("user_profiles")
        .select("first_name,last_name,phone,age,gender,city")
        .eq("user_id", uid)
        .single()

      if (basicProfileError && basicProfileError.code !== "PGRST116") {
        // Error fetching basic profile from DB
      }

      if (basicProfile) {
        finalProfileState = {
          ...finalProfileState,
          firstName: finalProfileState.firstName || basicProfile.first_name || "",
          lastName: finalProfileState.lastName || basicProfile.last_name || "",
          phone: finalProfileState.phone || basicProfile.phone || "",
          dateOfBirth: finalProfileState.dateOfBirth || (basicProfile as any).date_of_birth || "",
          gender: finalProfileState.gender || basicProfile.gender || "",
          city: finalProfileState.city || basicProfile.city || "",
        }
      }

      setProfileData(finalProfileState)

      // Fetch photos (this logic seems fine as it always fetches from DB)
      const { data: existingPhotos, error: photosError } = await supabase
        .from("user_images")
        .select("id,image_url,is_main")
        .eq("user_id", uid)
        .order("uploaded_at", { ascending: true })

      if (photosError) {
        // Don't show error to user, just log it
      }

      if (existingPhotos && existingPhotos.length > 0) {
        try {
          const withDisplay = await Promise.all(
            (existingPhotos as UserImage[]).map(async (p) => {
              try {
                const displayUrl = await getDisplayUrlFromImageUrl(p.image_url)
                return {
                  ...p,
                  display_url: displayUrl,
                }
              } catch (imgError) {
                // Fallback to original URL if display URL fails
                return {
                  ...p,
                  display_url: p.image_url,
                }
              }
            }),
          )
          setPhotos(withDisplay)
        } catch (photoError) {
          // Fallback: set photos with original URLs
          setPhotos(existingPhotos.map((p) => ({ ...p, display_url: p.image_url })))
        }
      } else {
        setPhotos([])
      }
    }
    void init()
  }, [])

  // Tab order and navigation
  const tabOrder = ["photos", "basic", "lifestyle", "education", "family", "partner", "settings"] as const
  type TabKey = (typeof tabOrder)[number]
  const getNextTab = (tab: TabKey): TabKey | null => {
    const idx = tabOrder.indexOf(tab)
    if (idx === -1 || idx === tabOrder.length - 1) return null
    return tabOrder[idx + 1]
  }
  const getPrevTab = (tab: TabKey): TabKey | null => {
    const idx = tabOrder.indexOf(tab)
    if (idx <= 0) return null
    return tabOrder[idx - 1]
  }
  const isFirstTab = (tab: TabKey) => tabOrder.indexOf(tab) === 0
  const isLastTab = (tab: TabKey) => tabOrder.indexOf(tab) === tabOrder.length - 1

  const handleNext = () => {
    saveDraftToStorage()
    const next = getNextTab(activeTab as TabKey)
    if (next) {
      setActiveTab(next)
      // Scroll to top of page when navigating to next tab
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }
  const handlePrev = () => {
    saveDraftToStorage()
    const prev = getPrevTab(activeTab as TabKey)
    if (prev) {
      setActiveTab(prev)
      // Scroll to top of page when navigating to previous tab
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Function to check table structure
  const checkTableStructure = async () => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*").limit(1)

      if (error) {
        return null
      }

      // Get column information by trying to insert a test row
      return true
    } catch (err) {
      return null
    }
  }

  // Save all changes to Supabase
  const handleSaveAll = async () => {
    try {
      setIsSavingAll(true)

      // Check authentication
      const { data: userData, error: authError } = await supabase.auth.getUser()
      if (authError) {
        alert(`Authentication error: ${authError.message}`)
        return
      }

      const uid = userData.user?.id
      if (!uid) {
        alert("You're not logged in. Please log in again.")
        return
      }

      // Note: Profile updates are allowed regardless of subscription status

      // Validate required fields
      if (!profileData.firstName || !profileData.lastName || !profileData.dateOfBirth || !profileData.gender) {
        alert("Please fill in all required fields: First Name, Last Name, Date of Birth, and Gender.")
        return
      }

      // Save profile data directly to user_profiles table

      // Show saving message to user
      setPhotoSuccessMessage("💾 Saving profile... Please wait.")

      // Prepare profile payload with all fields
      const profilePayload = {
        user_id: uid, // Use user_id as primary key
        // Basic Information
        first_name: profileData.firstName || null,
        middle_name: profileData.middleName || null,
        last_name: profileData.lastName || null,
        phone: profileData.phone || null,
        date_of_birth: profileData.dateOfBirth || null,
        age: profileData.dateOfBirth ? calculateAge(profileData.dateOfBirth) : null,
        gender: profileData.gender || null,
        city: profileData.city || null,
        religion: profileData.religion || null,
        sect: profileData.sect || null,
        caste: profileData.caste || null,
        mother_tongue: profileData.motherTongue || null,
        marital_status: profileData.maritalStatus || null,
        nationality: profileData.nationality || null,
        ethnicity: profileData.ethnicity || null,

        // Physical Appearance
        height: profileData.height || null,
        weight: profileData.weight || null,
        body_type: profileData.bodyType || null,
        complexion: profileData.complexion || null,
        eye_color: profileData.eyeColor || null,
        hair_color: profileData.hairColor || null,
        wear_hijab: profileData.wearHijab || null,

        // Location
        country: profileData.country || null,
        state: profileData.state || null,
        area: profileData.area || null,

        // Lifestyle
        diet: profileData.diet || null,
        drink: profileData.drink || null,
        smoke: profileData.smoke || null,
        living_situation: profileData.livingSituation || null,
        religious_values: profileData.religiousValues || null,
        read_quran: profileData.readQuran || null,
        hafiz_quran: profileData.hafizQuran || null,
        polygamy: profileData.polygamy || null,

        // Education & Career
        education: profileData.education || null,
        field_of_study: profileData.fieldOfStudy || null,
        custom_field_of_study: profileData.customFieldOfStudy || null,
        college: profileData.college || null,
        working_with: profileData.workingWith || null,
        annual_income: profileData.annualIncome || null,
        occupation: profileData.occupation || null,

        // Family
        father_occupation: profileData.fatherOccupation || null,
        mother_occupation: profileData.motherOccupation || null,
        brothers: profileData.brothers || null,
        brothers_married: profileData.brothersMarried || null,
        sisters: profileData.sisters || null,
        sisters_married: profileData.sistersMarried || null,
        family_values: profileData.familyValues || null,
        have_children: profileData.haveChildren || null,
        want_children: profileData.wantChildren || null,
        house_ownership: profileData.houseOwnership || null,
        house_owner: profileData.houseOwner || null,

        // Partner Preferences
        partner_age_from: profileData.partnerAgeFrom || null,
        partner_age_to: profileData.partnerAgeTo || null,
        partner_height_from: profileData.partnerHeightFrom || null,
        partner_height_to: profileData.partnerHeightTo || null,
        partner_education: profileData.partnerEducation || null,
        partner_occupation: profileData.partnerOccupation || null,
        partner_income: profileData.partnerIncome || null,
        partner_location: profileData.partnerLocation || null,
        partner_religion: profileData.partnerReligion || null,
        partner_sect: profileData.partnerSect || null,
        partner_marital_status: profileData.partnerMaritalStatus || null,
        partner_have_children: profileData.partnerHaveChildren || null,
        partner_religious_values: profileData.partnerReligiousValues || null,
        partner_wear_hijab: profileData.partnerWearHijab || null,
        partner_polygamy: profileData.partnerPolygamy || null,

        // About & Interests
        about: profileData.about || null,
        looking_for: profileData.lookingFor || null,
        hobbies: profileData.hobbies || null,
        additional_info: profileData.additionalInfo || null,
      }

      try {
        const { data, error: profileSaveError } = await supabase
          .from("user_profiles")
          .upsert(profilePayload, { onConflict: "user_id" })

        if (profileSaveError) {
          // Show more specific error messages
          let errorMessage = "Failed to save profile"
          if (profileSaveError.message.includes("timeout")) {
            errorMessage = "Save operation is taking too long. Please check your internet connection and try again."
          } else if (profileSaveError.message.includes("network")) {
            errorMessage = "Network error. Please check your internet connection and try again."
          } else if (profileSaveError.message.includes("permission")) {
            errorMessage = "Permission denied. Please make sure you're logged in."
          } else {
            errorMessage = `Save error: ${profileSaveError.message}`
          }

          alert(errorMessage)
          return
        }
      } catch (upsertError) {
        alert(`Database operation failed: ${upsertError}`)
        return
      }

      // Insert user subscription record only if it doesn't exist
      try {
        // Check if subscription record already exists
        const { data: existingSubscription, error: subscriptionCheckError } = await supabase
          .from("user_subscriptions")
          .select("user_id")
          .eq("user_id", uid)
          .single()

        if (subscriptionCheckError && subscriptionCheckError.code !== "PGRST116") {
          // Profile saved but subscription check failed
        } else if (existingSubscription) {
          // User subscription data already exists, skipping subscription update
        } else {
          // Only create subscription if it doesn't exist
          const currentTime = new Date().toISOString()
          const subscriptionPayload = {
            user_id: uid,
            subscription_status: "free",
            profile_status: "pending",
            views_limit: 0,
            verified_badge: false,
            boost_profile: false,
            created_at: currentTime,
            updated_at: currentTime,
          }

          const { data: subscriptionData, error: subscriptionError } = await supabase
            .from("user_subscriptions")
            .insert(subscriptionPayload)

          if (subscriptionError) {
            // Profile saved but subscription creation failed
          } else {
            // Subscription data created
          }
        }
      } catch (subscriptionUpsertError) {
        // Profile saved but subscription operation failed
      }

      clearDraft()
      setPhotoSuccessMessage("🎉 Profile saved successfully!")

      // Refresh the page to show updated data
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      alert(`An unexpected error occurred: ${error}`)
    } finally {
      setIsSavingAll(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // Snapshot the input element early; React may null out event.currentTarget later
      const inputEl = event.target as HTMLInputElement | null
      const files = inputEl?.files
      if (!files || files.length === 0) return

      // Always fetch fresh user (avoids race if state not ready)
      const { data: userData } = await supabase.auth.getUser()
      const uid = userData.user?.id || userId
      if (!uid) {
        setUploadError("You're not logged in. Please log in again and try uploading.")
        return
      }
      if (!userId) setUserId(uid)

      // Clear previous messages
      setUploadError(null)
      setPhotoSuccessMessage(null)

      // Limit to 4 total
      const remainingSlots = Math.max(0, 4 - photos.length)
      const selected = Array.from(files).slice(0, remainingSlots)

      // Client-side restrictions mirroring bucket
      const validFiles: File[] = []
      const rejectedReasons: string[] = []
      selected.forEach((file) => {
        if (!ALLOWED_MIME_TYPES.has(file.type)) {
          rejectedReasons.push(`${file.name}: only JPG/PNG allowed`)
          return
        }
        if (file.size > MAX_FILE_BYTES) {
          rejectedReasons.push(`${file.name}: exceeds ${MAX_FILE_MB}MB`)
          return
        }
        validFiles.push(file)
      })

      setUploadError(rejectedReasons.length ? rejectedReasons.join("\n") : null)

      if (selected.length === 0 || validFiles.length === 0) return

      setIsUploading(true)

      // Get current photos count to determine if this is the first photo
      const currentPhotosCount = photos.length
      const uploadedPhotos: UserImage[] = []

      // Process files sequentially to ensure proper order
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        const isFirstPhoto = currentPhotosCount === 0 && i === 0

        // Processing photo upload

        const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "-")
        const path = `${uid}/${Date.now()}-${sanitizedName}`

        const { error: uploadError } = await supabase.storage
          .from(PROFILE_PHOTOS_BUCKET)
          .upload(path, file, { cacheControl: "3600", upsert: false })
        if (uploadError) {
          setUploadError(uploadError.message)
          continue
        }

        const { data: publicUrlData } = supabase.storage.from(PROFILE_PHOTOS_BUCKET).getPublicUrl(path)
        const publicUrl = publicUrlData.publicUrl

        // Only the first photo should be marked as main
        const { data: inserted, error: insertError } = await supabase
          .from("user_images")
          .insert({
            user_id: uid,
            image_url: publicUrl,
            is_main: isFirstPhoto,
          })
          .select("id,image_url,is_main")
          .single()

        if (!insertError && inserted) {
          const displayUrl = await getDisplayUrlFromImageUrl(publicUrl)
          const newPhoto = { ...(inserted as UserImage), display_url: displayUrl }
          uploadedPhotos.push(newPhoto)
        } else if (insertError) {
          setUploadError(insertError.message)
        }
      }

      // If we successfully uploaded photos, update the state
      if (uploadedPhotos.length > 0) {
        // Ensure only the first photo is marked as main
        const updatedPhotos = uploadedPhotos.map((photo, index) => ({
          ...photo,
          is_main: index === 0,
        }))

        // Update photos state with the new photos
        setPhotos((prev) => [...prev, ...updatedPhotos])

        // If this is the first photo, update the database to ensure only one main photo
        if (currentPhotosCount === 0 && uploadedPhotos.length > 0) {
          const firstPhoto = uploadedPhotos[0]

          // Set all other photos to not main
          if (uploadedPhotos.length > 1) {
            const otherPhotoIds = uploadedPhotos.slice(1).map((p) => p.id)
            await supabase.from("user_images").update({ is_main: false }).in("id", otherPhotoIds)
          }

          // Ensure the first photo is main
          await supabase.from("user_images").update({ is_main: true }).eq("id", firstPhoto.id)
        }

        // Refresh photos from database to ensure consistency
        await refreshPhotos()

        // Ensure database consistency for main photos
        await ensureSingleMainPhoto()

        // Show success message
        setPhotoSuccessMessage(`${uploadedPhotos.length} photo(s) uploaded successfully!`)
      }
    } finally {
      setIsUploading(false)
      // Reset input value so the same file can be selected again if needed
      const inputEl = event.target as HTMLInputElement | null
      if (inputEl) {
        try {
          inputEl.value = ""
        } catch (_) {
          // no-op: some browsers may prevent programmatic value set
        }
      }
    }
  }

  // Test Supabase connection
  const testSupabaseConnection = async () => {
    try {
      // Use a simpler, faster connection test
      const { data, error } = await supabase.from("user_profiles").select("user_id").limit(1)

      if (error) {
        return false
      }

      return true
    } catch (err) {
      return false
    }
  }

  // Refresh photos from database
  const refreshPhotos = async () => {
    try {
      setIsRefreshingPhotos(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user?.id) {
        setIsRefreshingPhotos(false)
        return
      }

      const { data: existingPhotos, error: photosError } = await supabase
        .from("user_images")
        .select("id,image_url,is_main")
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: true })

      if (photosError) {
        setIsRefreshingPhotos(false)
        return
      }

      if (existingPhotos && existingPhotos.length > 0) {
        try {
          const withDisplay = await Promise.all(
            existingPhotos.map(async (p) => {
              try {
                const displayUrl = await getDisplayUrlFromImageUrl(p.image_url)
                return {
                  ...p,
                  display_url: displayUrl,
                }
              } catch (imgError) {
                return {
                  ...p,
                  display_url: p.image_url,
                }
              }
            }),
          )
          setPhotos(withDisplay)

          // Show success message
          setPhotoSuccessMessage("Photos refreshed successfully!")
          setTimeout(() => setPhotoSuccessMessage(null), 3000)
        } catch (photoError) {
          setPhotos(existingPhotos.map((p) => ({ ...p, display_url: p.image_url })))
        }
      } else {
        setPhotos([])
      }
    } catch (err) {
      // Error during photo refresh
    } finally {
      setIsRefreshingPhotos(false)
    }
  }

  // derive storage path from public URL: .../object/public/<bucket>/<path>
  const getPathFromPublicUrl = (publicUrl: string): string | null => {
    const needle = `/object/public/${PROFILE_PHOTOS_BUCKET}/`
    const idx = publicUrl.indexOf(needle)
    if (idx === -1) return null
    return publicUrl.substring(idx + needle.length)
  }

  // Build a display URL that works for public/private buckets
  const getDisplayUrlFromImageUrl = async (imageUrl: string): Promise<string> => {
    // If the image URL is already a public URL, return it directly
    if (imageUrl.includes("/storage/v1/object/public/")) {
      return imageUrl
    }

    const path = getPathFromPublicUrl(imageUrl)
    if (!path) {
      // If not a public-URL format, return as-is
      return imageUrl
    }

    // For public buckets, construct the public URL directly
    const { data: bucketData } = await supabase.storage.getBucket(PROFILE_PHOTOS_BUCKET)
    if (bucketData?.public) {
      const { data } = supabase.storage.from(PROFILE_PHOTOS_BUCKET).getPublicUrl(path)
      return data.publicUrl
    }

    // Fallback to signed URL for private buckets
    const { data } = await supabase.storage.from(PROFILE_PHOTOS_BUCKET).createSignedUrl(path, 60 * 60 * 24 * 365)
    return data?.signedUrl ?? imageUrl
  }

  const removeImage = async (photo: UserImage) => {
    if (isPhotoOperation) return

    try {
      setIsPhotoOperation(true)
      setUploadError(null)
      setPhotoSuccessMessage(null)

      const wasMainPhoto = photo.is_main

      // Remove from storage first (if we can derive path)
      const path = getPathFromPublicUrl(photo.image_url)
      if (path) {
        await supabase.storage.from(PROFILE_PHOTOS_BUCKET).remove([path])
      }

      // Remove from DB
      await supabase.from("user_images").delete().eq("id", photo.id)

      // Update UI
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))

      // If we removed the main photo and there are other photos, make the first remaining photo main
      if (wasMainPhoto && photos.length > 1) {
        const remainingPhotos = photos.filter((p) => p.id !== photo.id)
        if (remainingPhotos.length > 0) {
          const firstRemainingPhoto = remainingPhotos[0]
          await supabase.from("user_images").update({ is_main: true }).eq("id", firstRemainingPhoto.id)

          // Update local state
          setPhotos((prev) => prev.map((p) => ({ ...p, is_main: p.id === firstRemainingPhoto.id })))
        }
      }

      // Refresh photos from database to ensure consistency
      await refreshPhotos()

      setPhotoSuccessMessage("Photo removed successfully!")
    } catch (error) {
      setUploadError("Failed to remove photo. Please try again.")
    } finally {
      setIsPhotoOperation(false)
    }
  }

  const makeMain = async (photo: UserImage) => {
    if (!userId || isPhotoOperation) return

    try {
      setIsPhotoOperation(true)
      setUploadError(null)
      setPhotoSuccessMessage(null)

      // First, unset all photos as main
      await supabase.from("user_images").update({ is_main: false }).eq("user_id", userId)

      // Then set the selected photo as main
      await supabase.from("user_images").update({ is_main: true }).eq("id", photo.id)

      // Refresh photos from database to ensure consistency
      await refreshPhotos()

      setPhotoSuccessMessage("Main photo updated successfully!")
    } catch (error) {
      setUploadError("Failed to update main photo. Please try again.")
    } finally {
      setIsPhotoOperation(false)
    }
  }

  // Calculate profile completion percentage dynamically
  const calculateCompletion = () => {
    const fields = [
      // Basic Info (8 fields)
      profileData.firstName,
      profileData.lastName,
      profileData.dateOfBirth,
      profileData.gender,
      profileData.religion,
      profileData.sect,
      profileData.city,
      profileData.phone,
      // Lifestyle (4 fields)
      profileData.diet,
      profileData.drink,
      profileData.smoke,
      profileData.religiousValues,
      // Education (2 fields)
      profileData.education,
      profileData.workingWith,
      // Family (6 fields)
      profileData.fatherOccupation,
      profileData.motherOccupation,
      profileData.familyType,
      profileData.familyValues,
      profileData.houseOwnership,
      profileData.houseOwner,
      // Partner (6 fields)
      profileData.partnerAgeFrom,
      profileData.partnerAgeTo,
      profileData.partnerEducation,
      profileData.partnerReligion,
      profileData.partnerLocation,
      profileData.lookingFor,
      // About (2 fields)
      profileData.about,
      profileData.hobbies.length > 0 ? "filled" : "",
      // Photos (1 field)
      photos.length > 0 ? "filled" : "",
    ]

    const totalFields = fields.length
    const filledFields = fields.filter((field) => field && field.toString().trim() !== "").length
    return Math.round((filledFields / totalFields) * 100)
  }

  const completionPercentage = calculateCompletion()

  const availableHobbies = [
    "Art & Design",
    "Technology",
    "Reading",
    "Cooking",
    "Travel",
    "Sports",
    "Music",
    "Photography",
    "Gardening",
    "Movies",
    "Shopping",
    "Dancing",
  ]

  // Function to ensure only one photo is marked as main in the database
  const ensureSingleMainPhoto = async () => {
    if (!userId) return

    try {
      // Get all photos for this user
      const { data: userPhotos } = await supabase
        .from("user_images")
        .select("id,is_main")
        .eq("user_id", userId)
        .order("uploaded_at", { ascending: true })

      if (userPhotos && userPhotos.length > 0) {
        const mainPhotos = userPhotos.filter((p) => p.is_main)

        // If multiple photos are marked as main, fix it
        if (mainPhotos.length > 1) {
          // Keep only the first one as main
          const firstMainPhoto = mainPhotos[0]
          const otherMainPhotoIds = mainPhotos.slice(1).map((p) => p.id)

          // Set all other main photos to false
          if (otherMainPhotoIds.length > 0) {
            await supabase.from("user_images").update({ is_main: false }).in("id", otherMainPhotoIds)
          }
        }
        // If no photos are marked as main, mark the first one
        else if (mainPhotos.length === 0) {
          const firstPhoto = userPhotos[0]
          await supabase.from("user_images").update({ is_main: true }).eq("id", firstPhoto.id)
        }
      }
    } catch (error) {
      // Error ensuring single main photo
    }
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-gradient-to-b from-humsafar50 to-white">
      <Header />
      {isLoading || !isAuthenticated ? (
        <div className="container mx-auto px-4 py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-humsafar-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Dashboard Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-4">
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Profile Dashboard</h1>
                <p className="text-sm md:text-base text-gray-600 mt-1">
                  Manage your profile information and preferences
                </p>
              </div>
              <div className="flex justify-center md:justify-end">
                {/* Preview using current user id */}
                <Link href={`/profile/${userId || 1}`} legacyBehavior>
                  <Button
                    variant="outline"
                    className="border-humsafar-600 text-humsafar-600 hover:bg-humsafar-600 hover:text-white bg-transparent w-full md:w-auto"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    <span className="text-sm md:text-base">Preview Profile</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Package Success Message */}
            {typeof window !== "undefined" &&
              new URLSearchParams(window.location.search).get("package") === "success" && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">Package Activated Successfully!</h3>
                      <p className="text-green-700">
                        Your package has been activated successfully. You now have access to premium features and
                        additional profile views.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Payment Status Alert */}
            {paymentStatus && paymentStatus.status === 'under_review' && (
              <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-800">Payment Under Review</h3>
                    <p className="text-orange-700">
                      Your payment screenshot is under admin review. You will receive {paymentStatus.views_limit} profile views once your payment is approved.
                    </p>
                    <p className="text-sm text-orange-600 mt-1">
                      Package: {paymentStatus.package_type?.toUpperCase()} • Submitted: {new Date(paymentStatus.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Rejected Alert */}
            {paymentStatus && paymentStatus.status === 'rejected' && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">Payment Rejected</h3>
                    <p className="text-red-700">
                      Your payment has been rejected. Please try again with the correct payment screenshot.
                    </p>
                    {paymentStatus.rejection_reason && (
                      <p className="text-sm text-red-600 mt-1">
                        Reason: {paymentStatus.rejection_reason}
                      </p>
                    )}
                    <div className="mt-3">
                      <Link href="/packages">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          Try Again
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Pending Alert */}
            {paymentStatus && paymentStatus.status === 'pending' && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">Payment Pending</h3>
                    <p className="text-blue-700">
                      Your payment is pending. Please upload payment screenshot so admin can review it.
                    </p>
                    <div className="mt-3">
                      <Link href="/packages">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Upload Screenshot
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Completion */}
            <Card className="border-humsafar-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Profile Completion</h3>
                    <p className="text-sm text-gray-600">Complete your profile to get better matches</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-humsafar-600 h-2 rounded-full"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-humsafar-600">{completionPercentage}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="border-humsafar-100 ">
            <CardContent className="p-4 sm:p-6">
              {/* Save Changes Button - Right Aligned */}
              <div className="mb-4 md:mb-6 flex justify-center md:justify-end">
                <Button
                  onClick={handleSaveAll}
                  disabled={isSavingAll}
                  className="bg-humsafar-500 hover:bg-humsafar-600 text-white px-6 w-full md:w-auto"
                >
                  {isSavingAll ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
                <TabsList className="flex w-full overflow-x-auto overflow-y-hidden scrollbar-hide mb-6 md:mb-8 bg-humsafar-500 text-white md:grid md:grid-cols-7 gap-1 p-1 md:p-2 shadow-lg rounded-lg h-fit">
                  <TabsTrigger
                    value="photos"
                    className={`flex items-center gap-2 transition-all duration-300 flex-shrink-0 px-4 py-3 md:px-3 md:py-2 rounded-lg text-sm font-medium whitespace-nowrap min-w-[80px] md:min-w-0 ${activeTab === "photos" ? "bg-white text-humsafar-500 font-semibold shadow-lg" : "hover:bg-humsafar-400 active:scale-95"}`}
                  >
                    <ImageIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Photos</span>
                    <span className="sm:hidden text-xs">Photos</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="basic"
                    className={`flex items-center gap-2 transition-all duration-300 flex-shrink-0 px-4 py-3 md:px-3 md:py-2 rounded-lg text-sm font-medium whitespace-nowrap min-w-[80px] md:min-w-0 ${activeTab === "basic" ? "bg-white text-humsafar-500 font-semibold shadow-lg scale-105" : "hover:bg-humsafar-400 hover:scale-102 active:scale-95"}`}
                  >
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Basic Info</span>
                    <span className="sm:hidden text-xs">Basic</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="lifestyle"
                    className={`flex items-center gap-2 transition-all duration-300 flex-shrink-0 px-4 py-3 md:px-3 md:py-2 rounded-lg text-sm font-medium whitespace-nowrap min-w-[80px] md:min-w-0 ${activeTab === "lifestyle" ? "bg-white text-humsafar-500 font-semibold shadow-lg scale-105" : "hover:bg-humsafar-400 hover:scale-102 active:scale-95"}`}
                  >
                    <Heart className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Lifestyle</span>
                    <span className="sm:hidden text-xs">Life</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="education"
                    className={`flex items-center gap-2 transition-all duration-300 flex-shrink-0 px-4 py-3 md:px-3 md:py-2 rounded-lg text-sm font-medium whitespace-nowrap min-w-[80px] md:min-w-0 ${activeTab === "education" ? "bg-white text-humsafar-500 font-semibold shadow-lg scale-105" : "hover:bg-humsafar-400 hover:scale-102 active:scale-95"}`}
                  >
                    <GraduationCap className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Career</span>
                    <span className="sm:hidden text-xs">Career</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="family"
                    className={`flex items-center gap-2 transition-all duration-300 flex-shrink-0 px-4 py-3 md:px-3 md:py-2 rounded-lg text-sm font-medium whitespace-nowrap min-w-[80px] md:min-w-0 ${activeTab === "family" ? "bg-white text-humsafar-500 font-semibold shadow-lg scale-105" : "hover:bg-humsafar-400 hover:scale-102 active:scale-95"}`}
                  >
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Family</span>
                    <span className="sm:hidden text-xs">Family</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="partner"
                    className={`flex items-center gap-2 transition-all duration-300 flex-shrink-0 px-4 py-3 md:px-3 md:py-2 rounded-lg text-sm font-medium whitespace-nowrap min-w-[80px] md:min-w-0 ${activeTab === "partner" ? "bg-white text-humsafar-500 font-semibold shadow-lg scale-105" : "hover:bg-humsafar-400 hover:scale-102 active:scale-95"}`}
                  >
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Partner</span>
                    <span className="sm:hidden text-xs">Partner</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className={`flex items-center gap-2 transition-all duration-300 flex-shrink-0 px-4 py-3 md:px-3 md:py-2 rounded-lg text-sm font-medium whitespace-nowrap min-w-[80px] md:min-w-0 ${activeTab === "settings" ? "bg-white text-humsafar-500 font-semibold shadow-lg scale-105" : "hover:bg-humsafar-400 hover:scale-102 active:scale-95"}`}
                  >
                    <Trash2 className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Settings</span>
                    <span className="sm:hidden text-xs">Settings</span>
                  </TabsTrigger>
                </TabsList>

                {/* Photos Tab - SECTION 1 */}
                <TabsContent value="photos" className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Profile Photos</h3>
                    <Button
                      onClick={refreshPhotos}
                      variant="outline"
                      size="sm"
                      disabled={isRefreshingPhotos}
                      className="border-humsafar-500 text-humsafar-500 hover:bg-humsafar-50 disabled:opacity-50 bg-transparent"
                    >
                      {isRefreshingPhotos ? (
                        <>
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <svg
                                className="w-4 h-4 animate-spin text-humsafar-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                            </div>
                            <span className="text-humsafar-500">Refreshing...</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Refresh Photos
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Upload up to 4 photos. Your first photo will be your main profile picture.
                  </p>

                  {/* Photo Grid */}
                  <div className="relative">
                    {/* Loading Overlay for Photo Operations */}
                    {isPhotoOperation && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-8 h-8 border-2 border-humsafar-300 border-t-humsafar-500 rounded-full animate-spin"></div>
                          <div className="text-humsafar-600 font-medium">Processing Photos...</div>
                          <div className="flex items-center space-x-1">
                            <div
                              className="w-2 h-2 bg-humsafar-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-humsafar-500 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-humsafar-500 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mb-3">
                      {photos.map((photo, index) => (
                        <div key={photo.id} className="relative group">
                          {/* Use display_url if present (signed/private), else image_url */}
                          <img
                            src={photo.display_url || photo.image_url}
                            alt={`Profile ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border border-humsafar-100"
                          />
                          {photo.is_main && <Badge className="absolute top-2 left-2 bg-humsafar-600">Main Photo</Badge>}
                          <button
                            onClick={() => void removeImage(photo)}
                            disabled={isPhotoOperation}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Remove photo"
                          >
                            {isPhotoOperation ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </button>
                          {!photo.is_main && (
                            <button
                              onClick={() => void makeMain(photo)}
                              disabled={isPhotoOperation}
                              className="absolute bottom-2 left-2 bg-white/90 text-humsafar-600 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isPhotoOperation ? (
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-humsafar-600 rounded-full animate-bounce"></div>
                                  <span>Updating...</span>
                                </div>
                              ) : (
                                "Make Main"
                              )}
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Upload Button */}
                      {photos.length < 4 && (
                        <label
                          className={`w-full aspect-square border-2 border-dashed border-humsafar-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-humsafar-500 transition-colors ${isPhotoOperation ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {isUploading ? (
                            // Enhanced Uploading Loader
                            <div className="flex flex-col items-center justify-center space-y-3">
                              {/* Animated Upload Icon */}
                              <div className="relative">
                                <Upload className="w-8 h-8 text-humsafar-500 animate-bounce" />
                                <div className="absolute inset-0 w-8 h-8 border-2 border-humsafar-300 border-t-humsafar-500 rounded-full animate-spin"></div>
                              </div>
                              {/* Uploading Text with Animation */}
                              <div className="text-center">
                                <div className="text-humsafar-600 font-medium mb-1">Uploading...</div>
                                <div className="flex items-center justify-center space-x-1">
                                  <div
                                    className="w-2 h-2 bg-humsafar-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-humsafar-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-humsafar-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                  ></div>
                                </div>
                              </div>
                              {/* Progress Bar */}
                              <div className="w-20 h-1 bg-humsafar-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-humsafar-500 rounded-full animate-pulse"
                                  style={{ width: "60%" }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">JPG/PNG up to {MAX_FILE_MB}MB</span>
                            </div>
                          ) : (
                            // Normal Upload State
                            <>
                              <Upload className="w-8 h-8 text-humsafar-500 mb-2" />
                              <span className="text-humsafar-600 font-medium">Upload Photo</span>
                              <span className="text-xs text-gray-500">JPG/PNG up to {MAX_FILE_MB}MB</span>
                            </>
                          )}

                          <input
                            type="file"
                            multiple
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleImageUpload}
                            disabled={isPhotoOperation}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {uploadError && <div className="text-red-500 text-xs whitespace-pre-line">{uploadError}</div>}
                    {photoSuccessMessage && <div className="text-green-600 text-xs">{photoSuccessMessage}</div>}

                    <div className="bg-humsafar50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Photo Guidelines:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Use clear, recent photos of yourself</li>
                        <li>• Include at least one close-up face photo</li>
                        <li>• Avoid group photos or photos with other people</li>
                        <li>• Dress modestly and appropriately</li>
                      </ul>
                    </div>
                    {/* Navigation buttons for Photos step */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 p-4 border-t border-gray-200 rounded-lg">
                      <Button
                        onClick={handlePrev}
                        disabled={isFirstTab(activeTab as TabKey)}
                        variant="outline"
                        className="w-full sm:w-auto px-4 sm:px-6 bg-white hover:bg-gray-50 border-humsafar-500 text-humsafar-500"
                      >
                        Previous
                      </Button>
                      <div className="flex gap-3">
                        {!isLastTab(activeTab as TabKey) && (
                          <Button
                            onClick={handleNext}
                            className="w-full sm:w-auto bg-humsafar-600 hover:bg-humsafar-700 text-white px-4 sm:px-6"
                          >
                            Next
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h3>

                    {/* Personal Details */}
                    <div className="space-y-6">
                      {/* Essential Profile Information */}
                      <div className="bg-humsafar-100 border border-humsafar-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-humsafar-100 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-humsafar-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-humsafar-800">Essential Profile Information</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                              <Input
                                value={profileData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                placeholder="Enter your first name"
                                className="border-humsafar-200 focus:border-humsafar-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                              <Input
                                value={profileData.middleName}
                                onChange={(e) => handleInputChange("middleName", e.target.value)}
                                placeholder="Enter your middle name (optional)"
                                className="border-humsafar-200 focus:border-humsafar-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                              <Input
                                value={profileData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                placeholder="Enter your last name"
                                className="border-humsafar-200 focus:border-humsafar-500"
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                              <Input
                                type="date"
                                value={profileData.dateOfBirth}
                                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                className="border-humsafar-200 focus:border-humsafar-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                              <Select
                                value={profileData.gender}
                                onValueChange={(value) => handleInputChange("gender", value)}
                              >
                                <SelectTrigger className="border-humsafar-200 focus:border-humsafar-500">
                                  <SelectValue placeholder="Select your gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                              <Input
                                value={profileData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="e.g., +92 300 1234567 or 03001234567"
                                className="border-humsafar-200 focus:border-humsafar-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Additional Personal Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                            <Input
                              value={profileData.religion}
                              onChange={(e) => handleInputChange("religion", e.target.value)}
                              placeholder="e.g., Islam, Christianity, Hinduism, Judaism"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sect</label>
                            <Input
                              value={profileData.sect}
                              onChange={(e) => handleInputChange("sect", e.target.value)}
                              placeholder="e.g., Sunni, Shia, Catholic, Protestant"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
                            <Input
                              value={profileData.caste}
                              onChange={(e) => handleInputChange("caste", e.target.value)}
                              placeholder="e.g., Rajput, Sheikh, Arain, Jatt"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label>
                            <Input
                              value={profileData.motherTongue}
                              onChange={(e) => handleInputChange("motherTongue", e.target.value)}
                              placeholder="e.g., Urdu, Punjabi, English, Arabic"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                            <Input
                              value={profileData.maritalStatus}
                              onChange={(e) => {
                                const value = e.target.value
                                handleInputChange("maritalStatus", value)
                                // Auto-fill haveChildren if "Never Married" is selected
                                if (value.toLowerCase().includes("never") || value.toLowerCase().includes("single")) {
                                  handleInputChange("haveChildren", "no")
                                }
                              }}
                              placeholder="e.g., Never Married, Divorced, Widowed, Separated"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Have Children</label>
                            <Select
                              value={profileData.haveChildren}
                              onValueChange={(value) => handleInputChange("haveChildren", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Do you have children?" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Physical Appearance */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Physical Appearance</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                            <Input
                              value={profileData.height}
                              onChange={(e) => handleInputChange("height", e.target.value)}
                              placeholder="e.g., 5'6&quot;, 170 cm, or your height"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                            <Input
                              type="number"
                              value={profileData.weight}
                              onChange={(e) => handleInputChange("weight", e.target.value)}
                              placeholder="Enter weight in kg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                            <Input
                              value={profileData.bodyType}
                              onChange={(e) => handleInputChange("bodyType", e.target.value)}
                              placeholder="e.g., Slim, Average, Athletic, Heavy"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Complexion</label>
                            <Input
                              value={profileData.complexion}
                              onChange={(e) => handleInputChange("complexion", e.target.value)}
                              placeholder="e.g., Fair, Wheatish, Dark, or describe your complexion"
                            />
                          </div>
                          {profileData.gender === "female" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Do you wear Hijab?</label>
                              <Input
                                value={profileData.wearHijab}
                                onChange={(e) => handleInputChange("wearHijab", e.target.value)}
                                placeholder="Yes/No or describe your preference"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Location</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                            <Input
                              value={profileData.country}
                              onChange={(e) => handleInputChange("country", e.target.value)}
                              placeholder="e.g., Pakistan, India, UAE, USA, UK"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                            <Input
                              value={profileData.state}
                              onChange={(e) => handleInputChange("state", e.target.value)}
                              placeholder="e.g., Punjab, Sindh, KPK, Balochistan"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <Input
                              value={profileData.city}
                              onChange={(e) => handleInputChange("city", e.target.value)}
                              placeholder="e.g., Karachi, Lahore, Islamabad, Rawalpindi"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                            <Input
                              value={profileData.area}
                              onChange={(e) => handleInputChange("area", e.target.value)}
                              placeholder="e.g., DHA, Gulshan, Model Town, F-7"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                            <Input
                              value={profileData.nationality}
                              onChange={(e) => handleInputChange("nationality", e.target.value)}
                              placeholder="e.g., Pakistani, Indian, American, British"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ethnicity</label>
                            <Input
                              value={profileData.ethnicity}
                              onChange={(e) => handleInputChange("ethnicity", e.target.value)}
                              placeholder="e.g., Punjabi, Sindhi, Pashtun, Baloch"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Navigation Buttons - Always Visible */}
                      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 p-4 border-t border-gray-200 rounded-lg">
                        <Button
                          onClick={handlePrev}
                          disabled={isFirstTab(activeTab as TabKey)}
                          variant="outline"
                          className="w-full sm:w-auto px-4 sm:px-6 bg-white hover:bg-gray-50 border-humsafar-500 text-humsafar-500"
                        >
                          Previous
                        </Button>
                        <div className="flex gap-3">
                          {isLastTab(activeTab as TabKey) && (
                            <Button
                              onClick={() => setConsentOpen(true)}
                              className="w-full sm:w-auto bg-humsafar-600 hover:bg-humsafar-700 text-white px-4 sm:px-6"
                            >
                              Save Changes
                            </Button>
                          )}
                          {!isLastTab(activeTab as TabKey) && (
                            <Button
                              onClick={handleNext}
                              className="w-full sm:w-auto bg-humsafar-600 hover:bg-humsafar-700 text-white px-4 sm:px-6"
                            >
                              Next
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Lifestyle Tab - SECTION 2 */}
                <TabsContent value="lifestyle" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Lifestyle & Values</h3>

                    <div className="space-y-6">
                      {/* Living & Habits */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Living & Habits</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Diet</label>
                            <Input
                              value={profileData.diet}
                              onChange={(e) => handleInputChange("diet", e.target.value)}
                              placeholder="e.g., Halal, Vegetarian, Non-Vegetarian, Vegan"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Drinking</label>
                            <Input
                              value={profileData.drink}
                              onChange={(e) => handleInputChange("drink", e.target.value)}
                              placeholder="e.g., Never, Occasionally, Socially, Regularly"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Smoking</label>
                            <Input
                              value={profileData.smoke}
                              onChange={(e) => handleInputChange("smoke", e.target.value)}
                              placeholder="e.g., Never, Occasionally, Socially, Regularly"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Living Situation</label>
                            <Input
                              value={profileData.livingSituation}
                              onChange={(e) => handleInputChange("livingSituation", e.target.value)}
                              placeholder="e.g., With Family, Alone, With Roommates, With Spouse"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Religious Values */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Religious Values</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Religious Values</label>
                            <Input
                              value={profileData.religiousValues}
                              onChange={(e) => handleInputChange("religiousValues", e.target.value)}
                              placeholder="e.g., Very Religious, Religious, Somewhat Religious, Not Religious"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Read Quran</label>
                            <Input
                              value={profileData.readQuran}
                              onChange={(e) => handleInputChange("readQuran", e.target.value)}
                              placeholder="e.g., Daily, Regularly, Occasionally, Never"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hafiz e Quran</label>
                            <Select
                              value={profileData.hafizQuran}
                              onValueChange={(value) => handleInputChange("hafizQuran", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Interests & Hobbies */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Interests & Hobbies</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {availableHobbies.map((hobby) => (
                            <div key={hobby} className="flex items-center space-x-2">
                              <Checkbox
                                id={hobby}
                                checked={profileData.hobbies.includes(hobby.toLowerCase().replace(/\s+/g, "-"))}
                                onCheckedChange={() => handleHobbyToggle(hobby.toLowerCase().replace(/\s+/g, "-"))}
                              />
                              <label htmlFor={hobby} className="text-sm text-gray-700">
                                {hobby}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* About Me */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">About Me</h4>
                        <Textarea
                          value={profileData.about}
                          onChange={(e) => handleInputChange("about", e.target.value)}
                          placeholder="Tell us about yourself, your personality, interests, and what makes you unique..."
                          rows={4}
                          className="resize-none"
                        />
                        <p className="text-sm text-gray-500 mt-2">{profileData.about.length}/500 characters</p>
                      </div>
                      {/* Navigation Buttons - SECTION 3 */}
                      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 p-4 border-t border-gray-200 rounded-lg">
                        <Button
                          onClick={handlePrev}
                          disabled={isFirstTab(activeTab as TabKey)}
                          variant="outline"
                          className="w-full sm:w-auto px-4 sm:px-6 bg-white hover:bg-gray-50 border-humsafar-500 text-humsafar-500"
                        >
                          Previous
                        </Button>
                        <div className="flex gap-3">
                          {!isLastTab(activeTab as TabKey) && (
                            <Button
                              onClick={handleNext}
                              className="w-full sm:w-auto bg-humsafar-600 hover:bg-humsafar-700 text-white px-4 sm:px-6"
                            >
                              Next
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Education & Career Tab - SECTION 3 */}
                <TabsContent value="education" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Education & Career</h3>

                    <div className="space-y-6">
                      {/* Education */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Education</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Highest Education</label>
                            <Input
                              value={profileData.education}
                              onChange={(e) => handleInputChange("education", e.target.value)}
                              placeholder="e.g., High School, Bachelor's, Master's, PhD"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                            <Input
                              value={profileData.fieldOfStudy}
                              onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                              placeholder="e.g., Computer Science, Business, Medicine, Engineering"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">College/University</label>
                            <Input
                              value={profileData.college}
                              onChange={(e) => handleInputChange("college", e.target.value)}
                              placeholder="Enter college/university name"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Career */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Career</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                            <Select
                              value={profileData.workingWith}
                              onValueChange={(value) => handleInputChange("workingWith", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select employment type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="job">Job</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="freelance">Freelance</SelectItem>
                                <SelectItem value="self-employed">Self-employed</SelectItem>
                                <SelectItem value="government">Government</SelectItem>
                                <SelectItem value="ngo">NGO</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                            <Input
                              value={profileData.annualIncome}
                              onChange={(e) => handleInputChange("annualIncome", e.target.value)}
                              placeholder="e.g., 2-4 Lakhs, 8-12 Lakhs, or your income range"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Navigation Buttons - Always Visible */}
                      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 p-4 border-t border-gray-200 rounded-lg">
                        <Button
                          onClick={handlePrev}
                          disabled={isFirstTab(activeTab as TabKey)}
                          variant="outline"
                          className="w-full sm:w-auto px-4 sm:px-6 bg-white hover:bg-gray-50 border-humsafar-500 text-humsafar-500"
                        >
                          Previous
                        </Button>
                        <div className="flex gap-3">
                          {!isLastTab(activeTab as TabKey) && (
                            <Button
                              onClick={handleNext}
                              className="w-full sm:w-auto bg-humsafar-600 hover:bg-humsafar-700 text-white px-4 sm:px-6"
                            >
                              Next
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Family Tab - SECTION 4 */}
                <TabsContent value="family" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Family Details</h3>

                    <div className="space-y-6">
                      {/* Family Background */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Family Background</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Father's Occupation</label>
                            <Input
                              value={profileData.fatherOccupation}
                              onChange={(e) => handleInputChange("fatherOccupation", e.target.value)}
                              placeholder="Enter father's occupation"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Occupation</label>
                            <Input
                              value={profileData.motherOccupation}
                              onChange={(e) => handleInputChange("motherOccupation", e.target.value)}
                              placeholder="Enter mother's occupation"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Brothers</label>
                            <Input
                              type="number"
                              value={profileData.brothers}
                              onChange={(e) => handleInputChange("brothers", e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Brothers Married</label>
                            <Input
                              type="number"
                              value={profileData.brothersMarried}
                              onChange={(e) => handleInputChange("brothersMarried", e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Sisters</label>
                            <Input
                              type="number"
                              value={profileData.sisters}
                              onChange={(e) => handleInputChange("sisters", e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sisters Married</label>
                            <Input
                              type="number"
                              value={profileData.sistersMarried}
                              onChange={(e) => handleInputChange("sistersMarried", e.target.value)}
                              placeholder="0"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Family Values</label>
                            <Input
                              value={profileData.familyValues}
                              onChange={(e) => handleInputChange("familyValues", e.target.value)}
                              placeholder="e.g., Traditional, Moderate, Liberal, or describe your values"
                            />
                          </div>
                        </div>
                      </div>

                      {/* House Ownership */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">House Ownership</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">House Status</label>
                            <Select
                              value={profileData.houseOwnership}
                              onValueChange={(value) => {
                                handleInputChange("houseOwnership", value)
                                // Clear house owner if renting
                                if (value === "rent") {
                                  handleInputChange("houseOwner", "")
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select house status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="own">Own</SelectItem>
                                <SelectItem value="rent">Rent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {profileData.houseOwnership === "own" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">House Owner</label>
                              <Select
                                value={profileData.houseOwner}
                                onValueChange={(value) => handleInputChange("houseOwner", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select owner" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="parents">Parents</SelectItem>
                                  <SelectItem value="grandparents">Grand Parents</SelectItem>
                                  <SelectItem value="self">Self</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Navigation Buttons - Always Visible */}
                      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 p-4 border-t border-gray-200 rounded-lg">
                        <Button
                          onClick={handlePrev}
                          disabled={isFirstTab(activeTab as TabKey)}
                          variant="outline"
                          className="w-full sm:w-auto px-4 sm:px-6 bg-white hover:bg-gray-50 border-humsafar-500 text-humsafar-500"
                        >
                          Previous
                        </Button>
                        <div className="flex gap-3">
                          {!isLastTab(activeTab as TabKey) && (
                            <Button
                              onClick={handleNext}
                              className="w-full sm:w-auto bg-humsafar-600 hover:bg-humsafar-700 text-white px-4 sm:px-6"
                            >
                              Next
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Partner Preferences Tab - SECTION 5 */}
                <TabsContent value="partner" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Partner Preferences</h3>

                    <div className="space-y-6">
                      {/* Basic Preferences */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Basic Requirements</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Age From</label>
                            <Input
                              type="number"
                              value={profileData.partnerAgeFrom}
                              onChange={(e) => handleInputChange("partnerAgeFrom", e.target.value)}
                              placeholder="Minimum age"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Age To</label>
                            <Input
                              type="number"
                              value={profileData.partnerAgeTo}
                              onChange={(e) => handleInputChange("partnerAgeTo", e.target.value)}
                              placeholder="Maximum age"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Height From</label>
                            <Input
                              value={profileData.partnerHeightFrom}
                              onChange={(e) => handleInputChange("partnerHeightFrom", e.target.value)}
                              placeholder="e.g., 5'0&quot;, 150 cm, or minimum height"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Height To</label>
                            <Input
                              value={profileData.partnerHeightTo}
                              onChange={(e) => handleInputChange("partnerHeightTo", e.target.value)}
                              placeholder="e.g., 6'0&quot;, 180 cm, or maximum height"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                            <Input
                              value={profileData.partnerEducation}
                              onChange={(e) => handleInputChange("partnerEducation", e.target.value)}
                              placeholder="e.g., Any, High School, Graduate, Post Graduate"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                            <Input
                              value={profileData.partnerOccupation}
                              onChange={(e) => handleInputChange("partnerOccupation", e.target.value)}
                              placeholder="e.g., Any, Business, Service, Professional"
                            />
                          </div>
                          {/* Income field - Only show for female users */}
                          {profileData.gender === "female" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Income</label>
                              <Input
                                value={profileData.partnerIncome}
                                onChange={(e) => handleInputChange("partnerIncome", e.target.value)}
                                placeholder="e.g., Rs. 5 Lakhs and above, or describe income preference"
                              />
                            </div>
                          )}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <Input
                              value={profileData.partnerLocation}
                              onChange={(e) => handleInputChange("partnerLocation", e.target.value)}
                              placeholder="Preferred cities (comma separated)"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Religious & Cultural */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Religious & Cultural</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                            <Input
                              value={profileData.partnerReligion}
                              onChange={(e) => handleInputChange("partnerReligion", e.target.value)}
                              placeholder="e.g., Islam, Christianity, Hinduism, Any"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sect</label>
                            <Input
                              value={profileData.partnerSect}
                              onChange={(e) => handleInputChange("partnerSect", e.target.value)}
                              placeholder="e.g., Sunni, Shia, Any, or describe preference"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                            <Input
                              value={profileData.partnerMaritalStatus}
                              onChange={(e) => handleInputChange("partnerMaritalStatus", e.target.value)}
                              placeholder="e.g., Never Married, Divorced, Widowed, Any"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Religious Values</label>
                            <Input
                              value={profileData.partnerReligiousValues}
                              onChange={(e) => handleInputChange("partnerReligiousValues", e.target.value)}
                              placeholder="e.g., Very Religious, Religious, Somewhat Religious, Any"
                            />
                          </div>
                          {profileData.gender === "male" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Partner should wear Hijab?
                              </label>
                              <Select
                                value={profileData.partnerWearHijab}
                                onValueChange={(value) => handleInputChange("partnerWearHijab", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select preference" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                  <SelectItem value="any">Any</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          {profileData.gender === "female" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Do you support partner's polygamy?
                              </label>
                              <Select
                                value={profileData.partnerPolygamy}
                                onValueChange={(value) => handleInputChange("partnerPolygamy", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select preference" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                  <SelectItem value="depends">Depends on situation</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          {profileData.gender === "male" && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Do you support polygamy?
                              </label>
                              <Select
                                value={profileData.polygamy}
                                onValueChange={(value) => handleInputChange("polygamy", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yes">Yes</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                  <SelectItem value="depends">Depends on situation</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Children Preferences */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Children Preferences</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Want Children</label>
                            <Select
                              value={profileData.wantChildren}
                              onValueChange={(value) => handleInputChange("wantChildren", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                                <SelectItem value="maybe">Maybe</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Additional Information</h4>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Extra Details</label>
                          <Textarea
                            value={profileData.additionalInfo || ""}
                            onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                            placeholder="Add any additional information about your preferences, family, or anything else you'd like to share..."
                            rows={4}
                            className="resize-none"
                          />
                          <p className="text-sm text-gray-500 mt-2">
                            {(profileData.additionalInfo || "").length}/500 characters
                          </p>
                        </div>
                      </div>

                      {/* What I'm Looking For */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">What I'm Looking For</h4>
                        <Textarea
                          value={profileData.lookingFor}
                          onChange={(e) => handleInputChange("lookingFor", e.target.value)}
                          placeholder="Describe what you're looking for in a life partner..."
                          rows={4}
                          className="resize-none"
                        />
                        <p className="text-sm text-gray-500 mt-2">{profileData.lookingFor.length}/500 characters</p>
                      </div>
                      {/* Navigation Buttons - Always Visible */}
                      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 p-4 border-t border-gray-200 rounded-lg">
                        <Button
                          onClick={handlePrev}
                          disabled={isFirstTab(activeTab as TabKey)}
                          variant="outline"
                          className="w-full sm:w-auto px-4 sm:px-6 bg-white hover:bg-gray-50 border-humsafar-500 text-humsafar-500"
                        >
                          Previous
                        </Button>
                        <div className="flex gap-3">
                          {/* replaced partner tab next navigation with a save button using existing save logic */}
                          <Button
                            onClick={() => setConsentOpen(true)}
                            className="w-full sm:w-auto bg-humsafar-600 hover:bg-humsafar-700 text-white px-4 sm:px-6"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Settings Tab - Profile Deletion */}
                <TabsContent value="settings" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h3>

                    <div className="space-y-6">
                      {/* Profile Deletion Section */}
                      <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-red-800 mb-2">Delete Profile</h4>
                            <p className="text-red-700 mb-4">
                              Permanently delete your profile and all associated data. This action cannot be undone.
                            </p>
                            <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-4">
                              <h5 className="font-medium text-red-800 mb-2">What will be deleted:</h5>
                              <ul className="text-sm text-red-700 space-y-1">
                                <li>• Your profile information and photos</li>
                                <li>• All subscription data</li>
                                <li>• Profile views and interactions</li>
                                <li>• Account authentication data</li>
                                <li>• All uploaded images from storage</li>
                              </ul>
                            </div>
                            <ProfileDeletionDialog
                              onSuccess={() => {
                                // Handle successful deletion - user will be redirected
                                console.log("Profile deleted successfully")
                              }}
                              onError={(error) => {
                                // Handle deletion error
                                console.error("Profile deletion error:", error)
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Settings can be added here in the future */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">More Settings</h4>
                        <p className="text-gray-600">
                          Additional account settings and preferences will be available here in future updates.
                        </p>
                      </div>
                    </div>

                    {/* Navigation Buttons - Always Visible */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 p-4 border-t border-gray-200 rounded-lg">
                      <Button
                        onClick={handlePrev}
                        disabled={isFirstTab(activeTab as TabKey)}
                        variant="outline"
                        className="w-full sm:w-auto px-4 sm:px-6 bg-white hover:bg-gray-50 border-humsafar-500 text-humsafar-500"
                      >
                        Previous
                      </Button>
                      <div className="flex gap-3">
                        {!isLastTab(activeTab as TabKey) && (
                          <Button
                            onClick={handleNext}
                            className="w-full sm:w-auto bg-humsafar-600 hover:bg-humsafar-700 text-white px-4 sm:px-6"
                          >
                            Next
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Consent Modal for saving profile */}
      <AlertDialog open={consentOpen} onOpenChange={setConsentOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Consent Required</AlertDialogTitle>
            <AlertDialogDescription>
              I hereby give my consent to share my information. I also consent to allow other users to directly contact me using the numbers I am providing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConsentOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConsentOpen(false)
                void handleSaveAll()
              }}
              className="bg-humsafar-600 hover:bg-humsafar-700"
            >
              I Agree & Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
    </div>
  )
}
