'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface ESignatureRequest {
  id: string
  contractId: string
  contractTitle: string
  signerEmail: string
  signerName: string
  status: 'PENDING' | 'SIGNED' | 'EXPIRED'
  requestedAt: string
  signedAt?: string
  expiresAt: string
}

export default function ESignaturePage() {
  const [requests, setRequests] = useState<ESignatureRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SIGNED' | 'EXPIRED'>('ALL')
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])

  const filteredRequests = requests.filter(req => filter === 'ALL' || req.status === filter)

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'SIGNED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'EXPIRED': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Chữ ký điện tử</h1>
            <p className="mt-1 text-gray-600">Quản lý và theo dõi các yêu cầu chữ ký điện tử</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        </div>

        {/* Filters */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Yêu cầu chữ ký</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="PENDING">Chờ ký</option>
                <option value="SIGNED">Đã ký</option>
                <option value="EXPIRED">Hết hạn</option>
              </select>
            </div>
            <button className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
              + Tạo yêu cầu ký
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Hợp đồng</th>
                  <th className="px-4 py-3 text-left font-medium">Người ký</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày yêu cầu</th>
                  <th className="px-4 py-3 text-left font-medium">Hết hạn</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredRequests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{request.contractTitle}</div>
                        <div className="text-xs text-gray-500">ID: {request.contractId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{request.signerName}</div>
                        <div className="text-xs text-gray-500">{request.signerEmail}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(request.requestedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(request.expiresAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                          Xem
                        </button>
                        {request.status === 'PENDING' && (
                          <button className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">
                            Gửi nhắc nhở
                          </button>
                        )}
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
