'use client'

import React from 'react'
import { cn } from '../../lib/utils'

interface LoadingSkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function LoadingSkeleton({ className, children }: LoadingSkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded', className)}>
      {children}
    </div>
  )
}

// Card skeleton component
interface CardSkeletonProps {
  className?: string
  showAvatar?: boolean
  lines?: number
}

export function CardSkeleton({ 
  className, 
  showAvatar = false, 
  lines = 3 
}: CardSkeletonProps) {
  return (
    <div className={cn('bg-white rounded-lg p-6 shadow-sm border border-gray-200', className)}>
      <div className="animate-pulse">
        {showAvatar && (
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
            <div className="flex-1">
              <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="bg-gray-200 h-4 rounded" style={{ 
              width: i === lines - 1 ? '60%' : '100%' 
            }}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Table skeleton component
interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  className 
}: TableSkeletonProps) {
  return (
    <div className={cn('overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg', className)}>
      <div className="bg-gray-50 px-6 py-3">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="bg-gray-200 h-4 rounded"></div>
          ))}
        </div>
      </div>
      <div className="bg-white divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="bg-gray-200 h-4 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// List skeleton component
interface ListSkeletonProps {
  items?: number
  className?: string
}

export function ListSkeleton({ items = 5, className }: ListSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
          <div className="flex-1">
            <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
            <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
          </div>
          <div className="bg-gray-200 h-3 w-16 rounded"></div>
        </div>
      ))}
    </div>
  )
}

// Stats skeleton component
interface StatsSkeletonProps {
  cards?: number
  className?: string
}

export function StatsSkeleton({ cards = 4, className }: StatsSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-4 w-20 rounded mb-2"></div>
            <div className="bg-gray-200 h-8 w-16 rounded mb-2"></div>
            <div className="bg-gray-200 h-3 w-24 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
