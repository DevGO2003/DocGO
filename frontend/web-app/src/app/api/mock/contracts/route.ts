import { NextResponse } from 'next/server'

// Generate mock contracts
function generateContracts(count: number) {
  const statuses = ['DRAFT','PENDING_REVIEW','APPROVED','ACTIVE','EXPIRED','TERMINATED','ARCHIVED'] as const
  const types = ['Service','Sales','Partnership','Employment','NDA','Other'] as const
  const tags = ['priority','urgent','renewal','high_value','new_partner','risk']
  return Array.from({ length: count }).map((_, i) => {
    const id = i + 1
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const contractType = types[Math.floor(Math.random() * types.length)]
    const totalValue = Math.floor(10_000 + Math.random() * 1_000_000)
    const currency = 'USD'
    const createdAt = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
    const updatedAt = new Date(createdAt.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000)
    const effectiveDate = new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000)
    const expiryDate = new Date(effectiveDate.getTime() + 180 * 24 * 60 * 60 * 1000)
    return {
      id,
      title: `Contract #${id} — ${contractType}`,
      description: 'Auto-generated mock contract for UI demo.',
      status,
      contractType,
      tags: tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random()*3)),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      creatorId: Math.floor(1 + Math.random() * 5),
      parties: [
        { name: 'ABC Corp', role: 'Provider' },
        { name: 'XYZ Ltd', role: 'Customer' }
      ],
      totalValue,
      currency,
      effectiveDate: effectiveDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      content: 'Lorem ipsum dolor sit amet...'
    }
  })
}

const DATA = generateContracts(57)

export async function GET(req: Request) {
  const url = new URL(req.url)
  const pageNumber = parseInt(url.searchParams.get('pageNumber') || '0', 10)
  const pageSize = parseInt(url.searchParams.get('pageSize') || '9', 10)
  const searchTerm = (url.searchParams.get('searchTerm') || '').toLowerCase()
  const status = url.searchParams.get('status') || 'ALL'
  const type = url.searchParams.get('type') || 'ALL'
  const tags = (url.searchParams.get('tags') || '').split(',').filter(Boolean)
  const sortBy = url.searchParams.get('sortBy') || 'createdAt'
  const sortDirection = (url.searchParams.get('sortDirection') || 'desc') as 'asc'|'desc'

  let items = DATA.slice()
  if (searchTerm) {
    items = items.filter(c => c.title.toLowerCase().includes(searchTerm) || (c.description||'').toLowerCase().includes(searchTerm))
  }
  if (status !== 'ALL') items = items.filter(c => c.status === status)
  if (type !== 'ALL') items = items.filter(c => c.contractType === type)
  if (tags.length) items = items.filter(c => (c.tags||[]).some((t: string) => tags.includes(t)))

  items.sort((a: any, b: any) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    if (aVal === bVal) return 0
    const cmp = aVal > bVal ? 1 : -1
    return sortDirection === 'asc' ? cmp : -cmp
  })

  const total = items.length
  const start = pageNumber * pageSize
  const paged = items.slice(start, start + pageSize)

  return NextResponse.json({
    apiVersion: 'v1',
    statusCode: 200,
    shortMessage: 'Success',
    description: 'Mock contracts list',
    data: {
      content: paged,
      totalElements: total,
      totalPages: Math.ceil(total / pageSize),
      pageNumber,
      pageSize,
    },
    timestamp: new Date().toISOString(),
    requestId: crypto.randomUUID(),
    path: '/api/mock/contracts'
  })
}

export async function POST() {
  return NextResponse.json({ ok: true })
}



