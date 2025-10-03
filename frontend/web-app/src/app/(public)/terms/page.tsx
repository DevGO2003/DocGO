'use client'

import React from 'react'
import Link from 'next/link'
import { PublicLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ScaleIcon
} from '@heroicons/react/24/outline'

export default function TermsPage() {
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
              <ScaleIcon className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">Điều khoản sử dụng</h1>
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
                  Chào mừng bạn đến với DocGO. Những điều khoản sử dụng này ("Điều khoản") điều chỉnh việc sử dụng 
                  nền tảng quản lý tài liệu và hợp đồng thông minh của chúng tôi ("Dịch vụ") được cung cấp bởi DocGO.
                </p>
                <p className="text-gray-700">
                  Bằng việc truy cập hoặc sử dụng Dịch vụ, bạn đồng ý tuân thủ và bị ràng buộc bởi những Điều khoản này. 
                  Nếu bạn không đồng ý với bất kỳ phần nào của Điều khoản này, bạn không được phép sử dụng Dịch vụ.
                </p>
              </CardContent>
            </Card>

            {/* Acceptance of Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Chấp nhận điều khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Bằng việc sử dụng Dịch vụ, bạn xác nhận rằng:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Bạn đã đọc, hiểu và đồng ý với những Điều khoản này</li>
                  <li>Bạn có đủ năng lực pháp lý để tham gia vào thỏa thuận này</li>
                  <li>Bạn sẽ tuân thủ tất cả các luật và quy định hiện hành</li>
                  <li>Bạn sẽ sử dụng Dịch vụ một cách có trách nhiệm và hợp pháp</li>
                </ul>
              </CardContent>
            </Card>

            {/* Description of Service */}
            <Card>
              <CardHeader>
                <CardTitle>Mô tả dịch vụ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  DocGO cung cấp nền tảng quản lý tài liệu và hợp đồng thông minh bao gồm:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Quản lý tài liệu</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>Lưu trữ và tổ chức tài liệu</li>
                      <li>Tìm kiếm và phân loại</li>
                      <li>Chia sẻ và cộng tác</li>
                      <li>Phiên bản và lịch sử</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Xử lý AI</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>Trích xuất thông tin tự động</li>
                      <li>Phân tích và tóm tắt</li>
                      <li>Nhận dạng ký tự (OCR)</li>
                      <li>Phân loại thông minh</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card>
              <CardHeader>
                <CardTitle>Tài khoản người dùng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Đăng ký tài khoản</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Bạn phải cung cấp thông tin chính xác và đầy đủ</li>
                    <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập</li>
                    <li>Mỗi tài khoản chỉ được sử dụng bởi một người</li>
                    <li>Bạn phải thông báo ngay khi phát hiện vi phạm bảo mật</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Trách nhiệm tài khoản</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Bạn chịu trách nhiệm cho tất cả hoạt động trong tài khoản</li>
                    <li>Chúng tôi có quyền từ chối hoặc chấm dứt tài khoản vi phạm</li>
                    <li>Bạn có thể hủy tài khoản bất cứ lúc nào</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                  <span>Sử dụng chấp nhận được</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Bạn đồng ý sử dụng Dịch vụ chỉ cho các mục đích hợp pháp và được phép:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Được phép</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>Quản lý tài liệu doanh nghiệp</li>
                      <li>Xử lý hợp đồng và văn bản</li>
                      <li>Chia sẻ thông tin với đối tác</li>
                      <li>Sử dụng tính năng AI hợp pháp</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Không được phép</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      <li>Vi phạm quyền sở hữu trí tuệ</li>
                      <li>Phân phối nội dung bất hợp pháp</li>
                      <li>Spam hoặc quấy rối</li>
                      <li>Can thiệp vào hệ thống</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prohibited Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  <span>Hoạt động bị cấm</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Bạn không được phép sử dụng Dịch vụ để:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Vi phạm bất kỳ luật hoặc quy định nào</li>
                  <li>Xâm phạm quyền sở hữu trí tuệ của người khác</li>
                  <li>Phân phối nội dung khiêu dâm, bạo lực hoặc phản cảm</li>
                  <li>Thực hiện hoạt động lừa đảo hoặc gian lận</li>
                  <li>Phát tán virus, malware hoặc mã độc hại</li>
                  <li>Thu thập thông tin cá nhân trái phép</li>
                  <li>Can thiệp vào hoạt động của hệ thống</li>
                  <li>Tạo tài khoản giả mạo hoặc nhiều tài khoản</li>
                </ul>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle>Sở hữu trí tuệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quyền của DocGO</h3>
                  <p className="text-gray-700 mb-3">
                    Dịch vụ và tất cả nội dung liên quan (bao gồm nhưng không giới hạn ở giao diện, 
                    thiết kế, logo, phần mềm) là tài sản của DocGO và được bảo vệ bởi luật sở hữu trí tuệ.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Nội dung của bạn</h3>
                  <p className="text-gray-700 mb-3">
                    Bạn giữ quyền sở hữu đối với nội dung bạn tải lên. Tuy nhiên, bạn cấp cho chúng tôi 
                    quyền sử dụng để cung cấp Dịch vụ và cải thiện hệ thống.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card>
              <CardHeader>
                <CardTitle>Quyền riêng tư và dữ liệu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Việc thu thập và sử dụng thông tin cá nhân của bạn được điều chỉnh bởi 
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                    {' '}Chính sách bảo mật{' '}
                  </Link>
                  của chúng tôi.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Chúng tôi cam kết bảo vệ quyền riêng tư của bạn</li>
                  <li>Dữ liệu được mã hóa và bảo mật theo tiêu chuẩn quốc tế</li>
                  <li>Bạn có quyền truy cập, sửa đổi và xóa dữ liệu cá nhân</li>
                  <li>Chúng tôi không bán hoặc chia sẻ dữ liệu với bên thứ ba</li>
                </ul>
              </CardContent>
            </Card>

            {/* Payment and Subscription */}
            <Card>
              <CardHeader>
                <CardTitle>Thanh toán và đăng ký</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Phí dịch vụ</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Một số tính năng có thể yêu cầu thanh toán</li>
                    <li>Phí được tính theo gói dịch vụ bạn chọn</li>
                    <li>Thanh toán được thực hiện qua các cổng thanh toán an toàn</li>
                    <li>Chúng tôi có quyền thay đổi phí với thông báo trước</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Hủy đăng ký</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Bạn có thể hủy đăng ký bất cứ lúc nào</li>
                    <li>Không hoàn tiền cho thời gian chưa sử dụng</li>
                    <li>Dữ liệu sẽ được xóa sau khi hủy</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle>Giới hạn trách nhiệm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Trong phạm vi luật pháp cho phép, DocGO không chịu trách nhiệm về:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả</li>
                  <li>Mất dữ liệu hoặc gián đoạn dịch vụ</li>
                  <li>Hành vi của người dùng khác</li>
                  <li>Nội dung do bạn tải lên</li>
                  <li>Thiệt hại do lỗi kỹ thuật không thể tránh khỏi</li>
                </ul>
                <p className="text-gray-700">
                  Trách nhiệm tối đa của chúng tôi không vượt quá số tiền bạn đã thanh toán trong 12 tháng gần nhất.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle>Chấm dứt dịch vụ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Chấm dứt bởi bạn</h3>
                  <p className="text-gray-700">
                    Bạn có thể chấm dứt sử dụng Dịch vụ bất cứ lúc nào bằng cách hủy tài khoản 
                    hoặc ngừng sử dụng Dịch vụ.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Chấm dứt bởi chúng tôi</h3>
                  <p className="text-gray-700">
                    Chúng tôi có thể chấm dứt hoặc tạm ngừng Dịch vụ nếu bạn vi phạm Điều khoản này 
                    hoặc vì lý do kỹ thuật, pháp lý.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Hậu quả chấm dứt</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Quyền truy cập Dịch vụ sẽ bị chấm dứt</li>
                    <li>Dữ liệu có thể bị xóa vĩnh viễn</li>
                    <li>Các điều khoản bảo vệ vẫn có hiệu lực</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Thay đổi điều khoản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Chúng tôi có quyền cập nhật Điều khoản này bất cứ lúc nào. Khi có thay đổi:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Chúng tôi sẽ thông báo qua email hoặc trong ứng dụng</li>
                  <li>Thay đổi có hiệu lực ngay khi được đăng tải</li>
                  <li>Việc tiếp tục sử dụng Dịch vụ đồng nghĩa với việc chấp nhận thay đổi</li>
                  <li>Bạn có thể từ chối bằng cách ngừng sử dụng Dịch vụ</li>
                </ul>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle>Luật áp dụng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Điều khoản này được điều chỉnh bởi luật pháp Việt Nam. Mọi tranh chấp sẽ được 
                  giải quyết tại tòa án có thẩm quyền tại TP.HCM, Việt Nam.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Nếu bạn có câu hỏi về Điều khoản sử dụng này, vui lòng liên hệ với chúng tôi:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <p><strong>Email:</strong> legal@docgo.com</p>
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







