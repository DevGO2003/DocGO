'use client'

import React, { useState } from 'react'
import { ExclamationTriangleIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface GlobalErrorSummary {
  totalPages: number
  pagesWithErrors: number
  totalErrors: number
  criticalErrors: number
  warningErrors: number
  infoErrors: number
}

// Tính toán tổng quan lỗi từ tất cả các trang
function calculateGlobalErrors(): GlobalErrorSummary {
  const pageErrors = {
    '/': 1, // warning
    '/auth/login': 1, // critical
    '/dashboard': 1, // critical
    '/contracts': 3, // 3 warnings
    '/analytics': 1, // critical
    '/settings': 1, // critical
    '/user-management': 3, // 3 criticals
    '/profile': 1, // critical
    '/approval-workflow': 2, // 2 criticals
    '/e-signature': 2, // 2 criticals
    '/notifications': 1, // critical
    '/calendar': 1, // critical
    '/reports': 1, // critical
    '/integrations': 1, // critical
    '/backup-restore': 1, // critical
    '/activity-history': 1, // critical
    '/account-approval': 1, // critical
    '/collaboration-comments': 1, // critical
    '/contract-versions': 1, // critical
    '/role-based-permissions': 1, // critical
  }

  const totalPages = Object.keys(pageErrors).length
  const pagesWithErrors = Object.values(pageErrors).filter(count => count > 0).length
  const totalErrors = Object.values(pageErrors).reduce((sum, count) => sum + count, 0)
  
  // Ước tính phân bố theo mức độ (dựa trên phân tích trước đó)
  const criticalErrors = 16 // Hầu hết là critical
  const warningErrors = 4 // Một số warning
  const infoErrors = 0 // Không có info

  return {
    totalPages,
    pagesWithErrors,
    totalErrors,
    criticalErrors,
    warningErrors,
    infoErrors
  }
}

export default function GlobalErrorSummary() {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  
  const globalSummary = calculateGlobalErrors()
  
  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-red-200 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-red-800 text-sm">
              Tổng quan lỗi hệ thống
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600"
              title={isExpanded ? "Thu gọn" : "Mở rộng"}
            >
              {isExpanded ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center p-2 bg-red-50 rounded">
            <div className="text-lg font-bold text-red-700">{globalSummary.totalErrors}</div>
            <div className="text-xs text-red-600">Tổng lỗi</div>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded">
            <div className="text-lg font-bold text-orange-700">{globalSummary.pagesWithErrors}</div>
            <div className="text-xs text-orange-600">Trang có lỗi</div>
          </div>
        </div>
        
        {/* Error Breakdown */}
        <div className="flex gap-2 mb-3 text-xs">
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
            {globalSummary.criticalErrors} Critical
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            {globalSummary.warningErrors} Warning
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {globalSummary.infoErrors} Info
          </span>
        </div>
        
        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Tổng số trang:</span>
                <span className="font-medium">{globalSummary.totalPages}</span>
              </div>
              <div className="flex justify-between">
                <span>Trang có lỗi:</span>
                <span className="font-medium text-red-600">{globalSummary.pagesWithErrors}</span>
              </div>
              <div className="flex justify-between">
                <span>Trang hoàn thiện:</span>
                <span className="font-medium text-green-600">
                  {globalSummary.totalPages - globalSummary.pagesWithErrors}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tỷ lệ hoàn thiện:</span>
                <span className="font-medium">
                  {Math.round(((globalSummary.totalPages - globalSummary.pagesWithErrors) / globalSummary.totalPages) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Cần sửa trước khi deploy production
          </p>
        </div>
      </div>
    </div>
  )
}

