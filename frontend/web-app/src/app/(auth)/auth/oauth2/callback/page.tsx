'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

export default function OAuth2CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setTokens } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!searchParams) {
          setStatus('error')
          setMessage('Thông tin callback không hợp lệ.')
          setTimeout(() => router.push('/auth/login'), 3000)
          return
        }

        const token = searchParams.get('token')
        const refreshToken = searchParams.get('refreshToken')
        const success = searchParams.get('success')
        const username = searchParams.get('username')
        const error = searchParams.get('error')

        if (error) {
          setStatus('error')
          setMessage('Đăng nhập Google thất bại. Vui lòng thử lại.')
          setTimeout(() => router.push('/auth/login'), 3000)
          return
        }

        if (success === 'true' && token && refreshToken) {
          // Lưu tokens vào localStorage
          localStorage.setItem('accessToken', token)
          localStorage.setItem('refreshToken', refreshToken)
          
          // Cập nhật auth context
          setTokens(token, refreshToken)
          
          setStatus('success')
          setMessage(`Chào mừng ${username || 'bạn'}! Đang chuyển hướng...`)
          
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('Thông tin đăng nhập không hợp lệ.')
          setTimeout(() => router.push('/auth/login'), 3000)
        }
      } catch (error) {
        console.error('OAuth2 callback error:', error)
        setStatus('error')
        setMessage('Có lỗi xảy ra khi xử lý đăng nhập.')
        setTimeout(() => router.push('/auth/login'), 3000)
      }
    }

    handleCallback()
  }, [searchParams, router, setTokens])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <DocumentTextIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {status === 'loading' && 'Đang xử lý đăng nhập...'}
            {status === 'success' && 'Đăng nhập thành công!'}
            {status === 'error' && 'Đăng nhập thất bại'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {message}
          </p>
        </div>

        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex justify-center">
            <div className="rounded-full h-8 w-8 bg-green-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex justify-center">
            <div className="rounded-full h-8 w-8 bg-red-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
