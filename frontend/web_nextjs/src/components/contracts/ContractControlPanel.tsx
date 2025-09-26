'use client'

import React from 'react'
import Link from 'next/link'

interface ContractControlPanelProps {
  selectedItems: string[]
  onRefresh: () => void
  onCreateContract: () => void
  onEditSelected: () => void
  onDeleteSelected: () => void
  onSendForApproval: () => void
  onClearSelection: () => void
}

export default function ContractControlPanel({
  selectedItems,
  onRefresh,
  onCreateContract,
  onEditSelected,
  onDeleteSelected,
  onSendForApproval,
  onClearSelection
}: ContractControlPanelProps) {
  const hasSelection = selectedItems.length > 0

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-indigo-50/50 to-purple-50/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-xl shadow-indigo-100/50">
      {/* Background decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-200/30 to-pink-200/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-full blur-2xl" />
      
      {/* Floating particles */}
      <div className="absolute top-4 right-8 w-2 h-2 bg-indigo-400/60 rounded-full animate-pulse"></div>
      <div className="absolute top-12 right-16 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-8 left-12 w-1 h-1 bg-pink-400/60 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-pulse delay-1500"></div>
      
      <div className="relative z-10 flex flex-col gap-6">
        {/* Header Section */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🎛️ Bảng Điều Khiển
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            Quản lý và thao tác với hợp đồng một cách thông minh
          </p>
        </div>

        {/* Main Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">Thao tác chính</h3>
          </div>
          <div className="flex flex-wrap gap-2">
          <button
            onClick={onRefresh}
            className="group relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/90 text-indigo-700 border border-indigo-200/50 hover:bg-indigo-50 hover:border-indigo-300 shadow transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm text-sm"
            title="Làm mới danh sách hợp đồng"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-200 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="font-semibold">🔄 Làm mới</span>
            </div>
          </button>
          
          <Link 
            href="/import-document" 
            className="group relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow transition-all duration-200 hover:scale-[1.02] text-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-semibold">✨ Tạo hợp đồng</span>
            </div>
          </Link>
          </div>
        </div>

        {/* Selection Actions */}
        {hasSelection && (
          <div className="relative">
            {/* Animated border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-green-500/20 to-red-500/20 rounded-2xl blur-sm" />
            
            <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-lg">
              {/* Selection Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">Thao tác với lựa chọn</h3>
                </div>
              </div>

              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200 text-sm">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold">
                      {selectedItems.length} hợp đồng đã chọn
                    </span>
                  </div>
                  <button
                    onClick={onClearSelection}
                className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-all duration-200 font-medium"
                  >
                    ✕ Bỏ chọn tất cả
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={onEditSelected}
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow transition-all duration-200 hover:scale-[1.02] text-sm font-semibold"
                  title="Chỉnh sửa hợp đồng đã chọn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors duration-200">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <span>✏️ Chỉnh sửa ({selectedItems.length})</span>
                  </div>
                </button>
                
                <button
                  onClick={onSendForApproval}
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow transition-all duration-200 hover:scale-[1.02] text-sm font-semibold"
                  title="Gửi duyệt hợp đồng đã chọn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors duration-200">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>✅ Gửi duyệt ({selectedItems.length})</span>
                  </div>
                </button>
                
                <button
                  onClick={onDeleteSelected}
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow transition-all duration-200 hover:scale-[1.02] text-sm font-semibold"
                  title="Xóa hợp đồng đã chọn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="p-1 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors duration-200">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <span>🗑️ Xóa ({selectedItems.length})</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
