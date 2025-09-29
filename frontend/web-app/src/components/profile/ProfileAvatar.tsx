'use client'

import { useState, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ArrowUpTrayIcon, 
  TrashIcon, 
  CameraIcon, 
  UserIcon 
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

export function ProfileAvatar() {
  const { t } = useTranslation()
  const [avatar, setAvatar] = useState<string | null>('/api/placeholder/150/150')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, or GIF)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatar(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(t('profile.messages.uploadSuccess'))
    } catch (error) {
      toast.error(t('profile.messages.uploadError'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAvatar(null)
      toast.success(t('profile.messages.removeSuccess'))
    } catch (error) {
      toast.error(t('profile.messages.removeError'))
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      {/* Current Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.avatar.current')}</CardTitle>
          <CardDescription>
            {t('profile.avatar.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('profile.avatar.requirements')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Avatar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="flex items-center gap-2 flex-1"
            >
              <ArrowUpTrayIcon className="h-4 w-4" />
              {isUploading ? t('common.loading') : t('profile.avatar.upload')}
            </Button>
            
            {avatar && (
              <Button
                variant="outline"
                onClick={handleRemove}
                disabled={isUploading}
                className="flex items-center gap-2 flex-1"
              >
                <TrashIcon className="h-4 w-4" />
                {t('profile.avatar.remove')}
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Preview */}
      {avatar && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CameraIcon className="h-5 w-5" />
              {t('profile.avatar.preview')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={avatar}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Best Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Use a square image for best results</li>
            <li>• Make sure your face is clearly visible</li>
            <li>• Use good lighting and avoid shadows</li>
            <li>• Keep the background simple and uncluttered</li>
            <li>• Recommended resolution: 400x400 pixels or higher</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
