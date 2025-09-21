'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface ApprovalFlow {
  id: string
  contractId: string
  contractTitle: string
  contractValue: number
  currency: string
  status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  currentStep: number
  totalSteps: number
  steps: ApprovalStep[]
  createdBy: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  completedAt?: string
  rejectedAt?: string
  rejectedBy?: {
    id: string
    name: string
  }
  rejectionReason?: string
}

interface ApprovalStep {
  id: string
  stepNumber: number
  stepName: string
  approver: {
    id: string
    name: string
    email: string
    role: string
  }
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED'
  approvedAt?: string
  rejectedAt?: string
  comments?: string
  required: boolean
  minValue?: number
  maxValue?: number
}

export default function ApprovalWorkflowPage() {
  const [flows, setFlows] = useState<ApprovalFlow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<ApprovalFlow | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchApprovalFlows = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/mock/approval-flows')
        const json = await res.json()
        setFlows(json?.items || [])
      } catch (e: any) {
        setError(e?.message || 'Lỗi tải luồng phê duyệt')
      } finally {
        setLoading(false)
      }
    }
    fetchApprovalFlows()
  }, [])

  const filteredFlows = flows.filter(flow => {
    const matchesFilter = filter === 'ALL' || flow.status === filter
    const matchesSearch = !searchTerm || 
      flow.contractTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedItems(filteredFlows.map(flow => flow.id))
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  const handleViewDetail = (flow: ApprovalFlow) => {
    setSelectedFlow(flow)
    setShowDetailModal(true)
  }

  const handleApproveStep = async (flowId: string, stepId: string, comments?: string) => {
    try {
      const res = await fetch('/api/mock/approval-flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flowId, stepId, action: 'approve', comments })
      })
      if (!res.ok) throw new Error('Không thể phê duyệt bước')
      
      const json = await res.json()
      setFlows(prev => prev.map(flow => 
        flow.id === flowId ? json.data : flow
      ))
    } catch (error) {
      setError('Không thể phê duyệt bước')
    }
  }

  const handleRejectStep = async (flowId: string, stepId: string, reason: string) => {
    try {
      const res = await fetch('/api/mock/approval-flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flowId, stepId, action: 'reject', reason })
      })
      if (!res.ok) throw new Error('Không thể từ chối bước')
      
      const json = await res.json()
      setFlows(prev => prev.map(flow => 
        flow.id === flowId ? json.data : flow
      ))
    } catch (error) {
      setError('Không thể từ chối bước')
    }
  }

  const handleCancelFlow = async (flowId: string) => {
    if (!confirm('Bạn có chắc muốn hủy luồng phê duyệt này?')) return
    
    try {
      const res = await fetch('/api/mock/approval-flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flowId, action: 'cancel' })
      })
      if (!res.ok) throw new Error('Không thể hủy luồng phê duyệt')
      
      setFlows(prev => prev.map(flow => 
        flow.id === flowId 
          ? { ...flow, status: 'CANCELLED' as const }
          : flow
      ))
    } catch (error) {
      setError('Không thể hủy luồng phê duyệt')
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200'
      case 'CANCELLED': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý'
      case 'IN_PROGRESS': return 'Đang xử lý'
      case 'APPROVED': return 'Đã duyệt'
      case 'REJECTED': return 'Bị từ chối'
      case 'CANCELLED': return 'Đã hủy'
      default: return status
    }
  }

  const getStepStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-100 text-gray-600'
      case 'APPROVED': return 'bg-emerald-100 text-emerald-600'
      case 'REJECTED': return 'bg-red-100 text-red-600'
      case 'SKIPPED': return 'bg-amber-100 text-amber-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD'
    }).format(value)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Luồng phê duyệt</h1>
            <p className="mt-1 text-gray-600">Quản lý luồng phê duyệt nhiều bước theo giá trị hợp đồng.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
        </div>

        {/* Filters and Actions */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Luồng phê duyệt</h2>
              <input
                type="text"
                placeholder="Tìm kiếm luồng phê duyệt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="IN_PROGRESS">Đang xử lý</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Bị từ chối</option>
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
                className="px-3 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700"
              >
                + Tạo luồng phê duyệt
              </button>
            </div>
          </div>
        </div>

        {/* Flows List */}
        <div className="space-y-4">
          {error && <div className="rounded border p-3 text-sm text-rose-700 bg-rose-50">{error}</div>}
          
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
          
          {!loading && filteredFlows.map(flow => (
            <div key={flow.id} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(flow.id)}
                  onChange={() => toggleSelectItem(flow.id)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                />
                
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-medium">
                  {flow.currentStep}/{flow.totalSteps}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{flow.contractTitle}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{formatCurrency(flow.contractValue, flow.currency)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(flow.status)}`}>
                        {getStatusText(flow.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(flow)}
                        className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Xem
                      </button>
                      {(flow.status === 'PENDING' || flow.status === 'IN_PROGRESS') && (
                        <button
                          onClick={() => handleCancelFlow(flow.id)}
                          className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-600">Tiến độ:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(flow.currentStep / flow.totalSteps) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{flow.currentStep}/{flow.totalSteps}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Tạo bởi: {flow.createdBy.name}</span>
                    <span>•</span>
                    <span>{new Date(flow.createdAt).toLocaleDateString('vi-VN')}</span>
                    {flow.completedAt && (
                      <>
                        <span>•</span>
                        <span>Hoàn thành: {new Date(flow.completedAt).toLocaleDateString('vi-VN')}</span>
                      </>
                    )}
                    {flow.rejectedAt && (
                      <>
                        <span>•</span>
                        <span>Từ chối bởi: {flow.rejectedBy?.name}</span>
                      </>
                    )}
                  </div>
                  
                  {flow.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-400 rounded">
                      <div className="text-xs text-red-600 mb-1">Lý do từ chối:</div>
                      <div className="text-sm text-red-800">{flow.rejectionReason}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {!loading && filteredFlows.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có luồng phê duyệt</h3>
              <p className="text-gray-500">Chưa có luồng phê duyệt nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          )}
        </div>

        {/* Create Flow Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tạo luồng phê duyệt</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chọn hợp đồng</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="">Chọn hợp đồng cần phê duyệt</option>
                    <option value="HD-001">Hợp đồng lao động - HD-001</option>
                    <option value="HD-002">Hợp đồng cung cấp dịch vụ - HD-002</option>
                    <option value="HD-003">Hợp đồng mua bán - HD-003</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị hợp đồng</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Nhập giá trị hợp đồng..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tiền tệ</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                  </select>
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
                    className="px-4 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700"
                  >
                    Tạo luồng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedFlow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết luồng phê duyệt</h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedFlow(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Flow Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hợp đồng</label>
                    <div className="text-sm text-gray-900">{selectedFlow.contractTitle}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị</label>
                    <div className="text-sm text-gray-900">{formatCurrency(selectedFlow.contractValue, selectedFlow.currency)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(selectedFlow.status)}`}>
                      {getStatusText(selectedFlow.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiến độ</label>
                    <div className="text-sm text-gray-900">{selectedFlow.currentStep}/{selectedFlow.totalSteps}</div>
                  </div>
                </div>
                
                {/* Steps */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Các bước phê duyệt</label>
                  <div className="space-y-3">
                    {selectedFlow.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepStatusClass(step.status)}`}>
                            {step.stepNumber}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{step.stepName}</div>
                            <div className="text-sm text-gray-500">{step.approver.name} ({step.approver.role})</div>
                            {step.comments && (
                              <div className="text-xs text-gray-600 mt-1">{step.comments}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStepStatusClass(step.status)}`}>
                            {step.status}
                          </span>
                          {step.status === 'PENDING' && selectedFlow.status === 'IN_PROGRESS' && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  const comments = prompt('Nhập nhận xét (tùy chọn):')
                                  handleApproveStep(selectedFlow.id, step.id, comments || undefined)
                                }}
                                className="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Nhập lý do từ chối:')
                                  if (reason) handleRejectStep(selectedFlow.id, step.id, reason)
                                }}
                                className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                              >
                                Từ chối
                              </button>
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
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="text-gray-600">Tạo luồng phê duyệt</span>
                      <span className="text-gray-500">{new Date(selectedFlow.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    {selectedFlow.completedAt && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-gray-600">Hoàn thành</span>
                        <span className="text-gray-500">{new Date(selectedFlow.completedAt).toLocaleString('vi-VN')}</span>
                      </div>
                    )}
                    {selectedFlow.rejectedAt && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-gray-600">Bị từ chối</span>
                        <span className="text-gray-500">{new Date(selectedFlow.rejectedAt).toLocaleString('vi-VN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedFlow(null)
                  }}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
                {(selectedFlow.status === 'PENDING' || selectedFlow.status === 'IN_PROGRESS') && (
                  <button
                    onClick={() => {
                      handleCancelFlow(selectedFlow.id)
                      setShowDetailModal(false)
                      setSelectedFlow(null)
                    }}
                    className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                  >
                    Hủy luồng
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
