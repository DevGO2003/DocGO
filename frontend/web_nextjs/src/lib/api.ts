import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'

// Types
export interface ApiResponse<T = any> {
  apiVersion: string
  statusCode: number
  shortMessage: string
  description: string
  data: T
  timestamp: string
  requestId: string
  path: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
}

// API Configuration
class ApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor() {
    // Sử dụng API Gateway BFF thay vì gọi trực tiếp đến microservices
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Enable cookies for CORS requests
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // Add debug logging for token status
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            hasToken: !!token,
            tokenPreview: token ? `${token.substring(0, 20)}...` : null
          })
        }
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Chuẩn RestResponse: coi 200/201/204 trong body là thành công
        if (response.data && typeof response.data.statusCode === 'number') {
          const sc = response.data.statusCode
          const isSuccessCode = sc === 200 || sc === 201 || sc === 204
          if (!isSuccessCode) {
            // Tạo error object để trigger error handler
            const error = {
              response: {
                status: response.status,
                data: response.data
              }
            }
            this.handleApiError(error)
            return Promise.reject(error)
          }
        }
        return response
      },
      async (error) => {
        const originalRequest = error.config
        
        // Handle 401/403 errors with token refresh (kiểm tra cả HTTP status và statusCode trong body)
        const isUnauthorized = error.response?.status === 401 || 
                              (error.response?.data?.statusCode === 401)
        const isForbidden = error.response?.status === 403 || 
                           (error.response?.data?.statusCode === 403)
        
        if ((isUnauthorized || isForbidden) && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            console.log('[API] Token refresh needed, attempting refresh...')
            const refreshSuccess = await this.handleUnauthorized()
            if (refreshSuccess) {
              console.log('[API] Token refresh successful, retrying request...')
              // Retry the original request with new token
              const newToken = this.getAuthToken()
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return this.client(originalRequest)
              }
            } else {
              console.log('[API] Token refresh failed, redirecting to login...')
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
      // Try to get from new storage format first
      try {
        const authData = localStorage.getItem('docgo_auth_v1')
        if (authData) {
          const parsed = JSON.parse(authData)
          if (parsed.tokenData?.accessToken) {
            // Check if token is expired
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
      
      // Fallback to legacy storage
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
        
        // Also clear cookies
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
    
    // Handle backend RestResponse format
    let message = 'Đã xảy ra lỗi'
    let shortMessage = 'Error'
    let statusCode = status || 500
    
    if (responseData) {
      // Backend trả về HTTP 200 với statusCode trong body
      if (responseData.statusCode) {
        statusCode = responseData.statusCode
      }
      message = responseData.description || responseData.message || message
      shortMessage = responseData.shortMessage || shortMessage
    }

    // Handle validation errors
    if (responseData?.errors && Array.isArray(responseData.errors)) {
      const validationErrors = responseData.errors
        .map((err: any) => `${err.field}: ${err.message}`)
        .join(', ')
      message = `Lỗi validation: ${validationErrors}`
    }

    // Sử dụng statusCode từ response body thay vì HTTP status
    switch (statusCode) {
      case 400:
        toast.error(message)
        break
      case 401:
        this.handleUnauthorized()
        break
      case 403:
        // For 403 errors, check if it's due to expired token
        if (responseData?.message === 'permission error' || responseData?.msg === 'permission error') {
          console.warn('[API] 403 permission error - likely expired token')
          // Don't show toast for permission errors as they should be handled by token refresh
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
      // Try to refresh token before redirecting
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const refreshResponse = await this.client.post(`${this.baseURL}/api/v1/authentication-identity-service/auth/refresh`, { refreshToken })
          const refreshData = refreshResponse.data?.data
          
          if (refreshData?.accessToken) {
            // Update stored tokens
            const authData = localStorage.getItem('docgo_auth_v1')
            if (authData) {
              const parsed = JSON.parse(authData)
              parsed.accessToken = refreshData.accessToken
              parsed.tokenData = {
                ...parsed.tokenData,
                accessToken: refreshData.accessToken,
                refreshToken: refreshData.refreshToken || refreshToken,
                expiresAt: Date.now() + ((refreshData.expiresIn || 900) * 1000), // Default 15 minutes if not provided
                tokenType: refreshData.tokenType || 'Bearer'
              }
              localStorage.setItem('docgo_auth_v1', JSON.stringify(parsed))
            }
            
            // Update legacy storage
            localStorage.setItem('auth_token', refreshData.accessToken)
            if (refreshData.refreshToken) {
              localStorage.setItem('refresh_token', refreshData.refreshToken)
            }
            
            // Update cookies
            document.cookie = `auth_token=${refreshData.accessToken}; Max-Age=${(refreshData.expiresIn || 900)}; Path=/`
            if (refreshData.refreshToken) {
              document.cookie = `refresh_token=${refreshData.refreshToken}; Max-Age=${7 * 24 * 60 * 60}; Path=/`
            }
            
            // Retry the original request
            return true
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
      }
      
      // If refresh fails, clear all auth data and conditionally redirect
      localStorage.removeItem('docgo_auth_v1')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
      
      // Clear cookies
      document.cookie = 'auth_token=; Max-Age=0; Path=/'
      document.cookie = 'refresh_token=; Max-Age=0; Path=/'
      document.cookie = 'user_data=; Max-Age=0; Path=/'
      // Avoid forcing a full reload if we're already on any auth page
      const path = window.location.pathname || ''
      const isOnAuthPages = path === '/auth/login' || path.startsWith('/auth')
      if (!isOnAuthPages) {
        window.location.href = '/auth/login'
      }
    }
    return false
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.get(url, config)
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.post(url, data, config)
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.put(url, data, config)
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.delete(url, config)
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.patch(url, data, config)
  }
}

// Create API client instance
const apiClient = new ApiClient()

// Contract Management API - Sử dụng API Gateway
export class ContractAPI {
  private basePath = '/api/v1/contract-management-service'

  async getContracts(params?: {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: 'ASC' | 'DESC'
    searchTerm?: string
    includeDeleted?: boolean
  }, options?: { signal?: AbortSignal }) {
    return apiClient.get<PaginatedResponse<any>>(`${this.basePath}/contracts`, { 
      params,
      signal: options?.signal
    })
  }

  async getContract(id: string) {
    return apiClient.get<any>(`${this.basePath}/contracts/${id}`)
  }

  async createContract(data: any) {
    return apiClient.post<any>(`${this.basePath}/contracts`, data)
  }

  async updateContract(id: string, data: any) {
    return apiClient.put<any>(`${this.basePath}/contracts/${id}`, data)
  }

  async deleteContract(id: string) {
    return apiClient.delete<any>(`${this.basePath}/contracts/${id}`)
  }

  async restoreContract(id: string) {
    return apiClient.put<any>(`${this.basePath}/contracts/${id}/restore`)
  }

  async getContractEvents(id: string) {
    return apiClient.get<any[]>(`${this.basePath}/contracts/${id}/events`)
  }

  async getContractAttachments(id: string) {
    return apiClient.get<any[]>(`${this.basePath}/contracts/${id}/attachments`)
  }

  async approveContract(id: string) {
    return apiClient.put<any>(`${this.basePath}/contracts/${id}/approve`)
  }

  async createVersion(id: string, data: any) {
    return apiClient.post<any>(`${this.basePath}/contracts/${id}/versions`, data)
  }

  async requestESignature(id: string, data: any) {
    return apiClient.post<any>(`${this.basePath}/contracts/${id}/esignature`, data)
  }

  async addComment(id: string, data: any) {
    return apiClient.post<any>(`${this.basePath}/contracts/${id}/comments`, data)
  }
}

// User Management API - Sử dụng API Gateway
export class UserAPI {
  private basePath = '/api/v1/user-management-service'

  async getUsers(params?: {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: 'ASC' | 'DESC'
    searchTerm?: string
  }) {
    return apiClient.get<PaginatedResponse<any>>(`${this.basePath}/users`, { params })
  }

  async getUser(id: string) {
    return apiClient.get<any>(`${this.basePath}/users/${id}`)
  }

  async createUser(data: any) {
    return apiClient.post<any>(`${this.basePath}/users`, data)
  }

  async updateUser(id: string, data: any) {
    return apiClient.put<any>(`${this.basePath}/users/${id}`, data)
  }

  async deleteUser(id: string) {
    return apiClient.delete<any>(`${this.basePath}/users/${id}`)
  }

  async changePassword(id: string, data: { oldPassword: string; newPassword: string }) {
    return apiClient.put<any>(`${this.basePath}/users/${id}/password`, data)
  }
}

// AI Processing API - Sử dụng API Gateway
export class AIProcessingAPI {
  private basePath = '/api/v1/ai-processing-service'

  async extractText(file: File, apiKey?: string) {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.post<any>(`${this.basePath}/extract`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(apiKey && { 'GEMINI_API_KEY': apiKey }),
      },
    })
  }

  async summarizeText(text: string, apiKey?: string) {
    return apiClient.post<any>(`${this.basePath}/summarize`, { text }, {
      headers: {
        ...(apiKey && { 'GEMINI_API_KEY': apiKey }),
      },
    })
  }

  async summarizeFile(file: File, apiKey?: string) {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.post<any>(`${this.basePath}/summarize`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(apiKey && { 'GEMINI_API_KEY': apiKey }),
      },
    })
  }
}

