// File Storage Service API
// Base path: /api/v1/automation-service/v1/files

import { apiClient } from '../http/api-client'
import { ApiResponse } from '@/types/api'

export interface FileUploadResult {
  id: string
  filename: string
  originalName: string
  size: number
  mimeType: string
  url: string
  uploadPath: string
  createdAt: string
  metadata?: any
}

export interface FileInfo {
  id: string
  filename: string
  originalName: string
  size: number
  mimeType: string
  url: string
  uploadPath: string
  createdAt: string
  updatedAt: string
  metadata?: any
}

export interface FileSearchParams {
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: string
  searchTerm?: string
  mimeType?: string
  startDate?: string
  endDate?: string
}

export class FileAPI {
  private basePath = '/api/v1/automation-service/v1/files'

  // File Upload
  async uploadFile(file: File, metadata?: any) {
    const formData = new FormData()
    formData.append('file', file)
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata))
    }
    
    return apiClient.post<ApiResponse<FileUploadResult>>(`${this.basePath}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  async uploadMultipleFiles(files: File[], metadata?: any) {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append('files', file)
    })
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata))
    }
    
    return apiClient.post<ApiResponse<FileUploadResult[]>>(`${this.basePath}/batch`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // File Management
  async getFileById(id: string) {
    return apiClient.get<ApiResponse<FileInfo>>(`${this.basePath}/${id}`)
  }

  async getAllFiles(params?: FileSearchParams) {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}`, { params })
  }

  async updateFile(id: string, data: { filename?: string; metadata?: any }) {
    return apiClient.put<ApiResponse<FileInfo>>(`${this.basePath}/${id}`, data)
  }

  async deleteFile(id: string) {
    return apiClient.delete<ApiResponse<any>>(`${this.basePath}/${id}`)
  }

  async deleteMultipleFiles(ids: string[]) {
    return apiClient.delete<ApiResponse<any>>(`${this.basePath}/batch`, { 
      data: { ids } 
    })
  }

  // File Download
  async downloadFile(id: string) {
    return apiClient.get(`${this.basePath}/${id}/download`, {
      responseType: 'blob'
    })
  }

  async getFileUrl(id: string) {
    return apiClient.get<ApiResponse<{ url: string; expiresAt: string }>>(`${this.basePath}/${id}/url`)
  }

  // File Processing
  async processFile(id: string, processType: string, options?: any) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/${id}/process`, {
      processType,
      options
    })
  }

  async getProcessingStatus(id: string) {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/${id}/process/status`)
  }

  // File Analytics
  async getFileStats() {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/stats`)
  }

  async getStorageUsage() {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/storage/usage`)
  }

  // File Search
  async searchFiles(query: string, params?: FileSearchParams) {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/search`, { 
      params: { q: query, ...params } 
    })
  }

  async getFilesByType(mimeType: string, params?: FileSearchParams) {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/by-type`, { 
      params: { mimeType, ...params } 
    })
  }

  // File Validation
  async validateFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/validate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // File Cleanup
  async cleanupOrphanedFiles() {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/cleanup/orphaned`)
  }

  async cleanupExpiredFiles() {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/cleanup/expired`)
  }
}

// Export instance
export const fileAPI = new FileAPI()


