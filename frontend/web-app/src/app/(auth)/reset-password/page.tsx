'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { authAPI } from '@/lib/api'
import {
  LockClosedIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

type ResetPasswordFormData = {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params?.get('token') || ''

  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<ResetPasswordFormData>()

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    setServerError(null)
    setSuccessMessage(null)

    try {
      await authAPI.resetPassword(token, data.password)
      setSuccessMessage('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.')
      reset()
      setTimeout(() => router.push('/auth/login'), 1200)
    } catch (error: any) {
      const message = error?.response?.data?.description || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.'
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
        {/* Left Side - Reset Password Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
          <div className="max-w-md w-full space-y-6 lg:space-y-8">
            {/* Logo and Title */}
            <div className="text-center">
              <div className="flex justify-center">
                <DocumentTextIcon className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600" />
              </div>
              <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
                Đặt lại mật khẩu
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Nhập mật khẩu mới cho tài khoản của bạn
              </p>
            </div>

            {/* Reset Password Form */}
            <Card className="shadow-lg">
              <CardHeader className="space-y-1 px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-center">
                  Mật khẩu mới
                </CardTitle>
                <CardDescription className="text-center text-sm">
                  Đảm bảo mật khẩu đủ mạnh và dễ nhớ đối với bạn
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
                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu mới"
                        className="pl-10 pr-10"
                        {...register('password', {
                          required: 'Mật khẩu là bắt buộc',
                          minLength: {
                            value: 8,
                            message: 'Mật khẩu phải có ít nhất 8 ký tự',
                          },
                        })}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {/* Reuse icon size/space for consistency; icons toggled via label */}
                        <span className="text-xs text-gray-500">
                          {showPassword ? 'Ẩn' : 'Hiện'}
                        </span>
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
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu mới"
                        className="pl-10 pr-10"
                        {...register('confirmPassword', {
                          required: 'Vui lòng xác nhận mật khẩu',
                          validate: (value) => value === watch('password') || 'Mật khẩu không khớp',
                        })}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={isLoading}
                    disabled={isLoading || !token}
                  >
                    {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                  </Button>

                  {/* Back to Login */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Quay lại{' '}
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


