'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AuthLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface OAuthError {
  code?: string
  message: string
  details?: string
}

export default function OAuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'warning'>('loading')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<OAuthError | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuthData } = useAuth()

  const MAX_RETRY_ATTEMPTS = 3

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the current URL to check for OAuth response
        const currentUrl = window.location.href
        
        // Check if this is a successful OAuth callback
        if (currentUrl.includes('/login/oauth2/code/google') || currentUrl.includes('/oauth/callback')) {
          // Extract parameters from URL
          const token = searchParams.get('token')
          const refreshToken = searchParams.get('refreshToken')
          const success = searchParams.get('success')
          const username = searchParams.get('username')
          const errorCode = searchParams.get('error')
          const errorDescription = searchParams.get('error_description')
          
          // Handle explicit OAuth errors
          if (errorCode || errorDescription) {
            setStatus('error')
            setError({
              code: errorCode || 'OAUTH_ERROR',
              message: errorDescription || 'Lỗi xác thực OAuth',
              details: `Mã lỗi: ${errorCode}`
            })
            setMessage('Đăng nhập Google thất bại do lỗi xác thực.')
            return
          }
          
          // Handle successful OAuth flow
          if (token && success === 'true' && username) {
            try {
              // Validate token format (basic check)
              if (token.length < 10) {
                throw new Error('Token không hợp lệ')
              }
              
              // Store tokens and user info
              localStorage.setItem('auth_token', token)
              if (refreshToken) {
                localStorage.setItem('refresh_token', refreshToken)
              }
              
              // Create user object from OAuth data
              const userData = {
                id: username,
                userId: username,
                username: username,
                email: username,
                name: username,
                role: 'USER' as const,
                status: 'ACTIVE' as const
              }
              localStorage.setItem('user_data', JSON.stringify(userData))
              
              // Update auth context
              setAuthData(userData)

              // If opened as a popup, notify opener and close without reloading parent
              try {
                const opener = window.opener
                if (opener && !opener.closed) {
                  const targetOrigin = window.location.origin
                  opener.postMessage({
                    type: 'oauth_success',
                    token,
                    refreshToken: refreshToken || null,
                    username
                  }, targetOrigin)
                  window.close()
                  return
                }
              } catch (e) {
                // ignore if cross-origin or no opener
              }
              
              setStatus('success')
              setMessage(`Đăng nhập Google thành công! Chào mừng ${username}`)
              
              // Redirect to dashboard after a short delay
              setTimeout(() => {
                router.push('/dashboard')
              }, 2000)
            } catch (storageError) {
              console.error('Token storage error:', storageError)
              setStatus('error')
              setError({
                code: 'STORAGE_ERROR',
                message: 'Lỗi lưu trữ thông tin đăng nhập',
                details: storageError instanceof Error ? storageError.message : 'Unknown error'
              })
              setMessage('Không thể lưu thông tin đăng nhập.')
            }
          } else {
            // Missing required parameters
            const missingParams = []
            if (!token) missingParams.push('token')
            if (!username) missingParams.push('username')
            if (success !== 'true') missingParams.push('success=true')
            
            setStatus('error')
            setError({
              code: 'MISSING_PARAMS',
              message: 'Thiếu thông tin cần thiết từ OAuth',
              details: `Thiếu: ${missingParams.join(', ')}`
            })
            setMessage('Thông tin đăng nhập không đầy đủ.')

            // Inform opener about error if in popup
            try {
              const opener = window.opener
              if (opener && !opener.closed) {
                const targetOrigin = window.location.origin
                opener.postMessage({
                  type: 'oauth_error',
                  message: 'Thông tin đăng nhập không đầy đủ.',
                }, targetOrigin)
              }
            } catch {}
          }
        } else {
          setStatus('error')
          setError({
            code: 'INVALID_CALLBACK',
            message: 'URL callback không hợp lệ',
            details: 'URL không chứa thông tin OAuth callback'
          })
          setMessage('URL callback không hợp lệ.')

          // Inform opener if exists
          try {
            const opener = window.opener
            if (opener && !opener.closed) {
              const targetOrigin = window.location.origin
              opener.postMessage({
                type: 'oauth_error',
                message: 'URL callback không hợp lệ.',
              }, targetOrigin)
            }
          } catch {}
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        setStatus('error')
        setError({
          code: 'UNKNOWN_ERROR',
          message: 'Lỗi không xác định',
          details: error instanceof Error ? error.message : 'Unknown error'
        })
        setMessage('Có lỗi xảy ra trong quá trình đăng nhập.')

        // Inform opener on unknown error as well
        try {
          const opener = window.opener
          if (opener && !opener.closed) {
            const targetOrigin = window.location.origin
            opener.postMessage({
              type: 'oauth_error',
              message: 'Có lỗi xảy ra trong quá trình đăng nhập.',
            }, targetOrigin)
          }
        } catch {}
      }
    }

    handleOAuthCallback()
  }, [router, searchParams, setAuthData])

  const handleRetry = () => {
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      setRetryCount(prev => prev + 1)
      setStatus('loading')
      setError(null)
      setMessage('Đang thử lại...')
      
      // Retry the OAuth callback
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  const handleGoToLogin = () => {
    router.push('/auth/login')
  }

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xl sm:text-2xl font-semibold">
              Xử lý đăng nhập Google
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
            {status === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-sm sm:text-base text-gray-600">Đang xử lý đăng nhập...</p>
                {retryCount > 0 && (
                  <p className="text-xs sm:text-sm text-gray-500">Lần thử: {retryCount}/{MAX_RETRY_ATTEMPTS}</p>
                )}
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircleIcon className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto" />
                <p className="text-sm sm:text-base text-green-600 font-medium">{message}</p>
                <p className="text-xs sm:text-sm text-gray-500">Đang chuyển hướng đến dashboard...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
              </>
            )}
            
            {status === 'error' && (
              <>
                <XCircleIcon className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto" />
                <p className="text-sm sm:text-base text-red-600 font-medium">{message}</p>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-left">
                    <div className="flex items-start space-x-2">
                      <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs sm:text-sm">
                        <p className="font-medium text-red-800">{error.message}</p>
                        {error.code && (
                          <p className="text-red-600 mt-1">Mã lỗi: {error.code}</p>
                        )}
                        {error.details && (
                          <p className="text-red-600 mt-1">Chi tiết: {error.details}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  {retryCount < MAX_RETRY_ATTEMPTS && (
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      className="w-full h-10 sm:h-auto"
                    >
                      <span className="text-sm sm:text-base">Thử lại ({MAX_RETRY_ATTEMPTS - retryCount} lần còn lại)</span>
                    </Button>
                  )}
                  <Button
                    onClick={handleGoToLogin}
                    className="w-full h-10 sm:h-auto"
                  >
                    <span className="text-sm sm:text-base">Quay lại đăng nhập</span>
                  </Button>
                </div>
                
                {retryCount >= MAX_RETRY_ATTEMPTS && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs sm:text-sm text-yellow-800">
                      Đã thử lại tối đa {MAX_RETRY_ATTEMPTS} lần. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  )
}

