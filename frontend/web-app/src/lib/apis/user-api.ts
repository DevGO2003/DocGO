// User Management Service API
// Base path: /api/v1/user-management-service/v1

import { apiClient } from '../http/api-client'
import { ApiResponse } from '@/types/api'

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  role?: string
}

export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ProfileUpdateData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  department?: string
  position?: string
  avatar?: string
}

export interface PasswordChangeData {
  oldPassword: string
  newPassword: string
}

export class UserAPI {
  private basePath = '/api/v1/user-management-service/v1'

  // Authentication
  async login(credentials: LoginCredentials) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/auth/login`, credentials)
  }

  async register(userData: RegisterData) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/auth/register`, userData)
  }

  async refreshToken(refreshToken: string) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/auth/refresh`, { refreshToken })
  }

  async logout(refreshToken?: string) {
    const body = refreshToken ? { refreshToken } : {}
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/auth/logout`, body)
  }

  async forgotPassword(email: string) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/auth/forgot-password`, { email })
  }

  async resetPassword(token: string, newPassword: string) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/auth/reset-password`, { token, newPassword })
  }

  // Profile Management
  async getProfile() {
    return apiClient.get<ApiResponse<User>>(`${this.basePath}/auth/me`)
  }

  async updateProfile(data: ProfileUpdateData) {
    return apiClient.put<ApiResponse<User>>(`${this.basePath}/auth/profile`, data)
  }

  async changePassword(data: PasswordChangeData) {
    return apiClient.put<ApiResponse<any>>(`${this.basePath}/auth/change-password`, data)
  }

  // OAuth
  async getOAuthStatus() {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/auth/oauth2/test`)
  }

  async testOAuth() {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/auth/oauth2/test`)
  }

  async initiateOAuth(provider: string) {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/auth/oauth2/authorize/${provider}`)
  }

  // Token validation
  async validateToken(token: string) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/auth/validate`, { token })
  }

  // User Management (Admin)
  async getAllUsers(params?: {
    page?: number
    size?: number
    sortBy?: string
    sortDirection?: string
    searchTerm?: string
    includeDeleted?: boolean
  }) {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/users`, { params })
  }

  async getUserById(id: string) {
    return apiClient.get<ApiResponse<User>>(`${this.basePath}/users/${id}`)
  }

  async createUser(userData: RegisterData) {
    return apiClient.post<ApiResponse<User>>(`${this.basePath}/users`, userData)
  }

  async updateUser(id: string, userData: Partial<RegisterData>) {
    return apiClient.put<ApiResponse<User>>(`${this.basePath}/users/${id}`, userData)
  }

  async deleteUser(id: string) {
    return apiClient.delete<ApiResponse<any>>(`${this.basePath}/users/${id}`)
  }

  async restoreUser(id: string) {
    return apiClient.put<ApiResponse<User>>(`${this.basePath}/users/${id}/restore`)
  }
}

// Export instance
export const userAPI = new UserAPI()


