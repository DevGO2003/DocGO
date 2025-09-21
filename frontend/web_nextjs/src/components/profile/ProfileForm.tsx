'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ArrowDownTrayIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon, 
  GlobeAltIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  department: string
  company: string
  address: string
  bio: string
  birthDate: string
  gender: string
  nationality: string
  language: string
  timezone: string
}

export function ProfileForm() {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+84 123 456 789',
    position: 'Software Engineer',
    department: 'Engineering',
    company: 'DocGO Inc.',
    address: '123 Main Street, Ho Chi Minh City, Vietnam',
    bio: 'Passionate software engineer with 5+ years of experience in web development.',
    birthDate: '1990-01-01',
    gender: 'male',
    nationality: 'Vietnamese',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh'
  })

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
      toast.success(t('profile.messages.saveSuccess'))
    } catch (error) {
      toast.error(t('profile.messages.saveError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data if needed
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            {t('profile.personalInfo.form.firstName')} & {t('profile.personalInfo.form.lastName')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('profile.personalInfo.form.firstName')}
              value={profileData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={!isEditing}
              required
            />
            <Input
              label={t('profile.personalInfo.form.lastName')}
              value={profileData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={!isEditing}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EnvelopeIcon className="h-5 w-5" />
            {t('profile.personalInfo.form.email')} & {t('profile.personalInfo.form.phone')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('profile.personalInfo.form.email')}
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              required
            />
            <Input
              label={t('profile.personalInfo.form.phone')}
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('profile.personalInfo.form.position')}
              value={profileData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              disabled={!isEditing}
            />
            <Input
              label={t('profile.personalInfo.form.department')}
              value={profileData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <Input
            label={t('profile.personalInfo.form.company')}
            value={profileData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('profile.personalInfo.form.birthDate')}
              type="date"
              value={profileData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              disabled={!isEditing}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('profile.personalInfo.form.gender')}
              </label>
              <select
                value={profileData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="male">{t('profile.personalInfo.genders.male')}</option>
                <option value="female">{t('profile.personalInfo.genders.female')}</option>
                <option value="other">{t('profile.personalInfo.genders.other')}</option>
                <option value="preferNotToSay">{t('profile.personalInfo.genders.preferNotToSay')}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('profile.personalInfo.form.nationality')}
              value={profileData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              disabled={!isEditing}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('profile.personalInfo.form.language')}
              </label>
              <select
                value={profileData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address and Bio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            {t('profile.personalInfo.form.address')} & {t('profile.personalInfo.form.bio')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label={t('profile.personalInfo.form.address')}
            value={profileData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            disabled={!isEditing}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('profile.personalInfo.form.bio')}
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Tell us about yourself..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Timezone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            {t('profile.personalInfo.form.timezone')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('profile.personalInfo.form.timezone')}
            </label>
            <select
              value={profileData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
              <option value="UTC">UTC (GMT+0)</option>
              <option value="America/New_York">America/New_York (GMT-5)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <UserIcon className="h-4 w-4" />
              {t('profile.actions.edit')}
            </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {t('profile.actions.cancel')}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              {isLoading ? t('common.loading') : t('profile.actions.save')}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
