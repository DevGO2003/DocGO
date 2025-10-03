'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { authAPI } from '@/lib/api'
import {
  EnvelopeIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

type ForgotPasswordFormData = {
  email: string
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ForgotPasswordFormData>()

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setServerError(null)
    setSuccessMessage(null)

    try {
      const res = await authAPI.forgotPassword(data.email)
      const description = (res as any)?.data?.description || 'Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.'
      setSuccessMessage(description)
      reset()
    } catch (error: any) {
      const message = error?.response?.data?.description || 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại.'
      setServerError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    'Quản lý hợp đồng thông minh',
    'Xử lý tài liệu bằng AI',
    'Bảo mật dữ liệu cao cấp',
    'Giao diện thân thiện',
  ]

  return (
    <AuthLayout>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Forgot Password Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
          <div className="max-w-md w-full space-y-6 lg:space-y-8">
            {/* Logo and Title */}
            <div className="text-center">
              <div className="flex justify-center">
                <DocumentTextIcon className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600" />
              </div>
              <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
                Quên mật khẩu
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Nhập email để nhận liên kết đặt lại mật khẩu
              </p>
            </div>

            {/* Forgot Password Form */}
            <Card className="shadow-lg">
              <CardHeader className="space-y-1 px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-center">
                  Đặt lại mật khẩu
                </CardTitle>
                <CardDescription className="text-center text-sm">
                  Chúng tôi sẽ gửi liên kết đặt lại mật khẩu qua email của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                {/* Messages */}
                {serverError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{serverError}</p>
                  </div>
                )}
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
                        placeholder="you@example.com"
                        className="pl-10"
                        {...register('email', {
                          required: 'Email là bắt buộc',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Email không hợp lệ',
                          },
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang gửi...' : 'Gửi liên kết đặt lại mật khẩu'}
                  </Button>

                  {/* Back to Login */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Nhớ mật khẩu?{' '}
                      <Link
                        href="/auth/login"
                        className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                      >
                        Đăng nhập
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-primary-600 to-primary-800">
          <div className="max-w-lg px-6 lg:px-8 text-white">
            <div className="mb-6 lg:mb-8">
              <DocumentTextIcon className="h-12 w-12 lg:h-16 lg:w-16 text-white mb-3 lg:mb-4" />
              <h1 className="text-3xl lg:text-4xl font-bold mb-3 lg:mb-4">
                DocGO
              </h1>
              <p className="text-lg lg:text-xl text-primary-100">
                Nền tảng quản lý tài liệu và hợp đồng thông minh
              </p>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <h2 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">
                Tại sao chọn DocGO?
              </h2>
              <div className="space-y-3 lg:space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-5 w-5 lg:h-6 lg:w-6 text-primary-200 flex-shrink-0" />
                    <span className="text-sm lg:text-base text-primary-100">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}


