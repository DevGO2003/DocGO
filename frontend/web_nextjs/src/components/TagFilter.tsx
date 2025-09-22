'use client'

import React, { useEffect, useState } from 'react'
import { TagIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { tagAPI } from '@/lib/api'
import { NoDataEmptyState } from '@/components/ui/EmptyState'

interface Tag {
  name: string
  displayName: string
  count: number
  isPopular: boolean
}

interface TagFilterProps {
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  className?: string
}

export default function TagFilter({ selectedTags, onTagToggle, className = '' }: TagFilterProps) {
  const [popularTags, setPopularTags] = useState<Tag[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load popular tags on mount
  useEffect(() => {
    const loadPopularTags = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await tagAPI.getPopularTags()
        const tags = response.data?.data || []
        setPopularTags(tags)
      } catch (err) {
        console.error('Error loading popular tags:', err)
        setError('Không thể tải danh sách tags phổ biến')
      } finally {
        setLoading(false)
      }
    }

    loadPopularTags()
  }, [])

  // Load all tags when expanding
  const loadAllTags = async () => {
    if (allTags.length > 0) return // Already loaded

    try {
      setLoading(true)
      setError(null)
      const response = await tagAPI.getAllTags()
      const tags = response.data?.data || []
      setAllTags(tags)
    } catch (err) {
      console.error('Error loading all tags:', err)
      setError('Không thể tải danh sách tags đầy đủ')
    } finally {
      setLoading(false)
    }
  }

  const handleShowAll = () => {
    if (!showAll) {
      loadAllTags()
    }
    setShowAll(!showAll)
  }

  const displayTags = showAll ? allTags : popularTags

  if (loading && popularTags.length === 0) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded-full"></div>
        <div className="animate-pulse bg-gray-200 h-8 w-24 rounded-full"></div>
        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-sm text-red-600 ${className}`}>
        {error}
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Popular Tags */}
      <div className="flex flex-wrap gap-2">
        {displayTags.map(tag => {
          const active = selectedTags.includes(tag.name)
          return (
            <button
              key={tag.name}
              onClick={() => onTagToggle(tag.name)}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition ${
                active 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <TagIcon className="h-4 w-4" />
              {tag.displayName}
              {tag.count > 0 && (
                <span className="text-xs text-gray-500">({tag.count})</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Show More/Less Button */}
      {popularTags.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleShowAll}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            ) : showAll ? (
              <>
                <ChevronUpIcon className="h-4 w-4" />
                Thu gọn
              </>
            ) : (
              <>
                <ChevronDownIcon className="h-4 w-4" />
                Xem thêm tags
              </>
            )}
          </button>
        </div>
      )}

      {/* No tags message */}
      {displayTags.length === 0 && !loading && (
        <NoDataEmptyState 
          title="Chưa có tags nào"
          description="Chưa có tags nào để hiển thị."
          className="py-4"
        />
      )}
    </div>
  )
}
