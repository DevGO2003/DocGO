'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface Backup {
  id: string
  name: string
  type: 'AUTO' | 'MANUAL'
  status: 'CREATING' | 'COMPLETED' | 'FAILED'
  size: string
  createdAt: string
  completedAt?: string
  fileUrl?: string
}

export default function BackupRestorePage() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'AUTO' | 'MANUAL'>('ALL')
  const [selectedBackups, setSelectedBackups] = useState<string[]>([])

  const filteredBackups = backups.filter(backup => filter === 'ALL' || backup.type === filter)

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'AUTO': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'MANUAL': return 'bg-green-50 text-green-700 border-green-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CREATING': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'FAILED': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Sao lưu & khôi phục</h1>
            <p className="mt-1 text-gray-600">Quản lý sao lưu và khôi phục dữ liệu hệ thống</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        </div>

        {/* Filters and Actions */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Sao lưu</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="AUTO">Tự động</option>
                <option value="MANUAL">Thủ công</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
                + Tạo sao lưu
              </button>
              <button className="px-3 py-2 text-sm rounded-md border border-teal-300 text-teal-700 hover:bg-teal-50">
                🔄 Khôi phục
              </button>
            </div>
          </div>
        </div>

        {/* Backups List */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Tên sao lưu</th>
                  <th className="px-4 py-3 text-left font-medium">Loại</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">Kích thước</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                  <th className="px-4 py-3 text-left font-medium">Hoàn thành</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBackups.map(backup => (
                  <tr key={backup.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{backup.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getTypeBadgeClass(backup.type)}`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(backup.status)}`}>
                        {backup.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {backup.size}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(backup.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {backup.completedAt ? new Date(backup.completedAt).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {backup.status === 'COMPLETED' && backup.fileUrl && (
                          <button className="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700">
                            Tải xuống
                          </button>
                        )}
                        <button className="px-2 py-1 text-xs rounded border border-teal-300 text-teal-700 hover:bg-teal-50">
                          Khôi phục
                        </button>
                        <button className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                          Xem
                        </button>
                        <button className="px-2 py-1 text-xs rounded border border-red-300 text-red-700 hover:bg-red-50">
                          Xóa
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
