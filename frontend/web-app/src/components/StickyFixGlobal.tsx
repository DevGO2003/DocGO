'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { usePageErrors } from '@/hooks/usePageErrors'

export default function StickyFixGlobal() {
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()
  
  // Sử dụng hook để lấy lỗi của trang hiện tại
  const { hasErrors, criticalCount, warningCount, infoCount, errors } = usePageErrors(pathname || '')
  
  // Reset visibility khi chuyển trang
  useEffect(() => {
    setIsVisible(true)
  }, [pathname])
  
  if (!isVisible || !hasErrors) {
    return null
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-white rounded-lg shadow-lg border border-red-200 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-red-800 text-sm">
              Chức năng chưa hoàn thiện
            </h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
        
        {/* Page info */}
        <div className="mb-3">
          <p className="text-xs text-gray-600 font-medium">{pathname}</p>
        </div>
        
        {/* Summary */}
        <div className="flex gap-2 mb-3 text-xs">
          {criticalCount > 0 && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
              {criticalCount} Critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              {warningCount} Warning
            </span>
          )}
          {infoCount > 0 && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {infoCount} Info
            </span>
          )}
        </div>
        
        {/* Features list */}
        <div className="max-h-64 overflow-y-auto space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="border-l-2 border-red-200 pl-3 py-1">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  {error.status === 'critical' && (
                    <ExclamationTriangleIcon className="h-3 w-3 text-red-500" />
                  )}
                  {error.status === 'warning' && (
                    <ExclamationTriangleIcon className="h-3 w-3 text-yellow-500" />
                  )}
                  {error.status === 'info' && (
                    <CheckCircleIcon className="h-3 w-3 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">
                    {error.feature}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {error.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Cần hoàn thiện trước khi deploy production
          </p>
        </div>
      </div>
    </div>
  )
}
