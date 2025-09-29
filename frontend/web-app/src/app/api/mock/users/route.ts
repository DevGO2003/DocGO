import { NextResponse } from 'next/server'

const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Legal']
const roles = ['ADMIN', 'MANAGER', 'STAFF', 'USER', 'VIEWER'] as const
const statuses = ['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED'] as const

export async function GET() {
  const users = Array.from({ length: 15 }).map((_, i) => {
    const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    const lastLogin = Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null
    
    return {
      id: `U-${1000 + i}`,
      name: `Người dùng ${i + 1}`,
      email: `user${i + 1}@docgo.com`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
      createdAt: createdAt.toISOString(),
      lastLogin: lastLogin?.toISOString(),
      department: departments[i % departments.length],
      permissions: i % 3 === 0 ? ['read', 'write', 'delete'] : i % 2 === 0 ? ['read', 'write'] : ['read']
    }
  })
  
  return NextResponse.json({ 
    items: users,
    total: users.length,
    page: 1,
    pageSize: 15
  })
}


