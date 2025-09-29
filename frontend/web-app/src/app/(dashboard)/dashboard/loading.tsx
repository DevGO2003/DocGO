import React from 'react'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="p-6">
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="animate-pulse">
                <div className="bg-gray-200 h-4 w-20 rounded mb-2"></div>
                <div className="bg-gray-200 h-8 w-16 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 w-24 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-6 w-32 rounded mb-4"></div>
              <div className="bg-gray-200 h-64 w-full rounded"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-6 w-32 rounded mb-4"></div>
              <div className="bg-gray-200 h-64 w-full rounded"></div>
            </div>
          </div>
        </div>

        {/* Recent activity skeleton */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-6 w-40 rounded mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="bg-gray-200 h-10 w-10 rounded-full"></div>
                  <div className="flex-1">
                    <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                  </div>
                  <div className="bg-gray-200 h-3 w-16 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
