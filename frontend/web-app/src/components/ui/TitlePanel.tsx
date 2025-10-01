'use client'

import React from 'react'

export interface TitlePanelProps {
  title: React.ReactNode
  description: React.ReactNode
  icon?: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info'
  actionButton?: React.ReactNode
  className?: string
}

const variantStyles = {
  primary: {
    container: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100',
    title: 'text-blue-900',
    description: 'text-blue-700'
  },
  secondary: {
    container: 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100',
    title: 'text-gray-900',
    description: 'text-gray-700'
  },
  success: {
    container: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100',
    title: 'text-green-900',
    description: 'text-green-700'
  },
  warning: {
    container: 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-100',
    title: 'text-orange-900',
    description: 'text-orange-700'
  },
  info: {
    container: 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-100',
    title: 'text-purple-900',
    description: 'text-purple-700'
  }
}

const defaultIcons = {
  primary: '📊',
  secondary: '📄',
  success: '✅',
  warning: '⚠️',
  info: 'ℹ️'
}

export default function TitlePanel({
  title,
  description,
  icon,
  variant = 'primary',
  actionButton,
  className = ''
}: TitlePanelProps) {
  const styles = variantStyles[variant]
  const displayIcon = icon || defaultIcons[variant]

  return (
    <div className={`rounded-2xl p-5 border shadow-sm ring-1 ring-black/[0.03] ${styles.container} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className={`text-2xl font-bold tracking-tight mb-1 ${styles.title}`}>
            <span className="align-middle mr-2">{displayIcon}</span>
            <span className="align-middle">{title}</span>
          </h1>
          <p className={`text-sm leading-relaxed ${styles.description}`}>
            {description}
          </p>
        </div>
        {actionButton && (
          <div className="ml-4 flex-shrink-0">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  )
}
