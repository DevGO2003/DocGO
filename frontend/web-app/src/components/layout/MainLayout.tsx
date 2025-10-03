'use client'

import React, { useState } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import Sidebar from '../Sidebar'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageTransition } from '../PageTransition'

interface MainLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  showHeader?: boolean
  showFooter?: boolean
  sidebarCollapsed?: boolean
  onSidebarToggle?: (collapsed: boolean) => void
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showSidebar = true,
  showHeader = true,
  showFooter = true,
  sidebarCollapsed = false,
  onSidebarToggle,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(sidebarCollapsed)

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    onSidebarToggle?.(collapsed)
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex ${showSidebar ? (isCollapsed ? 'lg:pl-16' : 'lg:pl-64') : ''}`}>
      {/* Sidebar */}
      {showSidebar && (
        <>
          {/* Mobile overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <div
            className={`
              fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
            `}
          >
            <Sidebar />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        {showHeader && (
          <Header
            onMenuToggle={handleSidebarToggle}
            showSearch={true}
            showNotifications={true}
            showUserMenu={true}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto" suppressHydrationWarning>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>

        {/* Footer */}
        {showFooter && <Footer />}
      </div>
    </div>
  )
}

// Layout variants
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if not loading and definitely not authenticated
    // Use isAuthenticated instead of just checking user to avoid premature redirects
    if (!loading && !isAuthenticated) {
      // Add a small delay to prevent rapid redirects during token refresh
      // Tăng delay để đảm bảo token được sync hoàn toàn
      const timeoutId = setTimeout(() => {
        console.log('[DashboardLayout] Redirecting to login - isAuthenticated:', isAuthenticated, 'loading:', loading)
        router.replace('/auth/login')
      }, 1500) // Tăng từ 1000ms lên 1500ms
      
      return () => clearTimeout(timeoutId)
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cần đăng nhập</h2>
          <p className="text-gray-600">Vui lòng đăng nhập để truy cập trang này.</p>
        </div>
      </div>
    )
  }

  return (
    <MainLayout
      showSidebar={true}
      showHeader={true}
      showFooter={false}
      sidebarCollapsed={false}
    >
      {children}
    </MainLayout>
  )
}

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MainLayout
    showSidebar={false}
    showHeader={false}
    showFooter={true}
  >
    {children}
  </MainLayout>
)

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MainLayout
    showSidebar={false}
    showHeader={true}
    showFooter={true}
  >
    {children}
  </MainLayout>
)
