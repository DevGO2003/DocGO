// Common types
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

// Contract types
export interface Contract {
  id: string
  title: string
  description?: string
  content: string
  status: ContractStatus
  type: ContractType
  parties: ContractParty[]
  effectiveDate: string
  expiryDate?: string
  value?: number
  currency?: string
  tags: string[]
  attachments: Attachment[]
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
  deletedAt?: string
  deletedBy?: string
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
  ARCHIVED = 'ARCHIVED'
}

export enum ContractType {
  EMPLOYMENT = 'EMPLOYMENT',
  SERVICE = 'SERVICE',
  PURCHASE = 'PURCHASE',
  LEASE = 'LEASE',
  PARTNERSHIP = 'PARTNERSHIP',
  CONFIDENTIALITY = 'CONFIDENTIALITY',
  OTHER = 'OTHER'
}

export interface ContractParty {
  id: string
  name: string
  type: 'INDIVIDUAL' | 'ORGANIZATION'
  role: 'BUYER' | 'SELLER' | 'CLIENT' | 'PROVIDER' | 'PARTNER'
  email?: string
  phone?: string
  address?: string
  taxId?: string
}

export interface Attachment {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedAt: string
  uploadedBy: string
}

// User types
export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  role: UserRole
  status: UserStatus
  avatar?: string
  phone?: string
  department?: string
  position?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  VIEWER = 'VIEWER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING'
}

// AI Processing types
export interface AIExtractRequest {
  file: File
  apiKey?: string
}

export interface AIExtractResponse {
  extractedText: string
  confidence: number
  processingTime: number
}

export interface AISummarizeRequest {
  text?: string
  file?: File
  apiKey?: string
}

export interface AISummarizeResponse {
  summary: string
  keyPoints: string[]
  confidence: number
  processingTime: number
}

// File Storage types
export interface FileMetadata {
  filename: string
  originalName: string
  mimeType: string
  size: number
  tags?: string[]
  description?: string
  category?: string
}

export interface StoredFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  metadata: FileMetadata
  uploadedAt: string
  uploadedBy: string
  lastAccessedAt?: string
  accessCount: number
}

// Re-export authentication types from auth.ts
export * from './auth'

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'file'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    message?: string
  }
}

export interface FormData {
  [key: string]: any
}

// UI types
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export interface TableColumn<T> {
  key: keyof T
  header: string
  sortable?: boolean
  width?: string
  render?: (value: any, item: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  pagination?: {
    currentPage: number
    totalPages: number
    totalElements: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
  sorting?: {
    sortBy: keyof T
    sortDirection: 'ASC' | 'DESC'
    onSort: (key: keyof T) => void
  }
  onRowClick?: (item: T) => void
  selectedRows?: T[]
  onSelectionChange?: (selected: T[]) => void
}
