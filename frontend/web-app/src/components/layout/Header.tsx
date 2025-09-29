'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { NotificationDropdown } from '@/components/ui/NotificationDropdown'
import { NavigationLink } from '@/components/NavigationLink'
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  UserCircleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { APP_CONFIG } from '@/lib/constants'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { Notification, mockNotifications } from '@/types/notification'

interface HeaderProps {
  onMenuToggle?: () => void
  showSearch?: boolean
  showNotifications?: boolean
  showUserMenu?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  showSearch = true,
  showNotifications = true,
  showUserMenu = true,
}) => {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchTerm)
  }

  const handleLogout = () => {
    logout()
  }

  const handleNotificationClick = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Menu Toggle */}
          <div className="flex items-center">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}
            
            <NavigationLink href="/" className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">{APP_CONFIG.NAME}</h1>
              </div>
            </NavigationLink>
          </div>

          {/* Center - Search Bar */}
          {showSearch && (
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder={t('header.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  className="w-full"
                />
              </form>
            </div>
          )}

          {/* Right side - Actions and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search for mobile */}
            {showSearch && (
              <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            )}

            {/* Notifications */}
            {showNotifications && (
              <button 
                onClick={handleNotificationClick}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                )}
              </button>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu */}
            {showUserMenu && (
              <div className="relative">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="block text-right">
                      <p className="text-sm font-medium text-gray-900">{user.fullName || user.email || user.username}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    
                    <div className="relative group">
                      <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                        {(user as any).avatarUrl || (user as any).avatar ? (
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={(user as any).avatarUrl || (user as any).avatar}
                            alt={user.fullName || user.email || user.username || 'avatar'}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700">
                              {(user.fullName || user.email || user.username || '?')
                                .toString()
                                .trim()
                                .split(/\s|@/)[0]
                                .substring(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <NavigationLink
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t('header.user.profile')}
                        </NavigationLink>
                        <NavigationLink
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t('header.user.settings')}
                        </NavigationLink>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t('header.user.logout')}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <NavigationLink href="/auth/login">
                      <Button variant="outline" size="sm">
                        {t('header.user.login')}
                      </Button>
                    </NavigationLink>
                    <NavigationLink href="/auth/register">
                      <Button size="sm">
                        {t('header.user.register')}
                      </Button>
                    </NavigationLink>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="md:hidden border-t border-gray-200 p-4">
          <form onSubmit={handleSearch}>
            <Input
              type="text"
              placeholder={t('header.search.mobilePlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              className="w-full"
            />
          </form>
        </div>
      )}

      {/* Notification Dropdown */}
      <NotificationDropdown
        isOpen={isNotificationDropdownOpen}
        onClose={() => setIsNotificationDropdownOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDeleteNotification}
      />
    </header>
  )
}
