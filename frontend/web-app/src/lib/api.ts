import { apiClient } from './http/api-client'

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

// ApiClient implementation moved to ./http/api-client to avoid circular imports

// Contract Management API - Sử dụng API Gateway với pattern mới
export class ContractAPI {
  private basePath = '/api/v1/document-management-service/v1'

  async getContracts(params?: {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: 'ASC' | 'DESC'
    searchTerm?: string
    includeDeleted?: boolean
    view?: string
  }, options?: { signal?: AbortSignal }) {
    return apiClient.get<PaginatedResponse<any>>(`${this.basePath}/contracts`, { 
      params,
      signal: options?.signal
    })
  }

  async getContract(id: string, view?: string) {
    const params = view ? { view } : {}
    return apiClient.get<any>(`${this.basePath}/contracts/${id}`, { params })
  }

  async createContract(data: any, view?: string) {
    const params = view ? { view } : {}
    return apiClient.post<any>(`${this.basePath}/contracts`, data, { params })
  }

  async updateContract(id: string, data: any, view?: string) {
    const params = view ? { view } : {}
    return apiClient.put<any>(`${this.basePath}/contracts/${id}`, data, { params })
  }

  async deleteContract(id: string, view?: string) {
    const params = view ? { view } : {}
    return apiClient.delete<any>(`${this.basePath}/contracts/${id}`, { params })
  }

  async restoreContract(id: string, view?: string) {
    const params = view ? { view } : {}
    return apiClient.put<any>(`${this.basePath}/contracts/${id}/restore`, undefined, { params })
  }

  async getContractEvents(id: string, view?: string) {
    const params = view ? { view } : {}
    return apiClient.get<any[]>(`${this.basePath}/contracts/${id}/events`, { params })
  }

  async getContractAttachments(id: string, view?: string) {
    const params = view ? { view } : {}
    return apiClient.get<any[]>(`${this.basePath}/contracts/${id}/attachments`, { params })
  }

  async approveContract(id: string, view?: string) {
    const params = view ? { view } : {}
    return apiClient.put<any>(`${this.basePath}/contracts/${id}/approve`, undefined, { params })
  }

  async createVersion(id: string, data: any, view?: string) {
    const params = view ? { view } : {}
    return apiClient.post<any>(`${this.basePath}/contracts/${id}/versions`, data, { params })
  }

  async requestESignature(id: string, data: any, view?: string) {
    const params = view ? { view } : {}
    return apiClient.post<any>(`${this.basePath}/contracts/${id}/esignature`, data, { params })
  }

  async addComment(id: string, data: any, view?: string) {
    const params = view ? { view } : {}
    return apiClient.post<any>(`${this.basePath}/contracts/${id}/comments`, data, { params })
  }
}

// User Management API - Sử dụng API Gateway với pattern mới
export class UserAPI {
  private basePath = '/api/v1/user-management-service/v1'

  async getUsers(params?: {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: 'ASC' | 'DESC'
    searchTerm?: string
    view?: string
  }) {
    return apiClient.get<PaginatedResponse<any>>(`${this.basePath}/users`, { params })
  }

  async getUser(id: string, view?: string) {
    const params = view ? { view } : {}
    return apiClient.get<any>(`${this.basePath}/users/${id}`, { params })
  }

  async createUser(data: any, view?: string) {
    const params = view ? { view } : {}
    return apiClient.post<any>(`${this.basePath}/users`, data, { params })
  }

  async updateUser(id: string, data: any, view?: string) {
    const params = view ? { view } : {}
    return apiClient.put<any>(`${this.basePath}/users/${id}`, data, { params })
  }

  async deleteUser(id: string, view?: string) {
    const params = view ? { view } : {}
    return apiClient.delete<any>(`${this.basePath}/users/${id}`, { params })
  }

  async changePassword(id: string, data: { oldPassword: string; newPassword: string }, view?: string) {
    const params = view ? { view } : {}
    return apiClient.put<any>(`${this.basePath}/users/${id}/password`, data, { params })
  }
}

// Automation API - Sử dụng API Gateway với pattern mới
export class AutomationAPI {
  private basePath = '/api/v1/automation-service/v1'

