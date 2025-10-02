import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'

// Local-only types for this module to avoid circular deps
interface LocalApiResponse<T = any> {
  apiVersion: string
  statusCode: number
  shortMessage: string
  description: string
  data: T
  timestamp: string
  requestId: string
  path: string
}

class ApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            hasToken: !!token,
            tokenPreview: token ? `${token.substring(0, 20)}...` : null
          })
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => {
        if (response.data && typeof response.data.statusCode === 'number') {
          const sc = response.data.statusCode
          const isSuccessCode = sc === 200 || sc === 201 || sc === 204
          if (!isSuccessCode) {
            const error = { response: { status: response.status, data: response.data } }
            this.handleApiError(error)
            return Promise.reject(error)
          }
        }
        return response
      },
      async (error) => {
        const originalRequest = error.config
        const isUnauthorized = error.response?.status === 401 || (error.response?.data?.statusCode === 401)
        const isForbidden = error.response?.status === 403 || (error.response?.data?.statusCode === 403)

        if ((isUnauthorized || isForbidden) && !originalRequest._retry) {
          originalRequest._retry = true
          try {
            console.log('[API] Token refresh needed, attempting refresh...')
            const refreshSuccess = await this.handleUnauthorized()
            if (refreshSuccess) {
              console.log('[API] Token refresh successful, retrying request...')
              const newToken = this.getAuthToken()
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return this.client(originalRequest)
              }
            }
          } catch (retryError) {
            console.error('[API] Request retry failed:', retryError)
          }
        }

        this.handleApiError(error)
        return Promise.reject(error)
      }
    )
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      try {
        const authData = localStorage.getItem('docgo_auth_v1')
        if (authData) {
          const parsed = JSON.parse(authData)
          if (parsed.tokenData?.accessToken) {
            if (parsed.tokenData.expiresAt && Date.now() >= parsed.tokenData.expiresAt) {
              console.warn('[API] Token is expired, clearing storage')
              this.clearExpiredTokens()
              return null
            }
            return parsed.tokenData.accessToken
          }
          if (parsed.accessToken) {
            return parsed.accessToken
          }
        }
      } catch (error) {
        console.warn('[API] Error reading auth token from storage:', error)
        this.clearExpiredTokens()
      }
      return localStorage.getItem('auth_token')
    }
    return null
  }

  private clearExpiredTokens(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('docgo_auth_v1')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')
        document.cookie = 'auth_token=; Max-Age=0; Path=/'
        document.cookie = 'refresh_token=; Max-Age=0; Path=/'
        document.cookie = 'user_data=; Max-Age=0; Path=/'
      } catch (error) {
        console.warn('[API] Error clearing expired tokens:', error)
      }
    }
  }

  private handleApiError(error: any) {
    const status = error.response?.status
    const responseData = error.response?.data
    let message = 'Đã xảy ra lỗi'
    let shortMessage = 'Error'
    let statusCode = status || 500

    if (responseData) {
      if (responseData.statusCode) {
        statusCode = responseData.statusCode
      }
      message = responseData.description || responseData.message || message
      shortMessage = responseData.shortMessage || shortMessage
    }

    if (responseData?.errors && Array.isArray(responseData.errors)) {
      const validationErrors = responseData.errors
        .map((err: any) => `${err.field}: ${err.message}`)
        .join(', ')
      message = `Lỗi validation: ${validationErrors}`
    }

    switch (statusCode) {
      case 400:
        toast.error(message)
        break
      case 401:
        this.handleUnauthorized()
        break
      case 403:
        if (responseData?.message === 'permission error' || responseData?.msg === 'permission error') {
          console.warn('[API] 403 permission error - likely expired token')
        } else {
          toast.error('Bạn không có quyền truy cập')
        }
        break
      case 404:
        toast.error('Không tìm thấy tài nguyên')
        break
      case 409:
        toast.error(message || 'Xung đột dữ liệu')
        break
      case 422:
        toast.error(message || 'Dữ liệu không hợp lệ')
        break
      case 500:
        console.error('[API] Server error 500:', {
          url: this.baseURL,
          message,
          response: responseData
        })
        toast.error('Lỗi server, vui lòng thử lại sau')
        break
      default:
        toast.error(message)
    }
  }

  private async handleUnauthorized() {
    if (typeof window !== 'undefined') {
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const refreshResponse = await this.client.post(`${this.baseURL}/api/v1/user-management-service/v1/auth/refresh`, { refreshToken })
          const refreshData = refreshResponse.data?.data
          if (refreshData?.accessToken) {
            const authData = localStorage.getItem('docgo_auth_v1')
            if (authData) {
              const parsed = JSON.parse(authData)
              parsed.accessToken = refreshData.accessToken
              parsed.tokenData = {
                ...parsed.tokenData,
                accessToken: refreshData.accessToken,
                refreshToken: refreshData.refreshToken || refreshToken,
                expiresAt: Date.now() + ((refreshData.expiresIn || 900) * 1000),
                tokenType: refreshData.tokenType || 'Bearer'
              }
              localStorage.setItem('docgo_auth_v1', JSON.stringify(parsed))
            }
            localStorage.setItem('auth_token', refreshData.accessToken)
            if (refreshData.refreshToken) {
              localStorage.setItem('refresh_token', refreshData.refreshToken)
            }
            document.cookie = `auth_token=${refreshData.accessToken}; Max-Age=${(refreshData.expiresIn || 900)}; Path=/`
            if (refreshData.refreshToken) {
              document.cookie = `refresh_token=${refreshData.refreshToken}; Max-Age=${7 * 24 * 60 * 60}; Path=/`
            }
            return true
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
      }

      localStorage.removeItem('docgo_auth_v1')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
      document.cookie = 'auth_token=; Max-Age=0; Path=/'
      document.cookie = 'refresh_token=; Max-Age=0; Path=/'
      document.cookie = 'user_data=; Max-Age=0; Path=/'
      const path = window.location.pathname || ''
      const isOnAuthPages = path === '/auth/login' || path.startsWith('/auth')
      if (!isOnAuthPages) {
        window.location.href = '/auth/login'
      }
    }
    return false
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<LocalApiResponse<T>>> {
    return this.client.get(url, config)
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<LocalApiResponse<T>>> {
    return this.client.post(url, data, config)
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<LocalApiResponse<T>>> {
    return this.client.put(url, data, config)
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<LocalApiResponse<T>>> {
    return this.client.delete(url, config)
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<LocalApiResponse<T>>> {
    return this.client.patch(url, data, config)
  }
}

export const apiClient = new ApiClient()
export { ApiClient }


