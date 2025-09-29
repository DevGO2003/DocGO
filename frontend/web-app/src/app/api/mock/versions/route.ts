import { NextResponse } from 'next/server'

const contracts = [
  'Hợp đồng lao động - ABC Corp',
  'Hợp đồng cung cấp dịch vụ - XYZ Ltd',
  'Hợp đồng mua bán - Tech Solutions',
  'Hợp đồng thuê nhà - Global Inc',
  'Hợp đồng bảo hiểm - Startup Co'
]

const users = [
  { id: 'U-001', name: 'Nguyễn Văn A', email: 'nguyenvana@docgo.com' },
  { id: 'U-002', name: 'Trần Thị B', email: 'tranthib@docgo.com' },
  { id: 'U-003', name: 'Lê Văn C', email: 'levanc@docgo.com' },
  { id: 'U-004', name: 'Phạm Thị D', email: 'phamthid@docgo.com' },
  { id: 'U-005', name: 'Hoàng Văn E', email: 'hoangvane@docgo.com' }
]

const changeDescriptions = [
  'Cập nhật điều khoản thanh toán',
  'Thêm điều khoản bảo mật thông tin',
  'Sửa đổi thời hạn hợp đồng',
  'Bổ sung điều khoản chấm dứt hợp đồng',
  'Cập nhật thông tin các bên',
  'Thêm điều khoản gia hạn',
  'Sửa đổi mức phạt vi phạm',
  'Bổ sung điều khoản bảo hiểm',
  'Cập nhật địa chỉ và thông tin liên hệ',
  'Thêm điều khoản giải quyết tranh chấp'
]

const versions: any[] = Array.from({ length: 20 }).map((_, i) => {
  const createdAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
  const approvedAt = Math.random() > 0.3 ? new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null
  const rejectedAt = Math.random() > 0.8 ? new Date(createdAt.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000) : null
  
  const statuses = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ACTIVE', 'ARCHIVED'] as const
  let status: typeof statuses[number] = 'DRAFT'
  
  if (rejectedAt) status = 'REJECTED'
  else if (approvedAt) status = Math.random() > 0.5 ? 'APPROVED' : 'ACTIVE'
  else if (Math.random() > 0.4) status = 'PENDING_APPROVAL'
  else if (Math.random() > 0.8) status = 'ARCHIVED'
  
  const contract = contracts[i % contracts.length]
  const contractId = `HD-${1000 + (i % 5)}`
  const version = `${Math.floor(i / 5) + 1}.${(i % 5) + 1}`
  const createdBy = users[i % users.length]
  const approver = users[(i + 1) % users.length]
  const rejecter = users[(i + 2) % users.length]
  
  return {
    id: `V-${1000 + i}`,
    contractId,
    contractTitle: contract,
    version,
    status,
    changes: changeDescriptions[i % changeDescriptions.length],
    createdBy,
    createdAt: createdAt.toISOString(),
    approvedBy: approvedAt ? approver : undefined,
    approvedAt: approvedAt?.toISOString(),
    rejectedBy: rejectedAt ? rejecter : undefined,
    rejectedAt: rejectedAt?.toISOString(),
    rejectionReason: rejectedAt ? 'Cần bổ sung thêm thông tin' : undefined,
    previousVersionId: i > 0 ? `V-${1000 + i - 1}` : undefined,
    content: {
      title: contract,
      contractType: 'Hợp đồng lao động',
      object: 'Cung cấp dịch vụ lao động',
      effectiveDate: new Date().toISOString().split('T')[0],
      term: '12 tháng',
      paymentDetails: {
        totalValue: Math.floor(Math.random() * 1000000000) + 100000000,
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
        },
        {
          name: 'Công ty XYZ',
          role: 'Bên B',
          representative: 'Trần Thị B',
          taxCode: '9876543210',
          contact: '0987654321',
          address: '456 Đường XYZ, Quận 2, TP.HCM'
        }
      ]
    }
  }
})

export async function GET() {
  return NextResponse.json({ 
    items: versions,
    total: versions.length,
    page: 1,
    pageSize: 20
  })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as any
  if (!body || !body.action) return NextResponse.json({ ok: false }, { status: 400 })
  
  if (body.action === 'create') {
    const contractId = body.contractId
    const contract = contracts.find(c => c.includes(contractId)) || contracts[0]
    const latestVersion = versions
      .filter(v => v.contractId === contractId)
      .sort((a, b) => parseFloat(b.version) - parseFloat(a.version))[0]
    
    const newVersion = parseFloat(latestVersion?.version || '0') + 0.1
    const createdBy = users[Math.floor(Math.random() * users.length)]
    
    const newVersionData = {
      id: `V-${Date.now()}`,
      contractId,
      contractTitle: contract,
      version: newVersion.toFixed(1),
      status: 'DRAFT',
      changes: 'Tạo phiên bản mới',
      createdBy,
      createdAt: new Date().toISOString(),
      previousVersionId: latestVersion?.id,
      content: latestVersion?.content || {}
    }
    
    versions.unshift(newVersionData)
    
    return NextResponse.json({ 
      ok: true, 
      data: newVersionData 
    })
  }
  
  const version = versions.find(v => v.id === body.id)
  if (!version) return NextResponse.json({ ok: false }, { status: 404 })
  
  if (body.action === 'approve') {
    version.status = 'APPROVED'
    version.approvedAt = new Date().toISOString()
    version.approvedBy = { id: 'current-user', name: 'Người dùng hiện tại' }
  } else if (body.action === 'reject') {
    version.status = 'REJECTED'
    version.rejectedAt = new Date().toISOString()
    version.rejectedBy = { id: 'current-user', name: 'Người dùng hiện tại' }
    version.rejectionReason = body.reason || 'Không đạt yêu cầu'
  }
  
  return NextResponse.json({ 
    ok: true, 
    id: body.id, 
    action: body.action,
    status: version.status 
  })
}
