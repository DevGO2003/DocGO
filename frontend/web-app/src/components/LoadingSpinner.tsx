'use client'

import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'gray' | 'white'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-6 h-6'
  }

  const colorClasses = {
    primary: 'border-gray-300 border-t-primary-600',
    gray: 'border-gray-300 border-t-gray-600',
    white: 'border-gray-400 border-t-white'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-2 rounded-full animate-spin ${colorClasses[color]}`}
      />
    </div>
  )
}

// Spinner với hiệu ứng pulse
export function PulseSpinner({ 
  size = 'md',
  className = '' 
}: Omit<LoadingSpinnerProps, 'color'>) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-pulse`} />
    </div>
  )
}

// Spinner với hiệu ứng bounce
export function BounceSpinner({ 
  size = 'md',
  className = '' 
}: Omit<LoadingSpinnerProps, 'color'>) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-6 h-6'
  }

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
      <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
      <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
    </div>
  )
}

// Spinner với hiệu ứng dots
export function DotsSpinner({ 
  size = 'md',
  className = '' 
}: Omit<LoadingSpinnerProps, 'color'>) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-pulse`} style={{ animationDelay: '0ms' }} />
      <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-pulse`} style={{ animationDelay: '200ms' }} />
      <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-pulse`} style={{ animationDelay: '400ms' }} />
    </div>
  )
}

// Spinner với progress bar
export function ProgressSpinner({ 
  progress = 0,
  className = '' 
}: {
  progress?: number
  className?: string
}) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}

