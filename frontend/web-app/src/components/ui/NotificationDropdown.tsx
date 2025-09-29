'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  BellIcon, 
  XMarkIcon,
  CheckIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Notification, getTypeIcon, getTypeColor, getPriorityColor, formatNotificationTime } from '@/types/notification'

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter(n => !n.isRead).length

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute top-16 right-4 w-96 max-w-[calc(100vw-2rem)] sm:w-96">
        <div 
          ref={dropdownRef}
          className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Thông báo
                </h3>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Đọc tất cả
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 sm:max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Không có thông báo nào</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Type Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${getTypeColor(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2 break-words">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatNotificationTime(notification.createdAt)}
                              </span>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="Đánh dấu đã đọc"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => onDelete(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Xóa thông báo"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Action Button */}
                        {notification.actionUrl && notification.actionText && (
                          <div className="mt-2">
                            <Link
                              href={notification.actionUrl}
                              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
                              onClick={onClose}
                            >
                              {notification.actionText}
                              <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <Link
                href="/dashboard/notifications"
                className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                onClick={onClose}
              >
                Xem tất cả thông báo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
