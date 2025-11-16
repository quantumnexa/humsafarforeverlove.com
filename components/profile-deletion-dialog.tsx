"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, AlertTriangle, Shield, Database, Image, User, Eye, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

interface DeletionPreview {
  userId: string
  dataToDelete: {
    profile: number
    subscription: number
    images: number
    profileViewsAsViewer: number
    profileViewsAsViewed: number
    authentication: number
  }
  warning: string
}

interface ProfileDeletionDialogProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function ProfileDeletionDialog({ 
  trigger, 
  onSuccess, 
  onError 
}: ProfileDeletionDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletionPreview, setDeletionPreview] = useState<DeletionPreview | null>(null)
  const [reason, setReason] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [hasAgreed, setHasAgreed] = useState(false)
  const [error, setError] = useState("")
  
  const router = useRouter()

  const fetchDeletionPreview = async () => {
    try {
      setIsLoading(true)
      setError("")

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError("You must be logged in to delete your profile")
        return
      }

      const response = await fetch('/api/profile/delete', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch deletion preview')
      }

      const data = await response.json()
      setDeletionPreview(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProfile = async () => {
    try {
      setIsDeleting(true)
      setError("")

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error("You must be logged in to delete your profile")
      }

      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmDeletion: true,
          reason: reason.trim() || 'No reason provided'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete profile')
      }

      const result = await response.json()
      
      // Success - profile deleted
      onSuccess?.()
      
      // Sign out the user and redirect
      await supabase.auth.signOut()
      router.push('/')
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsDeleting(false)
      setShowConfirmDialog(false)
    }
  }

  const handleOpenDialog = () => {
    setIsOpen(true)
    fetchDeletionPreview()
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
    setShowConfirmDialog(false)
    setReason("")
    setConfirmText("")
    setHasAgreed(false)
    setError("")
    setDeletionPreview(null)
  }

  const canProceedToConfirmation = () => {
    return reason.trim().length >= 10 && hasAgreed
  }

  const canConfirmDeletion = () => {
    return confirmText.toLowerCase() === "delete my profile permanently"
  }

  const defaultTrigger = (
    <Button 
      variant="destructive" 
      className="bg-red-600 hover:bg-red-700 text-white"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Delete Profile
    </Button>
  )

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild onClick={handleOpenDialog}>
          {trigger || defaultTrigger}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Profile Permanently
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data will be permanently deleted from our servers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading deletion preview...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-red-700 mt-1">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Deletion Preview */}
            {deletionPreview && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Database className="h-4 w-4" />
                    Data to be Deleted
                  </CardTitle>
                  <CardDescription className="text-orange-600">
                    The following data will be permanently removed:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>Profile Data</span>
                      <Badge variant="secondary">{deletionPreview.dataToDelete.profile}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <span>Subscription</span>
                      <Badge variant="secondary">{deletionPreview.dataToDelete.subscription}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-gray-500" />
                      <span>Images</span>
                      <Badge variant="secondary">{deletionPreview.dataToDelete.images}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <span>Profile Views</span>
                      <Badge variant="secondary">
                        {deletionPreview.dataToDelete.profileViewsAsViewer + deletionPreview.dataToDelete.profileViewsAsViewed}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-red-100 rounded-lg">
                    <p className="text-red-800 text-sm font-medium">
                      ⚠️ {deletionPreview.warning}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reason Input */}
            {deletionPreview && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reason" className="text-sm font-medium">
                    Reason for Deletion (Required)
                  </Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please tell us why you're deleting your profile (minimum 10 characters)..."
                    rows={3}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {reason.length}/10 characters minimum
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agree"
                    checked={hasAgreed}
                    onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
                  />
                  <Label htmlFor="agree" className="text-sm">
                    I understand that this action is irreversible and all my data will be permanently deleted
                  </Label>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            {deletionPreview && (
              <Button
                variant="destructive"
                onClick={() => setShowConfirmDialog(true)}
                disabled={!canProceedToConfirmation()}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Proceed to Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Final Confirmation Required
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This is your last chance to cancel. Once you confirm, your profile and all associated data will be permanently deleted.
              </p>
              <div>
                <Label htmlFor="confirmText" className="text-sm font-medium">
                  Type "delete my profile permanently" to confirm:
                </Label>
                <Input
                  id="confirmText"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="delete my profile permanently"
                  className="mt-1"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProfile}
              disabled={!canConfirmDeletion() || isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Permanently
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}