'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface Integration {
  id: string
  name: string
  type: 'API' | 'WEBHOOK' | 'SDK' | 'PLUGIN'
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR'
  description: string
  lastSync?: string
  errorCount: number
  createdAt: string
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'API' | 'WEBHOOK' | 'SDK' | 'PLUGIN'>('ALL')
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])

  const filteredIntegrations = integrations.filter(integration => filter === 'ALL' || integration.type === filter)

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'API': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'WEBHOOK': return 'bg-green-50 text-green-700 border-green-200'
      case 'SDK': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'PLUGIN': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'INACTIVE': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'ERROR': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Tích hợp</h1>
            <p className="mt-1 text-gray-600">Quản lý các tích hợp và kết nối bên thứ ba</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        </div>

        {/* Filters and Actions */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Tích hợp</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="API">API</option>
                <option value="WEBHOOK">Webhook</option>
                <option value="SDK">SDK</option>
                <option value="PLUGIN">Plugin</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                + Thêm tích hợp
              </button>
              <button className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                📚 Tài liệu
              </button>
            </div>
          </div>
        </div>

        {/* Integrations List */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Tên tích hợp</th>
                  <th className="px-4 py-3 text-left font-medium">Loại</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">Mô tả</th>
                  <th className="px-4 py-3 text-left font-medium">Lần đồng bộ cuối</th>
                  <th className="px-4 py-3 text-left font-medium">Lỗi</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredIntegrations.map(integration => (
                  <tr key={integration.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{integration.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getTypeBadgeClass(integration.type)}`}>
                        {integration.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(integration.status)}`}>
                        {integration.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate text-gray-600">{integration.description}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {integration.lastSync ? new Date(integration.lastSync).toLocaleDateString('vi-VN') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        integration.errorCount > 0 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {integration.errorCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(integration.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                          Xem
                        </button>
                        <button className="px-2 py-1 text-xs rounded border border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                          Cấu hình
                        </button>
                        <button className="px-2 py-1 text-xs rounded border border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                          Test
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
