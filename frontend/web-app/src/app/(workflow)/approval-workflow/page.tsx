'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface ApprovalStep {
  id: string
  name: string
  approver: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  dueDate: string
  comments?: string
}

interface ApprovalWorkflow {
  id: string
  contractId: string
  contractTitle: string
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'
  steps: ApprovalStep[]
  createdAt: string
  completedAt?: string
}

export default function ApprovalWorkflowPage() {
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'>('ALL')

  const filteredWorkflows = workflows.filter(workflow => filter === 'ALL' || workflow.status === filter)

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStepStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Quy trình phê duyệt</h1>
            <p className="mt-1 text-gray-600">Quản lý và theo dõi quy trình phê duyệt hợp đồng</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
        </div>

        {/* Filters */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Quy trình</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="DRAFT">Nháp</option>
                <option value="IN_PROGRESS">Đang xử lý</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="REJECTED">Từ chối</option>
              </select>
            </div>
            <button className="px-3 py-2 text-sm rounded-md bg-orange-600 text-white hover:bg-orange-700">
              + Tạo quy trình mới
            </button>
          </div>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {filteredWorkflows.map(workflow => (
            <div key={workflow.id} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{workflow.contractTitle}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(workflow.status)}`}>
                      {workflow.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    ID: {workflow.contractId} • Tạo: {new Date(workflow.createdAt).toLocaleDateString('vi-VN')}
                    {workflow.completedAt && (
                      <span> • Hoàn thành: {new Date(workflow.completedAt).toLocaleDateString('vi-VN')}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                    Xem chi tiết
                  </button>
                  <button className="px-3 py-1 text-sm rounded border border-orange-300 text-orange-700 hover:bg-orange-50">
                    Chỉnh sửa
                  </button>
                </div>
              </div>
              
              {/* Steps */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Các bước phê duyệt:</h4>
                <div className="space-y-2">
                  {workflow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{step.name}</div>
                        <div className="text-sm text-gray-600">Người phê duyệt: {step.approver}</div>
                        <div className="text-xs text-gray-500">Hạn: {new Date(step.dueDate).toLocaleDateString('vi-VN')}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStepStatusBadgeClass(step.status)}`}>
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
