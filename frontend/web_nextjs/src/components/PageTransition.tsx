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
      {/* Transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 pointer-events-none">
          <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span className="text-sm text-gray-700">Đang tải trang...</span>
          </div>
        </div>
      )}
    </>
  )
}
