'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface ContractVersion {
  id: string
  contractId: string
  contractTitle: string
  version: string
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'ARCHIVED'
  changes: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  approvedBy?: {
    id: string
    name: string
  }
  approvedAt?: string
  rejectedBy?: {
    id: string
    name: string
  }
  rejectedAt?: string
  rejectionReason?: string
  previousVersionId?: string
  content: any
}

export default function ContractVersionsPage() {
  const [versions, setVersions] = useState<ContractVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedContract, setSelectedContract] = useState<string>('')
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'ARCHIVED'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchContractVersions = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/mock/versions')
        const json = await res.json()
        setVersions(json?.items || [])
      } catch (e: any) {
        setError(e?.message || 'Lỗi tải phiên bản')
      } finally {
        setLoading(false)
      }
    }
    fetchContractVersions()
  }, [])

  const filteredVersions = versions.filter(version => {
    const matchesFilter = filter === 'ALL' || version.status === filter
    const matchesSearch = !searchTerm || 
      version.contractTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.changes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    setSelectedItems(filteredVersions.map(version => version.id))
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  const handleCreateVersion = async (contractId: string) => {
    try {
      const res = await fetch('/api/mock/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId, action: 'create' })
      })
      if (!res.ok) throw new Error('Không thể tạo phiên bản mới')
      
      const json = await res.json()
      setVersions(prev => [json.data, ...prev])
      setShowCreateModal(false)
    } catch (error) {
      setError('Không thể tạo phiên bản mới')
    }
  }

  const handleApproveVersion = async (id: string) => {
    try {
      const res = await fetch('/api/mock/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'approve' })
      })
      if (!res.ok) throw new Error('Không thể phê duyệt phiên bản')
      
      setVersions(prev => prev.map(version => 
        version.id === id 
          ? { 
              ...version, 
              status: 'APPROVED' as const,
              approvedAt: new Date().toISOString(),
              approvedBy: { id: 'current-user', name: 'Người dùng hiện tại' }
            }
          : version
      ))
    } catch (error) {
      setError('Không thể phê duyệt phiên bản')
    }
  }

  const handleRejectVersion = async (id: string, reason: string) => {
    try {
      const res = await fetch('/api/mock/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'reject', reason })
      })
      if (!res.ok) throw new Error('Không thể từ chối phiên bản')
      
      setVersions(prev => prev.map(version => 
        version.id === id 
          ? { 
              ...version, 
              status: 'REJECTED' as const,
              rejectedAt: new Date().toISOString(),
              rejectedBy: { id: 'current-user', name: 'Người dùng hiện tại' },
              rejectionReason: reason
            }
          : version
      ))
    } catch (error) {
      setError('Không thể từ chối phiên bản')
    }
  }

  const handleCompareVersions = (versionIds: string[]) => {
    setSelectedVersions(versionIds)
    setShowCompareModal(true)
  }

  const handleViewHistory = (contractId: string) => {
    setSelectedContract(contractId)
    setShowHistoryModal(true)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'PENDING_APPROVAL': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200'
      case 'ACTIVE': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'ARCHIVED': return 'bg-purple-50 text-purple-700 border-purple-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Nháp'
      case 'PENDING_APPROVAL': return 'Chờ duyệt'
      case 'APPROVED': return 'Đã duyệt'
      case 'REJECTED': return 'Bị từ chối'
      case 'ACTIVE': return 'Đang hoạt động'
      case 'ARCHIVED': return 'Đã lưu trữ'
      default: return status
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Phiên bản hợp đồng</h1>
            <p className="mt-1 text-gray-600">Quản lý phiên bản, lịch sử thay đổi và so sánh hợp đồng.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />
        </div>

        {/* Filters and Actions */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Phiên bản</h2>
              <input
                type="text"
                placeholder="Tìm kiếm phiên bản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="DRAFT">Nháp</option>
                <option value="PENDING_APPROVAL">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Bị từ chối</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="ARCHIVED">Đã lưu trữ</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedItems.length} đã chọn</span>
                  {selectedItems.length === 2 && (
                    <button
                      onClick={() => handleCompareVersions(selectedItems)}
                      className="px-3 py-1 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      So sánh
                    </button>
                  )}
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
                className="px-3 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700"
              >
                + Tạo phiên bản mới
              </button>
            </div>
          </div>
        </div>

        {/* Versions List */}
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
          
          {!loading && filteredVersions.map(version => (
            <div key={version.id} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(version.id)}
                  onChange={() => toggleSelectItem(version.id)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                />
                
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                  v{version.version}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{version.contractTitle}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">Phiên bản {version.version}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(version.status)}`}>
                        {getStatusText(version.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewHistory(version.contractId)}
                        className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Lịch sử
                      </button>
                      {version.status === 'PENDING_APPROVAL' && (
                        <>
                          <button
                            onClick={() => handleApproveVersion(version.id)}
                            className="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Nhập lý do từ chối:')
                              if (reason) handleRejectVersion(version.id, reason)
                            }}
                            className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                          >
                            Từ chối
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Thay đổi: </span>
                    <span className="text-sm text-gray-800">{version.changes}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Tạo bởi: {version.createdBy.name}</span>
                    <span>•</span>
                    <span>{new Date(version.createdAt).toLocaleDateString('vi-VN')}</span>
                    {version.approvedAt && (
                      <>
                        <span>•</span>
                        <span>Duyệt bởi: {version.approvedBy?.name}</span>
                        <span>•</span>
                        <span>{new Date(version.approvedAt).toLocaleDateString('vi-VN')}</span>
                      </>
                    )}
                    {version.rejectedAt && (
                      <>
                        <span>•</span>
                        <span>Từ chối bởi: {version.rejectedBy?.name}</span>
                        <span>•</span>
                        <span>{new Date(version.rejectedAt).toLocaleDateString('vi-VN')}</span>
                      </>
                    )}
                  </div>
                  
                  {version.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-400 rounded">
                      <div className="text-xs text-red-600 mb-1">Lý do từ chối:</div>
                      <div className="text-sm text-red-800">{version.rejectionReason}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {!loading && filteredVersions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có phiên bản</h3>
              <p className="text-gray-500">Chưa có phiên bản nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          )}
        </div>

        {/* Create Version Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tạo phiên bản mới</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chọn hợp đồng</label>
                  <select 
                    value={selectedContract}
                    onChange={(e) => setSelectedContract(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Chọn hợp đồng cần tạo phiên bản</option>
                    <option value="HD-001">Hợp đồng lao động - HD-001</option>
                    <option value="HD-002">Hợp đồng cung cấp dịch vụ - HD-002</option>
                    <option value="HD-003">Hợp đồng mua bán - HD-003</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả thay đổi</label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Mô tả những thay đổi trong phiên bản này..."
                    required
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
                    onClick={(e) => {
                      e.preventDefault()
                      if (selectedContract) {
                        handleCreateVersion(selectedContract)
                      }
                    }}
                    className="px-4 py-2 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Tạo phiên bản
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Compare Modal */}
        {showCompareModal && selectedVersions.length === 2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">So sánh phiên bản</h3>
                <button
                  onClick={() => {
                    setShowCompareModal(false)
                    setSelectedVersions([])
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {selectedVersions.map((versionId, index) => {
                  const version = versions.find(v => v.id === versionId)
                  if (!version) return null
                  
                  return (
                    <div key={versionId} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                          v{version.version}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{version.contractTitle}</div>
                          <div className="text-sm text-gray-500">Phiên bản {version.version}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div><strong>Trạng thái:</strong> {getStatusText(version.status)}</div>
                        <div><strong>Thay đổi:</strong> {version.changes}</div>
                        <div><strong>Tạo bởi:</strong> {version.createdBy.name}</div>
                        <div><strong>Ngày tạo:</strong> {new Date(version.createdAt).toLocaleDateString('vi-VN')}</div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <div className="text-xs text-gray-600 mb-2">Nội dung:</div>
                        <pre className="text-xs text-gray-800 overflow-x-auto">
                          {JSON.stringify(version.content, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowCompareModal(false)
                    setSelectedVersions([])
                  }}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistoryModal && selectedContract && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Lịch sử phiên bản</h3>
                <button
                  onClick={() => {
                    setShowHistoryModal(false)
                    setSelectedContract('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {versions
                  .filter(v => v.contractId === selectedContract)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((version, index) => (
                    <div key={version.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                        v{version.version}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">Phiên bản {version.version}</span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(version.status)}`}>
                            {getStatusText(version.status)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{version.changes}</div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Tạo bởi: {version.createdBy.name}</span>
                          <span>•</span>
                          <span>{new Date(version.createdAt).toLocaleString('vi-VN')}</span>
                          {version.approvedAt && (
                            <>
                              <span>•</span>
                              <span>Duyệt bởi: {version.approvedBy?.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowHistoryModal(false)
                    setSelectedContract('')
                  }}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
