'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ShieldCheckIcon, 
  BellIcon, 
  EyeIcon, 
  KeyIcon, 
  DevicePhoneMobileIcon, 
  EnvelopeIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface SecuritySettings {
  twoFactorEnabled: boolean
  loginNotifications: boolean
  sessionTimeout: number
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  contractUpdates: boolean
  approvalRequests: boolean
  systemAlerts: boolean
  weeklyDigest: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'contacts'
  activityStatus: boolean
  dataSharing: boolean
}

export function ProfileSettings() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<'security' | 'notifications' | 'privacy'>('security')
  
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    contractUpdates: true,
    approvalRequests: true,
    systemAlerts: true,
    weeklyDigest: false
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'contacts',
    activityStatus: true,
    dataSharing: false
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSecurityChange = (field: keyof SecuritySettings, value: boolean | number) => {
    setSecurity(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePrivacyChange = (field: keyof PrivacySettings, value: string | boolean) => {
    setPrivacy(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(t('profile.messages.settingsUpdated'))
    } catch (error) {
      toast.error(t('profile.messages.settingsError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success(t('profile.messages.passwordChanged'))
    } catch (error) {
      toast.error(t('profile.messages.passwordError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveSection('security')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'security'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheckIcon className="h-4 w-4 inline mr-2" />
          {t('profile.settings.security.title')}
        </button>
        <button
          onClick={() => setActiveSection('notifications')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'notifications'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BellIcon className="h-4 w-4 inline mr-2" />
          {t('profile.settings.notifications.title')}
        </button>
        <button
          onClick={() => setActiveSection('privacy')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'privacy'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <EyeIcon className="h-4 w-4 inline mr-2" />
          {t('profile.settings.privacy.title')}
        </button>
      </div>

      {/* Security Settings */}
      {activeSection === 'security' && (
        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5" />
                {t('profile.settings.security.twoFactor')}
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <Button
                  variant={security.twoFactorEnabled ? 'outline' : 'default'}
                  onClick={() => handleSecurityChange('twoFactorEnabled', !security.twoFactorEnabled)}
                >
                  {security.twoFactorEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyIcon className="h-5 w-5" />
                {t('profile.settings.security.changePassword')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              />
              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              />
              <Button
                onClick={handleChangePassword}
                disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword}
                className="flex items-center gap-2"
              >
                <KeyIcon className="h-4 w-4" />
                {isLoading ? t('common.loading') : 'Change Password'}
              </Button>
            </CardContent>
          </Card>

          {/* Session Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Session Timeout (minutes)
                </label>
                <select
                  value={security.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={480}>8 hours</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="loginNotifications"
                  checked={security.loginNotifications}
                  onChange={(e) => handleSecurityChange('loginNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="loginNotifications" className="text-sm text-gray-700 dark:text-gray-300">
                  Notify me of new login attempts
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeSection === 'notifications' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellIcon className="h-5 w-5" />
                Notification Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { key: 'email', label: t('profile.settings.notifications.email'), icon: EnvelopeIcon },
                  { key: 'push', label: t('profile.settings.notifications.push'), icon: DevicePhoneMobileIcon },
                  { key: 'sms', label: t('profile.settings.notifications.sms'), icon: DevicePhoneMobileIcon }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">{label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof NotificationSettings] as boolean}
                      onChange={(e) => handleNotificationChange(key as keyof NotificationSettings, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { key: 'contractUpdates', label: t('profile.settings.notifications.contractUpdates') },
                  { key: 'approvalRequests', label: t('profile.settings.notifications.approvalRequests') },
                  { key: 'systemAlerts', label: t('profile.settings.notifications.systemAlerts') },
                  { key: 'weeklyDigest', label: t('profile.settings.notifications.weeklyDigest') }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="font-medium">{label}</span>
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof NotificationSettings] as boolean}
                      onChange={(e) => handleNotificationChange(key as keyof NotificationSettings, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Privacy Settings */}
      {activeSection === 'privacy' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EyeIcon className="h-5 w-5" />
                Privacy Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('profile.settings.privacy.profileVisibility')}
                </label>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Public - Anyone can see your profile</option>
                  <option value="contacts">Contacts - Only your contacts can see your profile</option>
                  <option value="private">Private - Only you can see your profile</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t('profile.settings.privacy.activityStatus')}</span>
                  <input
                    type="checkbox"
                    checked={privacy.activityStatus}
                    onChange={(e) => handlePrivacyChange('activityStatus', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t('profile.settings.privacy.dataSharing')}</span>
                  <input
                    type="checkbox"
                    checked={privacy.dataSharing}
                    onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <CheckCircleIcon className="h-4 w-4" />
          {isLoading ? t('common.loading') : t('profile.actions.save')}
        </Button>
      </div>
    </div>
  )
}
