import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Đang tải...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4`}></div>
      <p className={`text-gray-600 ${textSizeClasses[size]} font-medium`}>
        {text}
      </p>
    </div>
  );
}

// Loading component cho full page
export function FullPageLoading({ text = 'Đang tải trang...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-2xl animate-pulse">
          <span className="text-4xl">🚀</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          DocGO
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          {text}
        </p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500">Vui lòng chờ...</span>
        </div>
      </div>
    </div>
  );
}

// Loading component cho API calls
export function ApiLoading({ message = 'Đang tải dữ liệu...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center space-x-3">
        <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-gray-600 font-medium">{message}</span>
      </div>
    </div>
  );
}
