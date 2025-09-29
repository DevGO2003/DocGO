'use client'

import React from 'react'

export default function TestHotReload() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600">
        🔥 Hot Reload Test - {new Date().toLocaleTimeString()}
      </h1>
      <p className="mt-4 text-gray-600">
        Nếu bạn thấy thời gian thay đổi khi edit file này, hot reload đang hoạt động!
      </p>
      <div className="mt-4 p-4 bg-green-100 rounded">
        <p className="text-green-800">
          ✅ Hot reload đã được cấu hình với:
        </p>
        <ul className="mt-2 text-sm text-green-700">
          <li>• CHOKIDAR_USEPOLLING=1</li>
          <li>• WATCHPACK_POLLING=true</li>
          <li>• WATCHPACK_POLLING_INTERVAL=1000</li>
          <li>• NEXT_WEBPACK_USEPOLLING=1</li>
          <li>• FAST_REFRESH=true</li>
          <li>• Webpack watchOptions với poll: 1000ms</li>
        </ul>
      </div>
    </div>
  )
}
