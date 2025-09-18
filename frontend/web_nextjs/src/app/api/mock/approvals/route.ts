import { NextResponse } from 'next/server'

const companies = ['ABC Corp', 'XYZ Ltd', 'Tech Solutions', 'Global Inc', 'Startup Co', 'Enterprise Ltd']
const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Legal']
const roles = ['USER', 'STAFF', 'MANAGER', 'ADMIN', 'VIEWER']
const statuses = ['PENDING', 'APPROVED', 'REJECTED'] as const

const approvals = Array.from({ length: 12 }).map((_, i) => {
  const requestedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  const status = statuses[i % statuses.length]
  
  return {
    id: `A-${1000 + i}`,
    email: `requester${i + 1}@docgo.com`,
    name: `Người dùng ${i + 1}`,
    company: companies[i % companies.length],
    department: departments[i % departments.length],
    role: roles[i % roles.length],
    requestedAt: requestedAt.toISOString(),
    status,
    reason: status === 'REJECTED' ? 'Thiếu thông tin xác thực' : undefined,
    documents: i % 3 === 0 ? ['Giấy tờ tùy thân.pdf', 'CV.pdf'] : i % 2 === 0 ? ['Giấy tờ tùy thân.pdf'] : []
  }
})

export async function GET() {
  return NextResponse.json({ 
    items: approvals,
    total: approvals.length,
    page: 1,
    pageSize: 12
  })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as any
  if (!body || !body.id || !body.action) return NextResponse.json({ ok: false }, { status: 400 })
  
  // Mock update approval status
  const approval = approvals.find(a => a.id === body.id)
  if (approval) {
    approval.status = body.action === 'approve' ? 'APPROVED' : 'REJECTED'
    if (body.reason) {
      approval.reason = body.reason
    }
  }
  
  return NextResponse.json({ 
    ok: true, 
    id: body.id, 
    action: body.action,
    status: approval?.status 
  })
}


