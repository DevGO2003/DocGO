import { PublicLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  BuildingOfficeIcon, 
  UsersIcon, 
  LightBulbIcon, 
  ShieldCheckIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'DevGO2003 Team',
      role: 'Development Team',
      description: 'Đội ngũ phát triển chuyên nghiệp với kinh nghiệm trong lĩnh vực công nghệ thông tin'
    }
  ]

  const values = [
    {
      icon: LightBulbIcon,
      title: 'Đổi mới',
      description: 'Luôn tìm kiếm và áp dụng những công nghệ tiên tiến nhất để mang lại giá trị tốt nhất cho khách hàng'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Bảo mật',
      description: 'Đảm bảo an toàn tuyệt đối cho dữ liệu và thông tin của khách hàng với các tiêu chuẩn bảo mật cao nhất'
    },
    {
      icon: UsersIcon,
      title: 'Hợp tác',
      description: 'Xây dựng mối quan hệ đối tác bền vững và tạo ra giá trị chung cho tất cả các bên liên quan'
    },
    {
      icon: ChartBarIcon,
      title: 'Hiệu quả',
      description: 'Tối ưu hóa quy trình làm việc để mang lại hiệu suất cao nhất và tiết kiệm thời gian cho khách hàng'
    }
  ]

  const stats = [
    { label: 'Dự án đã triển khai', value: '100+' },
    { label: 'Khách hàng tin tưởng', value: '500+' },
    { label: 'Năm kinh nghiệm', value: '5+' },
    { label: 'Tỷ lệ hài lòng', value: '98%' }
  ]

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Về chúng tôi
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              DocGO - Nền tảng quản lý tài liệu và hợp đồng thông minh, 
              giúp doanh nghiệp tối ưu hóa quy trình làm việc và tăng hiệu quả kinh doanh.
            </p>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Sứ mệnh của chúng tôi
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  DocGO được ra đời với sứ mệnh cách mạng hóa cách thức quản lý tài liệu và hợp đồng 
                  trong doanh nghiệp. Chúng tôi tin rằng công nghệ AI và tự động hóa có thể giúp 
                  các tổ chức hoạt động hiệu quả hơn, tiết kiệm thời gian và giảm thiểu rủi ro.
                </p>
                <p className="text-lg text-gray-600">
                  Với đội ngũ chuyên gia giàu kinh nghiệm và công nghệ tiên tiến, chúng tôi cam kết 
                  mang đến những giải pháp tối ưu nhất cho từng khách hàng.
                </p>
              </div>
              <div className="relative">
                <div className="bg-primary-100 rounded-2xl p-8">
                  <BuildingOfficeIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                    DocGO Platform
                  </h3>
                  <p className="text-gray-600 text-center">
                    Nền tảng toàn diện cho quản lý tài liệu thông minh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Giá trị cốt lõi
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Những nguyên tắc và giá trị định hướng mọi hoạt động của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                      <value.icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {value.description}
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
                Những thành tựu mà chúng tôi đã đạt được
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

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Đội ngũ của chúng tôi
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Những con người tài năng và tâm huyết đằng sau DocGO
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                      <UsersIcon className="h-12 w-12 text-primary-600" />
                    </div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-primary-600 font-medium">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {member.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Hãy cùng chúng tôi xây dựng tương lai
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Liên hệ với chúng tôi để tìm hiểu thêm về DocGO và cách chúng tôi có thể 
              giúp doanh nghiệp của bạn phát triển.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Liên hệ ngay
              </a>
              <a 
                href="/" 
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-colors"
              >
                Về trang chủ
              </a>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