// File Storage API - Sử dụng API Gateway
export class FileStorageAPI {
  private basePath = '/api/v1/file-storage-asset-service'

  async uploadFile(file: File, metadata?: any) {
    const formData = new FormData()
    formData.append('file', file)
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata))
    }
    
    return apiClient.post<any>(`${this.basePath}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  async getFile(id: string) {
    return apiClient.get<any>(`${this.basePath}/files/${id}`)
  }

  async deleteFile(id: string) {
    return apiClient.delete<any>(`${this.basePath}/files/${id}`)
  }

  async getFiles(params?: {
    pageNumber?: number
    pageSize?: number
    searchTerm?: string
    category?: string
  }) {
    return apiClient.get<PaginatedResponse<any>>(`${this.basePath}/files`, { params })
  }
}

// Tag Management API - Sử dụng API Gateway
export class TagAPI {
  private basePath = '/api/v1/contract-management-service'

  async getPopularTags() {
    return apiClient.get<any[]>(`${this.basePath}/tags/popular`)
  }

  async getAllTags() {
    return apiClient.get<any[]>(`${this.basePath}/tags/all`)
  }

  async searchTags(searchTerm?: string) {
    return apiClient.get<any[]>(`${this.basePath}/tags/search`, {
      params: searchTerm ? { searchTerm } : {}
    })
  }
}

// Authentication API - Updated to use API Gateway proxy
export class AuthAPI {
  private basePath = '/api/auth'

  async login(credentials: { username: string; password: string }) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/login`, credentials)
  }

  async register(userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    role?: string
  }) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/register`, userData)
  }

  async refreshToken(refreshToken: string) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/refresh`, { refreshToken })
  }

  async logout(refreshToken?: string) {
    const body = refreshToken ? { refreshToken } : {}
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/logout`, body)
  }

  async forgotPassword(email: string) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/forgot-password`, { email })
  }

  async resetPassword(token: string, newPassword: string) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/reset-password`, { token, newPassword })
  }

  async getProfile() {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/me`)
  }

  async updateProfile(data: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    department?: string
    position?: string
    avatar?: string
  }) {
    return apiClient.put<ApiResponse<any>>(`${this.basePath}/profile`, data)
  }

  async changePassword(data: { oldPassword: string; newPassword: string }) {
    return apiClient.put<ApiResponse<any>>(`${this.basePath}/change-password`, data)
  }

  // OAuth endpoints
  async getOAuthStatus() {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/oauth2/test`)
  }

  async initiateOAuth(provider: string) {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/oauth2/authorize/${provider}`)
  }

  // Token validation
  async validateToken(token: string) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/auth/validate`, { token })
  }
}

// Export API instances
export const contractAPI = new ContractAPI()
export const userAPI = new UserAPI()
export const aiProcessingAPI = new AIProcessingAPI()
export const fileStorageAPI = new FileStorageAPI()
export const tagAPI = new TagAPI()
export const authAPI = new AuthAPI()

// Export default client for custom requests
export default apiClient
