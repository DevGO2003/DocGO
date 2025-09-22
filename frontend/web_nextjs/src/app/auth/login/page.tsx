'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { InlineLoading } from '@/components/ui/LoadingSpinner'

export default function AuthLoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the correct login URL
    router.replace('/login')
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <InlineLoading text="Đang chuyển hướng..." size="md" />
    </div>
  )
}
