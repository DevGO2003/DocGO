'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout'
import { useState } from 'react'

export default function CreateContractPage() {
  // Basic contract info
  const [title, setTitle] = useState('')
  const [creatorId, setCreatorId] = useState<string>('')
  const [contractType, setContractType] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [object, setObject] = useState<string>('')
  const [effectiveDate, setEffectiveDate] = useState<string>('')
  const [term, setTerm] = useState<string>('')
  const [terminationConditions, setTerminationConditions] = useState<string>('')
  const [content, setContent] = useState<string>('')
  
  // Payment details
  const [paymentTotalValue, setPaymentTotalValue] = useState<string>('')
  const [paymentCurrency, setPaymentCurrency] = useState<string>('VND')
  const [paymentSchedule, setPaymentSchedule] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('Chuyển khoản')
  
  // Dynamic arrays - using simple JSON input for now (easy to replace with backend)
  const [parties, setParties] = useState<string>('')
  const [keyClauses, setKeyClauses] = useState<string>('')
  const [favorableClauses, setFavorableClauses] = useState<string>('')
  const [unfavorableClauses, setUnfavorableClauses] = useState<string>('')
  const [reminders, setReminders] = useState<string>('')
  const [riskAssessment, setRiskAssessment] = useState<string>('')
  const [complianceStatus, setComplianceStatus] = useState<string>('')
  
  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [responseData, setResponseData] = useState<any>(null)
  const [jsonErrors, setJsonErrors] = useState<{[key: string]: string}>({})
  const [success, setSuccess] = useState(false)

  // JSON validation helper
  const validateJson = (value: string, fieldName: string) => {
    if (!value.trim()) return true
    try {
      JSON.parse(value)
      setJsonErrors(prev => ({ ...prev, [fieldName]: '' }))
      return true
    } catch (e: any) {
      setJsonErrors(prev => ({ ...prev, [fieldName]: 'JSON không hợp lệ. Vui lòng kiểm tra lại cú pháp.' }))
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setResponseData(null)

    // Basic validation
    if (!title.trim()) {
      setMessage('Vui lòng nhập tiêu đề hợp đồng.')
      return
    }
    if (!creatorId.trim() || isNaN(Number(creatorId))) {
      setMessage('Vui lòng nhập Creator ID hợp lệ (số).')
      return
    }

    // Validate all JSON fields
    const jsonFields = [
      { value: parties, name: 'parties' },
      { value: keyClauses, name: 'keyClauses' },
      { value: favorableClauses, name: 'favorableClauses' },
      { value: unfavorableClauses, name: 'unfavorableClauses' },
      { value: reminders, name: 'reminders' },
      { value: riskAssessment, name: 'riskAssessment' },
      { value: complianceStatus, name: 'complianceStatus' }
    ]

    let hasJsonError = false
    jsonFields.forEach(field => {
      if (!validateJson(field.value, field.name)) {
        hasJsonError = true
      }
    })

    if (hasJsonError) {
      setMessage('Vui lòng kiểm tra lại các trường JSON.')
      return
    }

    try {
      setSubmitting(true)
      setMessage('Đang tạo hợp đồng...')

      // Build payload matching backend schema
      const payload: any = {
        title: title.trim(),
        creatorId: Number(creatorId),
        status: 'DRAFT', // Default status
        contractType: contractType || 'Hợp đồng lao động',
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        object: object || '',
        effectiveDate: effectiveDate || new Date().toISOString().split('T')[0],
        term: term || '12 tháng',
        terminationConditions: terminationConditions || '',
        content: content || '',
        paymentDetails: {
          totalValue: Number(paymentTotalValue) || 0,
          currency: paymentCurrency || 'VND',
          schedule: paymentSchedule || 'Thanh toán 1 lần',
          paymentMethod: paymentMethod || 'Chuyển khoản'
        }
      }

      // Optional basic fields
      if (contractType.trim()) payload.contractType = contractType.trim()
      if (tags.trim()) payload.tags = tags.split(',').map(t => t.trim()).filter(Boolean)
      if (object.trim()) payload.object = object.trim()
      if (effectiveDate) payload.effectiveDate = effectiveDate
      if (term.trim()) payload.term = term.trim()
      if (terminationConditions.trim()) payload.terminationConditions = terminationConditions.trim()
      if (content.trim()) payload.content = content.trim()

      // Payment details
      if (paymentTotalValue || paymentCurrency || paymentSchedule || paymentMethod) {
        payload.paymentDetails = {
          totalValue: paymentTotalValue ? Number(paymentTotalValue) : 0,
          schedule: paymentSchedule || '',
          currency: paymentCurrency || 'VND',
          paymentMethod: paymentMethod || ''
        }
      }

      // JSON arrays (parse if provided)
      if (parties.trim()) payload.parties = JSON.parse(parties)
      if (keyClauses.trim()) payload.keyClauses = JSON.parse(keyClauses)
      if (favorableClauses.trim()) payload.favorableClauses = JSON.parse(favorableClauses)
      if (unfavorableClauses.trim()) payload.unfavorableClauses = JSON.parse(unfavorableClauses)
      if (reminders.trim()) payload.reminders = JSON.parse(reminders)
      if (riskAssessment.trim()) payload.riskAssessment = JSON.parse(riskAssessment)
      if (complianceStatus.trim()) payload.complianceStatus = JSON.parse(complianceStatus)

      // For now, use mock API - easy to replace with real backend
      const res = await fetch('/api/mock/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json().catch(() => null)
      if (!res.ok) {
        const errorMsg = json?.description || json?.message || json?.detail || res.statusText
        setMessage(`Lỗi tạo hợp đồng: ${errorMsg}`)
        setSubmitting(false)
        return
      }

      const data = json?.data ?? json
      setResponseData(data)
      setMessage('Tạo hợp đồng thành công!')
      setSuccess(true)
      
      // Reset form after successful submission
      setTimeout(() => {
        setTitle('')
        setCreatorId('')
        setContractType('')
        setTags('')
        setObject('')
        setEffectiveDate('')
        setTerm('')
        setTerminationConditions('')
        setContent('')
        setPaymentTotalValue('')
        setPaymentCurrency('VND')
        setPaymentSchedule('')
        setPaymentMethod('Chuyển khoản')
        setParties('')
        setKeyClauses('')
        setFavorableClauses('')
        setUnfavorableClauses('')
        setReminders('')
        setRiskAssessment('')
        setComplianceStatus('')
        setSuccess(false)
        setMessage(null)
        setResponseData(null)
      }, 3000)
    } catch (err: any) {
      setMessage(`Có lỗi xảy ra: ${err?.message || String(err)}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl transform rotate-1"></div>
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Tạo hợp đồng mới
                    </h1>
                    <p className="mt-2 text-gray-600 text-lg">Nhập thông tin chi tiết để khởi tạo hợp đồng trong hệ thống</p>
                  </div>
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
          <form onSubmit={handleSubmit} className="space-y-8 col-span-1 xl:col-span-1">
            {/* Thông tin cơ bản */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
                      <p className="text-sm text-gray-600">Các trường bắt buộc để tạo hợp đồng</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Bắt buộc</span>
                </div>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid gap-4">
                  <label className="text-base font-semibold text-gray-800 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    Tiêu đề hợp đồng
                    <span className="text-red-500 ml-2">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Hợp đồng Dịch vụ IT Quý 4/2025"
                    className="border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    required
                  />
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Tiêu đề ngắn gọn, giúp dễ tìm kiếm và quản lý
                  </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
                  <div className="grid gap-4">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                      Creator ID
                      <span className="text-red-500 ml-2">*</span>
                    </label>
                    <input
                      type="number"
                      value={creatorId}
                      onChange={(e) => setCreatorId(e.target.value)}
                      placeholder="VD: 101"
                      className="border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                      required
                      min={0}
                    />
                  </div>
                  <div className="grid gap-4">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                      Loại hợp đồng
                    </label>
                    <input
                      type="text"
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value)}
                      placeholder="VD: Dịch vụ, Mua bán, Hợp tác"
                      className="border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>
                  <div className="grid gap-4">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                      Tags
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="VD: ưu tiên, SLA, bảo mật"
                      className="border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>
                  <div className="grid gap-4">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
                      Đối tượng
                    </label>
                    <input
                      type="text"
                      value={object}
                      onChange={(e) => setObject(e.target.value)}
                      placeholder="VD: Dịch vụ IT, Mua bán"
                      className="border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Thời hạn & hiệu lực */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Thời hạn & Hiệu lực</h2>
                      <p className="text-sm text-gray-600">Thiết lập thời gian hiệu lực và thời hạn hợp đồng</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Quan trọng</span>
                </div>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="grid gap-4">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>
                      Ngày hiệu lực
                    </label>
                    <input
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Ngày hợp đồng có hiệu lực
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-teal-500 rounded-full mr-3"></span>
                      Thời hạn
                    </label>
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      placeholder="VD: 12 tháng, 2 năm"
                      className="border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Thời hạn thực hiện hợp đồng
                    </p>
                  </div>
                  <div className="grid gap-4 sm:col-span-2 lg:col-span-1">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-rose-500 rounded-full mr-3"></span>
                      Điều kiện chấm dứt
                    </label>
                    <input
                      type="text"
                      value={terminationConditions}
                      onChange={(e) => setTerminationConditions(e.target.value)}
                      placeholder="VD: Vi phạm, Hết hạn"
                      className="border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Các điều kiện chấm dứt
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Thanh toán */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Thông tin thanh toán</h2>
                      <p className="text-sm text-gray-600">Chi tiết về giá trị và phương thức thanh toán</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Tài chính</span>
                </div>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="grid gap-4">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-amber-500 rounded-full mr-3"></span>
                      Tổng giá trị
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={paymentTotalValue}
                      onChange={(e) => setPaymentTotalValue(e.target.value)}
                      placeholder="VD: 150000000"
                      className="border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>
                  <div className="grid gap-4">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                      Tiền tệ
                    </label>
                    <select
                      value={paymentCurrency}
                      onChange={(e) => setPaymentCurrency(e.target.value)}
                      className="border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <option value="VND">VND</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div className="grid gap-4">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                      Phương thức
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <option value="Chuyển khoản">Chuyển khoản</option>
                      <option value="Tiền mặt">Tiền mặt</option>
                      <option value="Thẻ">Thẻ</option>
                    </select>
                  </div>
                  <div className="grid gap-4">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                      Lịch thanh toán
                    </label>
                    <input
                      type="text"
                      value={paymentSchedule}
                      onChange={(e) => setPaymentSchedule(e.target.value)}
                      placeholder="VD: 30% khi ký, 70% nghiệm thu"
                      className="border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Các bên tham gia */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Các bên tham gia</h2>
                      <p className="text-sm text-gray-600">Thông tin chi tiết về các bên tham gia hợp đồng</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">JSON</span>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid gap-4">
                  <label className="text-base font-semibold text-gray-800 flex items-center">
                    <span className="w-3 h-3 bg-violet-500 rounded-full mr-3"></span>
                    Parties (JSON)
                  </label>
                  <textarea
                    value={parties}
                    onChange={(e) => {
                      setParties(e.target.value)
                      validateJson(e.target.value, 'parties')
                    }}
                    placeholder='[{"name":"Công ty ABC","role":"Bên cung cấp","representative":"Nguyễn Văn A","taxCode":"0123456789","contact":"contact@abc.com","address":"123 Đường ABC, TP.HCM","businessLicense":"123456789"}]'
                    rows={8}
                    className={`border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md ${jsonErrors.parties ? 'border-red-300 focus:ring-red-400' : 'focus:ring-violet-500 focus:border-transparent'}`}
                  />
                  {jsonErrors.parties ? (
                    <p className="text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {jsonErrors.parties}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Mảng JSON chứa thông tin các bên tham gia
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Điều khoản hợp đồng */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Điều khoản hợp đồng</h2>
                      <p className="text-sm text-gray-600">Các điều khoản chính, có lợi và bất lợi</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-medium rounded-full">Điều khoản</span>
                </div>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid gap-6">
                  <label className="text-base font-semibold text-gray-800 flex items-center">
                    <span className="w-3 h-3 bg-cyan-500 rounded-full mr-3"></span>
                    Điều khoản chính (keyClauses)
                  </label>
                  <textarea
                    value={keyClauses}
                    onChange={(e) => {
                      setKeyClauses(e.target.value)
                      validateJson(e.target.value, 'keyClauses')
                    }}
                    placeholder='[{"name":"Phạt vi phạm","description":"Mức phạt 5% giá trị hợp đồng","source":"Điều 5"}]'
                    rows={6}
                    className={`border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md ${jsonErrors.keyClauses ? 'border-red-300 focus:ring-red-400' : 'focus:ring-cyan-500 focus:border-transparent'}`}
                  />
                  {jsonErrors.keyClauses && (
                    <p className="text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {jsonErrors.keyClauses}
                    </p>
                  )}
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="grid gap-6">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                      Điều khoản có lợi
                    </label>
                    <textarea
                      value={favorableClauses}
                      onChange={(e) => {
                        setFavorableClauses(e.target.value)
                        validateJson(e.target.value, 'favorableClauses')
                      }}
                      placeholder='[{"clauseName":"Bảo hành","description":"Bảo hành 24 tháng","benefitTo":"Bên mua"}]'
                      rows={6}
                      className={`border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md ${jsonErrors.favorableClauses ? 'border-red-300 focus:ring-red-400' : 'focus:ring-cyan-500 focus:border-transparent'}`}
                    />
                    {jsonErrors.favorableClauses && (
                      <p className="text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {jsonErrors.favorableClauses}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-6">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                      Điều khoản bất lợi
                    </label>
                    <textarea
                      value={unfavorableClauses}
                      onChange={(e) => {
                        setUnfavorableClauses(e.target.value)
                        validateJson(e.target.value, 'unfavorableClauses')
                      }}
                      placeholder='[{"clauseName":"Trả chậm","description":"Phạt 0.5%/tháng","riskTo":"Bên bán"}]'
                      rows={6}
                      className={`border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md ${jsonErrors.unfavorableClauses ? 'border-red-300 focus:ring-red-400' : 'focus:ring-cyan-500 focus:border-transparent'}`}
                    />
                    {jsonErrors.unfavorableClauses && (
                      <p className="text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {jsonErrors.unfavorableClauses}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Nhắc nhở & Rủi ro */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Nhắc nhở & Đánh giá rủi ro</h2>
                      <p className="text-sm text-gray-600">Lịch nhắc nhở và đánh giá rủi ro hợp đồng</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">Rủi ro</span>
                </div>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid gap-6">
                  <label className="text-base font-semibold text-gray-800 flex items-center">
                    <span className="w-3 h-3 bg-rose-500 rounded-full mr-3"></span>
                    Nhắc nhở (reminders)
                  </label>
                  <textarea
                    value={reminders}
                    onChange={(e) => {
                      setReminders(e.target.value)
                      validateJson(e.target.value, 'reminders')
                    }}
                    placeholder='[{"type":"renewal","date":"2025-12-01","content":"Gia hạn hợp đồng"}]'
                    rows={5}
                    className={`border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md ${jsonErrors.reminders ? 'border-red-300 focus:ring-red-400' : 'focus:ring-rose-500 focus:border-transparent'}`}
                  />
                  {jsonErrors.reminders && (
                    <p className="text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {jsonErrors.reminders}
                    </p>
                  )}
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="grid gap-6">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                      Đánh giá rủi ro (riskAssessment)
                    </label>
                    <textarea
                      value={riskAssessment}
                      onChange={(e) => {
                        setRiskAssessment(e.target.value)
                        validateJson(e.target.value, 'riskAssessment')
                      }}
                      placeholder='{"riskLevel":"MEDIUM","riskFactors":["Rủi ro thanh toán","Rủi ro thực hiện"],"mitigationMeasures":["Ký quỹ","Bảo lãnh"]}'
                      rows={6}
                      className={`border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md ${jsonErrors.riskAssessment ? 'border-red-300 focus:ring-red-400' : 'focus:ring-rose-500 focus:border-transparent'}`}
                    />
                    {jsonErrors.riskAssessment && (
                      <p className="text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {jsonErrors.riskAssessment}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-6">
                    <label className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>
                      Trạng thái tuân thủ (complianceStatus)
                    </label>
                    <textarea
                      value={complianceStatus}
                      onChange={(e) => {
                        setComplianceStatus(e.target.value)
                        validateJson(e.target.value, 'complianceStatus')
                      }}
                      placeholder='{"status":"COMPLIANT","issues":[],"recommendations":["Kiểm tra định kỳ"]}'
                      rows={6}
                      className={`border border-gray-200 rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md ${jsonErrors.complianceStatus ? 'border-red-300 focus:ring-red-400' : 'focus:ring-rose-500 focus:border-transparent'}`}
                    />
                    {jsonErrors.complianceStatus && (
                      <p className="text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {jsonErrors.complianceStatus}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Hoàn tất tạo hợp đồng</h3>
                    <p className="text-sm text-gray-600">Kiểm tra thông tin và tạo hợp đồng mới</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      // Reset all form fields
                      setTitle('')
                      setCreatorId('')
                      setContractType('')
                      setTags('')
                      setObject('')
                      setEffectiveDate('')
                      setTerm('')
                      setTerminationConditions('')
                      setPaymentTotalValue('')
                      setPaymentCurrency('VND')
                      setPaymentSchedule('')
                      setPaymentMethod('Chuyển khoản')
                      setParties('')
                      setKeyClauses('')
                      setFavorableClauses('')
                      setUnfavorableClauses('')
                      setReminders('')
                      setRiskAssessment('')
                      setComplianceStatus('')
                      setContent('')
                      setMessage(null)
                      setResponseData(null)
                      setJsonErrors({})
                    }}
                    disabled={submitting}
                    className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Xoá dữ liệu
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 hover:shadow-xl"
                  >
                    {submitting && (
                      <svg className="h-5 w-5 animate-spin mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    )}
                    {submitting ? 'Đang tạo...' : 'Tạo hợp đồng'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Success/Error Messages */}
          {message && (
            <div className={`rounded-2xl border p-6 shadow-lg ${
              success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  success ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  {success ? (
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className={`font-semibold ${success ? 'text-emerald-900' : 'text-red-900'}`}>
                    {success ? 'Thành công!' : 'Có lỗi xảy ra'}
                  </h3>
                  <p className="text-sm mt-1">{message}</p>
                </div>
              </div>
            </div>
          )}

          {responseData && (
            <div className="rounded-2xl border bg-blue-50 border-blue-200 p-6 shadow-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Thông tin hợp đồng đã tạo:</h3>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <pre className="text-sm text-gray-800 overflow-x-auto">
                  {JSON.stringify(responseData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


