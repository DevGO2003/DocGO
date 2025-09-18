'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'

// Hook dữ liệu đơn giản: dùng mock bây giờ, dễ chuyển sang API thật sau
function useDashboardData() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState({
    statusStats: [
      { title: 'Chờ duyệt', value: 1, href: '/dashboard/hop-dong?status=pending' },
      { title: 'Đã duyệt', value: 1, href: '/dashboard/da-duyet' },
      { title: 'Từ chối', value: 1, href: '/dashboard/hop-dong?status=rejected' },
      { title: 'Sắp hết hạn', value: 0, href: '/dashboard/hop-dong?status=expiring' },
    ],
    uploadsByMonth: [7, 14, 21, 28, 14, 7],
    monthLabels: ['Tháng 2', 'Tháng 4', 'Tháng 6', 'Tháng 8', 'Tháng 10', 'Tháng 12'],
    pieData: [33, 33, 34],
    pieColors: ['#22c55e', '#f59e0b', '#ef4444'],
    rejectReasons: [
      { label: 'Giá trị vượt thẩm quyền', count: 2 },
      { label: 'Thiếu thông tin', count: 0 },
      { label: 'Không đúng quy định', count: 0 },
      { label: 'Cần bổ sung tài liệu', count: 0 },
      { label: 'Giá trị vượt thẩm quyền', count: 0 },
    ],
  })

  useEffect(() => {
    // Giả lập tải dữ liệu + hiệu ứng
    const t = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  // Khi có backend thật, chỉ cần thay bằng API call, ví dụ:
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const res = await contractAPI.getContracts({ pageNumber: 0, pageSize: 1 })
  //       // setData(prev => ({ ...prev, ...mappingFromAPI(res.data.data) }))
  //     } catch (e: any) { setError('Không tải được dữ liệu') } finally { setLoading(false) }
  //   }
  //   fetchData()
  // }, [])

  return { ...data, loading, error }
}

export default function DashboardPage() {
  const router = useRouter()
  const { statusStats, uploadsByMonth, monthLabels, pieData, pieColors, rejectReasons, loading } = useDashboardData()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* 4 Ô thống kê trên cùng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusStats.map((s, idx) => (
            <Card
              key={s.title}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer bg-gradient-to-br from-white to-gray-50"
              onClick={() => router.push(s.href)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-700">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                <p className="text-sm text-primary-600 mt-2">Nhấp để xem chi tiết</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hàng biểu đồ: cột (2/3) + tròn (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Biểu đồ cột: Hợp đồng tải lên theo tháng */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Hợp đồng tải lên theo tháng</CardTitle>
                <CardDescription>Nhấp vào cột để xem chi tiết</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2 items-end h-56">
                  {/* Trục Y */}
                  <div className="flex flex-col justify-between h-full text-xs text-gray-500 pr-2">
                    {[28, 21, 14, 7, 0].map((t) => (
                      <div key={t} className="h-0.5 translate-y-1/2">
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                  {/* Cột */}
                  <div className="col-span-7 grid grid-cols-6 gap-4 h-full">
                    {uploadsByMonth.map((val, idx) => (
                      <div key={idx} className="flex flex-col items-center justify-end">
                        <div
                          className="w-8 rounded bg-gradient-to-t from-primary-600 to-primary-400 shadow-sm hover:shadow-md transition-all duration-300"
                          style={{ height: `${(val / 28) * 100}%` }}
                          title={`${monthLabels[idx]}: ${val}`}
                        />
                        <span className="text-xs text-gray-600 mt-2">{monthLabels[idx]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Biểu đồ tròn: Phân bố trạng thái */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden h-full">
              <CardHeader>
                <CardTitle>Phân bố trạng thái</CardTitle>
                <CardDescription>Nhấp vào phần để xem chi tiết</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  {/* Pie chart */}
                  <div
                    className="w-40 h-40 rounded-full shadow-sm"
                    style={{
                      backgroundImage: `conic-gradient(${pieColors[0]} 0 ${pieData[0]}%, ${pieColors[1]} ${pieData[0]}% ${pieData[0] + pieData[1]}%, ${pieColors[2]} ${pieData[0] + pieData[1]}% 100%)`,
                    }}
                    title={`Đã duyệt ${pieData[0]}% | Chờ duyệt ${pieData[1]}% | Từ chối ${pieData[2]}%`}
                  />
                  {/* Legend */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: pieColors[0] }} /> Đã duyệt {pieData[0]}%</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: pieColors[1] }} /> Chờ duyệt {pieData[1]}%</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: pieColors[2] }} /> Từ chối {pieData[2]}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Biểu đồ cột: Lý do từ chối phổ biến (full width) */}
        <div>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Lý do từ chối phổ biến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-8 gap-2 items-end h-64">
                {/* Trục Y */}
                <div className="flex flex-col justify-between h-full text-xs text-gray-500 pr-2">
                  {[8, 6, 4, 2, 0].map((t) => (
                    <div key={t} className="h-0.5 translate-y-1/2">
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
                {/* Cột */}
                <div className="col-span-7 grid grid-cols-5 gap-4 h-full">
                  {rejectReasons.map((r, idx) => (
                    <div key={r.label} className="flex flex-col items-center justify-end">
                      <div
                        className="w-10 rounded bg-gradient-to-t from-red-600 to-red-400 shadow-sm hover:shadow-md transition-all duration-300"
                        style={{ height: `${(r.count / 8) * 100}%` }}
                        title={`${r.label}: ${r.count}`}
                      />
                      <span className="text-xs text-center text-gray-600 mt-2 break-words">{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">Giá trị vượt thẩm quyền — count: 2</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}






