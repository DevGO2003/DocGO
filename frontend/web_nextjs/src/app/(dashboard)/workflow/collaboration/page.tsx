'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface Comment {
  id: string
  contractId: string
  contractTitle: string
  author: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  content: string
  highlightedText?: string
  position?: {
    page: number
    x: number
    y: number
  }
  status: 'ACTIVE' | 'RESOLVED' | 'ARCHIVED'
  createdAt: string
  updatedAt?: string
  resolvedAt?: string
  resolvedBy?: {
    id: string
    name: string
  }
  replies?: Comment[]
  mentions?: string[]
}

export default function CollaborationCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED' | 'ARCHIVED'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/mock/comments')
        const json = await res.json()
        setComments(json?.items || [])
      } catch (e: any) {
        setError(e?.message || 'Lỗi tải bình luận')
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [])

  const filteredComments = comments.filter(comment => {
    const matchesFilter = filter === 'ALL' || comment.status === filter
    const matchesSearch = !searchTerm || 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.contractTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    setSelectedItems(filteredComments.map(comment => comment.id))
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  const handleViewDetail = (comment: Comment) => {
    setSelectedComment(comment)
    setShowDetailModal(true)
  }

  const handleResolveComment = async (id: string) => {
    try {
      const res = await fetch('/api/mock/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'resolve' })
      })
      if (!res.ok) throw new Error('Không thể giải quyết bình luận')
      
      setComments(prev => prev.map(comment => 
        comment.id === id 
          ? { 
              ...comment, 
              status: 'RESOLVED' as const,
              resolvedAt: new Date().toISOString(),
              resolvedBy: { id: 'current-user', name: 'Người dùng hiện tại' }
            }
          : comment
      ))
    } catch (error) {
      setError('Không thể giải quyết bình luận')
    }
  }

  const handleArchiveComment = async (id: string) => {
    try {
      const res = await fetch('/api/mock/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'archive' })
      })
      if (!res.ok) throw new Error('Không thể lưu trữ bình luận')
      
      setComments(prev => prev.map(comment => 
        comment.id === id 
          ? { ...comment, status: 'ARCHIVED' as const }
          : comment
      ))
    } catch (error) {
      setError('Không thể lưu trữ bình luận')
    }
  }

  const handleDeleteComment = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return
    
    try {
      const res = await fetch('/api/mock/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'delete' })
      })
      if (!res.ok) throw new Error('Không thể xóa bình luận')
      
      setComments(prev => prev.filter(comment => comment.id !== id))
      setSelectedItems(prev => prev.filter(x => x !== id))
    } catch (error) {
      setError('Không thể xóa bình luận')
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'ARCHIVED': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Đang mở'
      case 'RESOLVED': return 'Đã giải quyết'
      case 'ARCHIVED': return 'Đã lưu trữ'
      default: return status
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Bình luận & Cộng tác</h1>
            <p className="mt-1 text-gray-600">Quản lý bình luận, thảo luận và cộng tác trên hợp đồng.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        </div>

        {/* Filters and Actions */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Bình luận</h2>
              <input
                type="text"
                placeholder="Tìm kiếm bình luận..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="ACTIVE">Đang mở</option>
                <option value="RESOLVED">Đã giải quyết</option>
                <option value="ARCHIVED">Đã lưu trữ</option>
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
                className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                + Thêm bình luận
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
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
          
          {!loading && filteredComments.map(comment => (
            <div key={comment.id} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(comment.id)}
                  onChange={() => toggleSelectItem(comment.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                  {comment.author.name.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{comment.author.name}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(comment.status)}`}>
                        {getStatusText(comment.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(comment)}
                        className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Xem
                      </button>
                      {comment.status === 'ACTIVE' && (
                        <>
                          <button
                            onClick={() => handleResolveComment(comment.id)}
                            className="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            Giải quyết
                          </button>
                          <button
                            onClick={() => handleArchiveComment(comment.id)}
                            className="px-2 py-1 text-xs rounded bg-gray-600 text-white hover:bg-gray-700"
                          >
                            Lưu trữ
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Trên hợp đồng: </span>
                    <span className="text-sm font-medium text-blue-600">{comment.contractTitle}</span>
                  </div>
                  
                  {comment.highlightedText && (
                    <div className="mb-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <div className="text-xs text-gray-600 mb-1">Đoạn văn được highlight:</div>
                      <div className="text-sm text-gray-800 italic">"{comment.highlightedText}"</div>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-800 mb-3">{comment.content}</div>
                  
                  {comment.mentions && comment.mentions.length > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">Đề cập:</span>
                      {comment.mentions.map((mention, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          @{mention}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                      <div className="text-xs text-gray-500 mb-2">{comment.replies.length} phản hồi</div>
                      {comment.replies.slice(0, 2).map((reply, index) => (
                        <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-700">{reply.author.name}</span>
                            <span className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="text-xs text-gray-600">{reply.content}</div>
                        </div>
                      ))}
                      {comment.replies.length > 2 && (
                        <div className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                          Xem thêm {comment.replies.length - 2} phản hồi...
                        </div>
                      )}
                    </div>
                  )}
                  
                  {comment.resolvedAt && comment.resolvedBy && (
                    <div className="mt-2 text-xs text-gray-500">
                      ✓ Giải quyết bởi {comment.resolvedBy.name} lúc {new Date(comment.resolvedAt).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {!loading && filteredComments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bình luận</h3>
              <p className="text-gray-500">Chưa có bình luận nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          )}
        </div>

        {/* Create Comment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm bình luận mới</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chọn hợp đồng</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Chọn hợp đồng cần bình luận</option>
                    <option value="HD-001">Hợp đồng lao động - HD-001</option>
                    <option value="HD-002">Hợp đồng cung cấp dịch vụ - HD-002</option>
                    <option value="HD-003">Hợp đồng mua bán - HD-003</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đoạn văn được highlight (tùy chọn)</label>
                  <textarea
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập đoạn văn được highlight..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung bình luận</label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập nội dung bình luận..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đề cập người dùng (tùy chọn)</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập @username để đề cập..."
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
                    className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Thêm bình luận
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedComment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chi tiết bình luận</h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedComment(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                    {selectedComment.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{selectedComment.author.name}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{new Date(selectedComment.createdAt).toLocaleString('vi-VN')}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(selectedComment.status)}`}>
                        {getStatusText(selectedComment.status)}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">Trên hợp đồng: </span>
                      <span className="text-sm font-medium text-blue-600">{selectedComment.contractTitle}</span>
                    </div>
                  </div>
                </div>
                
                {selectedComment.highlightedText && (
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <div className="text-sm text-gray-600 mb-1">Đoạn văn được highlight:</div>
                    <div className="text-sm text-gray-800 italic">"{selectedComment.highlightedText}"</div>
                  </div>
                )}
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-800">{selectedComment.content}</div>
                </div>
                
                {selectedComment.mentions && selectedComment.mentions.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Đề cập:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedComment.mentions.map((mention, index) => (
                        <span key={index} className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                          @{mention}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedComment.replies && selectedComment.replies.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-3">Phản hồi ({selectedComment.replies.length})</div>
                    <div className="space-y-3">
                      {selectedComment.replies.map((reply, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs font-medium">
                            {reply.author.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-700">{reply.author.name}</span>
                              <span className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="text-sm text-gray-600">{reply.content}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedComment.resolvedAt && selectedComment.resolvedBy && (
                  <div className="p-3 bg-emerald-50 border-l-4 border-emerald-400 rounded">
                    <div className="text-sm text-emerald-700">
                      ✓ Giải quyết bởi {selectedComment.resolvedBy.name} lúc {new Date(selectedComment.resolvedAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedComment(null)
                  }}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
                {selectedComment.status === 'ACTIVE' && (
                  <>
                    <button
                      onClick={() => {
                        handleResolveComment(selectedComment.id)
                        setShowDetailModal(false)
                        setSelectedComment(null)
                      }}
                      className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Giải quyết
                    </button>
                    <button
                      onClick={() => {
                        handleArchiveComment(selectedComment.id)
                        setShowDetailModal(false)
                        setSelectedComment(null)
                      }}
                      className="px-4 py-2 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700"
                    >
                      Lưu trữ
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
