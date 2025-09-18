import { NextResponse } from 'next/server'

const contracts = [
  'Hợp đồng lao động - ABC Corp',
  'Hợp đồng cung cấp dịch vụ - XYZ Ltd',
  'Hợp đồng mua bán - Tech Solutions',
  'Hợp đồng thuê nhà - Global Inc',
  'Hợp đồng bảo hiểm - Startup Co'
]

const users = [
  { id: 'U-001', name: 'Nguyễn Văn A', email: 'nguyenvana@docgo.com', role: 'Trưởng phòng' },
  { id: 'U-002', name: 'Trần Thị B', email: 'tranthib@docgo.com', role: 'Giám đốc' },
  { id: 'U-003', name: 'Lê Văn C', email: 'levanc@docgo.com', role: 'Phó giám đốc' },
  { id: 'U-004', name: 'Phạm Thị D', email: 'phamthid@docgo.com', role: 'Kế toán trưởng' },
  { id: 'U-005', name: 'Hoàng Văn E', email: 'hoangvane@docgo.com', role: 'Luật sư' }
]

const stepTemplates = [
  { name: 'Phê duyệt cấp phòng ban', role: 'Trưởng phòng', minValue: 0, maxValue: 100000000 },
  { name: 'Phê duyệt cấp kế toán', role: 'Kế toán trưởng', minValue: 50000000, maxValue: 500000000 },
  { name: 'Phê duyệt cấp phó giám đốc', role: 'Phó giám đốc', minValue: 200000000, maxValue: 1000000000 },
  { name: 'Phê duyệt cấp giám đốc', role: 'Giám đốc', minValue: 500000000, maxValue: Infinity },
  { name: 'Phê duyệt pháp lý', role: 'Luật sư', minValue: 100000000, maxValue: Infinity }
]

