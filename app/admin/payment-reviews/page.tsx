'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  Check, 
  X, 
  Clock,
  AlertTriangle,
  Image as ImageIcon,
  User,
  Calendar,
  Package
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

interface AdminSession {
  id: string;
  email: string;
  loginTime: string;
}

interface PaymentReview {
  id: string;
  user_id: string;
  views_limit: number;
  ss_url: string;
  rejection_reason?: string;
  payment_status: 'pending' | 'under_review' | 'accepted' | 'rejected';
  package_type: string;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  // User profile data
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export default function PaymentReviewsPage() {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentReviews, setPaymentReviews] = useState<PaymentReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<PaymentReview | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'accepted' | 'rejected'>('under_review');
  
  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (adminSession) {
      fetchPaymentReviews();
    }
  }, [adminSession, filter]);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = () => {
    try {
      const session = sessionStorage.getItem('admin_session');
      if (session) {
        const parsedSession = JSON.parse(session);
        setAdminSession(parsedSession);
        fetchPaymentReviews();
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

  const fetchPaymentReviews = async () => {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          user_profiles!inner(
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('payment_status', filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching payment reviews:', error);
        return;
      }

      // Flatten the data structure
      const formattedData = data?.map(review => ({
        ...review,
        first_name: review.user_profiles?.first_name,
        last_name: review.user_profiles?.last_name,
        email: review.user_profiles?.email,
        phone: review.user_profiles?.phone
      })) || [];

      setPaymentReviews(formattedData);
    } catch (error) {
      console.error('Error fetching payment reviews:', error);
    }
  };

  const handleApprove = async (reviewId: string) => {
    setProcessingId(reviewId);
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          payment_status: 'accepted',
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminSession?.id
        })
        .eq('id', reviewId);

      if (error) {
        console.error('Error approving payment:', error);
        alert('Error approving payment: ' + error.message);
        return;
      }

      alert('Payment approved successfully! Views have been transferred to user subscription.');
      fetchPaymentReviews();
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('Error approving payment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reviewId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setProcessingId(reviewId);
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          payment_status: 'rejected',
          rejection_reason: rejectionReason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminSession?.id
        })
        .eq('id', reviewId);

      if (error) {
        console.error('Error rejecting payment:', error);
        alert('Error rejecting payment: ' + error.message);
        return;
      }

      alert('Payment rejected successfully!');
      setSelectedReview(null);
      setRejectionReason('');
      fetchPaymentReviews();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Error rejecting payment');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300"><Eye className="w-3 h-3 mr-1" />Under Review</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><Check className="w-3 h-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-humsafar-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!adminSession) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar currentPath="/admin/payment-reviews" />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Reviews</h1>
            <p className="text-gray-600">Review and approve payment screenshots from users</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {[
                { key: 'under_review', label: 'Under Review', count: paymentReviews.filter(r => r.payment_status === 'under_review').length },
                { key: 'pending', label: 'Pending', count: paymentReviews.filter(r => r.payment_status === 'pending').length },
                { key: 'accepted', label: 'Accepted', count: paymentReviews.filter(r => r.payment_status === 'accepted').length },
                { key: 'rejected', label: 'Rejected', count: paymentReviews.filter(r => r.payment_status === 'rejected').length },
                { key: 'all', label: 'All', count: paymentReviews.length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-white text-humsafar-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Payment Reviews Grid */}
          <div className="grid gap-6">
            {paymentReviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payment reviews found</h3>
                  <p className="text-gray-600">No payment reviews match the current filter.</p>
                </CardContent>
              </Card>
            ) : (
              paymentReviews.map((review) => (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {review.first_name} {review.last_name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {review.email} • {review.phone}
                        </CardDescription>
                      </div>
                      {getStatusBadge(review.payment_status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Payment Details */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Package:</span>
                          <span className="text-sm capitalize">{review.package_type}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Views Limit:</span>
                          <span className="text-sm">{review.views_limit}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Submitted:</span>
                          <span className="text-sm">{formatDate(review.created_at)}</span>
                        </div>

                        {review.reviewed_at && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">Reviewed:</span>
                            <span className="text-sm">{formatDate(review.reviewed_at)}</span>
                          </div>
                        )}

                        {review.rejection_reason && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                            <p className="text-sm text-red-700">{review.rejection_reason}</p>
                          </div>
                        )}
                      </div>

                      {/* Screenshot */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ImageIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Payment Screenshot:</span>
                        </div>
                        
                        {review.ss_url ? (
                          <div className="border rounded-lg overflow-hidden">
                            <img 
                              src={review.ss_url} 
                              alt="Payment Screenshot"
                              className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(review.ss_url, '_blank')}
                            />
                            <div className="p-2 bg-gray-50">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(review.ss_url, '_blank')}
                                className="w-full"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Full Size
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No screenshot uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {review.payment_status === 'under_review' && (
                      <div className="mt-6 pt-6 border-t">
                        <div className="flex gap-4">
                          <Button
                            onClick={() => handleApprove(review.id)}
                            disabled={processingId === review.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {processingId === review.id ? 'Approving...' : 'Approve Payment'}
                          </Button>
                          
                          <Button
                            variant="destructive"
                            onClick={() => setSelectedReview(review)}
                            disabled={processingId === review.id}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject Payment
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Reject Payment</CardTitle>
              <CardDescription>
                Provide a reason for rejecting {selectedReview.first_name}'s payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Please provide a clear reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedReview(null);
                    setRejectionReason('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedReview.id)}
                  disabled={processingId === selectedReview.id || !rejectionReason.trim()}
                  className="flex-1"
                >
                  {processingId === selectedReview.id ? 'Rejecting...' : 'Reject Payment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}