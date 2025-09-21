'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface SignatureRequest {
  id: string
  contractId: string
  contractTitle: string
  signers: Signer[]
  status: 'DRAFT' | 'SENT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  sentAt?: string
  completedAt?: string
  expiresAt?: string
  message?: string
}

interface Signer {
  id: string
  name: string
  email: string
  role: string
  status: 'PENDING' | 'SIGNED' | 'DECLINED' | 'EXPIRED'
  signedAt?: string
  declinedAt?: string
  declinedReason?: string
  order: number
}

export default function ESignaturePage() {
  const [requests, setRequests] = useState<SignatureRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<SignatureRequest | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'SENT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'>('ALL')

  useEffect(() => {
    const fetchSignatureRequests = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/mock/signatures')
        const json = await res.json()
        setRequests(json?.items || [])
      } catch (e: any) {
        setError(e?.message || 'Lỗi tải yêu cầu ký')
      } finally {
        setLoading(false)
      }
    }
    fetchSignatureRequests()
  }, [])

  const filteredRequests = requests.filter(req => filter === 'ALL' || req.status === filter)

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedItems(filteredRequests.map(req => req.id))
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  const handleViewDetail = (request: SignatureRequest) => {
    setSelectedRequest(request)
    setShowDetailModal(true)
  }

  const handleSendRequest = async (id: string) => {
    try {
      const res = await fetch('/api/mock/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'send' })
      })
      if (!res.ok) throw new Error('Không thể gửi yêu cầu ký')
      
      setRequests(prev => prev.map(req => 
        req.id === id 
          ? { ...req, status: 'SENT', sentAt: new Date().toISOString() }
          : req
      ))
    } catch (error) {
      setError('Không thể gửi yêu cầu ký')
    }
  }

  const handleCancelRequest = async (id: string) => {
    if (!confirm('Bạn có chắc muốn hủy yêu cầu ký này?')) return
    
    try {
      const res = await fetch('/api/mock/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'cancel' })
      })
      if (!res.ok) throw new Error('Không thể hủy yêu cầu ký')
      
      setRequests(prev => prev.map(req => 
        req.id === id 
          ? { ...req, status: 'CANCELLED' }
          : req
      ))
    } catch (error) {
      setError('Không thể hủy yêu cầu ký')
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'SENT': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getSignerStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'SIGNED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'DECLINED': return 'bg-red-50 text-red-700 border-red-200'
      case 'EXPIRED': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Chữ ký điện tử</h1>
            <p className="mt-1 text-gray-600">Gửi, theo dõi và quản lý yêu cầu ký hợp đồng.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        </div>

        {/* Filters and Actions */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Yêu cầu ký</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="DRAFT">Nháp</option>
                <option value="SENT">Đã gửi</option>
                <option value="IN_PROGRESS">Đang ký</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedItems.length} đã chọn</span>
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Bỏ chọn
                  </button>
                </div>
              )}
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              >
                + Tạo yêu cầu ký
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
                      checked={selectedItems.length === filteredRequests.length && filteredRequests.length > 0}
                      onChange={selectedItems.length === filteredRequests.length ? clearSelection : selectAll}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Hợp đồng</th>
                  <th className="px-4 py-3 text-left font-medium">Người ký</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">Tiến độ</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading && Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 w-4 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-40 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                    <td className="px-4 py-3 text-right"><div className="h-4 w-24 bg-gray-200 rounded ml-auto" /></td>
                  </tr>
                ))}
                {!loading && filteredRequests.map(req => {
                  const signedCount = req.signers.filter(s => s.status === 'SIGNED').length
                  const totalCount = req.signers.length
                  const progress = totalCount > 0 ? (signedCount / totalCount) * 100 : 0
                  
                  return (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(req.id)}
                          onChange={() => toggleSelectItem(req.id)}
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">{req.contractTitle}</div>
                          <div className="text-xs text-gray-500">ID: {req.contractId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="text-gray-900">{totalCount} người ký</div>
                          <div className="text-xs text-gray-500">
                            {req.signers.slice(0, 2).map(s => s.name).join(', ')}
                            {req.signers.length > 2 && ` +${req.signers.length - 2} khác`}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{signedCount}/{totalCount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetail(req)}
                            className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Xem
                          </button>
                          {req.status === 'DRAFT' && (
                            <button
                              onClick={() => handleSendRequest(req.id)}
                              className="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              Gửi
                            </button>
                          )}
                          {(req.status === 'SENT' || req.status === 'IN_PROGRESS') && (
                            <button
                              onClick={() => handleCancelRequest(req.id)}
                              className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                            >
                              Hủy
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Request Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tạo yêu cầu ký mới</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chọn hợp đồng</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">Chọn hợp đồng cần ký</option>
                    <option value="HD-001">Hợp đồng lao động - HD-001</option>
                    <option value="HD-002">Hợp đồng cung cấp dịch vụ - HD-002</option>
                    <option value="HD-003">Hợp đồng mua bán - HD-003</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thêm người ký</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Tên người ký"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="1">Thứ tự 1</option>
                        <option value="2">Thứ tự 2</option>
                        <option value="3">Thứ tự 3</option>
                      </select>
                      <button type="button" className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lời nhắn (tùy chọn)</label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nhập lời nhắn cho người ký..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn (ngày)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    defaultValue="7"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Tạo yêu cầu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết yêu cầu ký</h3>
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
              
              <div className="space-y-6">
                {/* Contract Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hợp đồng</label>
                    <div className="text-sm text-gray-900">{selectedRequest.contractTitle}</div>
                    <div className="text-xs text-gray-500">ID: {selectedRequest.contractId}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
                
                {/* Signers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Danh sách người ký</label>
                  <div className="space-y-3">
                    {selectedRequest.signers.map((signer, index) => (
                      <div key={signer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-medium">
                            {signer.order}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{signer.name}</div>
                            <div className="text-sm text-gray-500">{signer.email}</div>
                            <div className="text-xs text-gray-500">{signer.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getSignerStatusClass(signer.status)}`}>
                            {signer.status}
                          </span>
                          {signer.signedAt && (
                            <div className="text-xs text-gray-500">
                              Ký lúc: {new Date(signer.signedAt).toLocaleString('vi-VN')}
                            </div>
                          )}
                          {signer.declinedReason && (
                            <div className="text-xs text-red-600">
                              Lý do: {signer.declinedReason}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Lịch sử</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-gray-600">Tạo yêu cầu</span>
                      <span className="text-gray-500">{new Date(selectedRequest.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    {selectedRequest.sentAt && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-gray-600">Gửi yêu cầu</span>
                        <span className="text-gray-500">{new Date(selectedRequest.sentAt).toLocaleString('vi-VN')}</span>
                      </div>
                    )}
                    {selectedRequest.completedAt && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-gray-600">Hoàn thành</span>
                        <span className="text-gray-500">{new Date(selectedRequest.completedAt).toLocaleString('vi-VN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
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
                {selectedRequest.status === 'DRAFT' && (
                  <button
                    onClick={() => {
                      handleSendRequest(selectedRequest.id)
                      setShowDetailModal(false)
                      setSelectedRequest(null)
                    }}
                    className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Gửi yêu cầu
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
