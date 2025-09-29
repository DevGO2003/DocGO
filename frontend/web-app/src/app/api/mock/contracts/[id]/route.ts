import { NextResponse } from 'next/server'

export async function GET(_req: Request, context: { params: { id: string } }) {
  const id = Number(context.params.id)
  if (!Number.isFinite(id)) return NextResponse.json({ ok: false }, { status: 400 })

  // Synthesize a single item similar to list
  const statuses = ['DRAFT','PENDING_REVIEW','APPROVED','ACTIVE','EXPIRED','TERMINATED','ARCHIVED'] as const
  const types = ['Service','Sales','Partnership','Employment','NDA','Other'] as const
  const tags = ['priority','urgent','renewal','high_value','new_partner','risk']
  const status = statuses[id % statuses.length]
  const contractType = types[id % types.length]
  const totalValue = 10000 + id * 123
  const currency = 'USD'
  const today = new Date()
  const effectiveDate = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)
  const expiryDate = new Date(today.getTime() + 170 * 24 * 60 * 60 * 1000)

  const data = {
    id,
    title: `Contract #${id} — ${contractType}`,
    description: 'Detailed mock contract',
    status,
    contractType,
    tags: tags.slice(0, 3),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creatorId: 1,
    parties: [
      { name: 'ABC Corp', role: 'Provider', representative: 'John Doe', taxCode: 'TAX-001', contact: 'john@abc.com', address: '123 Main St' },
      { name: 'XYZ Ltd', role: 'Customer', representative: 'Jane Smith', taxCode: 'TAX-002', contact: 'jane@xyz.com', address: '456 Second St' }
    ],
    totalValue,
    currency,
    effectiveDate: effectiveDate.toISOString().split('T')[0],
    expiryDate: expiryDate.toISOString().split('T')[0],
    content: 'Lorem ipsum dolor sit amet... Detailed content here.',
    keyClauses: [
      { name: 'Payment Terms', description: 'Net 30 days' },
      { name: 'Confidentiality', description: 'NDA applies' }
    ],
    unfavorableClauses: [
      { clauseName: 'Late Fee', description: '2% per month' }
    ],
    reminders: [
      { type: 'Renewal', date: expiryDate.toISOString().split('T')[0], content: 'Renew 30 days before expiry' }
    ],
    riskAssessment: { riskLevel: 'LOW', riskFactors: [], mitigationMeasures: [] },
    complianceStatus: { status: 'COMPLIANT', issues: [], recommendations: [] },
    paymentDetails: { totalValue, currency, schedule: 'Monthly', paymentMethod: 'Bank transfer' }
  }

  return NextResponse.json({
    apiVersion: 'v1',
    statusCode: 200,
    shortMessage: 'Success',
    description: 'Mock contract detail',
    data,
    timestamp: new Date().toISOString(),
    requestId: crypto.randomUUID(),
    path: `/api/mock/contracts/${id}`
  })
}



