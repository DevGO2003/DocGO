'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

export default function QuickCreatePage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [textInput, setTextInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file')

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === 'application/pdf' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.type === 'text/plain') {
        setUploadedFile(file)
        setError(null)
      } else {
        setError('Chỉ hỗ trợ file PDF, DOCX, TXT')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === 'application/pdf' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.type === 'text/plain') {
        setUploadedFile(file)
        setError(null)
      } else {
        setError('Chỉ hỗ trợ file PDF, DOCX, TXT')
      }
    }
  }

  const handleOCR = async () => {
    if (!uploadedFile && !textInput.trim()) {
      setError('Vui lòng chọn file hoặc nhập văn bản')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResult(null)

      const formData = new FormData()
      if (uploadedFile) {
        formData.append('file', uploadedFile)
      } else {
        formData.append('text', textInput)
      }

      const res = await fetch('/api/mock/ocr', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        throw new Error('Lỗi xử lý OCR')
      }

      const data = await res.json()
      setResult(data.data)
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContract = async () => {
    if (!result) return

    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/mock/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: result.title || 'Hợp đồng từ OCR',
          creatorId: 1,
          status: 'DRAFT',
          contractType: result.contractType || 'Hợp đồng lao động',
          object: result.object || '',
          effectiveDate: result.effectiveDate || new Date().toISOString().split('T')[0],
          term: result.term || '12 tháng',
          content: result.content || '',
          paymentDetails: result.paymentDetails || {
            totalValue: 0,
            currency: 'VND',
            schedule: 'Thanh toán 1 lần',
            paymentMethod: 'Chuyển khoản'
          },
          parties: result.parties || [],
          keyClauses: result.keyClauses || [],
          tags: result.tags || []
        })
      })

      if (!res.ok) {
        throw new Error('Lỗi tạo hợp đồng')
      }

      const data = await res.json()
      alert('Tạo hợp đồng thành công!')
      setResult(null)
      setUploadedFile(null)
      setTextInput('')
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Tạo nhanh hợp đồng</h1>
            <p className="mt-1 text-gray-600">Sử dụng OCR để trích xuất thông tin từ file hoặc văn bản.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        </div>

        {/* Input Mode Toggle */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Chọn phương thức nhập liệu</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setInputMode('file')}
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  inputMode === 'file'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📄 Upload File
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  inputMode === 'text'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ✏️ Nhập văn bản
              </button>
            </div>
          </div>

          {/* File Upload */}
          {inputMode === 'file' && (
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {uploadedFile ? uploadedFile.name : 'Kéo thả file vào đây hoặc click để chọn'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Hỗ trợ PDF, DOCX, TXT (tối đa 10MB)
                  </p>
                </div>
                {uploadedFile && (
                  <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    File đã chọn thành công
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Text Input */}
          {inputMode === 'text' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Nhập văn bản hợp đồng
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={12}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Dán nội dung hợp đồng vào đây..."
              />
              <div className="text-xs text-gray-500">
                {textInput.length} ký tự
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleOCR}
                disabled={loading || (!uploadedFile && !textInput.trim())}
                className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Trích xuất thông tin
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setUploadedFile(null)
                  setTextInput('')
                  setResult(null)
                  setError(null)
                }}
                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Xóa dữ liệu
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* OCR Result */}
        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Kết quả trích xuất</h3>
                <button
                  onClick={handleCreateContract}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tạo hợp đồng
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Thông tin cơ bản</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Tiêu đề:</strong> {result.title || 'Chưa xác định'}</div>
                    <div><strong>Loại hợp đồng:</strong> {result.contractType || 'Chưa xác định'}</div>
                    <div><strong>Đối tượng:</strong> {result.object || 'Chưa xác định'}</div>
                    <div><strong>Ngày hiệu lực:</strong> {result.effectiveDate || 'Chưa xác định'}</div>
                    <div><strong>Thời hạn:</strong> {result.term || 'Chưa xác định'}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Thông tin thanh toán</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Giá trị:</strong> {result.paymentDetails?.totalValue ? new Intl.NumberFormat('vi-VN').format(result.paymentDetails.totalValue) + ' ' + result.paymentDetails.currency : 'Chưa xác định'}</div>
                    <div><strong>Lịch thanh toán:</strong> {result.paymentDetails?.schedule || 'Chưa xác định'}</div>
                    <div><strong>Phương thức:</strong> {result.paymentDetails?.paymentMethod || 'Chưa xác định'}</div>
                  </div>
                </div>
              </div>
              
              {result.parties && result.parties.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Các bên tham gia</h4>
                  <div className="space-y-2">
                    {result.parties.map((party: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm">
                          <strong>{party.name || `Bên ${index + 1}`}</strong>
                          {party.role && <span className="ml-2 text-gray-600">({party.role})</span>}
                        </div>
                        {party.representative && (
                          <div className="text-xs text-gray-600 mt-1">
                            Đại diện: {party.representative}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {result.keyClauses && result.keyClauses.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Điều khoản chính</h4>
                  <div className="space-y-2">
                    {result.keyClauses.map((clause: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium">{clause.title || `Điều khoản ${index + 1}`}</div>
                        <div className="text-xs text-gray-600 mt-1">{clause.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Nội dung đầy đủ</h4>
                <div className="text-sm text-blue-800 max-h-40 overflow-y-auto">
                  {result.content || 'Không có nội dung'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}