'use client'

import React from 'react'
import Link from 'next/link'
import { PublicLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  DocumentTextIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

export default function PrivacyPage() {
  const lastUpdated = '01/01/2024'

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Quay lại trang chủ
            </Link>
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">Chính sách bảo mật</h1>
            </div>
            <p className="text-gray-600">
              Cập nhật lần cuối: {lastUpdated}
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                  <span>Giới thiệu</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  DocGO ("chúng tôi", "của chúng tôi", hoặc "nền tảng") cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. 
                  Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi bạn sử dụng 
                  nền tảng quản lý tài liệu và hợp đồng thông minh của chúng tôi.
                </p>
                <p className="text-gray-700">
                  Bằng việc sử dụng DocGO, bạn đồng ý với việc thu thập và sử dụng thông tin theo chính sách này. 
                  Nếu bạn không đồng ý với chính sách này, vui lòng không sử dụng dịch vụ của chúng tôi.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <EyeIcon className="h-6 w-6 text-primary-600" />
                  <span>Thông tin chúng tôi thu thập</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin cá nhân</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Tên đầy đủ và thông tin liên hệ (email, số điện thoại)</li>
                    <li>Thông tin tài khoản (tên đăng nhập, mật khẩu)</li>
                    <li>Thông tin doanh nghiệp (tên công ty, địa chỉ, mã số thuế)</li>
                    <li>Thông tin thanh toán (khi sử dụng dịch vụ trả phí)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin sử dụng</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Dữ liệu truy cập và sử dụng nền tảng</li>
                    <li>Thông tin thiết bị và trình duyệt</li>
                    <li>Địa chỉ IP và vị trí địa lý</li>
                    <li>Cookies và công nghệ theo dõi tương tự</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Nội dung tài liệu</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Tài liệu và hợp đồng bạn tải lên</li>
                    <li>Dữ liệu được xử lý bởi AI</li>
                    <li>Bình luận và ghi chú</li>
                    <li>Lịch sử hoạt động trên nền tảng</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <CardTitle>Cách chúng tôi sử dụng thông tin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cung cấp dịch vụ</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>Xử lý và quản lý tài liệu</li>
                      <li>Phân tích và trích xuất thông tin</li>
                      <li>Cung cấp tính năng AI</li>
                      <li>Hỗ trợ khách hàng</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cải thiện dịch vụ</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>Phân tích xu hướng sử dụng</li>
                      <li>Phát triển tính năng mới</li>
                      <li>Tối ưu hóa hiệu suất</li>
                      <li>Nghiên cứu và phát triển</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LockClosedIcon className="h-6 w-6 text-primary-600" />
                  <span>Bảo mật dữ liệu</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Mã hóa dữ liệu</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>Mã hóa AES-256 cho dữ liệu lưu trữ</li>
                      <li>Mã hóa TLS/SSL cho truyền tải</li>
                      <li>Mã hóa đầu cuối cho tài liệu nhạy cảm</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Kiểm soát truy cập</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>Xác thực đa yếu tố</li>
                      <li>Phân quyền chi tiết</li>
                      <li>Giám sát hoạt động</li>
                      <li>Sao lưu định kỳ</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle>Chia sẻ thông tin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý của bạn, 
                  trừ các trường hợp sau:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Nhà cung cấp dịch vụ tin cậy (như nhà cung cấp hosting, thanh toán)</li>
                  <li>Tuân thủ yêu cầu pháp lý hoặc quy định</li>
                  <li>Bảo vệ quyền và tài sản của chúng tôi</li>
                  <li>Trong trường hợp sáp nhập hoặc mua lại doanh nghiệp</li>
                </ul>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Quyền của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Bạn có các quyền sau đối với thông tin cá nhân của mình:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Quyền truy cập</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>Xem thông tin cá nhân</li>
                      <li>Yêu cầu bản sao dữ liệu</li>
                      <li>Kiểm tra cách sử dụng</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Quyền kiểm soát</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>Cập nhật thông tin</li>
                      <li>Xóa tài khoản</li>
                      <li>Thu hồi đồng ý</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Nếu bạn có câu hỏi về chính sách bảo mật này hoặc muốn thực hiện quyền của mình, 
                  vui lòng liên hệ với chúng tôi:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> privacy@docgo.com</p>
                    <p><strong>Điện thoại:</strong> +84 123 456 789</p>
                    <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM, Việt Nam</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center py-8">
              <Button asChild>
                <Link href="/auth/register">
                  Bắt đầu sử dụng DocGO
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}







