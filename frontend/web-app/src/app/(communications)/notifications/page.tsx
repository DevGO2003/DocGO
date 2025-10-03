'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
  status: 'UNREAD' | 'READ'
  createdAt: string
  readAt?: string
  actionUrl?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('UNREAD')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  const filteredNotifications = notifications.filter(notification => filter === 'ALL' || notification.status === filter)

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'INFO': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'WARNING': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'ERROR': return 'bg-red-50 text-red-700 border-red-200'
      case 'SUCCESS': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'UNREAD': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'READ': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, status: 'READ' as const, readAt: new Date().toISOString() }
        : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => 
      notification.status === 'UNREAD'
        ? { ...notification, status: 'READ' as const, readAt: new Date().toISOString() }
        : notification
    ))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
            <p className="mt-1 text-gray-600">Quản lý và theo dõi các thông báo hệ thống</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500" />
        </div>

        {/* Filters and Actions */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Thông báo</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="UNREAD">Chưa đọc</option>
                <option value="READ">Đã đọc</option>
                <option value="ALL">Tất cả</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={markAllAsRead}
                className="px-3 py-2 text-sm rounded-md bg-pink-600 text-white hover:bg-pink-700"
              >
                Đánh dấu tất cả đã đọc
              </button>
              <button className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                Cài đặt
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`rounded-2xl border shadow-sm ring-1 ring-gray-100 p-6 cursor-pointer transition-colors ${
                notification.status === 'UNREAD' 
                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getTypeBadgeClass(notification.type)}`}>
                      {notification.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(notification.status)}`}>
                      {notification.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-800">{notification.message}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Tạo: {new Date(notification.createdAt).toLocaleString('vi-VN')}</span>
                    {notification.readAt && (
                      <span>Đọc: {new Date(notification.readAt).toLocaleString('vi-VN')}</span>
                    )}
                    {notification.actionUrl && (
                      <button className="text-pink-600 hover:text-pink-800">
                        Xem chi tiết
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {notification.status === 'UNREAD' && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}