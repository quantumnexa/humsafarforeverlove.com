'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Heart, 
  DollarSign, 
  UserCheck, 
  BarChart3, 
  FileText,
  AlertTriangle,
  TrendingUp,
  Banknote,
  Gift
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

export default function AdminDashboard() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProfiles: 0,
    pendingVerifications: 0,
    revenue: 0,
    flaggedContent: 0,
    conversions: 0,
    activePromos: 0
  });
  const router = useRouter();

  const fetchDashboardStats = async () => {
    try {
      // Fetch total profiles from user_subscriptions table
      const { count: totalProfilesCount } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true });

      // Fetch pending verifications (profile_status = 'pending')
      const { count: pendingCount } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('profile_status', 'pending');

      // Fetch total revenue from payments table (all time)
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount');

      const totalRevenue = paymentsData?.reduce(
        (sum, payment) => sum + Number(payment.amount ?? 0),
        0
      ) ?? 0;

      // Fetch flagged content (profile_status = 'flagged')
      const { count: flaggedCount } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('profile_status', 'flagged');

      // Update stats
      setStats({
        totalProfiles: totalProfilesCount || 0,
        pendingVerifications: pendingCount || 0,
        revenue: totalRevenue,
        flaggedContent: flaggedCount || 0,
        conversions: 0, // Can be calculated based on subscription upgrades
        activePromos: 0 // Can be fetched from promo codes table
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const session = localStorage.getItem('admin_session');
        if (session) {
          const parsedSession = JSON.parse(session);
          setAdminSession(parsedSession);
          // Fetch dashboard stats after authentication
          fetchDashboardStats();
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Error checking admin auth:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('admin_session');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('admin_session');
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!adminSession) {
    return null;
  }



  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar currentPath="/admin/dashboard" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-humsafar-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-humsafar-500">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome back, {adminSession.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-xl transition-all duration-300 bg-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Profiles</CardTitle>
                <Users className="h-5 w-5 text-humsafar-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-humsafar-500">{stats.totalProfiles}</div>
                <p className="text-xs text-gray-500">
                  Active user profiles
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 bg-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Verifications</CardTitle>
                <UserCheck className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-humsafar-500">{stats.pendingVerifications}</div>
                <p className="text-xs text-gray-500">
                  Awaiting approval • Click to manage
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 bg-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
                <Banknote className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-humsafar-500">₨ {stats.revenue.toLocaleString()}</div>
                <p className="text-xs text-gray-500">
                  All time
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 bg-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Flagged Content</CardTitle>
                <AlertTriangle className="h-5 w-5 text-[#ee406d]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-humsafar-500">{stats.flaggedContent}</div>
                <p className="text-xs text-gray-500">
                  Needs review
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 bg-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Conversions</CardTitle>
                <TrendingUp className="h-5 w-5 text-humsafar-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-humsafar-500">{stats.conversions}%</div>
                <p className="text-xs text-gray-500">
                  Success rate
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-xl transition-all duration-300 bg-white border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Promos</CardTitle>
                <Gift className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-humsafar-500">{stats.activePromos}</div>
                <p className="text-xs text-gray-500">
                  Running campaigns
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-humsafar-50/30 border-0"
              onClick={() => router.push('/admin/profiles')}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>Manage Profiles</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  View and manage user profiles, verify accounts, and handle profile issues.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-green-50/30 border-0"
              onClick={() => router.push('/admin/profiles/create')}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <UserCheck className="h-5 w-5 text-green-500" />
                  <span>Create Profile</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Create new user profiles manually with complete profile information.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Heart className="h-5 w-5 text-[#ee406d]" />
                  <span>Matchmaking</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Oversee matchmaking process, review matches, and manage matchmaker accounts.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span>Payments</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Monitor payment transactions, manage subscriptions, and handle billing issues.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <BarChart3 className="h-5 w-5 text-indigo-500" />
                  <span>Analytics</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  View detailed analytics, user engagement metrics, and platform performance.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <FileText className="h-5 w-5 text-orange-500" />
                  <span>Reports</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Generate reports, export data, and view system logs and user activity.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Gift className="h-5 w-5 text-humsafar-500" />
                  <span>Promo Codes</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Create and manage promotional codes, discounts, and special offers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
