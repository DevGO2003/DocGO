'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface APIEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  parameters: {
    name: string
    type: string
    required: boolean
    description: string
  }[]
  response: {
    status: number
    description: string
    example: any
  }[]
}

export default function APIDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const endpoints: APIEndpoint[] = [
    {
      id: '1',
      method: 'GET',
      path: '/api/mock/contracts',
      description: 'Lấy danh sách hợp đồng với phân trang và lọc',
      parameters: [
        { name: 'page', type: 'number', required: false, description: 'Số trang (mặc định: 1)' },
        { name: 'limit', type: 'number', required: false, description: 'Số lượng mỗi trang (mặc định: 10)' },
        { name: 'status', type: 'string', required: false, description: 'Lọc theo trạng thái' },
        { name: 'search', type: 'string', required: false, description: 'Tìm kiếm theo tên hoặc mô tả' }
      ],
      response: [
        {
          status: 200,
          description: 'Thành công',
          example: {
            apiVersion: 'v1',
            statusCode: 200,
            shortMessage: 'Success',
            description: 'Lấy danh sách hợp đồng thành công',
            data: {
              items: [
                {
                  id: '1',
                  title: 'Hợp đồng lao động',
                  status: 'ACTIVE',
                  contractType: 'Hợp đồng lao động',
                  createdAt: '2024-01-15T10:00:00Z'
                }
              ],
              pagination: {
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1
              }
            },
            timestamp: '2024-01-15T10:00:00Z',
            requestId: 'uuid-here',
            path: '/api/mock/contracts'
          }
        }
      ]
    },
    {
      id: '2',
      method: 'POST',
      path: '/api/mock/contracts',
      description: 'Tạo hợp đồng mới',
      parameters: [
        { name: 'title', type: 'string', required: true, description: 'Tiêu đề hợp đồng' },
        { name: 'contractType', type: 'string', required: true, description: 'Loại hợp đồng' },
        { name: 'object', type: 'string', required: true, description: 'Đối tượng hợp đồng' },
        { name: 'effectiveDate', type: 'string', required: true, description: 'Ngày hiệu lực (ISO 8601)' },
        { name: 'term', type: 'string', required: true, description: 'Thời hạn hợp đồng' },
        { name: 'content', type: 'string', required: true, description: 'Nội dung hợp đồng' },
        { name: 'paymentDetails', type: 'object', required: true, description: 'Thông tin thanh toán' },
        { name: 'parties', type: 'array', required: true, description: 'Danh sách các bên tham gia' },
        { name: 'keyClauses', type: 'array', required: true, description: 'Điều khoản chính' }
      ],
      response: [
        {
          status: 201,
          description: 'Tạo thành công',
          example: {
            apiVersion: 'v1',
            statusCode: 201,
            shortMessage: 'Created',
            description: 'Tạo hợp đồng thành công',
            data: {
              id: '1',
              title: 'Hợp đồng lao động',
              status: 'DRAFT',
              contractType: 'Hợp đồng lao động',
              createdAt: '2024-01-15T10:00:00Z'
            },
            timestamp: '2024-01-15T10:00:00Z',
            requestId: 'uuid-here',
            path: '/api/mock/contracts'
          }
        },
        {
          status: 400,
          description: 'Dữ liệu không hợp lệ',
          example: {
            apiVersion: 'v1',
            statusCode: 400,
            shortMessage: 'Bad Request',
            description: 'Dữ liệu đầu vào không hợp lệ',
            data: null,
            timestamp: '2024-01-15T10:00:00Z',
            requestId: 'uuid-here',
            path: '/api/mock/contracts'
          }
        }
      ]
    },
    {
      id: '3',
      method: 'GET',
      path: '/api/mock/contracts/{id}',
      description: 'Lấy chi tiết hợp đồng theo ID',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'ID của hợp đồng' }
      ],
      response: [
        {
          status: 200,
          description: 'Thành công',
          example: {
            apiVersion: 'v1',
            statusCode: 200,
            shortMessage: 'Success',
            description: 'Lấy chi tiết hợp đồng thành công',
            data: {
              id: '1',
              title: 'Hợp đồng lao động',
              status: 'ACTIVE',
              contractType: 'Hợp đồng lao động',
              object: 'Cung cấp dịch vụ lao động',
              effectiveDate: '2024-01-01',
              term: '12 tháng',
              content: 'Nội dung hợp đồng...',
              paymentDetails: {
                totalValue: 50000000,
                currency: 'VND',
                schedule: 'Thanh toán hàng tháng',
                paymentMethod: 'Chuyển khoản'
              },
              parties: [
                {
                  name: 'Công ty ABC',
                  role: 'Bên A',
                  representative: 'Nguyễn Văn A',
                  taxCode: '0123456789',
                  contact: '0123456789',
                  address: '123 Đường ABC, Quận 1, TP.HCM'
                }
              ],
              keyClauses: [
                {
                  title: 'Điều khoản thanh toán',
                  content: 'Bên A thanh toán cho Bên B theo lịch trình đã thỏa thuận'
                }
              ],
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            timestamp: '2024-01-15T10:00:00Z',
            requestId: 'uuid-here',
            path: '/api/mock/contracts/1'
          }
        },
        {
          status: 404,
          description: 'Không tìm thấy hợp đồng',
          example: {
            apiVersion: 'v1',
            statusCode: 404,
            shortMessage: 'Not Found',
            description: 'Không tìm thấy hợp đồng với ID đã cho',
            data: null,
            timestamp: '2024-01-15T10:00:00Z',
            requestId: 'uuid-here',
            path: '/api/mock/contracts/999'
          }
        }
      ]
    },
    {
      id: '4',
      method: 'POST',
      path: '/api/mock/auth/login',
      description: 'Đăng nhập hệ thống',
      parameters: [
        { name: 'email', type: 'string', required: true, description: 'Email đăng nhập' },
        { name: 'password', type: 'string', required: true, description: 'Mật khẩu' }
      ],
      response: [
        {
          status: 200,
          description: 'Đăng nhập thành công',
          example: {
            apiVersion: 'v1',
            statusCode: 200,
            shortMessage: 'Success',
            description: 'Đăng nhập thành công',
            data: {
              user: {
                id: '1',
                name: 'Nguyễn Văn A',
                email: 'admin@docgo.com',
                role: 'ADMIN',
                avatar: 'https://example.com/avatar.jpg'
              },
              token: 'jwt-token-here',
              expiresIn: 3600
            },
            timestamp: '2024-01-15T10:00:00Z',
            requestId: 'uuid-here',
            path: '/api/mock/auth/login'
          }
        },
        {
          status: 401,
          description: 'Thông tin đăng nhập không đúng',
          example: {
            apiVersion: 'v1',
            statusCode: 401,
            shortMessage: 'Unauthorized',
            description: 'Email hoặc mật khẩu không đúng',
            data: null,
            timestamp: '2024-01-15T10:00:00Z',
            requestId: 'uuid-here',
            path: '/api/mock/auth/login'
          }
        }
      ]
    },
    {
      id: '5',
      method: 'POST',
      path: '/api/mock/ocr',
      description: 'Trích xuất thông tin từ tài liệu bằng OCR',
      parameters: [
        { name: 'file', type: 'file', required: false, description: 'File tài liệu (PDF, DOCX, TXT)' },
        { name: 'text', type: 'string', required: false, description: 'Văn bản cần trích xuất' }
      ],
      response: [
        {
          status: 200,
          description: 'Trích xuất thành công',
          example: {
            apiVersion: 'v1',
            statusCode: 200,
            shortMessage: 'Success',
            description: 'Trích xuất OCR thành công',
            data: {
              title: 'Hợp đồng lao động',
              contractType: 'Hợp đồng lao động',
              object: 'Cung cấp dịch vụ lao động',
              effectiveDate: '2024-01-01',
              term: '12 tháng',
              content: 'Nội dung hợp đồng được trích xuất...',
              paymentDetails: {
                totalValue: 50000000,
                currency: 'VND',
                schedule: 'Thanh toán hàng tháng',
                paymentMethod: 'Chuyển khoản'
              },
              parties: [
                {
                  name: 'Công ty ABC',
                  role: 'Bên A',
                  representative: 'Nguyễn Văn A',
                  taxCode: '0123456789',
                  contact: '0123456789',
                  address: '123 Đường ABC, Quận 1, TP.HCM'
                }
              ],
              keyClauses: [
                {
                  title: 'Điều khoản thanh toán',
                  content: 'Bên A thanh toán cho Bên B theo lịch trình đã thỏa thuận'
                }
              ]
            },
            timestamp: '2024-01-15T10:00:00Z',
            requestId: 'uuid-here',
            path: '/api/mock/ocr'
          }
        }
      ]
    }
  ]

  const filteredApiEndpoints = endpoints.filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getHttpMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'POST':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
            <p className="mt-1 text-gray-600">Tài liệu API chi tiết cho hệ thống DocGO.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
        </div>

        {/* Search */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm API endpoint..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredApiEndpoints.length} endpoint{filteredApiEndpoints.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="space-y-4">
          {filteredApiEndpoints.map((endpoint) => (
            <div key={endpoint.id} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getHttpMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                  </div>
                  <button
                    onClick={() => setActiveEndpoint(activeEndpoint === endpoint.id ? null : endpoint.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {activeEndpoint === endpoint.id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                  </button>
                </div>
                <p className="mt-2 text-gray-600">{endpoint.description}</p>
              </div>

              {activeEndpoint === endpoint.id && (
                <div className="px-6 py-4 space-y-6">
                  {/* Parameters */}
                  {endpoint.parameters.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tham số</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50 text-gray-600">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium">Tên</th>
                              <th className="px-4 py-2 text-left font-medium">Loại</th>
                              <th className="px-4 py-2 text-left font-medium">Bắt buộc</th>
                              <th className="px-4 py-2 text-left font-medium">Mô tả</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {endpoint.parameters.map((param, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 font-mono text-gray-900">{param.name}</td>
                                <td className="px-4 py-2 text-gray-600">{param.type}</td>
                                <td className="px-4 py-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    param.required 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {param.required ? 'Có' : 'Không'}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-gray-600">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Response Examples */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Ví dụ phản hồi</h3>
                    <div className="space-y-4">
                      {endpoint.response.map((res, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              res.status >= 200 && res.status < 300 
                                ? 'bg-green-100 text-green-800' 
                                : res.status >= 400 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {res.status}
                            </span>
                            <span className="ml-2 text-sm text-gray-600">{res.description}</span>
                          </div>
                          <div className="p-4">
                            <pre className="text-sm text-gray-800 overflow-x-auto">
                              {JSON.stringify(res.example, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* API Info */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin API</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Base URL</h3>
              <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                http://localhost:3001
              </code>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">API Version</h3>
              <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                v1
              </code>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Content Type</h3>
              <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                application/json
              </code>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Authentication</h3>
              <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                Bearer Token
              </code>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
