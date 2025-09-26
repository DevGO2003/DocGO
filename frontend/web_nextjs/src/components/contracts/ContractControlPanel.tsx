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
    <div className="bg-white/80 backdrop-blur rounded-2xl border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Main Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow-sm transition-colors"
            title="Làm mới danh sách hợp đồng"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
          
          <Link 
            href="/import-document" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo hợp đồng
          </Link>
        </div>

        {/* Selection Actions */}
        {hasSelection && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {selectedItems.length} hợp đồng đã chọn
                </span>
                <button
                  onClick={onClearSelection}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onEditSelected}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
                title="Chỉnh sửa hợp đồng đã chọn"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Chỉnh sửa ({selectedItems.length})
              </button>
              
              <button
                onClick={onSendForApproval}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm"
                title="Gửi duyệt hợp đồng đã chọn"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Gửi duyệt ({selectedItems.length})
              </button>
              
              <button
                onClick={onDeleteSelected}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm"
                title="Xóa hợp đồng đã chọn"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa ({selectedItems.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
