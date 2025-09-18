export async function POST(req: Request) {
  const url = new URL(req.url)
  const action = url.searchParams.get('action') || 'login'
  const body = await req.json().catch(() => ({})) as any

  const now = new Date().toISOString()

  const users = [
    { id: 'u1', email: 'admin@docgo.local', name: 'Admin', role: 'ADMIN', status: 'APPROVED' },
    { id: 'u2', email: 'manager@docgo.local', name: 'Manager', role: 'MANAGER', status: 'APPROVED' },
    { id: 'u3', email: 'staff@docgo.local', name: 'Staff', role: 'STAFF', status: 'APPROVED' },
    { id: 'u4', email: 'pending@docgo.local', name: 'Pending', role: 'STAFF', status: 'PENDING' },
  ]

  if (action === 'login') {
    const email = body?.email as string | undefined
    // Cho phép đăng nhập với bất kỳ email nào; nếu không tồn tại trong danh sách mặc định, tạo user mock mới (PENDING)
    let user = users.find(u => u.email === email)
    if (!user && email) {
      const localPart = email.split('@')[0] || 'User'
      user = { id: crypto.randomUUID(), email, name: localPart, role: 'STAFF', status: 'PENDING' }
    }
    if (!user) {
      return new Response(JSON.stringify({
        apiVersion: 'v1', statusCode: 400, shortMessage: 'Bad Request', description: 'Thiếu email đăng nhập', data: null, timestamp: now, requestId: crypto.randomUUID(), path: '/api/mock/auth?action=login'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    return new Response(JSON.stringify({
      apiVersion: 'v1', statusCode: 200, shortMessage: 'Success', description: 'Đăng nhập thành công', data: { token: 'mock-token', user }, timestamp: now, requestId: crypto.randomUUID(), path: '/api/mock/auth?action=login'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  if (action === 'register') {
    const newUser = { id: crypto.randomUUID(), email: body?.email, name: body?.name || body?.email, role: 'STAFF', status: 'PENDING' }
    return new Response(JSON.stringify({
      apiVersion: 'v1', statusCode: 201, shortMessage: 'Created', description: 'Đăng ký thành công, chờ phê duyệt', data: { user: newUser }, timestamp: now, requestId: crypto.randomUUID(), path: '/api/mock/auth?action=register'
    }), { status: 201, headers: { 'Content-Type': 'application/json' } })
  }

  if (action === 'logout') {
    return new Response(JSON.stringify({
      apiVersion: 'v1', statusCode: 200, shortMessage: 'Success', description: 'Đăng xuất thành công', data: null, timestamp: now, requestId: crypto.randomUUID(), path: '/api/mock/auth?action=logout'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  return new Response(JSON.stringify({
    apiVersion: 'v1', statusCode: 400, shortMessage: 'Bad Request', description: 'Hành động không hợp lệ', data: null, timestamp: now, requestId: crypto.randomUUID(), path: '/api/mock/auth'
  }), { status: 400, headers: { 'Content-Type': 'application/json' } })
}

export async function GET() {
  const now = new Date().toISOString()
  // Giả lập lấy user hiện tại từ token (mock)
  const current = { id: 'u1', email: 'admin@docgo.local', name: 'Admin', role: 'ADMIN', status: 'APPROVED' }
  return new Response(JSON.stringify({
    apiVersion: 'v1', statusCode: 200, shortMessage: 'Success', description: 'Thông tin người dùng hiện tại', data: { user: current }, timestamp: now, requestId: crypto.randomUUID(), path: '/api/mock/auth'
  }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}


