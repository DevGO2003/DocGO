import { NextResponse } from 'next/server'

const roles = [
  {
    id: 'ADMIN',
    name: 'ADMIN',
    description: 'Quản trị viên hệ thống với toàn quyền',
    permissions: [
      'CONTRACT_VIEW', 'CONTRACT_CREATE', 'CONTRACT_EDIT', 'CONTRACT_DELETE', 'CONTRACT_APPROVE', 'CONTRACT_SIGN', 'CONTRACT_VERSION', 'CONTRACT_COMMENT',
      'USER_VIEW', 'USER_CREATE', 'USER_EDIT', 'USER_DELETE', 'USER_ROLE', 'USER_APPROVE',
      'SYSTEM_CONFIG', 'SYSTEM_BACKUP', 'SYSTEM_LOG', 'SYSTEM_MAINTENANCE',
      'REPORT_VIEW', 'REPORT_CREATE', 'REPORT_EXPORT', 'REPORT_SCHEDULE'
    ],
    userCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'MANAGER',
    name: 'MANAGER',
    description: 'Quản lý với quyền hạn cao',
    permissions: [
      'CONTRACT_VIEW', 'CONTRACT_CREATE', 'CONTRACT_EDIT', 'CONTRACT_APPROVE', 'CONTRACT_SIGN', 'CONTRACT_VERSION', 'CONTRACT_COMMENT',
      'USER_VIEW', 'USER_CREATE', 'USER_EDIT', 'USER_ROLE',
      'REPORT_VIEW', 'REPORT_CREATE', 'REPORT_EXPORT'
    ],
    userCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'STAFF',
    name: 'STAFF',
    description: 'Nhân viên với quyền hạn cơ bản',
    permissions: [
      'CONTRACT_VIEW', 'CONTRACT_CREATE', 'CONTRACT_EDIT', 'CONTRACT_COMMENT',
      'USER_VIEW',
      'REPORT_VIEW'
    ],
    userCount: 12,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'USER',
    name: 'USER',
    description: 'Người dùng thông thường',
    permissions: [
      'CONTRACT_VIEW', 'CONTRACT_COMMENT',
      'REPORT_VIEW'
    ],
    userCount: 25,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'VIEWER',
    name: 'VIEWER',
    description: 'Chỉ xem, không có quyền chỉnh sửa',
    permissions: [
      'CONTRACT_VIEW',
      'REPORT_VIEW'
    ],
    userCount: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

export async function GET() {
  return NextResponse.json({ 
    items: roles,
    total: roles.length,
    page: 1,
    pageSize: roles.length
  })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as any
  if (!body || !body.name || !body.description) {
    return NextResponse.json({ ok: false, message: 'Thiếu thông tin vai trò' }, { status: 400 })
  }
  
  const newRole = {
    id: body.name.toUpperCase(),
    name: body.name.toUpperCase(),
    description: body.description,
    permissions: body.permissions || [],
    userCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  roles.push(newRole)
  
  return NextResponse.json({ 
    ok: true, 
    data: newRole 
  })
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({})) as any
  if (!body || !body.id) {
    return NextResponse.json({ ok: false, message: 'Thiếu ID vai trò' }, { status: 400 })
  }
  
  const roleIndex = roles.findIndex(r => r.id === body.id)
  if (roleIndex === -1) {
    return NextResponse.json({ ok: false, message: 'Vai trò không tìm thấy' }, { status: 404 })
  }
  
  const updatedRole = {
    ...roles[roleIndex],
    name: body.name || roles[roleIndex].name,
    description: body.description || roles[roleIndex].description,
    permissions: body.permissions || roles[roleIndex].permissions,
    updatedAt: new Date().toISOString()
  }
  
  roles[roleIndex] = updatedRole
  
  return NextResponse.json({ 
    ok: true, 
    data: updatedRole 
  })
}

export async function DELETE(req: Request) {
  const body = await req.json().catch(() => ({})) as any
  if (!body || !body.id) {
    return NextResponse.json({ ok: false, message: 'Thiếu ID vai trò' }, { status: 400 })
  }
  
  const roleIndex = roles.findIndex(r => r.id === body.id)
  if (roleIndex === -1) {
    return NextResponse.json({ ok: false, message: 'Vai trò không tìm thấy' }, { status: 404 })
  }
  
  // Check if role has users
  if (roles[roleIndex].userCount > 0) {
    return NextResponse.json({ ok: false, message: 'Không thể xóa vai trò đang có người dùng' }, { status: 400 })
  }
  
  roles.splice(roleIndex, 1)
  
  return NextResponse.json({ 
    ok: true, 
    message: 'Vai trò đã được xóa' 
  })
}
