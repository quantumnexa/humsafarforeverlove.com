'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, AlertTriangle, Loader2, Shield } from 'lucide-react';

interface AdminProfileDeletionDialogProps {
  userId: string;
  userName: string;
  userEmail: string;
  onDeleteSuccess?: () => void;
}

interface DeletionPreview {
  userInfo: {
    name: string;
    email: string;
    joinDate: string;
  };
  dataToDelete: {
    profileData: number;
    images: number;
    subscriptions: number;
    profileViews: number;
    interactions: number;
  };
  totalRecords: number;
}

export default function AdminProfileDeletionDialog({
  userId,
  userName,
  userEmail,
  onDeleteSuccess
}: AdminProfileDeletionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'preview' | 'confirm' | 'processing' | 'complete'>('preview');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<DeletionPreview | null>(null);
  const [reason, setReason] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState('');

  const getAdminAuth = () => {
    const session = sessionStorage.getItem('admin_session');
    if (!session) {
      throw new Error('Admin session not found');
    }
    return session;
  };

  const fetchDeletionPreview = async () => {
    try {
      setLoading(true);
      setError('');

      const adminAuth = getAdminAuth();
      
      const response = await fetch('/api/admin/profile/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-auth': adminAuth
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch deletion preview');
      }

      setPreview(data);
    } catch (error) {
      console.error('Error fetching deletion preview:', error);
      setError(error instanceof Error ? error.message : 'Failed to load deletion preview');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const adminAuth = getAdminAuth();

      const response = await fetch('/api/admin/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'admin-auth': adminAuth
        },
        body: JSON.stringify({ 
          userId,
          reason: reason.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete profile');
      }

      setStep('complete');
      
      // Call success callback after a short delay
      setTimeout(() => {
        onDeleteSuccess?.();
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Error deleting profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('preview');
    setPreview(null);
    setReason('');
    setConfirmationText('');
    setAcknowledged(false);
    setError('');
  };

  const handleOpenChange = (open: boolean) => {
    if (open && !preview) {
      fetchDeletionPreview();
    }
    setIsOpen(open);
    if (!open) {
      handleClose();
    }
  };

  const canProceedToConfirm = reason.trim().length >= 10;
  const canDelete = acknowledged && confirmationText === 'delete this profile permanently';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="w-8 h-8 p-0 rounded-md flex-shrink-0"
          title="Delete Profile Permanently"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Shield className="h-5 w-5" />
            Admin Profile Deletion
          </DialogTitle>
          <DialogDescription>
            Permanently delete user profile: <strong>{userName}</strong> ({userEmail})
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading deletion preview...</span>
              </div>
            ) : preview ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Name:</strong> {preview.userInfo.name}</div>
                    <div><strong>Email:</strong> {preview.userInfo.email}</div>
                    <div><strong>Join Date:</strong> {new Date(preview.userInfo.joinDate).toLocaleDateString()}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Data to be Deleted
                    </CardTitle>
                    <CardDescription>
                      This action will permanently delete all associated data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span>Profile Data:</span>
                        <Badge variant="destructive">{preview.dataToDelete.profileData}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Images:</span>
                        <Badge variant="destructive">{preview.dataToDelete.images}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Subscriptions:</span>
                        <Badge variant="destructive">{preview.dataToDelete.subscriptions}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Profile Views:</span>
                        <Badge variant="destructive">{preview.dataToDelete.profileViews}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Interactions:</span>
                        <Badge variant="destructive">{preview.dataToDelete.interactions}</Badge>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total Records:</span>
                        <Badge variant="destructive">{preview.totalRecords}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label htmlFor="reason">Deletion Reason (Required)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a detailed reason for deleting this profile (minimum 10 characters)..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-gray-500">
                    {reason.length}/10 characters minimum
                  </p>
                </div>
              </>
            ) : null}
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-red-800">Final Confirmation Required</h3>
              </div>
              <p className="text-red-700 text-sm mb-3">
                You are about to permanently delete <strong>{userName}</strong>'s profile and all associated data. 
                This action cannot be undone.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acknowledge"
                    checked={acknowledged}
                    onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
                  />
                  <Label htmlFor="acknowledge" className="text-sm">
                    I understand this action is permanent and cannot be reversed
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmation">
                    Type "delete this profile permanently" to confirm:
                  </Label>
                  <Input
                    id="confirmation"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="delete this profile permanently"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm"><strong>Reason:</strong> {reason}</p>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            <div className="text-center">
              <h3 className="font-semibold">Deleting Profile...</h3>
              <p className="text-sm text-gray-600">
                Please wait while we permanently delete all user data.
              </p>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-green-800">Profile Deleted Successfully</h3>
              <p className="text-sm text-gray-600">
                All user data has been permanently removed from the system.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'preview' && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => setStep('confirm')}
                disabled={!canProceedToConfirm || loading}
              >
                Proceed to Delete
              </Button>
            </>
          )}

          {step === 'confirm' && (
            <>
              <Button variant="outline" onClick={() => setStep('preview')}>
                Back
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setStep('processing');
                  handleDeleteProfile();
                }}
                disabled={!canDelete || loading}
              >
                Delete Permanently
              </Button>
            </>
          )}

          {step === 'processing' && (
            <Button variant="outline" disabled>
              Processing...
            </Button>
          )}

          {step === 'complete' && (
            <Button onClick={handleClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}