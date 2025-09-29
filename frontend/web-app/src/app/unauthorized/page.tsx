import Link from 'next/link'

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-red-200 mb-4">401</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Truy cập bị từ chối</h1>
          <p className="text-gray-600">
            Bạn cần đăng nhập để truy cập trang này. Vui lòng đăng nhập để tiếp tục.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Đăng nhập ngay
          </Link>
          
          <div className="text-sm text-gray-500">
            Hoặc{' '}
            <Link href="/" className="text-red-600 hover:text-red-800 underline">
              quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