  async extractText(file: File, apiKey?: string, view?: string) {
    const formData = new FormData()
    formData.append('file', file)
    
    const params = view ? { view } : {}
    return apiClient.post<any>(`${this.basePath}/document/extract`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(apiKey && { 'GEMINI_API_KEY': apiKey }),
      },
      params
    })
  }

  async classifyText(text: string, apiKey?: string, view?: string) {
    const params = view ? { view } : {}
    return apiClient.post<any>(`${this.basePath}/document/classify`, { text }, {
      headers: {
        ...(apiKey && { 'GEMINI_API_KEY': apiKey }),
      },
      params
    })
  }

  async classifyFile(file: File, apiKey?: string, view?: string) {
    const formData = new FormData()
    formData.append('file', file)

    const params = view ? { view } : {}
    return apiClient.post<any>(`${this.basePath}/document/classify`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(apiKey && { 'GEMINI_API_KEY': apiKey }),
      },
      params
    })
  }

  async summarizeText(text: string, apiKey?: string, view?: string) {
    const params = view ? { view } : {}
    return apiClient.post<any>(`${this.basePath}/contracts/summarize`, { text }, {
      headers: {
        ...(apiKey && { 'GEMINI_API_KEY': apiKey }),
      },
      params
    })
  }

  async summarizeFile(file: File, apiKey?: string, view?: string) {
    const formData = new FormData()
    formData.append('file', file)
    
    const params = view ? { view } : {}
    return apiClient.post<any>(`${this.basePath}/contracts/summarize`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(apiKey && { 'GEMINI_API_KEY': apiKey }),
      },
      params
    })
  }

  // Upload tài liệu phục vụ quy trình OCR/AI (đưa về automation-service thay vì DMS)
  async uploadDocumentForAutomation(file: File, apiKey?: string, view?: string) {
    const formData = new FormData()
    formData.append('file', file)

    const params = view ? { view } : {}
    return apiClient.post<any>(`${this.basePath}/document/extract`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(apiKey && { 'GEMINI_API_KEY': apiKey }),
      },
      params
    })
  }
}

// File Storage API - Sử dụng API Gateway với pattern mới
export class FileStorageAPI {
  // Chuyển upload/lưu trữ file sang automation-service
  private basePath = '/api/v1/automation-service/v1/files'

  async uploadFile(file: File, metadata?: any, view?: string) {
    const formData = new FormData()
    formData.append('file', file)
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata))
    }
    
    const params = view ? { view } : {}
    // POST /api/v1/automation-service/v1/files
    return apiClient.post<any>(`${this.basePath}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params
    })
  }

  async getFile(id: string, view?: string) {
    const params = view ? { view } : {}
    // GET /api/v1/automation-service/v1/files/{id}
    return apiClient.get<any>(`${this.basePath}/${id}`, { params })
  }

  async deleteFile(id: string, view?: string) {
    const params = view ? { view } : {}
    // DELETE /api/v1/automation-service/v1/files/{id}
    return apiClient.delete<any>(`${this.basePath}/${id}`, { params })
  }

  async getFiles(params?: {
    pageNumber?: number
    pageSize?: number
    searchTerm?: string
    category?: string
    view?: string
  }) {
    // GET /api/v1/automation-service/v1/files
    return apiClient.get<PaginatedResponse<any>>(`${this.basePath}`, { params })
  }
}

// Tag Management API - Sử dụng API Gateway với pattern mới
export class TagAPI {
  private basePath = '/api/v1/document-management-service/v1'

  async getPopularTags(view?: string) {
    const params = view ? { view } : {}
    return apiClient.get<any[]>(`${this.basePath}/tags/popular`, { params })
  }

  async getAllTags(view?: string) {
    const params = view ? { view } : {}
    return apiClient.get<any[]>(`${this.basePath}/tags/all`, { params })
  }

  async searchTags(searchTerm?: string, view?: string) {
    const params: any = {}
    if (searchTerm) params.searchTerm = searchTerm
    if (view) params.view = view
    
    return apiClient.get<any[]>(`${this.basePath}/tags/search`, { params })
  }
}

// Authentication API - Updated to use API Gateway proxy
export class AuthAPI {
  private basePath = '/api/v1/user-management-service/v1/auth'

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

  async testOAuth() {
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

// Export API instances (Legacy - for backward compatibility)
export const contractAPI = new ContractAPI()
export const userAPI = new UserAPI()
export const automationAPI = new AutomationAPI()
export const fileStorageAPI = new FileStorageAPI()
export const tagAPI = new TagAPI()
export const authAPI = new AuthAPI()

// Note: Avoid re-exporting from './apis' here to prevent circular dependencies

// Export default client for custom requests
export { apiClient }
export default apiClient
