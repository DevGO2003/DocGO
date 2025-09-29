'use client'

import React, { useState } from 'react'

export interface TableColumn {
  key: string
  label: string
  visible: boolean
  order: number
}

interface TableSettingsProps {
  columns: TableColumn[]
  onColumnsChange: (columns: TableColumn[]) => void
  pageSize: number
  onPageSizeChange: (size: number) => void
  isOpen: boolean
  onClose: () => void
}

export default function TableSettings({
  columns,
  onColumnsChange,
  pageSize,
  onPageSizeChange,
  isOpen,
  onClose
}: TableSettingsProps) {
  const [localColumns, setLocalColumns] = useState<TableColumn[]>(columns)
  const [localPageSize, setLocalPageSize] = useState(pageSize)

  const handleColumnToggle = (key: string) => {
    const newColumns = localColumns.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    )
    setLocalColumns(newColumns)
  }

  const handleColumnOrderChange = (key: string, direction: 'up' | 'down') => {
    const newColumns = [...localColumns]
    const currentIndex = newColumns.findIndex(col => col.key === key)
    
    if (direction === 'up' && currentIndex > 0) {
      [newColumns[currentIndex], newColumns[currentIndex - 1]] = 
      [newColumns[currentIndex - 1], newColumns[currentIndex]]
    } else if (direction === 'down' && currentIndex < newColumns.length - 1) {
      [newColumns[currentIndex], newColumns[currentIndex + 1]] = 
      [newColumns[currentIndex + 1], newColumns[currentIndex]]
    }
    
    setLocalColumns(newColumns)
  }

  const handleSave = () => {
    onColumnsChange(localColumns)
    onPageSizeChange(localPageSize)
    onClose()
  }

  const handleReset = () => {
    setLocalColumns(columns)
    setLocalPageSize(pageSize)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Cài đặt bảng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Page Size Setting */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số lượng hiển thị mỗi lần
          </label>
          <select
            value={localPageSize}
            onChange={(e) => setLocalPageSize(Number(e.target.value))}
            className="w-full rounded-lg border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={5}>5 hợp đồng</option>
            <option value={10}>10 hợp đồng</option>
            <option value={20}>20 hợp đồng</option>
            <option value={50}>50 hợp đồng</option>
            <option value={100}>100 hợp đồng</option>
          </select>
        </div>

        {/* Column Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cột hiển thị</h3>
          <div className="space-y-3">
            {localColumns.map((column, index) => (
              <div key={column.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => handleColumnToggle(column.key)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{column.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleColumnOrderChange(column.key, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleColumnOrderChange(column.key, 'down')}
                    disabled={index === localColumns.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Đặt lại
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  )
}
