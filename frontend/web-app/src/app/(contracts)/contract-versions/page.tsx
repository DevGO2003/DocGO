'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface ContractVersion {
  id: string
  contractId: string
  contractTitle: string
  version: number
  changes: string
  author: string
  createdAt: string
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  fileUrl?: string
}

export default function ContractVersionsPage() {
  const [versions, setVersions] = useState<ContractVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'ACTIVE' | 'ARCHIVED'>('ALL')
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])

  const filteredVersions = versions.filter(version => filter === 'ALL' || version.status === filter)

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'ARCHIVED': return 'bg-blue-50 text-blue-700 border-blue-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Phiên bản hợp đồng</h1>
            <p className="mt-1 text-gray-600">Quản lý và theo dõi các phiên bản của hợp đồng</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500" />
        </div>

        {/* Filters */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Phiên bản</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="DRAFT">Nháp</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="ARCHIVED">Đã lưu trữ</option>
              </select>
            </div>
            <button className="px-3 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700">
              + Tạo phiên bản mới
            </button>
          </div>
        </div>

        {/* Versions List */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Hợp đồng</th>
                  <th className="px-4 py-3 text-left font-medium">Phiên bản</th>
                  <th className="px-4 py-3 text-left font-medium">Thay đổi</th>
                  <th className="px-4 py-3 text-left font-medium">Tác giả</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredVersions.map(version => (
                  <tr key={version.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{version.contractTitle}</div>
                        <div className="text-xs text-gray-500">ID: {version.contractId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        v{version.version}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate text-gray-600">{version.changes}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{version.author}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(version.status)}`}>
                        {version.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(version.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                          Xem
                        </button>
                        {version.fileUrl && (
                          <button className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">
                            Tải xuống
                          </button>
                        )}
                        <button className="px-2 py-1 text-xs rounded border border-purple-300 text-purple-700 hover:bg-purple-50">
                          So sánh
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
