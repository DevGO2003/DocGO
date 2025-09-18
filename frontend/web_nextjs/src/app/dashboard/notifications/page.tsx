'use client'

import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout'

interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  isRead: boolean
  createdAt: string
  actionUrl?: string
  actionText?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL')
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'>('ALL')

  // Mock data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Hợp đồng mới cần phê duyệt',
      message: 'Hợp đồng lao động #HD-001 đã được tạo và đang chờ phê duyệt từ bạn.',
      type: 'WARNING',
      isRead: false,
      createdAt: '2024-01-15T10:30:00Z',
      actionUrl: '/dashboard/hop-dong/1',
      actionText: 'Xem hợp đồng',
      priority: 'HIGH'
    },
    {
      id: '2',
      title: 'Chữ ký điện tử hoàn thành',
      message: 'Hợp đồng mua bán #HD-002 đã được ký thành công bởi tất cả các bên.',
      type: 'SUCCESS',
      isRead: false,
      createdAt: '2024-01-15T10:25:00Z',
      actionUrl: '/dashboard/hop-dong/2',
      actionText: 'Xem hợp đồng',
      priority: 'MEDIUM'
    },
    {
      id: '3',
      title: 'Hợp đồng sắp hết hạn',
      message: 'Hợp đồng dịch vụ #HD-003 sẽ hết hạn trong 3 ngày tới.',
      type: 'WARNING',
      isRead: true,
      createdAt: '2024-01-15T10:20:00Z',
      actionUrl: '/dashboard/hop-dong/3',
      actionText: 'Xem hợp đồng',
      priority: 'HIGH'
    },
    {
      id: '4',
      title: 'Tài khoản mới đăng ký',
      message: 'Nguyễn Văn A đã đăng ký tài khoản và đang chờ phê duyệt.',
      type: 'INFO',
      isRead: false,
      createdAt: '2024-01-15T10:15:00Z',
      actionUrl: '/dashboard/phe-duyet-tai-khoan',
      actionText: 'Phê duyệt',
      priority: 'MEDIUM'
    },
    {
      id: '5',
      title: 'Backup hệ thống thành công',
      message: 'Quá trình backup dữ liệu đã hoàn thành thành công lúc 02:00 sáng nay.',
      type: 'SUCCESS',
      isRead: true,
      createdAt: '2024-01-15T02:00:00Z',
      actionUrl: '/dashboard/backup-restore',
      actionText: 'Xem chi tiết',
      priority: 'LOW'
    },
    {
      id: '6',
      title: 'Lỗi hệ thống',
      message: 'Đã xảy ra lỗi khi xử lý hợp đồng #HD-004. Vui lòng kiểm tra lại.',
      type: 'ERROR',
      isRead: false,
      createdAt: '2024-01-15T10:10:00Z',
      actionUrl: '/dashboard/hop-dong/4',
      actionText: 'Kiểm tra',
      priority: 'URGENT'
    },
    {
      id: '7',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống đã được cập nhật lên phiên bản mới với nhiều tính năng cải tiến.',
      type: 'INFO',
      isRead: true,
      createdAt: '2024-01-15T09:00:00Z',
      actionUrl: '/dashboard/huong-dan',
      actionText: 'Xem hướng dẫn',
      priority: 'LOW'
    },
    {
      id: '8',
      title: 'Bình luận mới',
      message: 'Trần Thị B đã thêm bình luận mới vào hợp đồng #HD-005.',
      type: 'INFO',
      isRead: false,
      createdAt: '2024-01-15T10:05:00Z',
      actionUrl: '/dashboard/binh-luan-cong-tac',
      actionText: 'Xem bình luận',
      priority: 'MEDIUM'
    }
  ]

  useEffect(() => {
    fetchNotifications()
  }, [filter, typeFilter])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredNotifications = mockNotifications
      
      if (filter === 'UNREAD') {
        filteredNotifications = filteredNotifications.filter(n => !n.isRead)
      } else if (filter === 'READ') {
        filteredNotifications = filteredNotifications.filter(n => n.isRead)
      }
      
      if (typeFilter !== 'ALL') {
        filteredNotifications = filteredNotifications.filter(n => n.type === typeFilter)
      }
      
      // Sort by priority and date
      filteredNotifications.sort((a, b) => {
        const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        if (priorityDiff !== 0) return priorityDiff
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      
      setNotifications(filteredNotifications)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'SUCCESS':
        return '✅'
      case 'WARNING':
        return '⚠️'
      case 'ERROR':
        return '❌'
      case 'INFO':
      default:
        return 'ℹ️'
    }
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'SUCCESS':
        return 'bg-green-50 border-green-200'
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200'
      case 'ERROR':
        return 'bg-red-50 border-red-200'
      case 'INFO':
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Vừa xong'
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
    return date.toLocaleDateString('vi-VN')
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 opacity-50" />
          <div className="relative px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                <p className="mt-1 text-gray-600">Quản lý và theo dõi tất cả thông báo hệ thống.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{unreadCount}</div>
                  <div className="text-sm text-gray-600">Chưa đọc</div>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Đánh dấu tất cả đã đọc
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        </div>

        {/* Filters */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="UNREAD">Chưa đọc</option>
                <option value="READ">Đã đọc</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Loại:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="INFO">Thông tin</option>
                <option value="SUCCESS">Thành công</option>
                <option value="WARNING">Cảnh báo</option>
                <option value="ERROR">Lỗi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-full bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
              <p className="text-gray-600">Hiện tại không có thông báo nào phù hợp với bộ lọc của bạn.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border shadow-sm ring-1 ring-gray-100 p-6 transition-all hover:shadow-md ${
                  notification.isRead 
                    ? 'bg-white border-gray-200' 
                    : 'bg-blue-50 border-blue-200'
                } ${getTypeColor(notification.type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg">
                      {getTypeIcon(notification.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${notification.isRead ? 'text-gray-900' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
                            {notification.priority === 'URGENT' ? 'Khẩn cấp' :
                             notification.priority === 'HIGH' ? 'Cao' :
                             notification.priority === 'MEDIUM' ? 'Trung bình' : 'Thấp'}
                          </span>
                        </div>
                        <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {notification.actionText || 'Xem chi tiết'}
                          </a>
                        )}
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Đánh dấu đã đọc
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📢</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
                <div className="text-sm text-gray-600">Tổng thông báo</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-lg">🔴</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{unreadCount}</div>
                <div className="text-sm text-gray-600">Chưa đọc</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-lg">⚠️</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'WARNING' && !n.isRead).length}
                </div>
                <div className="text-sm text-gray-600">Cảnh báo</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'SUCCESS').length}
                </div>
                <div className="text-sm text-gray-600">Thành công</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
