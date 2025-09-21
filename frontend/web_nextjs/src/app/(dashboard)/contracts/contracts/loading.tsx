import React from 'react'

export default function ContractsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-6 w-48 rounded"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          </div>
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-gray-200 p-4 shadow-sm mx-6 mt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search skeleton */}
          <div className="md:col-span-2">
            <div className="animate-pulse bg-gray-200 h-10 w-full rounded-lg"></div>
          </div>
          {/* Status skeleton */}
          <div>
            <div className="animate-pulse bg-gray-200 h-10 w-full rounded-lg"></div>
          </div>
          {/* Type skeleton */}
          <div>
            <div className="animate-pulse bg-gray-200 h-10 w-full rounded-lg"></div>
          </div>
        </div>

        {/* Tags skeleton */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-8 w-20 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-6">
        {/* Grid view skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="animate-pulse">
                {/* Checkbox */}
                <div className="bg-gray-200 h-4 w-4 rounded mb-4"></div>
                
                {/* Title and status */}
                <div className="flex justify-between items-start gap-4 ml-6 mb-2">
                  <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
                  <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
                </div>
                
                {/* Description */}
                <div className="bg-gray-200 h-4 w-full rounded mb-3 ml-6"></div>
                <div className="bg-gray-200 h-4 w-2/3 rounded mb-3 ml-6"></div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 ml-6 mb-4">
                  <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
                  <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
                  <div className="bg-gray-200 h-6 w-14 rounded-full"></div>
                </div>
                
                {/* Details */}
                <div className="space-y-2 ml-6">
                  <div className="flex justify-between">
                    <div className="bg-gray-200 h-3 w-16 rounded"></div>
                    <div className="bg-gray-200 h-3 w-20 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="bg-gray-200 h-3 w-20 rounded"></div>
                    <div className="bg-gray-200 h-3 w-20 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="bg-gray-200 h-3 w-16 rounded"></div>
                    <div className="bg-gray-200 h-3 w-24 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
