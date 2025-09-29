'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function usePageLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Set loading to true when route changes
    setIsLoading(true)
    
    // Simulate loading time (adjust based on your app's performance)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100) // Short delay to show loading state

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return isLoading
}

// Custom hook for showing browser tab loading
export function useBrowserLoading() {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Create loading indicator in browser tab
    const originalTitle = document.title
    let loadingDots = 0

    const updateTitle = () => {
      if (isLoading) {
        loadingDots = (loadingDots + 1) % 4
        const dots = '.'.repeat(loadingDots)
        document.title = `Đang tải${dots} - DocGO`
      } else {
        document.title = originalTitle
      }
    }

    if (isLoading) {
      const interval = setInterval(updateTitle, 500)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  return { isLoading, setIsLoading }
}
