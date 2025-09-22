'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Đã xảy ra lỗi</h1>
          <p className="text-gray-600 mb-4">
            Có vẻ như đã xảy ra sự cố không mong muốn. Vui lòng thử lại sau.
          </p>
          {error.message && (
            <div className="p-3 bg-red-100 border border-red-200 rounded-lg text-sm text-red-800 mb-4">
              <strong>Chi tiết lỗi:</strong> {error.message}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Thử lại
          </button>
          
          <div className="text-sm text-gray-500">
            Hoặc{' '}
            <a href="/" className="text-red-600 hover:text-red-800 underline">
              quay về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
