'use client'

import React, { useState, useRef } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

interface MenuItemAnimationProps {
  children: React.ReactNode
  isLoading?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
  showHoverEffect?: boolean
}

export function MenuItemAnimation({
  children,
  isLoading = false,
  onClick,
  disabled = false,
  className = '',
  showHoverEffect = true
}: MenuItemAnimationProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const rippleRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || isLoading) return

    // Tạo hiệu ứng ripple
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    if (rippleRef.current) {
      rippleRef.current.style.width = rippleRef.current.style.height = size + 'px'
      rippleRef.current.style.left = x + 'px'
      rippleRef.current.style.top = y + 'px'
      rippleRef.current.classList.remove('animate-ripple')
      void rippleRef.current.offsetWidth // Trigger reflow
      rippleRef.current.classList.add('animate-ripple')
    }

    // Gọi onClick sau một chút delay để animation kịp hiển thị
    setTimeout(() => {
      onClick?.()
    }, 150)
  }

  const handleMouseDown = () => {
    if (!disabled && !isLoading) {
      setIsPressed(true)
    }
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const handleMouseLeave = () => {
    setIsPressed(false)
    setIsHovered(false)
  }

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden transition-all duration-200 ease-out
        ${disabled || isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${isPressed ? 'scale-95' : 'scale-100'}
        ${showHoverEffect && isHovered && !disabled && !isLoading ? 'bg-gray-50 shadow-sm' : ''}
        ${className}
      `}
    >
      {/* Ripple Effect */}
      <div
        ref={rippleRef}
        className="absolute pointer-events-none bg-white/30 rounded-full opacity-0 animate-ripple"
        style={{
          transform: 'scale(0)',
          animation: 'ripple 0.6s linear'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center">
        {children}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <LoadingSpinner size="sm" color="gray" />
        </div>
      )}

      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 0.6s linear;
        }
      `}</style>
    </button>
  )
}

// Component cho menu item với animation đặc biệt
export function AnimatedMenuItem({
  icon: Icon,
  label,
  isLoading = false,
  onClick,
  disabled = false,
  isActive = false,
  hasError = false,
  className = ''
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  isLoading?: boolean
  onClick?: () => void
  disabled?: boolean
  isActive?: boolean
  hasError?: boolean
  className?: string
}) {
  return (
    <MenuItemAnimation
      isLoading={isLoading}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-3 py-2 text-left rounded-md text-sm font-medium
        ${isActive 
          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
          : 'text-gray-700 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      <div className="flex items-center relative">
        {isLoading ? (
          <div className="h-5 w-5 flex items-center justify-center">
            <LoadingSpinner size="sm" color="gray" />
          </div>
        ) : (
          <Icon className="h-5 w-5" />
        )}
        {hasError && !isLoading && (
          <span 
            className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"
            title="Trang này có lỗi cần sửa"
          />
        )}
        <span className="ml-3">{label}</span>
      </div>
    </MenuItemAnimation>
  )
}

