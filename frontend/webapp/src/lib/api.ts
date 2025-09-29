import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

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

class ApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor() {
    // Use public gateway URL for browser; default to current origin if not set
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.data && typeof response.data.statusCode === 'number') {
          const sc = response.data.statusCode
          const ok = sc === 200 || sc === 201 || sc === 204
          if (!ok) {
            const error = { response: { status: response.status, data: response.data } }
            return Promise.reject(error)
          }
        }
        return response
      },
      (error) => Promise.reject(error)
    )
  }

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

const apiClient = new ApiClient()

// Contract Management via API Gateway BFF
export class ContractAPI {
  private basePath = '/api/contracts'

  async getContracts(params?: {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: 'ASC' | 'DESC'
    searchTerm?: string
    includeDeleted?: boolean
  }, options?: { signal?: AbortSignal }) {
    return apiClient.get<PaginatedResponse<any>>(`${this.basePath}`, { params, signal: options?.signal })
  }

  async getContract(id: string) { return apiClient.get<any>(`${this.basePath}/${id}`) }
  async createContract(data: any) { return apiClient.post<any>(`${this.basePath}`, data) }
  async updateContract(id: string, data: any) { return apiClient.put<any>(`${this.basePath}/${id}`, data) }
  async deleteContract(id: string) { return apiClient.delete<any>(`${this.basePath}/${id}`) }
  async restoreContract(id: string) { return apiClient.put<any>(`${this.basePath}/${id}/restore`) }
  async getContractEvents(id: string) { return apiClient.get<any[]>(`${this.basePath}/${id}/events`) }
  async getContractAttachments(id: string) { return apiClient.get<any[]>(`${this.basePath}/${id}/attachments`) }
  async approveContract(id: string) { return apiClient.put<any>(`${this.basePath}/${id}/approve`) }
  async createVersion(id: string, data: any) { return apiClient.post<any>(`${this.basePath}/${id}/versions`, data) }
  async requestESignature(id: string, data: any) { return apiClient.post<any>(`${this.basePath}/${id}/esignature`, data) }
  async addComment(id: string, data: any) { return apiClient.post<any>(`${this.basePath}/${id}/comments`, data) }
}

// User Management via BFF
export class UserAPI {
  private basePath = '/api/users'
  async getUsers(params?: { pageNumber?: number; pageSize?: number; sortBy?: string; sortDirection?: 'ASC' | 'DESC'; searchTerm?: string }) {
    return apiClient.get<PaginatedResponse<any>>(`${this.basePath}`, { params })
  }
  async getUser(id: string) { return apiClient.get<any>(`${this.basePath}/${id}`) }
  async createUser(data: any) { return apiClient.post<any>(`${this.basePath}`, data) }
  async updateUser(id: string, data: any) { return apiClient.put<any>(`${this.basePath}/${id}`, data) }
  async deleteUser(id: string) { return apiClient.delete<any>(`${this.basePath}/${id}`) }
  async changePassword(id: string, data: { oldPassword: string; newPassword: string }) { return apiClient.put<any>(`${this.basePath}/${id}/password`, data) }
}

// AI Processing via BFF
export class AIProcessingAPI {
  private basePath = '/api/ai'
  async extractText(file: File, apiKey?: string) {
    const formData = new FormData(); formData.append('file', file)
    return apiClient.post<any>(`${this.basePath}/extract`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...(apiKey && { 'GEMINI_API_KEY': apiKey }) } })
  }
}

// File Storage via BFF
export class FileStorageAPI {
  private basePath = '/api/files'
  async uploadFile(file: File, metadata?: any) {
    const formData = new FormData(); formData.append('file', file); if (metadata) formData.append('metadata', JSON.stringify(metadata))
    return apiClient.post<any>(`${this.basePath}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  }
  async getFile(id: string) { return apiClient.get<any>(`${this.basePath}/${id}`) }
  async deleteFile(id: string) { return apiClient.delete<any>(`${this.basePath}/${id}`) }
  async getFiles(params?: { pageNumber?: number; pageSize?: number; searchTerm?: string; category?: string }) {
    return apiClient.get<PaginatedResponse<any>>(`${this.basePath}`, { params })
  }
}

// Tags (proxied under contracts BFF)
export class TagAPI {
  private basePath = '/api/contracts/tags'
  async getPopularTags() { return apiClient.get<any[]>(`${this.basePath}/popular`) }
  async getAllTags() { return apiClient.get<any[]>(`${this.basePath}/all`) }
  async searchTags(searchTerm?: string) { return apiClient.get<any[]>(`${this.basePath}/search`, { params: searchTerm ? { searchTerm } : {} }) }
}

// Auth via BFF
export class AuthAPI {
  private basePath = '/api/auth'
  async login(credentials: { username: string; password: string }) { return apiClient.post<ApiResponse<any>>(`${this.basePath}/login`, credentials) }
  async refreshToken(refreshToken: string) { return apiClient.post<ApiResponse<any>>(`${this.basePath}/refresh`, { refreshToken }) }
  async logout(refreshToken?: string) { const body = refreshToken ? { refreshToken } : {}; return apiClient.post<ApiResponse<any>>(`${this.basePath}/logout`, body) }
  async getProfile() { return apiClient.get<ApiResponse<any>>(`${this.basePath}/me`) }
}

export const contractAPI = new ContractAPI()
export const userAPI = new UserAPI()
export const aiProcessingAPI = new AIProcessingAPI()
export const fileStorageAPI = new FileStorageAPI()
export const tagAPI = new TagAPI()
export const authAPI = new AuthAPI()

export default apiClient




