'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { ProfileForm, ProfileAvatar, ProfileSettings, ProfileStats } from '@/components/profile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { TitlePanel } from '@/components/ui'
import { UserIcon, CogIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { DashboardLayout } from '@/components/layout'

export default function ProfilePage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('personal')

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        {/* Page Title */}
        <TitlePanel
          title="THÔNG TIN CÁ NHÂN"
          description="Quản lý thông tin tài khoản và cài đặt cá nhân"
          variant="primary"
        />

      {/* Profile Tabs */}
      <div className="space-y-6">
        <div className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'personal'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <UserIcon className="h-4 w-4" />
            {t('profile.tabs.personal')}
          </button>
          <button
            onClick={() => setActiveTab('avatar')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'avatar'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheckIcon className="h-4 w-4" />
            {t('profile.tabs.avatar')}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <CogIcon className="h-4 w-4" />
            {t('profile.tabs.settings')}
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ChartBarIcon className="h-4 w-4" />
            {t('profile.tabs.stats')}
          </button>
        </div>

        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.personalInfo.title')}</CardTitle>
                <CardDescription>
                  {t('profile.personalInfo.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Avatar Tab */}
        {activeTab === 'avatar' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.avatar.title')}</CardTitle>
                <CardDescription>
                  {t('profile.avatar.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileAvatar />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.settings.title')}</CardTitle>
                <CardDescription>
                  {t('profile.settings.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileSettings />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.stats.title')}</CardTitle>
                <CardDescription>
                  {t('profile.stats.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileStats />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  )
}
