'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Plus, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { calculateAge } from '@/lib/utils';
import AdminSidebar from '@/components/AdminSidebar';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface ProfileFormData {
  // Basic Information
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  age: number | null;
  gender: string;
  city: string;
  country: string;
  state: string;
  area: string;
  nationality: string;
  ethnicity: string;
  
  // Religious Information
  religion: string;
  sect: string;
  caste: string;
  mother_tongue: string;
  marital_status: string;
  
  // Physical Appearance
  height: string;
  weight: string;
  body_type: string;
  complexion: string;
  wear_hijab: string;
  
  // Lifestyle
  diet: string;
  drink: string;
  smoke: string;
  living_situation: string;
  religious_values: string;
  read_quran: string;
  hafiz_quran: string;
  polygamy: string;
  
  // Education & Career
  education: string;
  field_of_study: string;
  custom_field_of_study: string;
  college: string;
  working_with: string;
  annual_income: string;
  occupation: string;
  
  // Family Information
  father_occupation: string;
  mother_occupation: string;
  brothers: number | null;
  brothers_married: number | null;
  sisters: number | null;
  sisters_married: number | null;
  family_values: string;
  have_children: string;
  want_children: string;
  house_ownership: string;
  house_owner: string;
  
  // Partner Preferences
  partner_age_from: number | null;
  partner_age_to: number | null;
  partner_height_from: string;
  partner_height_to: string;
  partner_education: string;
  partner_occupation: string;
  partner_income: string;
  partner_location: string;
  partner_religion: string;
  partner_sect: string;
  partner_caste: string;
  partner_marital_status: string;
  partner_have_children: string;
  partner_want_children: string;
  partner_religious_values: string;
  partner_wear_hijab: string;
  partner_polygamy: string;
  
  // About & Interests
  about: string;
  looking_for: string;
  hobbies: string;
  additional_info: string;
  
  // Subscription Settings
  subscription_status: string;
  profile_status: string;
  views_limit: number;
  verified_badge: boolean;
  boost_profile: boolean;
}

