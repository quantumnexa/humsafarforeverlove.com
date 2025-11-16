'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Eye, 
  Shield,
  Rocket,
  Save,
  Image as ImageIcon,
  Package,
  Check,
  X,
  Clock
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface UserSubscriptionData {
  user_id: string;
  subscription_status: string;
  profile_status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  city?: string;
  views_limit: number;
  verified_badge: boolean;
  boost_profile: boolean;
  payment_screenshot?: string;
  payment_status?: string;
  payment_id?: string;
  created_at: string;
  updated_at: string;
  mainImage?: string;
}

export default function PackagesManagement() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserSubscriptionData[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Starting fetchUsers function...');
      
      // First, let's check what columns exist in user_subscriptions table
      console.log('🔍 Testing user_subscriptions table existence...');
      const { data: testData, error: testError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .limit(1);

      console.log('📊 Test query result:', { testData, testError });

      if (testError) {
        console.error('❌ Table does not exist or has permission issues:', testError);
        alert(`Database Error: ${testError.message}`);
        setLoading(false);
        return;
      }

      // Fetch user subscriptions with user profiles (no direct payments join)
      console.log('🔍 Fetching user subscriptions with profiles...');
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          user_id,
          subscription_status,
          profile_status,
          views_limit,
          verified_badge,
          boost_profile,
          created_at,
          updated_at,
          user_profiles (
            first_name,
            last_name,
            email,
            phone,
            city,
            age,
            gender
          )
        `)
        .order('created_at', { ascending: false });

      console.log('📊 User subscriptions query result:', { data, error, dataLength: data?.length });

      if (error) {
        console.error('❌ Error fetching user subscriptions:', error);
        alert(`Query Error: ${error.message}`);
        setLoading(false);
        return;
      }

      // Now fetch payments separately for each user
      console.log('🔍 Fetching payments for users...');
      const userIds = data?.map(item => item.user_id) || [];
      
      let paymentsData: any[] = [];
      if (userIds.length > 0) {
        const { data: payments, error: paymentsError } = await supabase
          .from('payments')
          .select(`
            user_id,
            id,
            ss_url,
            payment_status,
            created_at
          `)
          .in('user_id', userIds)
          .order('created_at', { ascending: false });

        console.log('📊 Payments query result:', { payments, paymentsError, paymentsLength: payments?.length });

        if (paymentsError) {
          console.error('❌ Error fetching payments:', paymentsError);
          // Continue without payments data
        } else {
          paymentsData = payments || [];
        }
      }

      console.log('📊 Main query result:', { data, error, dataLength: data?.length });

      if (error) {
        console.error('❌ Error fetching users:', error);
        alert(`Query Error: ${String(error) || 'Unknown error occurred'}`);
        setLoading(false);
        return;
      }

      console.log('📊 Raw data from database:', { data, dataCount: data?.length }); // Debug log

      if (!data || data.length === 0) {
        console.log('⚠️ No data found in user_subscriptions table');
        alert('No subscription data found. The user_subscriptions table might be empty.');
        setUsers([]);
        setLoading(false);
        return;
      }

      // Transform the data to flatten the structure
      console.log('🔄 Starting data transformation...');
      const transformedUsers: UserSubscriptionData[] = data?.map((item, index) => {
        console.log(`🔄 Processing item ${index + 1}:`, item);
        
        // Handle both array and object structure for user_profiles
        const userProfile = Array.isArray(item.user_profiles) 
          ? item.user_profiles[0] 
          : item.user_profiles;
        
        console.log(`👤 User profile for item ${index + 1}:`, userProfile);
        
        // Find payments for this user from the separate payments data
        const userPayments = paymentsData.filter(payment => payment.user_id === item.user_id);
        const latestPayment = userPayments.length > 0
          ? userPayments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
          : null;
        
        console.log(`💳 Latest payment for item ${index + 1}:`, latestPayment);
        
        const transformedItem = {
          user_id: item.user_id,
          subscription_status: item.subscription_status,
          profile_status: item.profile_status,
          first_name: userProfile?.first_name || '',
          last_name: userProfile?.last_name || '',
          email: userProfile?.email || '',
          phone: userProfile?.phone || '',
          city: userProfile?.city || '',
          views_limit: item.views_limit || 0,
          verified_badge: item.verified_badge || false,
          boost_profile: item.boost_profile || false,
          payment_screenshot: latestPayment?.ss_url || '',
          payment_status: latestPayment?.payment_status || '',
          payment_id: latestPayment?.id || '',
          created_at: item.created_at,
          updated_at: item.updated_at
        };
        
        console.log(`✅ Transformed item ${index + 1}:`, transformedItem);
        return transformedItem;
      }) || [];

      console.log('📊 All transformed users:', { transformedUsers, count: transformedUsers.length }); // Debug log

      // Enhance users with images
      const enhancedUsers = await Promise.all(
        transformedUsers.map(async (user) => {
          try {
            // Get main image for each user
            const { data: images } = await supabase
              .from('user_images')
              .select('image_url, is_main')
              .eq('user_id', user.user_id)
              .order('is_main', { ascending: false })
              .limit(1)
            
            let mainImage = '/placeholder.jpg'
            if (images && images.length > 0) {
              const imageUrl = images[0].image_url
              if (imageUrl && imageUrl !== '/placeholder.jpg') {
                if (imageUrl.startsWith('http')) {
                  mainImage = imageUrl
                } else {
                  mainImage = `https://kzmfreck4dxcc4cifgls.supabase.co/storage/v1/object/public/humsafar-user-images/${imageUrl}`
                }
              }
            }
            
            return {
              ...user,
              mainImage
            }
          } catch (error) {
            return {
              ...user,
              mainImage: '/placeholder.jpg'
            }
          }
        })
      )

      console.log('📊 Final enhanced users:', { enhancedUsers, count: enhancedUsers.length });
      setUsers(enhancedUsers);
      console.log('✅ Users state updated successfully');
    } catch (error) {
      console.error('❌ Fatal error in fetchUsers:', error);
      console.error('Error in fetchUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserSubscription = async (userId: string, updates: Partial<UserSubscriptionData>) => {
    try {
      setActionLoading(userId);

      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating user subscription:', error);
        alert('Failed to update user subscription');
        return;
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userId 
            ? { ...user, ...updates, updated_at: new Date().toISOString() }
            : user
        )
      );

      alert('User subscription updated successfully!');
    } catch (error) {
      console.error('Error updating user subscription:', error);
      alert('Failed to update user subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewsLimitChange = (userId: string, newValue: number[]) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.user_id === userId 
          ? { ...user, views_limit: newValue[0] }
          : user
      )
    );
  };

  const handleToggleChange = (userId: string, field: 'verified_badge' | 'boost_profile', value: boolean) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.user_id === userId 
          ? { ...user, [field]: value }
          : user
      )
    );
  };

  const handleSaveUser = (userId: string) => {
    const user = users.find(u => u.user_id === userId);
    if (!user) return;

    updateUserSubscription(userId, {
      views_limit: user.views_limit,
      verified_badge: user.verified_badge,
      boost_profile: user.boost_profile
    });
  };

  const handlePaymentValidation = async (paymentId: string, userId: string, action: 'approve' | 'reject') => {
    try {
      setActionLoading(paymentId);

      // Update payment status
      const { error: paymentError } = await supabase
        .from('payments')
        .update({ 
          status: action === 'approve' ? 'completed' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (paymentError) {
        console.error('Error updating payment status:', paymentError);
        alert('Failed to update payment status');
        return;
      }

      // Update subscription status based on action
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (subscriptionError) {
        console.error('Error updating subscription:', subscriptionError);
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userId 
            ? { ...user, payment_status: action === 'approve' ? 'completed' : 'rejected' }
            : user
        )
      );

      alert(`Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      
    } catch (error) {
      console.error('Error handling payment validation:', error);
      alert('Failed to update payment status');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar currentPath={'/admin/packages'} />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading users...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar currentPath={'/admin/packages'} />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-8 h-8 text-humsafar-600" />
              <h1 className="text-3xl font-bold text-gray-900">Package Features Management</h1>
            </div>
            <p className="text-gray-600">
              Manage user package features including views limit, verified badge, and boost profile settings.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Verified Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.verified_badge).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Rocket className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Boosted Profiles</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.boost_profile).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Views Limit</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(users.reduce((sum, u) => sum + u.views_limit, 0) / users.length) || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <div className="space-y-6">
            {users.map((user) => (
              <Card key={user.user_id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* User Avatar and Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={user.mainImage}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.first_name} {user.last_name}
                          {user.verified_badge && (
                            <Shield className="inline w-5 h-5 text-blue-600 ml-2" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant={user.subscription_status === 'free' ? 'secondary' : 'default'}>
                            {user.subscription_status}
                          </Badge>
                          <Badge variant={user.profile_status === 'approved' ? 'default' : 'secondary'}>
                            {user.profile_status}
                          </Badge>
                          {user.city && (
                            <span className="text-sm text-gray-500">{user.city}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Package Controls */}
                    <div className="flex-1 space-y-6">
                      {/* Views Limit Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Number of Views
                          </label>
                          <span className="text-sm font-semibold text-humsafar-600">
                            {user.views_limit}
                          </span>
                        </div>
                        <Slider
                          value={[user.views_limit]}
                          onValueChange={(value) => handleViewsLimitChange(user.user_id, value)}
                          max={100}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      {/* Toggle Switches */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">Verified Badge</span>
                          </div>
                          <Switch
                            checked={user.verified_badge}
                            onCheckedChange={(checked) => 
                              handleToggleChange(user.user_id, 'verified_badge', checked)
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium">Boost Profile</span>
                          </div>
                          <Switch
                            checked={user.boost_profile}
                            onCheckedChange={(checked) => 
                              handleToggleChange(user.user_id, 'boost_profile', checked)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Screenshot */}
                    <div className="w-48">
                      {user.payment_screenshot ? (
                        <div className="text-center">
                          <img
                            src={user.payment_screenshot}
                            alt="Payment Screenshot"
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 mx-auto mb-2"
                          />
                          <p className="text-xs text-gray-600 mb-2">Payment Screenshot</p>
                          
                          {/* Payment Status Badge */}
                          <div className="mb-2">
                            {user.payment_status === 'pending' && (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                            {user.payment_status === 'completed' && (
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                <Check className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                            )}
                            {user.payment_status === 'rejected' && (
                              <Badge className="bg-red-100 text-red-800 border-red-300">
                                <X className="w-3 h-3 mr-1" />
                                Rejected
                              </Badge>
                            )}
                          </div>

                          {/* Validation Buttons */}
                          {user.payment_status === 'pending' && user.payment_id && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handlePaymentValidation(user.payment_id!, user.user_id, 'approve')}
                                disabled={actionLoading === user.payment_id}
                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handlePaymentValidation(user.payment_id!, user.user_id, 'reject')}
                                disabled={actionLoading === user.payment_id}
                                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto mb-2">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500">No Screenshot</p>
                        </div>
                      )}
                    </div>

                    {/* Save Button */}
                    <div className="flex flex-col justify-center">
                      <Button
                        onClick={() => handleSaveUser(user.user_id)}
                        disabled={actionLoading === user.user_id}
                        className="bg-humsafar-600 hover:bg-humsafar-700"
                      >
                        {actionLoading === user.user_id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {users.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
                <p className="text-gray-600">No user subscriptions found in the system.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
