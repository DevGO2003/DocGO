'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface SupportTicket {
  id: string
  title: string
  category: 'BUG' | 'FEATURE' | 'QUESTION' | 'COMPLAINT'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  description: string
  author: string
  authorEmail: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
  response?: string
}

export default function HelpSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'BUG' | 'FEATURE' | 'QUESTION' | 'COMPLAINT'>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'>('ALL')
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  const filteredTickets = tickets.filter(ticket => 
    (filter === 'ALL' || ticket.category === filter) &&
    (statusFilter === 'ALL' || ticket.status === statusFilter)
  )

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'BUG': return 'bg-red-50 text-red-700 border-red-200'
      case 'FEATURE': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'QUESTION': return 'bg-green-50 text-green-700 border-green-200'
      case 'COMPLAINT': return 'bg-orange-50 text-orange-700 border-orange-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'MEDIUM': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'URGENT': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'CLOSED': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Trợ giúp & Hỗ trợ</h1>
            <p className="mt-1 text-gray-600">Quản lý và theo dõi các yêu cầu hỗ trợ</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
        </div>

        {/* Filters and Actions */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Yêu cầu hỗ trợ</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="BUG">Lỗi</option>
                <option value="FEATURE">Tính năng</option>
                <option value="QUESTION">Câu hỏi</option>
                <option value="COMPLAINT">Khiếu nại</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="OPEN">Mở</option>
                <option value="IN_PROGRESS">Đang xử lý</option>
                <option value="RESOLVED">Đã giải quyết</option>
                <option value="CLOSED">Đã đóng</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700">
                + Tạo yêu cầu
              </button>
              <button className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                📚 Tài liệu
              </button>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryBadgeClass(ticket.category)}`}>
                      {ticket.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityBadgeClass(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-600">{ticket.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Tác giả: {ticket.author} ({ticket.authorEmail})</span>
                    <span>Tạo: {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span>Cập nhật: {new Date(ticket.updatedAt).toLocaleDateString('vi-VN')}</span>
                    {ticket.assignedTo && (
                      <span>Giao cho: {ticket.assignedTo}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                    Xem chi tiết
                  </button>
                  <button className="px-3 py-1 text-sm rounded border border-orange-300 text-orange-700 hover:bg-orange-50">
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
