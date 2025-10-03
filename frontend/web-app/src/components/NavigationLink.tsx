'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLoading } from './LoadingProvider'

interface NavigationLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function NavigationLink({ href, children, className, onClick }: NavigationLinkProps) {
  // Removed setLoading to avoid duplicate loading with PageTransition
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}

// Hook for programmatic navigation with loading
export function useNavigationWithLoading() {
  const { setLoading } = useLoading()
  const router = useRouter()

  const navigate = (href: string) => {
    setLoading(true)
    router.push(href)
  }

  return { navigate }
}
