'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface ApprovalRequest {
  id: string
  email: string
  name: string
  company?: string
  department?: string
  role: string
  requestedAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reason?: string
  documents?: string[]
}

export default function AccountApprovalPage() {
  const [items, setItems] = useState<ApprovalRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')

  const fetchApprovalRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/mock/approvals')
      const json = await res.json()
      setItems(json?.items || [])
    } catch (e: any) {
      setError(e?.message || 'Lỗi tải yêu cầu')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchApprovalRequests() }, [fetchApprovalRequests])

  const filteredItems = items.filter(item => filter === 'ALL' || item.status === filter)

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedItems(filteredItems.map(item => item.id))
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  const handleViewDetail = (request: ApprovalRequest) => {
    setSelectedRequest(request)
    setShowDetailModal(true)
  }

  const processApprovalRequest = async (id: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      setBusyId(id)
      const res = await fetch('/api/mock/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, reason })
      })
      if (!res.ok) throw new Error('Yêu cầu không thành công')
      
      // Update status instead of removing
      setItems(prev => prev.map(item => 
        item.id === id 
          ? { ...item, status: action === 'approve' ? 'APPROVED' : 'REJECTED', reason }
          : item
      ))
      setSelectedItems(prev => prev.filter(x => x !== id))
    } catch (e: any) {
      setError(e?.message || 'Lỗi xử lý')
    } finally {
      setBusyId(null)
    }
  }

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedItems.length === 0) return
    
    try {
      for (const id of selectedItems) {
        await processApprovalRequest(id, action)
      }
      setSelectedItems([])
    } catch (error) {
      setError('Không thể thực hiện thao tác hàng loạt')
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-yellow-50 to-lime-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Phê duyệt tài khoản</h1>
            <p className="mt-1 text-gray-600">Xem và xử lý yêu cầu phê duyệt đăng ký.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500" />
        </div>

        {/* Filters and Actions */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Yêu cầu phê duyệt</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="PENDING">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Đã từ chối</option>
                <option value="ALL">Tất cả</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedItems.length} đã chọn</span>
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-3 py-1 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Duyệt hàng loạt
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    className="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                  >
                    Từ chối hàng loạt
                  </button>
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Bỏ chọn
                  </button>
                </div>
              )}
              <button onClick={fetchApprovalRequests} className="px-3 py-2 text-sm rounded-md bg-amber-600 text-white hover:bg-amber-700">
                🔄 Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          {error && <div className="m-4 rounded border p-3 text-sm text-rose-700 bg-rose-50">{error}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onChange={selectedItems.length === filteredItems.length ? clearSelection : selectAll}
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Người dùng</th>
                  <th className="px-4 py-3 text-left font-medium">Thông tin</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày yêu cầu</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading && Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 w-4 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-40 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3 text-right"><div className="h-4 w-24 bg-gray-200 rounded ml-auto" /></td>
                  </tr>
                ))}
                {!loading && filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center text-white text-sm font-medium">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="text-gray-900">{item.role}</div>
                        {item.company && <div className="text-xs text-gray-500">{item.company}</div>}
                        {item.department && <div className="text-xs text-gray-500">{item.department}</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(item.requestedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(item)}
                          className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Xem
                        </button>
                        {item.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => processApprovalRequest(item.id, 'approve')}
                              disabled={busyId === item.id}
                              className="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {busyId === item.id ? 'Đang duyệt...' : 'Duyệt'}
                            </button>
                            <button
                              onClick={() => processApprovalRequest(item.id, 'reject')}
                              disabled={busyId === item.id}
                              className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              {busyId === item.id ? 'Đang từ chối...' : 'Từ chối'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết yêu cầu</h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedRequest(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
      <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                    <div className="text-sm text-gray-900">{selectedRequest.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="text-sm text-gray-900">{selectedRequest.email}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò yêu cầu</label>
                    <div className="text-sm text-gray-900">{selectedRequest.role}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
                
                {selectedRequest.company && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Công ty</label>
                    <div className="text-sm text-gray-900">{selectedRequest.company}</div>
                  </div>
                )}
                
                {selectedRequest.department && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
                    <div className="text-sm text-gray-900">{selectedRequest.department}</div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày yêu cầu</label>
                  <div className="text-sm text-gray-900">{new Date(selectedRequest.requestedAt).toLocaleString('vi-VN')}</div>
                </div>
                
                {selectedRequest.reason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lý do</label>
                    <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">{selectedRequest.reason}</div>
                  </div>
                )}
                
                {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tài liệu đính kèm</label>
                    <div className="space-y-2">
                      {selectedRequest.documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                          <span className="text-sm text-gray-600">📄</span>
                          <span className="text-sm text-gray-900">{doc}</span>
                          <button className="text-xs text-blue-600 hover:text-blue-800">Tải xuống</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {selectedRequest.status === 'PENDING' && (
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    onClick={() => {
                      setShowDetailModal(false)
                      setSelectedRequest(null)
                    }}
                    className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      processApprovalRequest(selectedRequest.id, 'approve')
                      setShowDetailModal(false)
                      setSelectedRequest(null)
                    }}
                    className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Nhập lý do từ chối (tùy chọn):')
                      processApprovalRequest(selectedRequest.id, 'reject', reason || undefined)
                      setShowDetailModal(false)
                      setSelectedRequest(null)
                    }}
                    className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                  >
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
