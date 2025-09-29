import { NextResponse } from 'next/server'

export async function GET() {
  const now = new Date().toISOString()
  const data = {
    kpis: {
      totalContracts: 128,
      approvedRate: 0.76,
      avgProcessingDays: 5.4,
      expiringSoon: 7,
    },
    charts: {
      monthlyUploads: [
        { month: '01', value: 12 }, { month: '02', value: 18 }, { month: '03', value: 22 }, { month: '04', value: 15 },
        { month: '05', value: 19 }, { month: '06', value: 25 }, { month: '07', value: 30 }, { month: '08', value: 28 },
        { month: '09', value: 24 }, { month: '10', value: 20 }, { month: '11', value: 18 }, { month: '12', value: 16 }
      ],
      statusDistribution: [
        { name: 'Nháp', value: 18 },
        { name: 'Đang duyệt', value: 22 },
        { name: 'Bị từ chối', value: 9 },
        { name: 'Đã duyệt', value: 79 }
      ],
      rejectReasons: [
        { reason: 'Thiếu thông tin', value: 8 },
        { reason: 'Giá trị vượt quyền', value: 5 },
        { reason: 'Điều khoản chưa rõ', value: 3 },
        { reason: 'Khác', value: 2 }
      ]
    }
  }
  return NextResponse.json({
    apiVersion: 'v1', statusCode: 200, shortMessage: 'Success', description: 'Mock KPI', data, timestamp: now, requestId: crypto.randomUUID(), path: '/api/mock/stats'
  })
}

