'use client'

import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout'

interface CalendarEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  type: 'CONTRACT_EXPIRY' | 'MEETING' | 'DEADLINE' | 'REMINDER' | 'HOLIDAY'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  relatedContract?: string
  attendees?: string[]
  location?: string
  isAllDay: boolean
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'REMINDER',
    priority: 'MEDIUM',
    status: 'PENDING',
    isAllDay: false
  })

  // Mock data
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Hợp đồng HD-001 hết hạn',
      description: 'Hợp đồng lao động với Công ty ABC sẽ hết hạn vào ngày này',
      startDate: '2024-01-20T00:00:00Z',
      endDate: '2024-01-20T23:59:59Z',
      type: 'CONTRACT_EXPIRY',
      priority: 'HIGH',
      status: 'PENDING',
      relatedContract: 'HD-001',
      isAllDay: true
    },
    {
      id: '2',
      title: 'Họp phê duyệt hợp đồng',
      description: 'Cuộc họp để phê duyệt các hợp đồng mới trong tháng',
      startDate: '2024-01-18T09:00:00Z',
      endDate: '2024-01-18T11:00:00Z',
      type: 'MEETING',
      priority: 'MEDIUM',
      status: 'PENDING',
      attendees: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'],
      location: 'Phòng họp A',
      isAllDay: false
    },
    {
      id: '3',
      title: 'Deadline báo cáo tháng',
      description: 'Hạn chót nộp báo cáo thống kê tháng 1/2024',
      startDate: '2024-01-25T17:00:00Z',
      endDate: '2024-01-25T17:00:00Z',
      type: 'DEADLINE',
      priority: 'HIGH',
      status: 'PENDING',
      isAllDay: false
    },
    {
      id: '4',
      title: 'Nhắc nhở kiểm tra hợp đồng',
      description: 'Kiểm tra và cập nhật trạng thái các hợp đồng đang chờ',
      startDate: '2024-01-16T10:00:00Z',
      endDate: '2024-01-16T10:30:00Z',
      type: 'REMINDER',
      priority: 'MEDIUM',
      status: 'PENDING',
      isAllDay: false
    },
    {
      id: '5',
      title: 'Tết Nguyên Đán',
      description: 'Nghỉ lễ Tết Nguyên Đán',
      startDate: '2024-02-10T00:00:00Z',
      endDate: '2024-02-16T23:59:59Z',
      type: 'HOLIDAY',
      priority: 'LOW',
      status: 'PENDING',
      isAllDay: true
    },
    {
      id: '6',
      title: 'Họp đánh giá quý',
      description: 'Cuộc họp đánh giá kết quả hoạt động quý 1',
      startDate: '2024-01-22T14:00:00Z',
      endDate: '2024-01-22T16:00:00Z',
      type: 'MEETING',
      priority: 'HIGH',
      status: 'PENDING',
      attendees: ['Ban giám đốc', 'Trưởng phòng'],
      location: 'Hội trường lớn',
      isAllDay: false
    }
  ]

  useEffect(() => {
    fetchCalendarEvents()
  }, [selectedDate, view])

  const fetchCalendarEvents = async () => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setEvents(mockEvents)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.startDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title!,
      description: newEvent.description || '',
      startDate: newEvent.startDate!,
      endDate: newEvent.endDate || newEvent.startDate!,
      type: newEvent.type!,
      priority: newEvent.priority!,
      status: newEvent.status!,
      relatedContract: newEvent.relatedContract,
      attendees: newEvent.attendees,
      location: newEvent.location,
      isAllDay: newEvent.isAllDay!
    }

    setEvents(prev => [event, ...prev])
    setNewEvent({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      type: 'REMINDER',
      priority: 'MEDIUM',
      status: 'PENDING',
      isAllDay: false
    })
    setShowAddModal(false)
  }

  const getTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'CONTRACT_EXPIRY':
        return '📄'
      case 'MEETING':
        return '👥'
      case 'DEADLINE':
        return '⏰'
      case 'REMINDER':
        return '🔔'
      case 'HOLIDAY':
        return '🎉'
      default:
        return '📅'
    }
  }

  const getTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'CONTRACT_EXPIRY':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'MEETING':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'DEADLINE':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'REMINDER':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'HOLIDAY':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: CalendarEvent['priority']) => {
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
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return events.filter(event => {
      const eventDate = new Date(event.startDate)
      return eventDate >= now && eventDate <= nextWeek && event.status === 'PENDING'
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }

  const upcomingEvents = getUpcomingEvents()

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 opacity-50" />
          <div className="relative px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lịch</h1>
                <p className="mt-1 text-gray-600">Quản lý sự kiện, nhắc nhở và deadline.</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + Thêm sự kiện
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
        </div>

        {/* View Controls */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setView('month')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    view === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tháng
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    view === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tuần
                </button>
                <button
                  onClick={() => setView('day')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    view === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Ngày
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {selectedDate.toLocaleDateString('vi-VN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
                  className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
                >
                  ←
                </button>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
                >
                  Hôm nay
                </button>
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
                  className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch sự kiện</h2>
              
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getTypeIcon(event.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{event.title}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(event.type)}`}>
                              {event.type === 'CONTRACT_EXPIRY' ? 'Hết hạn' :
                               event.type === 'MEETING' ? 'Họp' :
                               event.type === 'DEADLINE' ? 'Deadline' :
                               event.type === 'REMINDER' ? 'Nhắc nhở' : 'Lễ'}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(event.priority)}`}>
                              {event.priority === 'URGENT' ? 'Khẩn cấp' :
                               event.priority === 'HIGH' ? 'Cao' :
                               event.priority === 'MEDIUM' ? 'Trung bình' : 'Thấp'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>📅 {formatDate(event.startDate)}</span>
                            {!event.isAllDay && (
                              <span>🕐 {formatTime(event.startDate)}</span>
                            )}
                            {event.location && (
                              <span>📍 {event.location}</span>
                            )}
                            {event.attendees && (
                              <span>👥 {event.attendees.length} người</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sắp tới</h2>
              <div className="space-y-3">
                {upcomingEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getTypeIcon(event.type)}</span>
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatDate(event.startDate)} {!event.isAllDay && formatTime(event.startDate)}
                    </div>
                  </div>
                ))}
                {upcomingEvents.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">Không có sự kiện sắp tới</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tổng sự kiện</span>
                  <span className="font-medium text-gray-900">{events.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sắp tới</span>
                  <span className="font-medium text-gray-900">{upcomingEvents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Họp</span>
                  <span className="font-medium text-gray-900">
                    {events.filter(e => e.type === 'MEETING').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Deadline</span>
                  <span className="font-medium text-gray-900">
                    {events.filter(e => e.type === 'DEADLINE').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Event Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thêm sự kiện mới</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tiêu đề sự kiện"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả chi tiết sự kiện"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu *</label>
                    <input
                      type="datetime-local"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                    <input
                      type="datetime-local"
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="REMINDER">Nhắc nhở</option>
                      <option value="MEETING">Họp</option>
                      <option value="DEADLINE">Deadline</option>
                      <option value="CONTRACT_EXPIRY">Hết hạn hợp đồng</option>
                      <option value="HOLIDAY">Lễ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Độ ưu tiên</label>
                    <select
                      value={newEvent.priority}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, priority: e.target.value as CalendarEvent['priority'] }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LOW">Thấp</option>
                      <option value="MEDIUM">Trung bình</option>
                      <option value="HIGH">Cao</option>
                      <option value="URGENT">Khẩn cấp</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
                  <input
                    type="text"
                    value={newEvent.location || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập địa điểm"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddEvent}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Thêm sự kiện
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
