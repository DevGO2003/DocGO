'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoadingContextType {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Listen for route changes
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    // Add event listeners for navigation
    if (typeof window !== 'undefined') {
      // Listen for popstate (back/forward buttons)
      window.addEventListener('popstate', handleComplete)
      
      // Listen for beforeunload (page refresh/close)
      window.addEventListener('beforeunload', handleComplete)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handleComplete)
        window.removeEventListener('beforeunload', handleComplete)
      }
    }
  }, [])

  // Update browser tab title when loading
  useEffect(() => {
    if (typeof window === 'undefined') return

    const originalTitle = document.title
    let loadingDots = 0

    if (isLoading) {
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
  }, [isLoading])

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
      {/* Global overlay disabled to avoid duplicate loading UI. */}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
