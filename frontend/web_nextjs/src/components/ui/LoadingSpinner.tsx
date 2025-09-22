'use client'

import React from 'react'
import { cn } from '../../lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  text?: string
  className?: string
  showText?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6', 
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
}

const colorClasses = {
  primary: 'border-indigo-600',
  secondary: 'border-gray-600',
  white: 'border-white',
  gray: 'border-gray-400'
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text = 'Đang tải...',
  className,
  showText = true
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300',
          sizeClasses[size],
          colorClasses[color]
        )}
        style={{
          borderTopColor: 'transparent'
        }}
      />
      {showText && text && (
        <p className={cn(
          'mt-2 text-sm font-medium',
          color === 'white' ? 'text-white' : 'text-gray-600'
        )}>
          {text}
        </p>
      )}
    </div>
  )
}

// Loading overlay component
interface LoadingOverlayProps {
  isVisible: boolean
  text?: string
  backdrop?: boolean
  className?: string
}

export function LoadingOverlay({ 
  isVisible, 
  text = 'Đang tải...',
  backdrop = true,
  className 
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      backdrop ? 'bg-black/20 backdrop-blur-sm' : 'bg-transparent',
      className
    )}>
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  )
}

// Inline loading component
interface InlineLoadingProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function InlineLoading({ 
  text = 'Đang tải...', 
  size = 'md',
  className 
}: InlineLoadingProps) {
  return (
    <div className={cn('text-center py-8', className)}>
      <LoadingSpinner size={size} text={text} />
    </div>
  )
}
