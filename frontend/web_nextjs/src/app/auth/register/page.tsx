'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import { RegisterData } from '@/types'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData & { confirmPassword: string }>()

  const password = watch('password')

  const onSubmit = async (data: RegisterData & { confirmPassword: string }) => {
    setIsLoading(true)
    try {
      const { confirmPassword, ...registerData } = data
      const success = await registerUser(registerData)
      if (success) {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Register error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    'Tạo và quản lý hợp đồng dễ dàng',
    'Xử lý tài liệu tự động với AI',
    'Bảo mật dữ liệu đạt chuẩn quốc tế',
    'Hỗ trợ 24/7 từ đội ngũ chuyên gia',
  ]

  return (
    <AuthLayout>
      <div className="min-h-screen flex">
        {/* Left Side - Register Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Logo and Title */}
            <div className="text-center">
              <div className="flex justify-center">
                <DocumentTextIcon className="h-12 w-12 text-primary-600" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Tạo tài khoản mới
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Tham gia DocGO để bắt đầu quản lý tài liệu thông minh
              </p>
            </div>

            {/* Register Form */}
            <Card className="shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-semibold text-center">
                  Đăng ký
                </CardTitle>
                <CardDescription className="text-center">
                  Điền thông tin để tạo tài khoản mới
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Full Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        Họ
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Họ"
                          className="pl-10"
                          {...register('firstName', {
                            required: 'Họ là bắt buộc',
                          })}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Tên
                      </label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Tên"
                        {...register('lastName', {
                          required: 'Tên là bắt buộc',
                        })}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Username Field */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Tên đăng nhập
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                        className="pl-10"
                        {...register('username', {
                          required: 'Tên đăng nhập là bắt buộc',
                          minLength: {
                            value: 3,
                            message: 'Tên đăng nhập phải có ít nhất 3 ký tự',
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới',
                          },
                        })}
                      />
                    </div>
                    {errors.username && (
                      <p className="text-sm text-red-600">{errors.username.message}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Nhập email"
                        className="pl-10"
                        {...register('email', {
                          required: 'Email là bắt buộc',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email không hợp lệ',
                          },
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        className="pl-10 pr-10"
                        {...register('password', {
                          required: 'Mật khẩu là bắt buộc',
                          minLength: {
                            value: 8,
                            message: 'Mật khẩu phải có ít nhất 8 ký tự',
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                            message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
                          },
                        })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        className="pl-10 pr-10"
                        {...register('confirmPassword', {
                          required: 'Xác nhận mật khẩu là bắt buộc',
                          validate: (value) =>
                            value === password || 'Mật khẩu không khớp',
                        })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-gray-700">
                        Tôi đồng ý với{' '}
                        <Link
                          href="/terms"
                          className="font-medium text-primary-600 hover:text-primary-500"
                        >
                          Điều khoản sử dụng
                        </Link>{' '}
                        và{' '}
                        <Link
                          href="/privacy"
                          className="font-medium text-primary-600 hover:text-primary-500"
                        >
                          Chính sách bảo mật
                        </Link>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={isLoading}
                  >
                    {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                  </Button>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Đã có tài khoản?{' '}
                      <Link
                        href="/auth/login"
                        className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                      >
                        Đăng nhập ngay
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Benefits */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-primary-600 to-primary-800">
          <div className="max-w-lg px-8 text-white">
            <div className="mb-8">
              <ShieldCheckIcon className="h-16 w-16 text-white mb-4" />
              <h1 className="text-4xl font-bold mb-4">
                Bắt đầu ngay hôm nay
              </h1>
              <p className="text-xl text-primary-100">
                Tham gia hàng nghìn doanh nghiệp đã tin tưởng DocGO
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">
                Lợi ích khi sử dụng DocGO
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-primary-200 flex-shrink-0" />
                    <span className="text-primary-100">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">500+</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Doanh nghiệp tin tưởng</p>
                  <p className="text-xs text-primary-200">Đang sử dụng DocGO</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">99.9%</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Uptime đảm bảo</p>
                  <p className="text-xs text-primary-200">Dịch vụ ổn định</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}







