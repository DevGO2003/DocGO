'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { LoadingSpinner, ProgressSpinner } from './LoadingSpinner'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentPath, setCurrentPath] = useState('')
  const pathname = usePathname()
  const contentRef = useRef<HTMLDivElement>(null)
  const loadingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Nếu đây là lần đầu load (currentPath rỗng)
    if (!currentPath) {
      setCurrentPath(pathname || '')
      return
    }

    // Nếu pathname thay đổi
    if (pathname !== currentPath) {
      // Bắt đầu loading animation
      setIsLoading(true)
      
      // Clear timeout cũ nếu có
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }

      // Giả lập thời gian loading (có thể điều chỉnh)
      loadingTimeoutRef.current = setTimeout(() => {
        setCurrentPath(pathname || '')
        setIsLoading(false)
      }, 800) // 800ms để tạo cảm giác mượt mà
    }

    // Cleanup timeout khi component unmount
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [pathname, currentPath])

  return (
    <div className="relative min-h-screen">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            {/* Spinner */}
            <div className="relative">
              <LoadingSpinner size="lg" color="primary" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-primary-400 opacity-20"></div>
            </div>
            
            {/* Loading Text */}
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">Đang tải trang...</p>
              <p className="text-sm text-gray-500 mt-1">Vui lòng chờ trong giây lát</p>
            </div>
            
            {/* Progress Bar */}
            <ProgressSpinner className="w-64" />
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        ref={contentRef}
        className={`transition-all duration-500 ease-in-out ${
          isLoading 
            ? 'opacity-30 scale-95 blur-sm' 
            : 'opacity-100 scale-100 blur-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

// Hook để kiểm soát loading state từ bên ngoài
export function usePageLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Đang tải...')

  const startLoading = (message = 'Đang tải...') => {
    setLoadingMessage(message)
    setIsLoading(true)
  }

  const stopLoading = () => {
    setIsLoading(false)
  }

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading
  }
}

// Component Loading Overlay độc lập
export function LoadingOverlay({ 
  isLoading, 
  message = 'Đang tải...',
  showProgress = true 
}: {
  isLoading: boolean
  message?: string
  showProgress?: boolean
}) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Spinner */}
        <div className="relative">
          <LoadingSpinner size="lg" color="primary" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-primary-400 opacity-20"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">{message}</p>
          <p className="text-sm text-gray-500 mt-1">Vui lòng chờ trong giây lát</p>
        </div>
        
        {/* Progress Bar */}
        {showProgress && (
          <ProgressSpinner className="w-64" />
        )}
      </div>
    </div>
  )
}