interface UploadedImage {
  id?: string;
  file?: File;
  url: string;
  is_main: boolean;
}

  export default function CreateProfile() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [activeTab, setActiveTab] = useState('photos');
  const [pasteText, setPasteText] = useState<string>("");
  const tabOrder = ['photos', 'basic', 'religious', 'physical', 'lifestyle', 'education', 'family', 'partner', 'paste'] as const;
  const goPrev = () => {
    const idx = tabOrder.indexOf(activeTab as typeof tabOrder[number]);
    if (idx > 0) setActiveTab(tabOrder[idx - 1]);
  };
  const goNext = () => {
    const idx = tabOrder.indexOf(activeTab as typeof tabOrder[number]);
    if (idx < tabOrder.length - 1) setActiveTab(tabOrder[idx + 1]);
  };
  const isFirstTab = tabOrder.indexOf(activeTab as typeof tabOrder[number]) === 0;
  const isLastTab = tabOrder.indexOf(activeTab as typeof tabOrder[number]) === tabOrder.length - 1;
  const router = useRouter();

  const [formData, setFormData] = useState<ProfileFormData>({
    // Basic Information
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    age: null,
    gender: '',
    city: '',
    country: '',
    state: '',
    area: '',
    nationality: '',
    ethnicity: '',
    
    // Religious Information
    religion: '',
    sect: '',
    caste: '',
    mother_tongue: '',
    marital_status: '',
    
    // Physical Appearance
    height: '',
    weight: '',
    body_type: '',
    complexion: '',
    wear_hijab: '',
    
    // Lifestyle
    diet: '',
    drink: '',
    smoke: '',
    living_situation: '',
    religious_values: '',
    read_quran: '',
    hafiz_quran: '',
    polygamy: '',
    
    // Education & Career
    education: '',
    field_of_study: '',
    custom_field_of_study: '',
    college: '',
    working_with: '',
    annual_income: '',
    occupation: '',
    
    // Family Information
    father_occupation: '',
    mother_occupation: '',
    brothers: null,
    brothers_married: null,
    sisters: null,
    sisters_married: null,
    family_values: '',
    have_children: '',
    want_children: '',
    house_ownership: '',
    house_owner: '',
    
    // Partner Preferences
    partner_age_from: null,
    partner_age_to: null,
    partner_height_from: '',
    partner_height_to: '',
    partner_education: '',
    partner_occupation: '',
    partner_income: '',
    partner_location: '',
    partner_religion: '',
    partner_sect: '',
    partner_caste: '',
    partner_marital_status: '',
    partner_have_children: '',
    partner_want_children: '',
    partner_religious_values: '',
    partner_wear_hijab: '',
    partner_polygamy: '',
    
    // Personal Information
    about: '',
    looking_for: '',
    hobbies: '',
    additional_info: '',
    
    // Subscription Settings
    subscription_status: 'free',
    profile_status: 'approved',
    views_limit: 0,
    verified_badge: false,
    boost_profile: false,
  });

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = () => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsedSession = JSON.parse(session);
      setAdminSession(parsedSession);
    } catch (error) {
      console.error('Invalid admin session:', error);
      localStorage.removeItem('admin_session');
      router.push('/admin/login');
    }
  };

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => {
      // Auto-calculate age when date_of_birth changes
      if (field === 'date_of_birth') {
        const dob = value as string;
        const age = dob ? calculateAge(dob) : null;
        return {
          ...prev,
          date_of_birth: dob,
          age,
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const MAX_IMAGES = 4;
    const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

    setImages(prev => {
      const remainingSlots = MAX_IMAGES - prev.length;
      const validNewImages: UploadedImage[] = [];

      if (remainingSlots <= 0) {
        toast({
          title: 'Limit reached',
          description: 'You can upload up to 4 photos.',
          variant: 'destructive',
        });
        return prev;
      }

      Array.from(files)
        .slice(0, remainingSlots)
        .forEach(file => {
          if (!file.type.startsWith('image/')) return;
          if (file.size > MAX_SIZE_BYTES) {
            toast({
              title: 'File too large',
              description: 'Each photo must be under 4MB.',
              variant: 'destructive',
            });
            return;
          }
          const url = URL.createObjectURL(file);
          validNewImages.push({
            file,
            url,
            is_main: prev.length === 0 && validNewImages.length === 0, // First overall image becomes main
          });
        });

      if (validNewImages.length === 0) return prev;
      return [...prev, ...validNewImages];
    });
  };

  // Simple parser for the "Paste" tab to auto-fill fields from free text
  const parsePastedText = (text: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const map: Record<string, string> = {};

    // Normalize bullets like "◼" and separators like ":", ".", ".."
    lines.forEach(line => {
      // Remove leading bullets and extra spaces
      const cleaned = line.replace(/^([\u25A0\u25AA\u25CF\u25E6\-\*]+)\s*/, '').trim();
      // Split on common separators
      const parts = cleaned.split(/\s*[:\.]{1,2}\s*/);
      if (parts.length >= 2) {
        const key = parts[0].toLowerCase();
        const value = parts.slice(1).join(' ').trim();
        map[key] = value;
      }
    });

    // Helper to get value by possible labels
    const getVal = (labels: string[], fallback = '') => {
      for (const label of labels) {
        const v = map[label.toLowerCase()];
        if (v) return v;
      }
      return fallback;
    };

    // Extract numeric ranges like "21-30"
    const parseRange = (v: string) => {
      const m = v.match(/(\d{1,2})\s*[-to]+\s*(\d{1,2})/i);
      if (m) return { from: parseInt(m[1]), to: parseInt(m[2]) };
      return null;
    };

    // Extract height like "6 2" or "5'3" etc.
    const normalizeHeight = (v: string) => {
      const s = v.toLowerCase();
      const feetInches1 = s.match(/(\d)\s*'\s*(\d{1,2})/); // 5'3
      const feetInches2 = s.match(/(\d)\s*(\d{1,2})/); // 6 2
      if (feetInches1) return `${feetInches1[1]}'${feetInches1[2]}`;
      if (feetInches2) return `${feetInches2[1]}'${feetInches2[2]}`;
      const justFeet = s.match(/(\d)\s*'?\s*feet?/);
      if (justFeet) return `${justFeet[1]}'0`;
      return v;
    };

    // Build updates for formData
    const updates: Partial<ProfileFormData> = {};

    // Personal details
    const fullName = getVal(['name']);
    if (fullName) {
      const parts = fullName.split(/\s+/);
      updates.first_name = parts[0] || '';
      updates.last_name = parts.slice(1).join(' ');
    }
    const gender = getVal(['gender']);
    if (gender) updates.gender = gender.toLowerCase().includes('male') ? 'male' : gender.toLowerCase().includes('female') ? 'female' : gender;
    const caste = getVal(['cast', 'caste']);
    if (caste) updates.caste = caste;
    const ageStr = getVal(['age']);
    if (ageStr) {
      const m = ageStr.match(/\d{1,3}/);
      if (m) updates.age = parseInt(m[0]);
    }
    const edu = getVal(['edu', 'education']);
    if (edu) updates.education = edu;
    const job = getVal(['job', 'occupation']);
    if (job) updates.occupation = job;
    const post = getVal(['post']);
    if (post) updates.field_of_study = post; // store in field_of_study as placeholder
    const salary = getVal(['salary', 'income']);
    if (salary) updates.annual_income = salary;
    const belongs = getVal(['belongs', 'hometown', 'from']);
    if (belongs) updates.nationality = belongs;
    const height = getVal(['height']);
    if (height) updates.height = normalizeHeight(height);
    const maslak = getVal(['maslak', 'sect']);
    if (maslak) updates.sect = maslak.toLowerCase();
    const marital = getVal(['marital status']);
    if (marital) updates.marital_status = marital.toLowerCase().includes('single') ? 'never_married' : marital.toLowerCase();
    const complexion = getVal(['complexion']);
    if (complexion) updates.complexion = complexion.toLowerCase();
    const motherTongue = getVal(['mother tongue']);
    if (motherTongue) updates.mother_tongue = motherTongue;
    const familyStatus = getVal(['family status']);
    if (familyStatus) updates.family_values = familyStatus;
    const area = getVal(['area']);
    if (area) updates.area = area;
    const city = getVal(['city']);
    if (city) updates.city = city;
    const country = getVal(['country']);
    if (country) updates.country = country;

    // Family details
    const fatherOcc = getVal(["father's", 'father occupation']);
    if (fatherOcc) updates.father_occupation = fatherOcc;
    const motherOcc = getVal(['mother', 'mother occupation']);
    if (motherOcc) updates.mother_occupation = motherOcc;
    const brothers = getVal(['brothers']);
    if (brothers) {
      const m = brothers.match(/\d+/);
      if (m) updates.brothers = parseInt(m[0]);
    }
    const sisters = getVal(['sisters']);
    if (sisters) {
      const m = sisters.match(/\d+/);
      if (m) updates.sisters = parseInt(m[0]);
    }

    // Requirements for Match (partner preferences)
    const ageRange = getVal(['requirements for match', 'req for match']);
    const partnerAge = getVal(['age']);
    const rangeVal = parseRange(partnerAge || ageRange);
    if (rangeVal) {
      updates.partner_age_from = rangeVal.from;
      updates.partner_age_to = rangeVal.to;
    }
    const ph = getVal(['hight', 'height']);
    if (ph) updates.partner_height_from = normalizeHeight(ph);
    const eduReq = getVal(['edu']);
    if (eduReq) updates.partner_education = eduReq;
    const castReq = getVal(['cast']);
    if (castReq) updates.partner_caste = castReq;
    const complexionReq = getVal(['complexion']);
    if (complexionReq) updates.partner_religious_values = complexionReq; // placeholder mapping
    const areaReq = getVal(['area']);
    if (areaReq) updates.partner_location = areaReq;
    const maslakReq = getVal(['maslak']);
    if (maslakReq) updates.partner_sect = maslakReq.toLowerCase();
    const maritalReq = getVal(['marital status']);
    if (maritalReq) updates.partner_marital_status = maritalReq.toLowerCase().includes('single') ? 'never_married' : 'any';
    const incomeReq = getVal(['income']);
    if (incomeReq) updates.partner_income = incomeReq;
    const polygamyReq = getVal(['2nd marriage acpt?']);
    if (polygamyReq) updates.partner_polygamy = polygamyReq.toLowerCase().includes('yes') ? 'accept' : polygamyReq.toLowerCase().includes('no') ? 'reject' : 'maybe';

    // Additional free text sections
    const otherReq = getVal(['other reqment', 'other requirement']);
    if (otherReq) updates.looking_for = otherReq;

    // Apply updates
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // If we removed the main image, make the first remaining image main
      if (prev[index].is_main && newImages.length > 0) {
        newImages[0].is_main = true;
      }
      return newImages;
    });
  };

  const setMainImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      is_main: i === index
    })));
  };

  const handleSubmit = async () => {
    if (!adminSession) return;

    // Validate required fields
    if (!formData.first_name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "First name and email are required",
        variant: "destructive",
      });
      return;
    }

    // Validate DOB and age range (18–100)
    if (formData.date_of_birth) {
      const age = calculateAge(formData.date_of_birth);
      if (age < 18 || age > 100) {
        toast({
          title: "Invalid Age",
          description: "Age must be between 18 and 100 based on DOB",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      // First, create the profile
      const response = await fetch('/api/admin/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-auth': JSON.stringify(adminSession),
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create profile');
      }

      const userId = result.data.user_id;

      // Upload images if any
      if (images.length > 0) {
        for (const image of images) {
          if (image.file) {
            const imageFormData = new FormData();
            imageFormData.append('file', image.file);
            imageFormData.append('userId', userId);
            imageFormData.append('isMain', image.is_main.toString());

            const imageResponse = await fetch('/api/admin/profile/upload-image', {
              method: 'POST',
              headers: {
                'admin-auth': JSON.stringify(adminSession),
              },
              body: imageFormData,
            });

            if (!imageResponse.ok) {
              console.error('Failed to upload image:', await imageResponse.text());
            }
          }
        }
      }

      // Show success message with auth credentials
      const authCredentials = result.data.auth_credentials;
      toast({
        title: "Success",
        description: `Profile created successfully! Auth Email: ${authCredentials.email} | Password: ${authCredentials.password}`,
      });

      // Also log credentials to console for admin reference
      console.log('Generated Auth Credentials:', authCredentials);

      router.push('/admin/profiles');

    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!adminSession) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/profiles')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profiles
            </Button>
            <h1 className="text-3xl font-bold">Create New Profile</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Create a complete user profile with all necessary information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-9">
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="religious">Religious</TabsTrigger>
                  <TabsTrigger value="physical">Physical</TabsTrigger>
                  <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="family">Family</TabsTrigger>
                  <TabsTrigger value="partner">Partner</TabsTrigger>
                  <TabsTrigger value="paste">Paste</TabsTrigger>
                </TabsList>

                {/* Photos Tab */}
                <TabsContent value="photos" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Profile Photos</h3>
                    
                    {/* Uploaded Photos Display */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={`Profile ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                            />
                            {image.is_main && (
                              <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                                Main Photo
                              </Badge>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!image.is_main && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setMainImage(index)}
                                  className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                                  title="Set as main photo"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeImage(index)}
                                className="h-6 w-6 p-0 bg-red-500/80 hover:bg-red-500"
                                title="Remove photo"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="space-y-2">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Button variant="outline" className="mb-2" asChild>
                            <span>Choose Photos</span>
                          </Button>
                          <input
                            id="image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="text-sm text-gray-600">
                          Max 4 photos. Each photo must be under 4MB. The first photo will be set as main.
                        </p>
                      </div>
                    </div>

                    {/* Photo Guidelines */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Photo Guidelines:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Upload clear, recent photos of yourself</li>
                        <li>• Face should be clearly visible</li>
                        <li>• Avoid group photos or photos with other people</li>
                        <li>• Professional or casual photos work best</li>
                        <li>• Maximum file size: 4MB per photo</li>
                        <li>• Maximum photos: 4</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name *</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="middle_name">Middle Name</Label>
                      <Input
                        id="middle_name"
                        value={formData.middle_name}
                        onChange={(e) => handleInputChange('middle_name', e.target.value)}
                        placeholder="Enter your middle name (optional)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        placeholder="Select your date of birth"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age || ''}
                        readOnly
                        placeholder="Auto-calculated from DOB"
                      />
                      <p className="text-xs text-gray-500 mt-1">Age is auto-calculated from date of birth.</p>
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter your city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="Enter your country"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Enter your state/province"
                      />
                    </div>
                    <div>
                      <Label htmlFor="area">Area</Label>
                      <Input
                        id="area"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        placeholder="Enter your area/locality"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        placeholder="Enter your nationality"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ethnicity">Ethnicity</Label>
                      <Input
                        id="ethnicity"
                        value={formData.ethnicity}
                        onChange={(e) => handleInputChange('ethnicity', e.target.value)}
                        placeholder="Enter your ethnicity"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Religious Information Tab */}
                <TabsContent value="religious" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="religion">Religion</Label>
                      <Select value={formData.religion} onValueChange={(value) => handleInputChange('religion', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your religion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="islam">Islam</SelectItem>
                          <SelectItem value="christianity">Christianity</SelectItem>
                          <SelectItem value="hinduism">Hinduism</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="sect">Sect</Label>
                      <Input
                        id="sect"
                        value={formData.sect}
                        onChange={(e) => handleInputChange('sect', e.target.value)}
                        placeholder="Enter your sect (e.g., Sunni, Shia)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="caste">Caste</Label>
                      <Input
                        id="caste"
                        value={formData.caste}
                        onChange={(e) => handleInputChange('caste', e.target.value)}
                        placeholder="Enter your caste"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mother_tongue">Mother Tongue</Label>
                      <Input
                        id="mother_tongue"
                        value={formData.mother_tongue}
                        onChange={(e) => handleInputChange('mother_tongue', e.target.value)}
                        placeholder="Enter your mother tongue"
                      />
                    </div>
                    <div>
                      <Label htmlFor="marital_status">Marital Status</Label>
                      <Select value={formData.marital_status} onValueChange={(value) => handleInputChange('marital_status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your marital status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never_married">Never Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                          <SelectItem value="separated">Separated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Physical Appearance Tab */}
                <TabsContent value="physical" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="e.g., 5'6\"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        placeholder="e.g., 65 kg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="body_type">Body Type</Label>
                      <Select value={formData.body_type} onValueChange={(value) => handleInputChange('body_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select body type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slim">Slim</SelectItem>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="athletic">Athletic</SelectItem>
                          <SelectItem value="heavy">Heavy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="complexion">Complexion</Label>
                      <Select value={formData.complexion} onValueChange={(value) => handleInputChange('complexion', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select complexion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="wear_hijab">Wear Hijab</Label>
                      <Select value={formData.wear_hijab} onValueChange={(value) => handleInputChange('wear_hijab', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="sometimes">Sometimes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Lifestyle Tab */}
                <TabsContent value="lifestyle" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="diet">Diet</Label>
                      <Select value={formData.diet} onValueChange={(value) => handleInputChange('diet', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select diet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="halal">Halal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="drink">Drink</Label>
                      <Select value={formData.drink} onValueChange={(value) => handleInputChange('drink', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="occasionally">Occasionally</SelectItem>
                          <SelectItem value="regularly">Regularly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="smoke">Smoke</Label>
                      <Select value={formData.smoke} onValueChange={(value) => handleInputChange('smoke', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="occasionally">Occasionally</SelectItem>
                          <SelectItem value="regularly">Regularly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="living_situation">Living Situation</Label>
                      <Select value={formData.living_situation} onValueChange={(value) => handleInputChange('living_situation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select living situation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="with_family">With Family</SelectItem>
                          <SelectItem value="alone">Alone</SelectItem>
                          <SelectItem value="with_roommates">With Roommates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="religious_values">Religious Values</Label>
                      <Select value={formData.religious_values} onValueChange={(value) => handleInputChange('religious_values', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select religious values" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very_religious">Very Religious</SelectItem>
                          <SelectItem value="religious">Religious</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="not_religious">Not Religious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="read_quran">Read Quran</Label>
                      <Select value={formData.read_quran} onValueChange={(value) => handleInputChange('read_quran', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="occasionally">Occasionally</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="hafiz_quran">Hafiz Quran</Label>
                      <Select value={formData.hafiz_quran} onValueChange={(value) => handleInputChange('hafiz_quran', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="polygamy">Polygamy</Label>
                      <Select value={formData.polygamy} onValueChange={(value) => handleInputChange('polygamy', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accept">Accept</SelectItem>
                          <SelectItem value="reject">Reject</SelectItem>
                          <SelectItem value="maybe">Maybe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Education & Career Tab */}
                <TabsContent value="education" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="education">Education</Label>
                      <Select value={formData.education} onValueChange={(value) => handleInputChange('education', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high_school">High School</SelectItem>
                          <SelectItem value="bachelors">Bachelor's</SelectItem>
                          <SelectItem value="masters">Master's</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="field_of_study">Field of Study</Label>
                      <Input
                        id="field_of_study"
                        value={formData.field_of_study}
                        onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom_field_of_study">Custom Field of Study</Label>
                      <Input
                        id="custom_field_of_study"
                        value={formData.custom_field_of_study}
                        onChange={(e) => handleInputChange('custom_field_of_study', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="college">College/University</Label>
                      <Input
                        id="college"
                        value={formData.college}
                        onChange={(e) => handleInputChange('college', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="working_with">Working With</Label>
                      <Select value={formData.working_with} onValueChange={(value) => handleInputChange('working_with', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private_company">Private Company</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="self_employed">Self Employed</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="not_working">Not Working</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="annual_income">Annual Income</Label>
                      <Input
                        id="annual_income"
                        value={formData.annual_income}
                        onChange={(e) => handleInputChange('annual_income', e.target.value)}
                        placeholder="e.g., 500,000 PKR"
                      />
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input
                        id="occupation"
                        value={formData.occupation}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Family Information Tab */}
                <TabsContent value="family" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="father_occupation">Father's Occupation</Label>
                      <Input
                        id="father_occupation"
                        value={formData.father_occupation}
                        onChange={(e) => handleInputChange('father_occupation', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mother_occupation">Mother's Occupation</Label>
                      <Input
                        id="mother_occupation"
                        value={formData.mother_occupation}
                        onChange={(e) => handleInputChange('mother_occupation', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="brothers">Number of Brothers</Label>
                      <Input
                        id="brothers"
                        type="number"
                        value={formData.brothers || ''}
                        onChange={(e) => handleInputChange('brothers', e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="brothers_married">Brothers Married</Label>
                      <Input
                        id="brothers_married"
                        type="number"
                        value={formData.brothers_married || ''}
                        onChange={(e) => handleInputChange('brothers_married', e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sisters">Number of Sisters</Label>
                      <Input
                        id="sisters"
                        type="number"
                        value={formData.sisters || ''}
                        onChange={(e) => handleInputChange('sisters', e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sisters_married">Sisters Married</Label>
                      <Input
                        id="sisters_married"
                        type="number"
                        value={formData.sisters_married || ''}
                        onChange={(e) => handleInputChange('sisters_married', e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="family_values">Family Values</Label>
                      <Select value={formData.family_values} onValueChange={(value) => handleInputChange('family_values', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select family values" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="traditional">Traditional</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="liberal">Liberal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="have_children">Have Children</Label>
                      <Select value={formData.have_children} onValueChange={(value) => handleInputChange('have_children', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="want_children">Want Children</Label>
                      <Select value={formData.want_children} onValueChange={(value) => handleInputChange('want_children', value)}>
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
                    <div>
                      <Label htmlFor="house_ownership">House Ownership</Label>
                      <Select value={formData.house_ownership} onValueChange={(value) => handleInputChange('house_ownership', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owned">Owned</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                          <SelectItem value="family_owned">Family Owned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="house_owner">House Owner</Label>
                      <Input
                        id="house_owner"
                        value={formData.house_owner}
                        onChange={(e) => handleInputChange('house_owner', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Partner Preferences Tab */}
                <TabsContent value="partner" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="partner_age_from">Partner Age From</Label>
                      <Input
                        id="partner_age_from"
                        type="number"
                        value={formData.partner_age_from || ''}
                        onChange={(e) => handleInputChange('partner_age_from', e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner_age_to">Partner Age To</Label>
                      <Input
                        id="partner_age_to"
                        type="number"
                        value={formData.partner_age_to || ''}
                        onChange={(e) => handleInputChange('partner_age_to', e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner_height_from">Partner Height From</Label>
                      <Input
                        id="partner_height_from"
                        value={formData.partner_height_from}
                        onChange={(e) => handleInputChange('partner_height_from', e.target.value)}
                        placeholder="e.g., 5'4\"
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner_height_to">Partner Height To</Label>
                      <Input
                        id="partner_height_to"
                        value={formData.partner_height_to}
                        onChange={(e) => handleInputChange('partner_height_to', e.target.value)}
                        placeholder="e.g., 6'0\"
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner_education">Partner Education</Label>
                      <Input
                        id="partner_education"
                        value={formData.partner_education}
                        onChange={(e) => handleInputChange('partner_education', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner_occupation">Partner Occupation</Label>
                      <Input
                        id="partner_occupation"
                        value={formData.partner_occupation}
                        onChange={(e) => handleInputChange('partner_occupation', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner_income">Partner Income</Label>
                      <Input
                        id="partner_income"
                        value={formData.partner_income}
                        onChange={(e) => handleInputChange('partner_income', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner_location">Partner Location</Label>
                      <Input
                        id="partner_location"
                        value={formData.partner_location}
                        onChange={(e) => handleInputChange('partner_location', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner_religion">Partner Religion</Label>
                      <Input
                        id="partner_religion"
                        value={formData.partner_religion}
                        onChange={(e) => handleInputChange('partner_religion', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner_sect">Partner Sect</Label>
                      <Input
                        id="partner_sect"
                        value={formData.partner_sect}
                        onChange={(e) => handleInputChange('partner_sect', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="partner_marital_status">Partner Marital Status</Label>
                      <Select value={formData.partner_marital_status} onValueChange={(value) => handleInputChange('partner_marital_status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never_married">Never Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                          <SelectItem value="any">Any</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="partner_have_children">Partner Have Children</Label>
                      <Select value={formData.partner_have_children} onValueChange={(value) => handleInputChange('partner_have_children', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="doesnt_matter">Doesn't Matter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="partner_religious_values">Partner Religious Values</Label>
                      <Select value={formData.partner_religious_values} onValueChange={(value) => handleInputChange('partner_religious_values', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very_religious">Very Religious</SelectItem>
                          <SelectItem value="religious">Religious</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="not_religious">Not Religious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="partner_wear_hijab">Partner Wear Hijab</Label>
                      <Select value={formData.partner_wear_hijab} onValueChange={(value) => handleInputChange('partner_wear_hijab', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="doesnt_matter">Doesn't Matter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="partner_polygamy">Partner Polygamy</Label>
                      <Select value={formData.partner_polygamy} onValueChange={(value) => handleInputChange('partner_polygamy', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accept">Accept</SelectItem>
                          <SelectItem value="reject">Reject</SelectItem>
                          <SelectItem value="maybe">Maybe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="about">About</Label>
                      <Textarea
                        id="about"
                        value={formData.about}
                        onChange={(e) => handleInputChange('about', e.target.value)}
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="looking_for">Looking For</Label>
                      <Textarea
                        id="looking_for"
                        value={formData.looking_for}
                        onChange={(e) => handleInputChange('looking_for', e.target.value)}
                        placeholder="What are you looking for in a partner?"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hobbies">Hobbies</Label>
                      <Textarea
                        id="hobbies"
                        value={formData.hobbies}
                        onChange={(e) => handleInputChange('hobbies', e.target.value)}
                        placeholder="List your hobbies and interests"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="additional_info">Additional Information</Label>
                      <Textarea
                        id="additional_info"
                        value={formData.additional_info}
                        onChange={(e) => handleInputChange('additional_info', e.target.value)}
                        placeholder="Any additional information"
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Paste Tab */}
                <TabsContent value="paste" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paste_text">Paste the profile text here</Label>
                    <Textarea
                      id="paste_text"
                      placeholder="Paste profile details here..."
                      rows={12}
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                      <Button type="button" variant="secondary" onClick={() => parsePastedText(pasteText)}>
                        Map
                      </Button>
                      <span className="text-xs text-muted-foreground">Click Map to fill fields from the pasted text.</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Remove the old image upload section since it's now in Photos tab */}

              {/* Navigation / Submit */}
              <div className="flex justify-end gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/profiles')}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={goPrev}
                  disabled={isFirstTab}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                {isLastTab ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create Profile
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={goNext}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
