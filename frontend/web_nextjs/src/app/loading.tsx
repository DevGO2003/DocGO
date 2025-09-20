import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        
        {/* Loading text */}
        <p className="text-gray-600 text-lg font-medium">Đang tải...</p>
        <p className="text-gray-500 text-sm mt-2">Vui lòng chờ trong giây lát</p>
        
        {/* Progress bar */}
        <div className="w-64 bg-gray-200 rounded-full h-2 mt-6 mx-auto">
          <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  )
}