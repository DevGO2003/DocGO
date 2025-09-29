// Authentication Types - Updated to match backend response format

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

// User types matching backend response
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
  VIEWER = 'VIEWER',
  EMPLOYEE = 'EMPLOYEE' // Added for OAuth compatibility
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED' // Added for backend compatibility
}

// Authentication request/response types
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
  role?: UserRole
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

// Backend Auth Response matching RestResponse format
export interface AuthResponse {
  success: boolean
  message: string
  accessToken: string    // Primary token field
  refreshToken: string
  expiresIn: number
  tokenType: string
  user: User
}

// Wrapped Auth Response (as returned by backend)
export interface AuthApiResponse extends ApiResponse<AuthResponse> {}

// Profile update types
export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  department?: string
  position?: string
  avatar?: string
}

// OAuth types
export interface OAuthUserData {
  id: string
  userId: string
  username: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
}

// Token refresh types
export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  success: boolean
  message: string
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

// Token storage types
export interface TokenData {
  accessToken: string
  refreshToken: string
  expiresAt: number
  tokenType: string
}

// Token validation types
export interface TokenValidationResult {
  isValid: boolean
  isExpired: boolean
  expiresAt?: number
  timeUntilExpiry?: number
}

// Error types
export interface AuthError {
  code: string
  message: string
  details?: string
  field?: string
}

export interface ValidationError {
  field: string
  message: string
  rejectedValue?: any
}

// Auth context types
export interface AuthContextValue {
  user: User | null
  accessToken: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => Promise<void>
  setAuthData: (userData: OAuthUserData) => void
  refreshToken: () => Promise<boolean>
  updateProfile: (data: UpdateProfileRequest) => Promise<boolean>
  changePassword: (data: ChangePasswordRequest) => Promise<boolean>
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (data: ResetPasswordRequest) => Promise<boolean>
  validateToken: () => TokenValidationResult
  isTokenExpired: () => boolean
}

// Form types for auth
export interface LoginFormData {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  agreeToTerms: boolean
}

export interface ForgotPasswordFormData {
  email: string
}

export interface ResetPasswordFormData {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordFormData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// API Error Response
export interface ApiErrorResponse {
  apiVersion: string
  statusCode: number
  shortMessage: string
  description: string
  data: null
  timestamp: string
  requestId: string
  path: string
  errors?: ValidationError[]
}
