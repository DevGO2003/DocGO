import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Trang không tìm thấy</h1>
          <p className="text-gray-600">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ
          </Link>
          
          <div className="text-sm text-gray-500">
            Hoặc{' '}
            <Link href="/dashboard/huong-dan" className="text-blue-600 hover:text-blue-800 underline">
              xem hướng dẫn sử dụng
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
