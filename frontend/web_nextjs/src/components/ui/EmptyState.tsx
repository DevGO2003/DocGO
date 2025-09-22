'use client'

import React from 'react'
import { cn } from '../../lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      {icon && (
        <div className="mx-auto w-16 h-16 text-gray-300 mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  )
}

// Specific empty state variants
interface NoDataEmptyStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function NoDataEmptyState({ 
  title = 'Không có dữ liệu',
  description = 'Chưa có dữ liệu nào để hiển thị.',
  action,
  className 
}: NoDataEmptyStateProps) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}

interface NoResultsEmptyStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function NoResultsEmptyState({ 
  title = 'Không tìm thấy kết quả',
  description = 'Không có kết quả nào phù hợp với tiêu chí tìm kiếm.',
  action,
  className 
}: NoResultsEmptyStateProps) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}

interface ErrorEmptyStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function ErrorEmptyState({ 
  title = 'Đã xảy ra lỗi',
  description = 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
  action,
  className 
}: ErrorEmptyStateProps) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      }
      title={title}
      description={description}
      action={action}
      className={className}
    />
  )
}
