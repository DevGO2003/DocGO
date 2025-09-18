'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Tổng quan', icon: '🏠' },
    { id: 'getting-started', title: 'Bắt đầu', icon: '🚀' },
    { id: 'contracts', title: 'Quản lý hợp đồng', icon: '📄' },
    { id: 'approval', title: 'Phê duyệt', icon: '✅' },
    { id: 'signature', title: 'Chữ ký điện tử', icon: '✍️' },
    { id: 'collaboration', title: 'Cộng tác', icon: '👥' },
    { id: 'reports', title: 'Báo cáo', icon: '📊' },
    { id: 'troubleshooting', title: 'Khắc phục sự cố', icon: '🔧' }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Giới thiệu DocGO</h2>
              <p className="text-gray-600 mb-4">
                DocGO là hệ thống quản lý hợp đồng thông minh được thiết kế để tối ưu hóa quy trình 
                quản lý hợp đồng từ tạo lập, phê duyệt, ký điện tử đến lưu trữ và báo cáo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">🎯 Mục tiêu</h3>
                  <p className="text-sm text-blue-800">Tự động hóa và số hóa quy trình quản lý hợp đồng</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">💡 Lợi ích</h3>
                  <p className="text-sm text-green-800">Tiết kiệm thời gian, giảm sai sót, tăng hiệu quả</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tính năng chính</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Tạo hợp đồng', desc: 'Thủ công và tự động (OCR)', icon: '📝' },
                  { title: 'Phê duyệt', desc: 'Luồng phê duyệt nhiều bước', icon: '✅' },
                  { title: 'Chữ ký điện tử', desc: 'Ký số an toàn và hợp pháp', icon: '✍️' },
                  { title: 'Quản lý phiên bản', desc: 'Theo dõi thay đổi và lịch sử', icon: '🔄' },
                  { title: 'Cộng tác', desc: 'Bình luận và làm việc nhóm', icon: '👥' },
                  { title: 'Báo cáo', desc: 'Thống kê và phân tích', icon: '📊' }
                ].map((feature, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'getting-started':
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bắt đầu sử dụng</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">1</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Đăng nhập hệ thống</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Sử dụng tài khoản được cấp để đăng nhập vào hệ thống DocGO
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">2</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Khám phá Dashboard</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Xem tổng quan thống kê và các hợp đồng quan trọng trên trang chủ
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">3</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Tạo hợp đồng đầu tiên</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Sử dụng tính năng "Tạo hợp đồng" hoặc "Tạo nhanh" để bắt đầu
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Giao diện chính</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-700"><strong>Sidebar:</strong> Menu điều hướng chính</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-700"><strong>Header:</strong> Thông tin người dùng và thông báo</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm text-gray-700"><strong>Content:</strong> Nội dung chính của từng trang</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'contracts':
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quản lý hợp đồng</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">📝 Tạo hợp đồng thủ công</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Vào menu "Tạo hợp đồng"</li>
                    <li>Điền thông tin cơ bản (tiêu đề, loại, đối tượng...)</li>
                    <li>Thêm thông tin thanh toán</li>
                    <li>Nhập các bên tham gia (JSON format)</li>
                    <li>Thêm điều khoản chính và phụ</li>
                    <li>Kiểm tra và lưu hợp đồng</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">⚡ Tạo nhanh với OCR</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Vào menu "Tạo nhanh"</li>
                    <li>Upload file PDF/DOCX hoặc nhập văn bản</li>
                    <li>Hệ thống tự động trích xuất thông tin</li>
                    <li>Kiểm tra và chỉnh sửa nếu cần</li>
                    <li>Tạo hợp đồng từ dữ liệu đã trích xuất</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">📋 Quản lý danh sách</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Tìm kiếm và lọc hợp đồng</li>
                    <li>Xem chi tiết từng hợp đồng</li>
                    <li>Thực hiện hành động hàng loạt</li>
                    <li>Xuất báo cáo danh sách</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 'approval':
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Luồng phê duyệt</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">🔄 Cách hoạt động</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Hệ thống tự động tạo luồng phê duyệt dựa trên giá trị hợp đồng:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-green-900">Dưới 100 triệu VND</div>
                      <div className="text-xs text-green-700">Trưởng phòng → Kế toán trưởng</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-sm font-medium text-yellow-900">100-500 triệu VND</div>
                      <div className="text-xs text-yellow-700">+ Phó giám đốc</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-sm font-medium text-orange-900">500 triệu - 1 tỷ VND</div>
                      <div className="text-xs text-orange-700">+ Giám đốc</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-sm font-medium text-red-900">Trên 1 tỷ VND</div>
                      <div className="text-xs text-red-700">+ Luật sư + Hội đồng</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">✅ Thực hiện phê duyệt</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Vào "Luồng phê duyệt" để xem danh sách</li>
                    <li>Chọn hợp đồng cần phê duyệt</li>
                    <li>Xem chi tiết và đọc nội dung</li>
                    <li>Thêm nhận xét (nếu có)</li>
                    <li>Chọn "Duyệt" hoặc "Từ chối"</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )

      case 'signature':
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Chữ ký điện tử</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">✍️ Tạo yêu cầu ký</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Vào "Chữ ký điện tử"</li>
                    <li>Chọn "Tạo yêu cầu ký mới"</li>
                    <li>Nhập tên hợp đồng</li>
                    <li>Thêm danh sách người ký (tên + email)</li>
                    <li>Gửi yêu cầu ký</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">📧 Quy trình ký</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">1</div>
                      <span className="text-sm text-gray-700">Người ký nhận email thông báo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">2</div>
                      <span className="text-sm text-gray-700">Click link trong email để xem hợp đồng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">3</div>
                      <span className="text-sm text-gray-700">Ký điện tử trên hợp đồng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">4</div>
                      <span className="text-sm text-gray-700">Hệ thống cập nhật trạng thái</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'collaboration':
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cộng tác và bình luận</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">💬 Thêm bình luận</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Vào "Bình luận & Cộng tác"</li>
                    <li>Chọn hợp đồng cần bình luận</li>
                    <li>Highlight đoạn văn cần thảo luận</li>
                    <li>Viết bình luận và gửi</li>
                    <li>Mention người khác bằng @username</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">🔄 Quản lý bình luận</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Xem tất cả bình luận theo trạng thái</li>
                    <li>Trả lời bình luận của người khác</li>
                    <li>Đánh dấu bình luận đã giải quyết</li>
                    <li>Lưu trữ bình luận cũ</li>
                    <li>Xóa bình luận không cần thiết</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Báo cáo và thống kê</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">📊 Dashboard chính</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Trang chủ hiển thị các thống kê quan trọng:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Tổng số hợp đồng theo trạng thái</li>
                    <li>Biểu đồ tải lên theo tháng</li>
                    <li>Phân bố trạng thái hợp đồng</li>
                    <li>Top lý do từ chối</li>
                    <li>Hợp đồng sắp hết hạn</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">📈 Báo cáo chi tiết</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Vào "Thống kê" để xem báo cáo chi tiết:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
                    <li>Báo cáo theo thời gian</li>
                    <li>Phân tích hiệu suất phê duyệt</li>
                    <li>Thống kê người dùng</li>
                    <li>Xuất báo cáo Excel/PDF</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      case 'troubleshooting':
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Khắc phục sự cố</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">❌ Lỗi thường gặp</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="font-medium text-red-900">Không thể đăng nhập</div>
                      <div className="text-sm text-red-700 mt-1">Kiểm tra tài khoản và mật khẩu, liên hệ admin</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-yellow-900">File upload bị lỗi</div>
                      <div className="text-sm text-yellow-700 mt-1">Kiểm tra định dạng file (PDF, DOCX, TXT) và kích thước</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-900">OCR không hoạt động</div>
                      <div className="text-sm text-blue-700 mt-1">Thử lại với file khác hoặc nhập văn bản thủ công</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">📞 Hỗ trợ kỹ thuật</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Email hỗ trợ</div>
                      <div className="text-sm text-gray-600">support@docgo.com</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">Hotline</div>
                      <div className="text-sm text-gray-600">1900-xxxx</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Hướng dẫn sử dụng</h1>
            <p className="mt-1 text-gray-600">Tài liệu hướng dẫn chi tiết về cách sử dụng hệ thống DocGO.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-4 sticky top-4">
              <h2 className="font-semibold text-gray-900 mb-4">Mục lục</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}