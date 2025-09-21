'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface FAQ {
  id: string
  question: string
  answer: string
  category: 'GENERAL' | 'CONTRACT' | 'TECHNICAL' | 'ACCOUNT'
}

interface SupportTicket {
  id: string
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: string
  updatedAt: string
  category: 'BUG' | 'FEATURE' | 'QUESTION' | 'OTHER'
}

export default function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState<'faq' | 'ticket' | 'contact'>('faq')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'GENERAL' | 'CONTRACT' | 'TECHNICAL' | 'ACCOUNT'>('ALL')
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [newTicket, setNewTicket] = useState<Partial<SupportTicket>>({
    title: '',
    description: '',
    category: 'QUESTION',
    priority: 'MEDIUM'
  })

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'Làm thế nào để tạo hợp đồng mới?',
      answer: 'Để tạo hợp đồng mới, bạn có thể:\n1. Vào trang "Tạo hợp đồng" và điền thông tin chi tiết\n2. Sử dụng tính năng "Tạo nhanh" với OCR để trích xuất thông tin từ file\n3. Upload file hợp đồng có sẵn và chỉnh sửa',
      category: 'CONTRACT'
    },
    {
      id: '2',
      question: 'Làm sao để phê duyệt hợp đồng?',
      answer: 'Quy trình phê duyệt hợp đồng:\n1. Hợp đồng được tạo ở trạng thái "DRAFT"\n2. Người tạo gửi hợp đồng để phê duyệt\n3. Người có quyền phê duyệt sẽ nhận thông báo\n4. Sau khi phê duyệt, hợp đồng chuyển sang trạng thái "ACTIVE"',
      category: 'CONTRACT'
    },
    {
      id: '3',
      question: 'Tôi không thể đăng nhập vào hệ thống?',
      answer: 'Nếu không thể đăng nhập, hãy kiểm tra:\n1. Email và mật khẩu có đúng không\n2. Tài khoản có bị khóa không\n3. Kết nối internet có ổn định không\n4. Liên hệ quản trị viên nếu vấn đề vẫn tiếp diễn',
      category: 'ACCOUNT'
    },
    {
      id: '4',
      question: 'Làm thế nào để sử dụng chữ ký điện tử?',
      answer: 'Sử dụng chữ ký điện tử:\n1. Tạo yêu cầu ký từ trang "Chữ ký điện tử"\n2. Thêm các bên cần ký\n3. Gửi yêu cầu ký\n4. Theo dõi tiến độ ký\n5. Tải hợp đồng đã ký khi hoàn thành',
      category: 'CONTRACT'
    },
    {
      id: '5',
      question: 'Hệ thống có hỗ trợ mobile không?',
      answer: 'Có, hệ thống DocGO được thiết kế responsive và hoạt động tốt trên:\n- Điện thoại thông minh\n- Máy tính bảng\n- Máy tính để bàn\nGiao diện sẽ tự động điều chỉnh theo kích thước màn hình.',
      category: 'TECHNICAL'
    },
    {
      id: '6',
      question: 'Làm sao để khôi phục dữ liệu đã xóa?',
      answer: 'Để khôi phục dữ liệu:\n1. Vào trang "Backup & Restore"\n2. Chọn backup phù hợp\n3. Thực hiện khôi phục\n4. Liên hệ quản trị viên nếu cần hỗ trợ thêm',
      category: 'TECHNICAL'
    },
    {
      id: '7',
      question: 'Tôi có thể xuất báo cáo không?',
      answer: 'Có, bạn có thể tạo nhiều loại báo cáo:\n1. Vào trang "Báo cáo"\n2. Chọn mẫu báo cáo phù hợp\n3. Điền tham số cần thiết\n4. Tạo báo cáo và tải xuống',
      category: 'GENERAL'
    },
    {
      id: '8',
      question: 'Làm thế nào để thay đổi thông tin cá nhân?',
      answer: 'Thay đổi thông tin cá nhân:\n1. Click vào avatar ở góc phải màn hình\n2. Chọn "Cài đặt tài khoản"\n3. Cập nhật thông tin cần thiết\n4. Lưu thay đổi',
      category: 'ACCOUNT'
    }
  ]

  const mockTickets: SupportTicket[] = [
    {
      id: '1',
      title: 'Không thể tạo hợp đồng mới',
      description: 'Khi tôi cố gắng tạo hợp đồng mới, hệ thống báo lỗi "Dữ liệu không hợp lệ" mặc dù tôi đã điền đầy đủ thông tin.',
      status: 'OPEN',
      priority: 'HIGH',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      category: 'BUG'
    },
    {
      id: '2',
      title: 'Yêu cầu thêm tính năng xuất Excel',
      description: 'Tôi muốn hệ thống hỗ trợ xuất danh sách hợp đồng ra file Excel để dễ dàng phân tích.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      createdAt: '2024-01-14T15:20:00Z',
      updatedAt: '2024-01-15T09:15:00Z',
      category: 'FEATURE'
    },
    {
      id: '3',
      title: 'Cách sử dụng tính năng OCR',
      description: 'Tôi không hiểu cách sử dụng tính năng OCR để trích xuất thông tin từ file PDF. Có thể hướng dẫn chi tiết không?',
      status: 'RESOLVED',
      priority: 'LOW',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-14T14:30:00Z',
      category: 'QUESTION'
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ALL' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.description) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    const ticket: SupportTicket = {
      id: Date.now().toString(),
      title: newTicket.title!,
      description: newTicket.description!,
      status: 'OPEN',
      priority: newTicket.priority!,
      category: newTicket.category!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Mock API call
    alert('Ticket đã được tạo thành công! Chúng tôi sẽ liên hệ lại sớm nhất.')
    setNewTicket({
      title: '',
      description: '',
      category: 'QUESTION',
      priority: 'MEDIUM'
    })
    setShowTicketForm(false)
  }

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: SupportTicket['category']) => {
    switch (category) {
      case 'BUG':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'FEATURE':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'QUESTION':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'OTHER':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Trợ giúp & Hỗ trợ</h1>
            <p className="mt-1 text-gray-600">Tìm kiếm câu trả lời và nhận hỗ trợ từ đội ngũ DocGO.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'faq'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ❓ Câu hỏi thường gặp
          </button>
          <button
            onClick={() => setActiveTab('ticket')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'ticket'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🎫 Ticket hỗ trợ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'contact'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📞 Liên hệ
          </button>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm câu hỏi..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as typeof selectedCategory)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">Tất cả danh mục</option>
                    <option value="GENERAL">Tổng quan</option>
                    <option value="CONTRACT">Hợp đồng</option>
                    <option value="TECHNICAL">Kỹ thuật</option>
                    <option value="ACCOUNT">Tài khoản</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm">❓</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">{faq.question}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                          faq.category === 'GENERAL' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                          faq.category === 'CONTRACT' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          faq.category === 'TECHNICAL' ? 'bg-green-100 text-green-800 border-green-200' :
                          'bg-purple-100 text-purple-800 border-purple-200'
                        }`}>
                          {faq.category === 'GENERAL' ? 'Tổng quan' :
                           faq.category === 'CONTRACT' ? 'Hợp đồng' :
                           faq.category === 'TECHNICAL' ? 'Kỹ thuật' : 'Tài khoản'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredFAQs.length === 0 && (
                <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy câu hỏi</h3>
                  <p className="text-gray-600">Không có câu hỏi nào phù hợp với từ khóa tìm kiếm của bạn.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ticket Tab */}
        {activeTab === 'ticket' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Ticket hỗ trợ của bạn</h2>
              <button
                onClick={() => setShowTicketForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + Tạo ticket mới
              </button>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Tiêu đề</th>
                      <th className="px-4 py-3 text-left font-medium">Loại</th>
                      <th className="px-4 py-3 text-left font-medium">Độ ưu tiên</th>
                      <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                      <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                      <th className="px-4 py-3 text-left font-medium">Cập nhật cuối</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {ticket.title}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(ticket.category)}`}>
                            {ticket.category === 'BUG' ? 'Lỗi' :
                             ticket.category === 'FEATURE' ? 'Tính năng' :
                             ticket.category === 'QUESTION' ? 'Câu hỏi' : 'Khác'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority === 'URGENT' ? 'Khẩn cấp' :
                             ticket.priority === 'HIGH' ? 'Cao' :
                             ticket.priority === 'MEDIUM' ? 'Trung bình' : 'Thấp'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                            {ticket.status === 'OPEN' ? 'Mở' :
                             ticket.status === 'IN_PROGRESS' ? 'Đang xử lý' :
                             ticket.status === 'RESOLVED' ? 'Đã giải quyết' : 'Đã đóng'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatDate(ticket.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatDate(ticket.updatedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-lg">📧</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Email hỗ trợ</div>
                      <div className="text-sm text-gray-600">support@docgo.com</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-lg">📞</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Hotline</div>
                      <div className="text-sm text-gray-600">1900 1234</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-lg">💬</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Chat trực tuyến</div>
                      <div className="text-sm text-gray-600">Có sẵn 24/7</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Giờ làm việc</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thứ 2 - Thứ 6</span>
                    <span className="font-medium text-gray-900">8:00 - 17:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thứ 7</span>
                    <span className="font-medium text-gray-900">8:00 - 12:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chủ nhật</span>
                    <span className="font-medium text-gray-900">Nghỉ</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Hỗ trợ khẩn cấp có sẵn 24/7 qua hotline và chat trực tuyến.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tài liệu hướng dẫn</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/dashboard/huong-dan" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📖</div>
                    <h3 className="font-medium text-gray-900">Hướng dẫn sử dụng</h3>
                    <p className="text-sm text-gray-600 mt-1">Hướng dẫn chi tiết cách sử dụng hệ thống</p>
                  </div>
                </a>
                
                <a href="/dashboard/api-docs" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔧</div>
                    <h3 className="font-medium text-gray-900">Tài liệu API</h3>
                    <p className="text-sm text-gray-600 mt-1">Tài liệu kỹ thuật cho developers</p>
                  </div>
                </a>
                
                <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎥</div>
                    <h3 className="font-medium text-gray-900">Video hướng dẫn</h3>
                    <p className="text-sm text-gray-600 mt-1">Video demo các tính năng chính</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Ticket Modal */}
        {showTicketForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tạo ticket hỗ trợ mới</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                  <input
                    type="text"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả ngắn gọn vấn đề"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value as SupportTicket['category'] }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="QUESTION">Câu hỏi</option>
                      <option value="BUG">Lỗi</option>
                      <option value="FEATURE">Tính năng</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Độ ưu tiên</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as SupportTicket['priority'] }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="LOW">Thấp</option>
                      <option value="MEDIUM">Trung bình</option>
                      <option value="HIGH">Cao</option>
                      <option value="URGENT">Khẩn cấp</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết *</label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả chi tiết vấn đề, bao gồm các bước để tái tạo lỗi (nếu có)"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowTicketForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateTicket}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tạo ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
