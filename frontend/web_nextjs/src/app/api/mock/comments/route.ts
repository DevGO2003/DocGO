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

const commentTemplates = [
  {
    content: 'Điều khoản này cần được làm rõ thêm về trách nhiệm của các bên.',
    highlightedText: 'Trách nhiệm của các bên trong việc thực hiện hợp đồng'
  },
  {
    content: 'Tôi nghĩ nên thêm điều khoản về việc gia hạn hợp đồng.',
    highlightedText: 'Thời hạn hợp đồng là 12 tháng'
  },
  {
    content: 'Điều kiện thanh toán này có vẻ không hợp lý, cần xem xét lại.',
    highlightedText: 'Thanh toán 100% trước khi giao hàng'
  },
  {
    content: 'Cần bổ sung thêm điều khoản về bảo mật thông tin.',
    highlightedText: 'Các bên cam kết bảo mật thông tin'
  },
  {
    content: 'Điều khoản chấm dứt hợp đồng cần được chi tiết hóa.',
    highlightedText: 'Hợp đồng có thể chấm dứt trong các trường hợp sau'
  }
]

const comments: any[] = Array.from({ length: 15 }).map((_, i) => {
  const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  const updatedAt = Math.random() > 0.7 ? new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null
  const resolvedAt = Math.random() > 0.6 ? new Date(createdAt.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000) : null
  
  const statuses = ['ACTIVE', 'RESOLVED', 'ARCHIVED'] as const
  let status: typeof statuses[number] = 'ACTIVE'
  
  if (resolvedAt) status = 'RESOLVED'
  else if (Math.random() > 0.8) status = 'ARCHIVED'
  
  const author = users[i % users.length]
  const template = commentTemplates[i % commentTemplates.length]
  const contract = contracts[i % contracts.length]
  
  const hasReplies = Math.random() > 0.5
  const replies = hasReplies ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, j) => {
    const replyAuthor = users[(i + j + 1) % users.length]
    const replyCreatedAt = new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
    
    return {
      id: `R-${1000 + i}-${j}`,
      author: replyAuthor,
      content: `Phản hồi ${j + 1}: Tôi đồng ý với ý kiến này. Cần xem xét kỹ hơn.`,
      createdAt: replyCreatedAt.toISOString(),
      updatedAt: null
    }
  }) : []
  
  const hasMentions = Math.random() > 0.6
  const mentions = hasMentions ? [users[(i + 1) % users.length].name, users[(i + 2) % users.length].name] : []
  
  return {
    id: `C-${1000 + i}`,
    contractId: `HD-${1000 + i}`,
    contractTitle: contract,
    author,
    content: template.content,
    highlightedText: template.highlightedText,
    position: {
      page: Math.floor(Math.random() * 5) + 1,
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100)
    },
    status,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt?.toISOString(),
    resolvedAt: resolvedAt?.toISOString(),
    resolvedBy: resolvedAt ? users[(i + 1) % users.length] : undefined,
    replies,
    mentions
  }
})

export async function GET() {
  return NextResponse.json({ 
    items: comments,
    total: comments.length,
    page: 1,
    pageSize: 15
  })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as any
  if (!body || !body.id || !body.action) return NextResponse.json({ ok: false }, { status: 400 })
  
  const comment = comments.find(c => c.id === body.id)
  if (!comment) return NextResponse.json({ ok: false }, { status: 404 })
  
  if (body.action === 'resolve') {
    comment.status = 'RESOLVED'
    comment.resolvedAt = new Date().toISOString()
    comment.resolvedBy = { id: 'current-user', name: 'Người dùng hiện tại' }
  } else if (body.action === 'archive') {
    comment.status = 'ARCHIVED'
  } else if (body.action === 'delete') {
    const index = comments.findIndex(c => c.id === body.id)
    if (index > -1) {
      comments.splice(index, 1)
    }
  }
  
  return NextResponse.json({ 
    ok: true, 
    id: body.id, 
    action: body.action,
    status: comment?.status 
  })
}
