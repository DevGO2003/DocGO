'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { UserRole, UserStatus } from '@/types/auth'
import { AuthLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface OAuthError {
  code?: string
  message: string
  details?: string
}

export default function OAuth2CallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'warning'>('loading')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<OAuthError | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuthData } = useAuth()

  useEffect(() => {
    const handleOAuth2Callback = async () => {
      try {
        // Get the current URL to check for OAuth2 response
        const currentUrl = window.location.href
        
        // Accept both the Spring callback URL and the final frontend callback URL
        const isSpringCallback = currentUrl.includes('/login/oauth2/code/google')
        const isFrontendCallback = currentUrl.includes('/auth/oauth2/callback')
        if (isSpringCallback || isFrontendCallback) {
          // Only enforce presence of 'code' for Spring callback URL
          if (isSpringCallback) {
            // Extract parameters from URL
            const code = searchParams.get('code')
            const state = searchParams.get('state')
            const error = searchParams.get('error')

            if (error) {
              setStatus('error')
              setMessage('Đăng nhập Google thất bại')
              setError({
                code: error,
                message: `Lỗi OAuth2: ${error}`,
                details: searchParams.get('error_description') || undefined
              })
              return
            }

            if (!code) {
              setStatus('error')
              setMessage('Không nhận được authorization code từ Google')
              setError({
                message: 'Authorization code không được cung cấp',
                details: 'Vui lòng thử đăng nhập lại'
              })
              return
            }
          }
          
          // Extract tokens from URL parameters (sent by OAuth2LoginSuccessHandler)
          const token = searchParams.get('token')
          const refreshToken = searchParams.get('refreshToken')
          const success = searchParams.get('success')
          const username = searchParams.get('username')
          
          if (token && token.length > 10) {
            try {
              // Validate token format (basic check)
              if (token.length < 10) {
                throw new Error('Token không hợp lệ')
              }
              
              // Store tokens in localStorage
              localStorage.setItem('auth_token', token)
              if (refreshToken) {
                localStorage.setItem('refresh_token', refreshToken)
              }
              
              // Create user object from OAuth2 data
              // Use username from URL or fallback to email from token
              const userEmail = username || 'oauth-user@example.com'
              const userData = {
                id: userEmail,
                userId: userEmail,
                username: userEmail,
                email: userEmail,
                name: username || 'OAuth User',
                role: 'USER' as UserRole,
                status: 'ACTIVE' as UserStatus
              }
              localStorage.setItem('user_data', JSON.stringify(userData))
              
              // Update auth context
              setAuthData(userData)
              
              setStatus('success')
              setMessage(`Đăng nhập Google thành công! Chào mừng ${userEmail}`)
              
              // If opened as a popup, notify opener and close
              try {
                const opener = window.opener
                if (opener && !opener.closed) {
                  const targetOrigin = window.location.origin
                  opener.postMessage({
                    type: 'oauth_success',
                    token,
                    refreshToken: refreshToken || null,
                    username: userEmail
                  }, targetOrigin)
                  window.close()
                  return
                }
              } catch (e) {
                // ignore if cross-origin or no opener
              }
              
              // Redirect to dashboard after a short delay
              setTimeout(() => {
                router.push('/dashboard')
              }, 2000)
              
            } catch (storageError) {
              console.error('Error storing OAuth2 data:', storageError)
              setStatus('error')
              setMessage('Lỗi lưu trữ dữ liệu đăng nhập')
              setError({
                message: 'Không thể lưu thông tin đăng nhập',
                details: 'Vui lòng thử đăng nhập lại'
              })
            }
          } else {
            // No tokens found, OAuth2LoginSuccessHandler might not have processed correctly
            setStatus('warning')
            setMessage('Đăng nhập Google hoàn tất nhưng chưa nhận được thông tin người dùng')
            setError({
              message: 'Thiếu thông tin xác thực',
              details: 'Vui lòng thử đăng nhập lại hoặc liên hệ quản trị viên'
            })
          }
          
        } else {
          setStatus('error')
          setMessage('URL callback không hợp lệ')
          setError({
            message: 'URL không phải là OAuth2 callback',
            details: 'Vui lòng truy cập từ trang đăng nhập'
          })
        }
        
      } catch (error) {
        console.error('OAuth2 callback error:', error)
        setStatus('error')
        setMessage('Lỗi xử lý callback OAuth2')
        setError({
          message: 'Lỗi không xác định',
          details: error instanceof Error ? error.message : 'Vui lòng thử lại'
        })
      }
    }

    handleOAuth2Callback()
  }, [router, searchParams, setAuthData])

  const handleRetry = () => {
    router.push('/auth/login')
  }

  const handleClose = () => {
    try {
      const opener = window.opener
      if (opener && !opener.closed) {
        opener.postMessage({
          type: 'oauth_cancelled'
        }, window.location.origin)
        window.close()
      } else {
        router.push('/auth/login')
      }
    } catch (e) {
      router.push('/auth/login')
    }
  }

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {status === 'loading' && 'Đang xử lý đăng nhập Google...'}
              {status === 'success' && 'Đăng nhập thành công!'}
              {status === 'error' && 'Đăng nhập thất bại'}
              {status === 'warning' && 'Cảnh báo'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Status Icon */}
            <div className="flex justify-center">
              {status === 'loading' && (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              )}
              {status === 'success' && (
                <CheckCircleIcon className="h-12 w-12 text-green-600" />
              )}
              {status === 'error' && (
                <XCircleIcon className="h-12 w-12 text-red-600" />
              )}
              {status === 'warning' && (
                <ExclamationTriangleIcon className="h-12 w-12 text-yellow-600" />
              )}
            </div>

            {/* Message */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">{message}</p>
              
              {error && (
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    {error.message}
                  </p>
                  {error.details && (
                    <p className="text-xs text-gray-600">{error.details}</p>
                  )}
                  {error.code && (
                    <p className="text-xs text-gray-500 mt-1">Mã lỗi: {error.code}</p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {status === 'error' && (
                <Button onClick={handleRetry} className="w-full">
                  Thử lại
                </Button>
              )}
              
              {status === 'warning' && (
                <div className="space-y-2">
                  <Button onClick={handleRetry} className="w-full">
                    Thử lại
                  </Button>
                  <Button onClick={handleClose} variant="outline" className="w-full">
                    Đóng
                  </Button>
                </div>
              )}
              
              {status === 'success' && (
                <Button onClick={() => router.push('/dashboard')} className="w-full">
                  Đi đến Dashboard
                </Button>
              )}
              
              {status === 'loading' && (
                <Button onClick={handleClose} variant="outline" className="w-full">
                  Hủy
                </Button>
              )}
            </div>

            {/* Debug Info (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600">
                <p><strong>URL:</strong> {window.location.href}</p>
                <p><strong>Code:</strong> {searchParams.get('code') || 'N/A'}</p>
                <p><strong>State:</strong> {searchParams.get('state') || 'N/A'}</p>
                <p><strong>Error:</strong> {searchParams.get('error') || 'N/A'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  )
}
