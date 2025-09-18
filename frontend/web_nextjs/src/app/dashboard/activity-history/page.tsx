'use client'

import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout'

interface ActivityLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  details: string
  ipAddress: string
  userAgent: string
  status: 'SUCCESS' | 'FAILED' | 'WARNING'
}

export default function ActivityHistoryPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    user: '',
    action: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Mock data
  const mockLogs: ActivityLog[] = [
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      user: 'Nguyễn Văn A',
      action: 'Tạo hợp đồng',
      resource: 'Hợp đồng lao động #HD-001',
      details: 'Tạo hợp đồng lao động mới với Công ty ABC',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'SUCCESS'
    },
    {
      id: '2',
      timestamp: '2024-01-15T10:25:00Z',
      user: 'Trần Thị B',
      action: 'Phê duyệt hợp đồng',
      resource: 'Hợp đồng lao động #HD-001',
      details: 'Phê duyệt hợp đồng lao động với nhận xét: "Hợp đồng đã được xem xét kỹ lưỡng"',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      status: 'SUCCESS'
    },
    {
      id: '3',
      timestamp: '2024-01-15T10:20:00Z',
      user: 'Lê Văn C',
      action: 'Đăng nhập',
      resource: 'Hệ thống',
      details: 'Đăng nhập thành công vào hệ thống',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      status: 'SUCCESS'
    },
    {
      id: '4',
      timestamp: '2024-01-15T10:15:00Z',
      user: 'Phạm Thị D',
      action: 'Từ chối hợp đồng',
      resource: 'Hợp đồng mua bán #HD-002',
      details: 'Từ chối hợp đồng mua bán do thiếu thông tin pháp lý',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'WARNING'
    },
    {
      id: '5',
      timestamp: '2024-01-15T10:10:00Z',
      user: 'Hoàng Văn E',
      action: 'Cập nhật thông tin',
      resource: 'Hồ sơ người dùng',
      details: 'Cập nhật thông tin cá nhân và liên hệ',
      ipAddress: '192.168.1.104',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      status: 'SUCCESS'
    },
    {
      id: '6',
      timestamp: '2024-01-15T10:05:00Z',
      user: 'Vũ Thị F',
      action: 'Xuất báo cáo',
      resource: 'Báo cáo thống kê tháng 1/2024',
      details: 'Xuất báo cáo thống kê hợp đồng tháng 1/2024',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'SUCCESS'
    },
    {
      id: '7',
      timestamp: '2024-01-15T10:00:00Z',
      user: 'Đỗ Văn G',
      action: 'Đăng nhập thất bại',
      resource: 'Hệ thống',
      details: 'Đăng nhập thất bại do sai mật khẩu',
      ipAddress: '192.168.1.106',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'FAILED'
    },
    {
      id: '8',
      timestamp: '2024-01-15T09:55:00Z',
      user: 'Bùi Thị H',
      action: 'Tạo chữ ký điện tử',
      resource: 'Yêu cầu ký #YK-001',
      details: 'Tạo yêu cầu ký điện tử cho hợp đồng lao động',
      ipAddress: '192.168.1.107',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      status: 'SUCCESS'
    }
  ]

  useEffect(() => {
    fetchActivityLogs()
  }, [filters, currentPage])

  const fetchActivityLogs = async () => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let filteredLogs = mockLogs
      
      if (filters.user) {
        filteredLogs = filteredLogs.filter(log => 
          log.user.toLowerCase().includes(filters.user.toLowerCase())
        )
      }
      
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => 
          log.action.toLowerCase().includes(filters.action.toLowerCase())
        )
      }
      
      if (filters.status) {
        filteredLogs = filteredLogs.filter(log => log.status === filters.status)
      }
      
      if (filters.dateFrom) {
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) >= new Date(filters.dateFrom)
        )
      }
      
      if (filters.dateTo) {
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) <= new Date(filters.dateTo)
        )
      }
      
      setLogs(filteredLogs)
      setTotalPages(Math.ceil(filteredLogs.length / 10))
    } catch (error) {
      console.error('Error loading logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: ActivityLog['status']) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: ActivityLog['status']) => {
    switch (status) {
      case 'SUCCESS':
        return '✅'
      case 'FAILED':
        return '❌'
      case 'WARNING':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử hoạt động</h1>
            <p className="mt-1 text-gray-600">Theo dõi và kiểm tra tất cả hoạt động trong hệ thống.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" />
        </div>

        {/* Filters */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Người dùng</label>
              <input
                type="text"
                value={filters.user}
                onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                placeholder="Tìm theo tên người dùng..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hành động</label>
              <input
                type="text"
                value={filters.action}
                onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                placeholder="Tìm theo hành động..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="SUCCESS">Thành công</option>
                <option value="FAILED">Thất bại</option>
                <option value="WARNING">Cảnh báo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFilters({ user: '', action: '', status: '', dateFrom: '', dateTo: '' })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Thời gian</th>
                  <th className="px-4 py-3 text-left font-medium">Người dùng</th>
                  <th className="px-4 py-3 text-left font-medium">Hành động</th>
                  <th className="px-4 py-3 text-left font-medium">Tài nguyên</th>
                  <th className="px-4 py-3 text-left font-medium">Chi tiết</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-28 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-40 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                    </tr>
                  ))
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {log.user}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {log.action}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {log.resource}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                        {log.details}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(log.status)}`}>
                          <span className="mr-1">{getStatusIcon(log.status)}</span>
                          {log.status === 'SUCCESS' ? 'Thành công' : 
                           log.status === 'FAILED' ? 'Thất bại' : 'Cảnh báo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
