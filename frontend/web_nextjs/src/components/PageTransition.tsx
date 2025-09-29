'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Show loading when route changes
    setIsTransitioning(true)
    
    // Hide loading after a short delay (simulating compilation time)
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname])

  // Update browser tab title during transition
  useEffect(() => {
    if (typeof window === 'undefined') return

    const originalTitle = document.title
    let loadingDots = 0

    if (isTransitioning) {
      const interval = setInterval(() => {
        loadingDots = (loadingDots + 1) % 4
        const dots = '.'.repeat(loadingDots)
        document.title = `Đang tải${dots} - DocGO`
      }, 500)

      return () => {
        clearInterval(interval)
        document.title = originalTitle
      }
    } else {
      document.title = originalTitle
    }
  }, [isTransitioning])

  return (
    <>
      {children}
      {/* Removed visual overlay to avoid duplicate loading UI. Title update remains. */}
    </>
  )
}
