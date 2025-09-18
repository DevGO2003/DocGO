'use client'

import React, { useState } from 'react'
import { PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  DocumentTextIcon, 
  CogIcon, 
  ChartBarIcon, 
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')

  const features = [
    {
      icon: DocumentTextIcon,
      title: 'Quản lý hợp đồng',
      description: 'Quản lý toàn bộ vòng đời hợp đồng từ tạo mới đến kết thúc'
    },
    {
      icon: CogIcon,
      title: 'Xử lý AI',
      description: 'Trích xuất và tóm tắt tài liệu tự động với công nghệ AI tiên tiến'
    },
    {
      icon: ChartBarIcon,
      title: 'Báo cáo & Phân tích',
      description: 'Theo dõi hiệu suất và tạo báo cáo chi tiết'
    },
    {
      icon: CloudArrowUpIcon,
      title: 'Lưu trữ đám mây',
      description: 'Lưu trữ an toàn và truy cập tài liệu từ mọi nơi'
    }
  ]

  const stats = [
    { label: 'Hợp đồng đã xử lý', value: '10,000+' },
    { label: 'Tài liệu được lưu trữ', value: '50,000+' },
    { label: 'Người dùng hoạt động', value: '1,000+' },
    { label: 'Thời gian tiết kiệm', value: '80%' }
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchTerm)
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Quản lý tài liệu và hợp đồng
            <span className="block text-primary-200">thông minh</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
            Nền tảng toàn diện giúp doanh nghiệp tối ưu hóa quy trình làm việc, 
            tăng hiệu quả và giảm thiểu rủi ro trong quản lý tài liệu.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 flex items-center px-4">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài liệu, hợp đồng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-l-none">
                Tìm kiếm
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Dùng thử miễn phí
            </Button>
            <Button size="lg" variant="outline">
              Xem demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá những tính năng mạnh mẽ giúp doanh nghiệp của bạn 
              quản lý tài liệu hiệu quả hơn bao giờ hết.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Con số ấn tượng
            </h2>
            <p className="text-xl text-gray-600">
              DocGO đã được tin tưởng bởi hàng nghìn doanh nghiệp trên toàn quốc
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Tham gia cùng hàng nghìn doanh nghiệp đã tin tưởng DocGO
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Đăng ký ngay
            </Button>
            <Button size="lg" variant="outline">
              Liên hệ tư vấn
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
