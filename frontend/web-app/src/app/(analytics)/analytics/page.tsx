'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { TitlePanel } from '@/components/ui'
import dynamic from 'next/dynamic'

const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false })
const LineChart = dynamic(() => import('recharts').then(m => m.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then(m => m.Line), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false })
// Import Legend directly to avoid type issues
import { Legend } from 'recharts'
const PieChart = dynamic(() => import('recharts').then(m => m.PieChart), { ssr: false })
const Pie = dynamic(() => import('recharts').then(m => m.Pie), { ssr: false })
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false })
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false })

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/mock/stats')
        const json = await res.json()
        setStats(json.data)
      } catch (e: any) {
        setError(e?.message || 'Lỗi tải thống kê')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <TitlePanel
          title="THỐNG KÊ"
          description="Tổng quan hoạt động và số liệu chính"
          variant="primary"
        />

        {error && <div className="rounded-xl border p-4 text-sm text-rose-700 bg-rose-50">{error}</div>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-white shadow-sm p-5 ring-1 ring-gray-100 animate-pulse">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="mt-3 h-6 w-16 bg-gray-200 rounded" />
              <div className="mt-4 h-1 w-full bg-gray-100 rounded" />
            </div>
          ))}
          {!loading && stats && ([
            { label: 'Tổng hợp đồng', value: stats.kpis?.totalContracts },
            { label: 'Tỷ lệ phê duyệt', value: `${Math.round((stats.kpis?.approvedRate ?? 0) * 100)}%` },
            { label: 'Thời gian xử lý TB', value: `${stats.kpis?.avgProcessingDays} ngày` },
            { label: 'Sắp hết hạn', value: stats.kpis?.expiringSoon },
          ] as const).map((k: any, i: number) => (
            <div key={i} className="rounded-2xl border bg-white shadow-sm p-5 ring-1 ring-gray-100">
              <p className="text-sm text-gray-500">{k.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{k.value}</p>
              <div className="mt-3 h-1 w-full rounded bg-gray-100">
                <div className="h-1 rounded bg-gradient-to-r from-sky-500 to-blue-600" style={{ width: `${(Number(parseFloat(String(k.value))) % 100) + 10}%` }} />
              </div>
            </div>
          ))}
        </div>

        {stats && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-5">
              <h2 className="text-base font-semibold text-gray-900">Phân bố trạng thái</h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Pie data={stats.charts?.statusDistribution} dataKey="value" nameKey="name" outerRadius={90} label>
                      {(stats.charts?.statusDistribution || []).map((_: any, idx: number) => (
                        <Cell key={idx} fill={["#60a5fa", "#34d399", "#f59e0b", "#ef4444"][idx % 4]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-5">
              <h2 className="text-base font-semibold text-gray-900">Uploads theo tháng</h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.charts?.monthlyUploads}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-5 lg:col-span-2">
              <h2 className="text-base font-semibold text-gray-900">Lý do từ chối</h2>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.charts?.rejectReasons}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="reason" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
