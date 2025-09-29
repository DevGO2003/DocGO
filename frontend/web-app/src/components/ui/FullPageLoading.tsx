'use client'

import React from 'react'

interface FullPageLoadingProps {
  title?: string
  subtitle?: string
  progressWidthPercent?: number
}

export default function FullPageLoading({
  title = 'Đang tải...',
  subtitle = 'Vui lòng chờ trong giây lát',
  progressWidthPercent = 60,
}: FullPageLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">{title}</p>
        <p className="text-gray-500 text-sm mt-2">{subtitle}</p>
        <div className="w-64 bg-gray-200 rounded-full h-2 mt-6 mx-auto">
          <div
            className="bg-indigo-600 h-2 rounded-full animate-pulse"
            style={{ width: `${progressWidthPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}