const flows: any[] = Array.from({ length: 15 }).map((_, i) => {
  const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  const completedAt = Math.random() > 0.6 ? new Date(createdAt.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000) : null
  const rejectedAt = Math.random() > 0.8 ? new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null
  
  const statuses = ['PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'CANCELLED'] as const
  let status: typeof statuses[number] = 'PENDING'
  
  if (rejectedAt) status = 'REJECTED'
  else if (completedAt) status = 'APPROVED'
  else if (Math.random() > 0.3) status = 'IN_PROGRESS'
  else if (Math.random() > 0.9) status = 'CANCELLED'
  
  const contract = contracts[i % contracts.length]
  const contractId = `HD-${1000 + (i % 5)}`
  const contractValue = Math.floor(Math.random() * 1000000000) + 10000000
  const currency = 'VND'
  const createdBy = users[i % users.length]
  
  // Determine which steps are needed based on contract value
  const requiredSteps = stepTemplates.filter(step => 
    contractValue >= step.minValue && contractValue <= step.maxValue
  )
  
  const totalSteps = requiredSteps.length
  const currentStep = status === 'APPROVED' ? totalSteps : 
                     status === 'REJECTED' ? Math.floor(Math.random() * totalSteps) + 1 :
                     status === 'IN_PROGRESS' ? Math.floor(Math.random() * totalSteps) + 1 : 0
  
  const steps = requiredSteps.map((stepTemplate, index) => {
    const stepNumber = index + 1
    const approver = users.find(u => u.role === stepTemplate.role) || users[0]
    
    let stepStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED' = 'PENDING'
    if (stepNumber < currentStep) stepStatus = 'APPROVED'
    else if (stepNumber === currentStep && status === 'REJECTED') stepStatus = 'REJECTED'
    else if (stepNumber > currentStep) stepStatus = 'PENDING'
    
    const approvedAt = stepStatus === 'APPROVED' ? 
      new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null
    const rejectedAt = stepStatus === 'REJECTED' ? 
      new Date(createdAt.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000) : null
    
    return {
      id: `S-${1000 + i}-${stepNumber}`,
      stepNumber,
      stepName: stepTemplate.name,
      approver,
      status: stepStatus,
      approvedAt: approvedAt?.toISOString(),
      rejectedAt: rejectedAt?.toISOString(),
      comments: stepStatus === 'APPROVED' ? 'Đã phê duyệt' : undefined,
      required: true,
      minValue: stepTemplate.minValue,
      maxValue: stepTemplate.maxValue
    }
  })
  
  return {
    id: `F-${1000 + i}`,
    contractId,
    contractTitle: contract,
    contractValue,
    currency,
    status,
    currentStep,
    totalSteps,
    steps,
    createdBy,
    createdAt: createdAt.toISOString(),
    completedAt: completedAt?.toISOString(),
    rejectedAt: rejectedAt?.toISOString(),
    rejectedBy: rejectedAt ? users[(i + 1) % users.length] : undefined,
    rejectionReason: rejectedAt ? 'Không đạt yêu cầu về mặt pháp lý' : undefined
  }
})

export async function GET() {
  return NextResponse.json({ 
    items: flows,
    total: flows.length,
    page: 1,
    pageSize: 15
  })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as any
  if (!body || !body.action) return NextResponse.json({ ok: false }, { status: 400 })
  
  if (body.action === 'create') {
    const contractId = body.contractId
    const contractValue = body.contractValue || 0
    const currency = body.currency || 'VND'
    const contract = contracts.find(c => c.includes(contractId)) || contracts[0]
    const createdBy = users[Math.floor(Math.random() * users.length)]
    
    // Determine which steps are needed based on contract value
    const requiredSteps = stepTemplates.filter(step => 
      contractValue >= step.minValue && contractValue <= step.maxValue
    )
    
    const steps = requiredSteps.map((stepTemplate, index) => {
      const approver = users.find(u => u.role === stepTemplate.role) || users[0]
      return {
        id: `S-${Date.now()}-${index + 1}`,
        stepNumber: index + 1,
        stepName: stepTemplate.name,
        approver,
        status: 'PENDING' as const,
        required: true,
        minValue: stepTemplate.minValue,
        maxValue: stepTemplate.maxValue
      }
    })
    
    const newFlow = {
      id: `F-${Date.now()}`,
      contractId,
      contractTitle: contract,
      contractValue,
      currency,
      status: 'PENDING' as const,
      currentStep: 0,
      totalSteps: steps.length,
      steps,
      createdBy,
      createdAt: new Date().toISOString()
    }
    
    flows.unshift(newFlow)
    
    return NextResponse.json({ 
      ok: true, 
      data: newFlow 
    })
  }
  
  const flow = flows.find(f => f.id === body.flowId)
  if (!flow) return NextResponse.json({ ok: false }, { status: 404 })
  
  if (body.action === 'approve') {
    const step = flow.steps.find((s: any) => s.id === body.stepId)
    if (step) {
      step.status = 'APPROVED'
      step.approvedAt = new Date().toISOString()
      step.comments = body.comments || 'Đã phê duyệt'
      
      // Move to next step
      const currentStepIndex = flow.steps.findIndex((s: any) => s.id === body.stepId)
      if (currentStepIndex < flow.steps.length - 1) {
        flow.currentStep = currentStepIndex + 2
        flow.status = 'IN_PROGRESS'
      } else {
        flow.currentStep = flow.totalSteps
        flow.status = 'APPROVED'
        flow.completedAt = new Date().toISOString()
      }
    }
  } else if (body.action === 'reject') {
    const step = flow.steps.find((s: any) => s.id === body.stepId)
    if (step) {
      step.status = 'REJECTED'
      step.rejectedAt = new Date().toISOString()
      step.comments = body.reason || 'Bị từ chối'
      
      flow.status = 'REJECTED'
      flow.rejectedAt = new Date().toISOString()
      flow.rejectedBy = { id: 'current-user', name: 'Người dùng hiện tại' }
      flow.rejectionReason = body.reason || 'Không đạt yêu cầu'
    }
  } else if (body.action === 'cancel') {
    flow.status = 'CANCELLED'
  }
  
  return NextResponse.json({ 
    ok: true, 
    data: flow 
  })
}
