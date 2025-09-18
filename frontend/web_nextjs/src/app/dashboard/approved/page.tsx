'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout'

export default function ApprovedPage() {
  const [items, setItems] = useState<Array<{ id: string; title: string; status: string; approvedAt?: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApprovedItems = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/mock/contracts')
        const json = await res.json()
        const approved = (json?.items || []).filter((x: any) => x.status === 'APPROVED')
        setItems(approved)
      } catch (e: any) {
        setError(e?.message || 'Lỗi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }
    fetchApprovedItems()
  }, [])
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Hợp đồng đã duyệt</h1>
            <p className="mt-1 text-gray-600">Danh sách các hợp đồng đã được phê duyệt.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        </div>

        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <h2 className="text-base font-semibold text-gray-900">Bộ lọc</h2>
            <span className="text-xs text-gray-500">Tìm kiếm và lọc</span>
          </div>
          <div className="p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Tìm theo tiêu đề" />
            <input className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" type="date" />
            <select className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Tất cả trạng thái</option>
              <option>ACTIVE</option>
              <option>ARCHIVED</option>
            </select>
            <button className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Áp dụng</button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border p-4 text-sm text-rose-700 bg-rose-50">{error}</div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-white shadow-sm p-4 animate-pulse">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="mt-3 h-5 w-48 bg-gray-200 rounded" />
              <div className="mt-4 h-3 w-full bg-gray-100 rounded" />
            </div>
          ))}
          {!loading && items.map((it) => (
            <div key={it.id} className="rounded-xl border bg-white shadow-sm p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{it.id}</p>
                  <h3 className="mt-1 font-semibold text-gray-900">{it.title}</h3>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">APPROVED</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Ngày duyệt: {it.approvedAt || '-'}</span>
                <button className="text-emerald-700 hover:underline">Xem chi tiết</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

