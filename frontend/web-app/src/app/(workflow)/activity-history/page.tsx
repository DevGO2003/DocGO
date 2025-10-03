'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface Activity {
  id: string
  action: string
  description: string
  actor: string
  actorEmail: string
  target: string
  targetType: 'CONTRACT' | 'USER' | 'SYSTEM'
  status: 'SUCCESS' | 'FAILED' | 'PENDING'
  createdAt: string
  ipAddress?: string
  userAgent?: string
}

export default function ActivityHistoryPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'CONTRACT' | 'USER' | 'SYSTEM'>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED' | 'PENDING'>('ALL')
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])

  const filteredActivities = activities.filter(activity => 
    (filter === 'ALL' || activity.targetType === filter) &&
    (statusFilter === 'ALL' || activity.status === statusFilter)
  )

  const getTargetTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'CONTRACT': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'USER': return 'bg-green-50 text-green-700 border-green-200'
      case 'SYSTEM': return 'bg-purple-50 text-purple-700 border-purple-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'FAILED': return 'bg-red-50 text-red-700 border-red-200'
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-gray-50 to-zinc-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử hoạt động</h1>
            <p className="mt-1 text-gray-600">Theo dõi và quản lý lịch sử hoạt động hệ thống</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-slate-500 via-gray-500 to-zinc-500" />
        </div>

        {/* Filters */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Hoạt động</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="CONTRACT">Hợp đồng</option>
                <option value="USER">Người dùng</option>
                <option value="SYSTEM">Hệ thống</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="SUCCESS">Thành công</option>
                <option value="FAILED">Thất bại</option>
                <option value="PENDING">Đang xử lý</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm rounded-md bg-slate-600 text-white hover:bg-slate-700">
                📊 Xuất báo cáo
              </button>
              <button className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                🔄 Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Hành động</th>
                  <th className="px-4 py-3 text-left font-medium">Mô tả</th>
                  <th className="px-4 py-3 text-left font-medium">Người thực hiện</th>
                  <th className="px-4 py-3 text-left font-medium">Đối tượng</th>
                  <th className="px-4 py-3 text-left font-medium">Loại</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">Thời gian</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredActivities.map(activity => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{activity.action}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate text-gray-600">{activity.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{activity.actor}</div>
                        <div className="text-xs text-gray-500">{activity.actorEmail}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{activity.target}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getTargetTypeBadgeClass(activity.targetType)}`}>
                        {activity.targetType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(activity.status)}`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(activity.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                          Xem chi tiết
                        </button>
                        <button className="px-2 py-1 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-50">
                          Xuất
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
