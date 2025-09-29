'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface Comment {
  id: string
  contractId: string
  contractTitle: string
  author: string
  authorEmail: string
  content: string
  createdAt: string
  status: 'ACTIVE' | 'RESOLVED' | 'ARCHIVED'
  replies?: Comment[]
}

export default function CollaborationCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED' | 'ARCHIVED'>('ACTIVE')
  const [selectedComments, setSelectedComments] = useState<string[]>([])

  const filteredComments = comments.filter(comment => filter === 'ALL' || comment.status === filter)

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'ARCHIVED': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Bình luận cộng tác</h1>
            <p className="mt-1 text-gray-600">Quản lý và theo dõi các bình luận trên hợp đồng</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
        </div>

        {/* Filters */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Bình luận</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="RESOLVED">Đã giải quyết</option>
                <option value="ARCHIVED">Đã lưu trữ</option>
                <option value="ALL">Tất cả</option>
              </select>
            </div>
            <button className="px-3 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700">
              + Thêm bình luận
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {filteredComments.map(comment => (
            <div key={comment.id} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-medium">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{comment.author}</div>
                      <div className="text-xs text-gray-500">{comment.authorEmail}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(comment.status)}`}>
                      {comment.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">Hợp đồng: {comment.contractTitle}</div>
                    <div className="text-gray-800">{comment.content}</div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{new Date(comment.createdAt).toLocaleString('vi-VN')}</span>
                    <button className="text-blue-600 hover:text-blue-800">Trả lời</button>
                    <button className="text-gray-600 hover:text-gray-800">Chỉnh sửa</button>
                    <button className="text-red-600 hover:text-red-800">Xóa</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
