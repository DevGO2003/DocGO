import React from 'react'

type PaymentDetails = {
  totalValue?: number | string
  currency?: string
  schedule?: string
  paymentMethod?: string
}

type RiskAssessment = {
  riskLevel?: string
  riskFactors?: any[]
  mitigationMeasures?: any[]
  riskDetails?: any[]
}

type ComplianceStatus = {
  status?: string
  issues?: any[]
  recommendations?: any[]
}

export type ContractSummaryData = {
  contractNumber?: string | null
  status?: string | null
  contractType?: string | null
  title?: string | null
  tags?: string[]
  parties?: Array<Record<string, any>>
  object?: string | null
  effectiveDate?: string | null
  term?: string | null
  paymentDetails?: PaymentDetails
  keyClauses?: any[]
  favorableClauses?: any[]
  unfavorableClauses?: any[]
  reminders?: any[]
  terminationConditions?: string | null
  riskAssessment?: RiskAssessment
  complianceStatus?: ComplianceStatus
}

interface Props {
  data: ContractSummaryData
}

/**
 * Hiển thị giao diện giống Tab 3 (tạo thủ công) nhưng chỉ đọc dữ liệu từ JSON tóm tắt.
 */
export default function ContractSummaryRender({ data }: Props) {
  return (
    <div className="space-y-8">
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
                <p className="text-sm text-gray-600">Các trường đọc từ JSON tóm tắt</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Read-only</span>
          </div>
        </div>
        <div className="p-8 space-y-8">
          <div className="grid gap-4">
            <label className="text-base font-semibold text-gray-800 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
              Tiêu đề hợp đồng
            </label>
            <input value={data.title ?? ''} onChange={() => {}} className="border border-gray-200 rounded-xl px-6 py-4 text-base" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
            <div className="grid gap-4">
              <label className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                Loại hợp đồng
              </label>
              <input value={data.contractType ?? ''} onChange={() => {}} className="border border-gray-200 rounded-xl px-6 py-4 text-base" />
            </div>
            <div className="grid gap-4">
              <label className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
                Đối tượng
              </label>
              <input value={data.object ?? ''} onChange={() => {}} className="border border-gray-200 rounded-xl px-6 py-4 text-base" />
            </div>
            <div className="grid gap-4 md:col-span-2">
              <label className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                Tags
              </label>
              <input value={(data.tags || []).join(', ')} onChange={() => {}} className="border border-gray-200 rounded-xl px-6 py-4 text-base" />
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
                <p className="text-sm text-gray-600">Thiết lập theo JSON</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 space-y-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-4">
              <label className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>
                Ngày hiệu lực
              </label>
              <input value={data.effectiveDate ?? ''} onChange={() => {}} className="border border-gray-200 rounded-xl px-6 py-4 text-base" />
            </div>
            <div className="grid gap-4">
              <label className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-3 h-3 bg-teal-500 rounded-full mr-3"></span>
                Thời hạn
              </label>
              <input value={data.term ?? ''} onChange={() => {}} className="border border-gray-200 rounded-xl px-6 py-4 text-base" />
            </div>
            <div className="grid gap-4 sm:col-span-2 lg:col-span-1">
              <label className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-3 h-3 bg-rose-500 rounded-full mr-3"></span>
                Điều kiện chấm dứt
              </label>
              <input value={data.terminationConditions ?? ''} onChange={() => {}} className="border border-gray-200 rounded-xl px-6 py-4 text-base" />
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
                <p className="text-sm text-gray-600">Chi tiết từ JSON</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 space-y-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="grid gap-4">
              <label className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-3 h-3 bg-amber-500 rounded-full mr-3"></span>
                Tổng giá trị
              </label>
              <input value={(data.paymentDetails?.totalValue ?? '') as any} onChange={() => {}} className="border border-gray-200 rounded-xl px-6 py-4 text-base" />
            </div>
            <div className="grid gap-4">
              <label className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                Tiền tệ
              </label>
              <input value={data.paymentDetails?.currency ?? ''} onChange={() => {}} className="border border-gray-200 rounded-xl px-6 py-4 text-base" />
            </div>
            <div className="grid gap-4">
              <label className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                Phương thức
              </label>
              <input value={data.paymentDetails?.paymentMethod ?? ''} onChange={() => {}} className="border border-gray-200 rounded-xl px-6 py-4 text-base" />
            </div>
            <div className="grid gap-4">
              <label className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-3 h-3 bg-amber-400 rounded-full mr-3"></span>
                Lịch thanh toán
              </label>
              <input value={data.paymentDetails?.schedule ?? ''} onChange={() => {}} className="border border-gray-200 rounded-xl px-6 py-4 text-base" />
            </div>
          </div>
        </div>
      </div>

      {/* Các bên, điều khoản, rủi ro... */}
      <div className="grid gap-8">
        {/* Các bảng mảng sẽ được render từ trang cha bằng component EditableArrayTable */}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Điều khoản</h2>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-3">
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">Điều khoản chính</label>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 overflow-x-auto">
                <pre className="text-xs text-gray-800">{JSON.stringify(data.keyClauses ?? [], null, 2)}</pre>
              </div>
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">Điều khoản có lợi</label>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 overflow-x-auto">
                <pre className="text-xs text-gray-800">{JSON.stringify(data.favorableClauses ?? [], null, 2)}</pre>
              </div>
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-700">Điều khoản bất lợi</label>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 overflow-x-auto">
                <pre className="text-xs text-gray-800">{JSON.stringify(data.unfavorableClauses ?? [], null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Đánh giá rủi ro & Tuân thủ</h2>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Rủi ro</label>
              <textarea value={JSON.stringify(data.riskAssessment ?? {}, null, 2)} onChange={() => {}} rows={6} className="border border-gray-200 rounded-lg px-4 py-2 text-sm" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Trạng thái tuân thủ</label>
              <textarea value={JSON.stringify(data.complianceStatus ?? {}, null, 2)} onChange={() => {}} rows={6} className="border border-gray-200 rounded-lg px-4 py-2 text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


