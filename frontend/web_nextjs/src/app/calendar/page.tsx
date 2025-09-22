'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface CalendarEvent {
  id: string
  title: string
  description?: string
  type: 'CONTRACT' | 'MEETING' | 'DEADLINE' | 'REMINDER'
  startDate: string
  endDate?: string
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  attendees?: string[]
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'CONTRACT' | 'MEETING' | 'DEADLINE' | 'REMINDER'>('ALL')
  const [view, setView] = useState<'MONTH' | 'WEEK' | 'DAY'>('MONTH')

  const filteredEvents = events.filter(event => filter === 'ALL' || event.type === filter)

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'CONTRACT': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'MEETING': return 'bg-green-50 text-green-700 border-green-200'
      case 'DEADLINE': return 'bg-red-50 text-red-700 border-red-200'
      case 'REMINDER': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'MEDIUM': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'HIGH': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Lịch</h1>
            <p className="mt-1 text-gray-600">Quản lý và theo dõi các sự kiện và lịch trình</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500" />
        </div>

        {/* Filters and View Controls */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Lịch trình</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="CONTRACT">Hợp đồng</option>
                <option value="MEETING">Cuộc họp</option>
                <option value="DEADLINE">Hạn chót</option>
                <option value="REMINDER">Nhắc nhở</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setView('MONTH')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    view === 'MONTH' 
                      ? 'bg-teal-600 text-white' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tháng
                </button>
                <button 
                  onClick={() => setView('WEEK')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    view === 'WEEK' 
                      ? 'bg-teal-600 text-white' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Tuần
                </button>
                <button 
                  onClick={() => setView('DAY')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    view === 'DAY' 
                      ? 'bg-teal-600 text-white' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Ngày
                </button>
              </div>
              <button className="px-3 py-2 text-sm rounded-md bg-teal-600 text-white hover:bg-teal-700">
                + Thêm sự kiện
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View Placeholder */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Lịch {view.toLowerCase()}</h3>
            <p className="text-gray-600 mb-4">Chế độ xem lịch sẽ được hiển thị ở đây</p>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
              Tải lịch
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Sự kiện sắp tới</h3>
          {filteredEvents.map(event => (
            <div key={event.id} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getTypeBadgeClass(event.type)}`}>
                      {event.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(event.status)}`}>
                      {event.status}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityBadgeClass(event.priority)}`}>
                      {event.priority}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-600 mb-3">{event.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Bắt đầu: {new Date(event.startDate).toLocaleString('vi-VN')}</span>
                    {event.endDate && (
                      <span>Kết thúc: {new Date(event.endDate).toLocaleString('vi-VN')}</span>
                    )}
                    {event.attendees && event.attendees.length > 0 && (
                      <span>Tham gia: {event.attendees.length} người</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                    Chỉnh sửa
                  </button>
                  <button className="px-3 py-1 text-sm rounded border border-red-300 text-red-700 hover:bg-red-50">
                    Xóa
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
