// API Exports - Centralized API access
// Tất cả API calls được gom vào đây để dễ quản lý

// User Management APIs
export { userAPI, UserAPI } from './user-api'
export type { 
  LoginCredentials, 
  RegisterData, 
  User, 
  ProfileUpdateData, 
  PasswordChangeData 
} from './user-api'

// Document Management APIs
export { documentAPI, DocumentAPI } from './document-api'
export type { 
  Contract, 
  ContractCreateData, 
  ContractUpdateData,
  Document,
  DocumentCreateData,
  PaginationParams
} from './document-api'

// Automation APIs
export { automationAPI, AutomationAPI } from './automation-api'
export type { 
  ExtractResult, 
  SummarizeResult, 
  ProcessResult, 
  ValidationResult,
  BatchProcessResult
} from './automation-api'

// File Storage APIs
export { fileAPI, FileAPI } from './file-api'
export type { 
  FileUploadResult, 
  FileInfo, 
  FileSearchParams 
} from './file-api'

// Legacy API Client (for backward compatibility) - avoid circular imports
export { apiClient } from '../http/api-client'
export type { ApiResponse } from '@/types/api'


