'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Eye, 
  Check, 
  X, 
  RotateCcw,
  AlertTriangle,
  Trash2,
  CheckCircle,
  Clock,
  Pencil
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminProfileDeletionDialog from '@/components/admin-profile-deletion-dialog';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface ProfileData {
  user_id: string;
  profile_status: 'pending' | 'approved' | 'rejected' | 'terminated' | 'flagged';
  subscription_status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  city?: string;
  age?: number;
  gender?: string;
  religion?: string;
  sect?: string;
  caste?: string;
  mother_tongue?: string;
  marital_status?: string;
  nationality?: string;
  ethnicity?: string;
  education?: string;
  field_of_study?: string;
  created_at: string;
  updated_at: string;
  mainImage?: string;
  has_photos?: boolean;
}

export default function ProfilesManagement() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
    fetchProfiles();
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

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles from user_subscriptions joined with user_profiles
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          user_id,
          profile_status,
          subscription_status,
          created_at,
          updated_at,
          user_profiles!inner (
            first_name,
            last_name,
            email,
            phone,
            city,
            age,
            gender,
            religion,
            sect,
            caste,
            mother_tongue,
            marital_status,
            nationality,
            ethnicity,
            education,
            field_of_study
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      // Transform the data to flatten the structure
      const transformedProfiles: ProfileData[] = data?.map(item => {
        // Handle both array and object structure for user_profiles
        const userProfile = Array.isArray(item.user_profiles) 
          ? item.user_profiles[0] 
          : item.user_profiles;
        
        return {
          user_id: item.user_id,
          profile_status: item.profile_status,
          subscription_status: item.subscription_status,
          first_name: userProfile?.first_name || '',
          last_name: userProfile?.last_name || '',
          email: userProfile?.email || '',
          phone: userProfile?.phone || '',
          city: userProfile?.city || '',
          age: userProfile?.age || null,
          gender: userProfile?.gender || '',
          religion: userProfile?.religion || '',
          sect: userProfile?.sect || '',
          caste: userProfile?.caste || '',
          mother_tongue: userProfile?.mother_tongue || '',
          marital_status: userProfile?.marital_status || '',
          nationality: userProfile?.nationality || '',
          ethnicity: userProfile?.ethnicity || '',
          education: userProfile?.education || '',
          field_of_study: userProfile?.field_of_study || '',
          created_at: item.created_at,
          updated_at: item.updated_at
        };
      }) || [];

      // Enhance profiles with images (same logic as other pages)
      const enhancedProfiles = await Promise.all(
        transformedProfiles.map(async (profile) => {
          try {
            // Get main image for each profile
            const { data: images } = await supabase
              .from('user_images')
              .select('image_url, is_main')
              .eq('user_id', profile.user_id)
              .order('is_main', { ascending: false })
              .limit(1)
            
            let mainImage = '/placeholder.jpg'
            if (images && images.length > 0) {
              const imageUrl = images[0].image_url
              if (imageUrl && imageUrl !== '/placeholder.jpg') {
                // Check if imageUrl is already a full URL
                if (imageUrl.startsWith('http')) {
                  mainImage = imageUrl
                } else {
                  mainImage = `https://kzmfreck4dxcc4cifgls.supabase.co/storage/v1/object/public/humsafar-user-images/${imageUrl}`
                }
              }
            }
            
            return {
              ...profile,
              mainImage,
              has_photos: mainImage !== '/placeholder.jpg'
            }
          } catch (error) {
            // Error fetching image for profile
            return {
              ...profile,
              mainImage: '/placeholder.jpg',
              has_photos: false
            }
          }
        })
      )

      setProfiles(enhancedProfiles);
    } catch (error) {
      console.error('Error in fetchProfiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    if (activeTab === 'all') return true;
    // Remove flagged case since it's not a valid profile status
    if (activeTab === 'flagged') return false;
    return profile.profile_status === activeTab;
  });

  const updateProfileStatus = async (userId: string, newStatus: 'approved' | 'rejected' | 'terminated' | 'pending' | 'flagged') => {
    try {
      setActionLoading(userId);

      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          profile_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating profile status:', error);
        alert('Failed to update profile status');
        return;
      }

      // Update local state
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.user_id === userId 
            ? { ...profile, profile_status: newStatus, updated_at: new Date().toISOString() }
            : profile
        )
      );

      alert(`Profile status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error in updateProfileStatus:', error);
      alert('An error occurred while updating profile status');
    } finally {
      setActionLoading(null);
    }
  };

  const viewProfile = (userId: string) => {
    window.open(`/profile/${userId}`, '_blank');
  };

  const editProfile = (userId: string) => {
    router.push(`/admin/profiles/${userId}/edit`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      case 'terminated': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusActions = (profile: ProfileData) => {
    const { profile_status, user_id } = profile;
    const isLoading = actionLoading === user_id;

    switch (profile_status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => viewProfile(user_id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Profile
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => editProfile(user_id)}
              disabled={isLoading}
              className="w-8 h-8 p-0"
              title="Edit Profile"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => updateProfileStatus(user_id, 'approved')}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 w-8 h-8 p-0"
                title="Approve Profile"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => updateProfileStatus(user_id, 'rejected')}
                disabled={isLoading}
                className="w-8 h-8 p-0"
                title="Reject Profile"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateProfileStatus(user_id, 'terminated')}
                disabled={isLoading}
                className="w-8 h-8 p-0 border-orange-500 text-orange-500 hover:bg-orange-50"
                title="Terminate Profile (Temporary)"
              >
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'approved':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => viewProfile(user_id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Profile
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => editProfile(user_id)}
              disabled={actionLoading === user_id}
              className="w-8 h-8 p-0 rounded-md flex-shrink-0"
              title="Edit Profile"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => updateProfileStatus(user_id, 'terminated')}
              disabled={actionLoading === user_id}
              className="w-8 h-8 p-0 rounded-md flex-shrink-0"
              title="Terminate Profile (Temporary)"
            >
              <AlertTriangle className="h-4 w-4" />
            </Button>
            <AdminProfileDeletionDialog
              userId={user_id}
              userName={`${profile.first_name} ${profile.last_name}`}
              userEmail={profile.email}
              onDeleteSuccess={() => fetchProfiles()}
            />
          </div>
        );

      case 'rejected':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => viewProfile(user_id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Profile
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => editProfile(user_id)}
              disabled={actionLoading === user_id}
              className="w-8 h-8 p-0"
              title="Edit Profile"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateProfileStatus(user_id, 'terminated')}
              disabled={actionLoading === user_id}
              className="w-8 h-8 p-0 border-orange-500 text-orange-500 hover:bg-orange-50"
              title="Terminate Profile (Temporary)"
            >
              <AlertTriangle className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => updateProfileStatus(user_id, 'approved')}
              disabled={actionLoading === user_id}
              className="bg-green-600 hover:bg-green-700 w-8 h-8 p-0"
              title="Approve Profile"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateProfileStatus(user_id, 'pending')}
              disabled={actionLoading === user_id}
              className="w-8 h-8 p-0"
              title="Mark as Pending"
            >
              <Clock className="h-4 w-4" />
            </Button>
          </div>
        );

      case 'terminated':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => viewProfile(user_id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Profile
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => editProfile(user_id)}
              disabled={isLoading}
              className="w-8 h-8 p-0"
              title="Edit Profile"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => updateProfileStatus(user_id, 'approved')}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reinstate
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => updateProfileStatus(user_id, 'rejected')}
              disabled={actionLoading === user_id}
              className="w-8 h-8 p-0"
              title="Reject Profile"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateProfileStatus(user_id, 'pending')}
              disabled={actionLoading === user_id}
              className="w-8 h-8 p-0"
              title="Mark as Pending"
            >
              <Clock className="h-4 w-4" />
            </Button>
            <AdminProfileDeletionDialog
              userId={user_id}
              userName={`${profile.first_name} ${profile.last_name}`}
              userEmail={profile.email}
              onDeleteSuccess={() => fetchProfiles()}
            />
          </div>
        );

      default:
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => viewProfile(user_id)}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Profile
          </Button>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar currentPath="/admin/profiles" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-humsafar-500 mx-auto mb-4"></div>
            <p className="text-humsafar-600">Loading profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar currentPath="/admin/profiles" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-humsafar-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-humsafar-500">Profiles Management</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Manage user profiles and their approval status</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* View Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Toggle view</div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-3 py-1 text-xs transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-humsafar-600 hover:bg-humsafar-700 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-white hover:text-humsafar-600'
                }`}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-3 py-1 text-xs transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-humsafar-600 hover:bg-humsafar-700 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-white hover:text-humsafar-600'
                }`}
              >
                List
              </Button>
            </div>
          </div>
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-2 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'all'
                    ? 'bg-humsafar-600 text-white shadow-sm'
                    : 'bg-humsafar-50 text-humsafar-700 hover:text-humsafar-900 hover:bg-humsafar-100 border border-humsafar-200'
                }`}
              >
                All Profiles
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  activeTab === 'all'
                    ? 'bg-humsafar-500 text-white'
                    : 'bg-humsafar-200 text-humsafar-800'
                }`}>
                  {profiles.length}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'pending'
                    ? 'bg-humsafar-600 text-white shadow-sm'
                    : 'bg-humsafar-50 text-humsafar-700 hover:text-humsafar-900 hover:bg-humsafar-100 border border-humsafar-200'
                }`}
              >
                Pending
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  activeTab === 'pending'
                    ? 'bg-humsafar-500 text-white'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {profiles.filter(p => p.profile_status === 'pending').length}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'approved'
                    ? 'bg-humsafar-600 text-white shadow-sm'
                    : 'bg-humsafar-50 text-humsafar-700 hover:text-humsafar-900 hover:bg-humsafar-100 border border-humsafar-200'
                }`}
              >
                Approved
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  activeTab === 'approved'
                    ? 'bg-humsafar-500 text-white'
                    : 'bg-green-100 text-green-600'
                }`}>
                  {profiles.filter(p => p.profile_status === 'approved').length}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'rejected'
                    ? 'bg-humsafar-600 text-white shadow-sm'
                    : 'bg-humsafar-50 text-humsafar-700 hover:text-humsafar-900 hover:bg-humsafar-100 border border-humsafar-200'
                }`}
              >
                Rejected
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  activeTab === 'rejected'
                    ? 'bg-humsafar-500 text-white'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {profiles.filter(p => p.profile_status === 'rejected').length}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('flagged')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'flagged'
                    ? 'bg-humsafar-600 text-white shadow-sm'
                    : 'bg-humsafar-50 text-humsafar-700 hover:text-humsafar-900 hover:bg-humsafar-100 border border-humsafar-200'
                }`}
              >
                Flagged
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  activeTab === 'flagged'
                    ? 'bg-humsafar-500 text-white'
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {profiles.filter(p => p.profile_status === 'flagged').length}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('terminated')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'terminated'
                    ? 'bg-humsafar-600 text-white shadow-sm'
                    : 'bg-humsafar-50 text-humsafar-700 hover:text-humsafar-900 hover:bg-humsafar-100 border border-humsafar-200'
                }`}
              >
                Terminated
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  activeTab === 'terminated'
                    ? 'bg-humsafar-500 text-white'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {profiles.filter(p => p.profile_status === 'terminated').length}
                </span>
              </button>
            </div>
          </div>

         
          {/* Profiles */}
          <Card>
            <CardHeader>
              <CardDescription>Manage profile approval status and view profile details</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProfiles.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-humsafar-400 mx-auto mb-4" />
                  <p className="text-humsafar-600">No profiles found matching your criteria</p>
                </div>
              ) : viewMode === 'list' ? (
                <div className="bg-white rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProfiles.map((profile) => (
                        <TableRow key={profile.user_id}>
                          <TableCell className="text-sm font-medium">{profile.first_name} {profile.last_name}</TableCell>
                          <TableCell className="text-sm">{profile.email}</TableCell>
                          <TableCell className="text-sm">{profile.city || '—'}</TableCell>
                          <TableCell className="text-sm">{profile.age ?? '—'}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(profile.profile_status)} className="capitalize">
                              {profile.profile_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{new Date(profile.created_at).toLocaleString()}</TableCell>
                          <TableCell className="text-xs">{new Date(profile.updated_at).toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => viewProfile(profile.user_id)}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => editProfile(profile.user_id)}>
                                <Pencil className="h-4 w-4 mr-1" /> Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((profile) => {
                    // Calculate profile completion percentage
                  const calculateProfileCompletion = (profile: ProfileData) => {
                      const fields = [
                        profile.first_name,
                        profile.last_name,
                        profile.email,
                        profile.phone,
                        profile.age,
                        profile.gender,
                        profile.city,
                        profile.religion,
                        profile.sect,
                        profile.caste,
                        profile.mother_tongue,
                        profile.marital_status,
                        profile.nationality,
                        profile.ethnicity,
                        profile.education,
                        profile.field_of_study
                      ];
                      const filled = fields.filter(v => v !== undefined && v !== null && String(v).trim() !== '').length;
                      const total = fields.length + 2;
                      const photoBonus = profile.has_photos ? 2 : 0;
                      return Math.round(((filled + photoBonus) / total) * 100);
                  };

                    const completionPercentage = calculateProfileCompletion(profile);
                    const shortId = profile.user_id.slice(0, 8);

                    return (
                      <div
                        key={profile.user_id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-humsafar-200"
                      >
                        {/* Header with Avatar, Name, ID and Status */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-humsafar-200 overflow-hidden">
                            {profile.mainImage && profile.mainImage !== '/placeholder.jpg' ? (
                              <img 
                                src={profile.mainImage} 
                                alt={`${profile.first_name} ${profile.last_name}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to placeholder if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-full bg-gradient-to-br from-humsafar-100 to-humsafar-200 rounded-full flex items-center justify-center ${profile.mainImage && profile.mainImage !== '/placeholder.jpg' ? 'hidden' : ''}`}>
                              <svg className="w-6 h-6 text-humsafar-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-lg text-gray-900 truncate">
                                {profile.first_name} {profile.last_name}
                              </h3>
                              {profile.profile_status === 'approved' ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Badge 
                                      variant={getStatusBadgeVariant(profile.profile_status)}
                                      className="ml-2 flex-shrink-0 bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                                    >
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Approved
                                    </Badge>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => updateProfileStatus(profile.user_id, 'pending')}>
                                      <Clock className="w-4 h-4" />
                                      <span>Pending</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateProfileStatus(profile.user_id, 'rejected')}>
                                      <X className="w-4 h-4" />
                                      <span>Rejected</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (
                                <Badge 
                                  variant={getStatusBadgeVariant(profile.profile_status)}
                                  className={"ml-2 flex-shrink-0"}
                                >
                                  {profile.profile_status.charAt(0).toUpperCase() + profile.profile_status.slice(1)}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">ID: {shortId}...</p>
                          </div>
                        </div>

                        {/* Profile Completion */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                            <span className="text-sm font-bold text-gray-900">{completionPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-humsafar-500 to-humsafar-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-humsafar-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <span className="truncate">{profile.email}</span>
                          </div>
                          
                          {profile.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4 text-humsafar-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              <span>{profile.phone}</span>
                            </div>
                          )}
                          
                          {profile.city && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4 text-humsafar-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              <span>{profile.city}</span>
                            </div>
                          )}
                          
                          {profile.age && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4 text-humsafar-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <span>{profile.age} years old</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-gray-100">
                          {getStatusActions(profile)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
