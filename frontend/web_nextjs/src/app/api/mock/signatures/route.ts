import { NextResponse } from 'next/server'

const companies = ['ABC Corp', 'XYZ Ltd', 'Tech Solutions', 'Global Inc', 'Startup Co', 'Enterprise Ltd']
const roles = ['Giám đốc', 'Trưởng phòng', 'Nhân viên', 'Kế toán', 'Luật sư', 'Quản lý']

const signatureRequests: any[] = Array.from({ length: 10 }).map((_, i) => {
  const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  const sentAt = Math.random() > 0.3 ? new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null
  const completedAt = Math.random() > 0.7 ? new Date((sentAt || createdAt).getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000) : null
  
  const statuses = ['DRAFT', 'SENT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const
  let status: typeof statuses[number] = 'DRAFT'
  
  if (completedAt) status = 'COMPLETED'
  else if (sentAt) status = Math.random() > 0.5 ? 'IN_PROGRESS' : 'SENT'
  else if (Math.random() > 0.8) status = 'CANCELLED'
  
  const signerCount = Math.floor(Math.random() * 3) + 2 // 2-4 signers
  const signers = Array.from({ length: signerCount }).map((_, j) => {
    const signerStatuses = ['PENDING', 'SIGNED', 'DECLINED', 'EXPIRED'] as const
    let signerStatus: typeof signerStatuses[number] = 'PENDING'
    
    if (status === 'COMPLETED') {
      signerStatus = Math.random() > 0.1 ? 'SIGNED' : 'DECLINED'
    } else if (status === 'IN_PROGRESS') {
      signerStatus = j === 0 ? 'SIGNED' : Math.random() > 0.3 ? 'SIGNED' : 'PENDING'
    } else if (status === 'CANCELLED') {
      signerStatus = 'EXPIRED'
    }
    
    const signedAt = signerStatus === 'SIGNED' ? new Date((sentAt || createdAt).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null
    const declinedAt = signerStatus === 'DECLINED' ? new Date((sentAt || createdAt).getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000) : null
    
    return {
      id: `S-${1000 + i}-${j}`,
      name: `Người ký ${j + 1}`,
      email: `signer${j + 1}@${companies[i % companies.length].toLowerCase().replace(' ', '')}.com`,
      role: roles[j % roles.length],
      status: signerStatus,
      signedAt: signedAt?.toISOString(),
      declinedAt: declinedAt?.toISOString(),
      declinedReason: signerStatus === 'DECLINED' ? 'Không đồng ý với điều khoản' : undefined,
      order: j + 1
    }
  })
  
  return {
    id: `SR-${1000 + i}`,
    contractId: `HD-${1000 + i}`,
    contractTitle: `Hợp đồng ${i % 2 === 0 ? 'lao động' : i % 3 === 0 ? 'cung cấp dịch vụ' : 'mua bán'} - ${companies[i % companies.length]}`,
    signers,
    status,
    createdAt: createdAt.toISOString(),
    sentAt: sentAt?.toISOString(),
    completedAt: completedAt?.toISOString(),
    expiresAt: sentAt ? new Date(sentAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    message: i % 3 === 0 ? 'Vui lòng ký hợp đồng này để hoàn tất thủ tục.' : undefined
  }
})

export async function GET() {
  return NextResponse.json({ 
    items: signatureRequests,
    total: signatureRequests.length,
    page: 1,
    pageSize: 10
  })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as any
  if (!body || !body.id || !body.action) return NextResponse.json({ ok: false }, { status: 400 })
  
  const request = signatureRequests.find(r => r.id === body.id)
  if (!request) return NextResponse.json({ ok: false }, { status: 404 })
  
  if (body.action === 'send') {
    request.status = 'SENT'
    request.sentAt = new Date().toISOString()
    request.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  } else if (body.action === 'cancel') {
    request.status = 'CANCELLED'
    // Update all signers to expired
    request.signers.forEach((signer: any) => {
      if (signer.status === 'PENDING') {
        signer.status = 'EXPIRED'
      }
    })
  }
  
  return NextResponse.json({ 
    ok: true, 
    id: body.id, 
    action: body.action,
    status: request.status 
  })
}
