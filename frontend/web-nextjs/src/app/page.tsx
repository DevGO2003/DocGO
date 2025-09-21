'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useRouter } from 'next/navigation';

const { Content } = Layout;

export default function HomePage() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { setLanguage } = useLanguage();
  const router = useRouter();

  // Handle search
  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // Handle language change
  const handleLanguageChange = (language: string) => {
    setLanguage(language);
  };

  // Handle user actions
  const handleUserAction = (action: string) => {
    switch (action) {
      case 'profile':
        router.push('/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'notifications':
        router.push('/notifications');
        break;
      case 'help':
        router.push('/help');
        break;
      case 'logout':
        // Logout is handled in UserMenu component
        break;
      default:
        break;
    }
  };

  // Handle menu toggle
  const handleMenuToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="min-h-screen">
      {/* Navigation Sidebar */}
      <Navigation 
        collapsed={collapsed}
        onCollapse={setCollapsed}
      />
      
      {/* Main Layout */}
      <Layout 
        className="transition-all duration-300"
        style={{ 
          marginLeft: collapsed ? 80 : 256,
          minHeight: '100vh'
        }}
      >
        {/* Header */}
        <Header
          onSearch={handleSearch}
          onLanguageChange={handleLanguageChange}
          user={user}
          onUserAction={handleUserAction}
          onMenuToggle={handleMenuToggle}
          collapsed={collapsed}
        />
        
        {/* Main Content */}
        <Content className="p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Chào mừng đến với DocGO
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Hệ thống quản lý tài liệu và hợp đồng toàn diện
              </p>
              
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-blue-900 mb-2">
                      Xin chào, {user?.name}!
                    </h2>
                    <p className="text-blue-700">
                      Bạn đã đăng nhập thành công vào hệ thống DocGO.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Hợp đồng
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Quản lý và theo dõi tất cả hợp đồng
                      </p>
                      <button 
                        onClick={() => router.push('/contracts')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Xem hợp đồng →
                      </button>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Tài liệu
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Lưu trữ và quản lý tài liệu
                      </p>
                      <button 
                        onClick={() => router.push('/documents')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Xem tài liệu →
                      </button>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Báo cáo
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Xem báo cáo và thống kê
                      </p>
                      <button 
                        onClick={() => router.push('/reports')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Xem báo cáo →
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-yellow-900 mb-2">
                      Chưa đăng nhập
                    </h2>
                    <p className="text-yellow-700 mb-4">
                      Vui lòng đăng nhập để sử dụng đầy đủ tính năng của hệ thống.
                    </p>
                    <button 
                      onClick={() => router.push('/login')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Đăng nhập
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

