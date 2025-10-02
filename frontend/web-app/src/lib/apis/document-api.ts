// Document Management Service API
// Base path: /api/v1/document-management-service/v1

import { apiClient } from '../http/api-client'
import { ApiResponse } from '@/types/api'

export interface Contract {
  id: string
  title: string
  content: string
  status: string
  type: string
  parties: string[]
  startDate: string
  endDate: string
  value: number
  currency: string
  createdAt: string
  updatedAt: string
  createdBy: string
  tags: string[]
  attachments: string[]
}

export interface ContractCreateData {
  title: string
  content: string
  type: string
  parties: string[]
  startDate: string
  endDate: string
  value: number
  currency: string
  tags?: string[]
}

export interface ContractUpdateData {
  title?: string
  content?: string
  status?: string
  type?: string
  parties?: string[]
  startDate?: string
  endDate?: string
  value?: number
  currency?: string
  tags?: string[]
}

export interface Document {
  id: string
  title: string
  content: string
  type: string
  status: string
  filePath: string
  fileSize: number
  mimeType: string
  createdAt: string
  updatedAt: string
  createdBy: string
  tags: string[]
}

export interface DocumentCreateData {
  title: string
  content: string
  type: string
  filePath?: string
  tags?: string[]
}

export interface PaginationParams {
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: string
  searchTerm?: string
  includeDeleted?: boolean
}

export class DocumentAPI {
  private basePath = '/api/v1/document-management-service/v1'

  // Contracts
  async getAllContracts(params?: PaginationParams) {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/contracts`, { params })
  }

  async getContractById(id: string) {
    return apiClient.get<ApiResponse<Contract>>(`${this.basePath}/contracts/${id}`)
  }

  async createContract(contractData: ContractCreateData) {
    return apiClient.post<ApiResponse<Contract>>(`${this.basePath}/contracts`, contractData)
  }

  async updateContract(id: string, contractData: ContractUpdateData) {
    return apiClient.put<ApiResponse<Contract>>(`${this.basePath}/contracts/${id}`, contractData)
  }

  async deleteContract(id: string) {
    return apiClient.delete<ApiResponse<any>>(`${this.basePath}/contracts/${id}`)
  }

  async restoreContract(id: string) {
    return apiClient.put<ApiResponse<Contract>>(`${this.basePath}/contracts/${id}/restore`)
  }

  // Documents
  async getAllDocuments(params?: PaginationParams) {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/documents`, { params })
  }

  async getDocumentById(id: string) {
    return apiClient.get<ApiResponse<Document>>(`${this.basePath}/documents/${id}`)
  }

  async createDocument(documentData: DocumentCreateData) {
    return apiClient.post<ApiResponse<Document>>(`${this.basePath}/documents`, documentData)
  }

  async updateDocument(id: string, documentData: Partial<DocumentCreateData>) {
    return apiClient.put<ApiResponse<Document>>(`${this.basePath}/documents/${id}`, documentData)
  }

  async deleteDocument(id: string) {
    return apiClient.delete<ApiResponse<any>>(`${this.basePath}/documents/${id}`)
  }

  async restoreDocument(id: string) {
    return apiClient.put<ApiResponse<Document>>(`${this.basePath}/documents/${id}/restore`)
  }

  // File Management
  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  async getFileById(id: string) {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/files/${id}`)
  }

  async deleteFile(id: string) {
    return apiClient.delete<ApiResponse<any>>(`${this.basePath}/files/${id}`)
  }

  // Attachments
  async getContractAttachments(contractId: string) {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/contracts/${contractId}/attachments`)
  }

  async uploadContractAttachment(contractId: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/contracts/${contractId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // Tags
  async getAllTags() {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/tags`)
  }

  async createTag(name: string, color?: string) {
    return apiClient.post<ApiResponse<any>>(`${this.basePath}/tags`, { name, color })
  }

  async updateTag(id: string, data: { name?: string; color?: string }) {
    return apiClient.put<ApiResponse<any>>(`${this.basePath}/tags/${id}`, data)
  }

  async deleteTag(id: string) {
    return apiClient.delete<ApiResponse<any>>(`${this.basePath}/tags/${id}`)
  }

  async searchTags(query: string) {
    return apiClient.get<ApiResponse<any>>(`${this.basePath}/tags/search`, { 
      params: { q: query } 
    })
  }
}

// Export instance
export const documentAPI = new DocumentAPI()


