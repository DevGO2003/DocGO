// Application Constants
export const APP_CONFIG = {
  NAME: 'DocGO',
  VERSION: '1.0.0',
  DESCRIPTION: 'Hệ thống quản lý tài liệu và hợp đồng thông minh',
  COMPANY: 'DevGO2003',
  SUPPORT_EMAIL: 'support@docgo.com',
  WEBSITE: 'https://docgo.com',
} as const

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_TIME: "yyyy-MM-dd'T'HH:mm:ss",
  ISO: 'yyyy-MM-ddTHH:mm:ss.SSSZ',
} as const

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEET: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    TEXT: ['text/plain', 'text/csv'],
  },
  MAX_FILES: 10,
} as const

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PHONE: {
    PATTERN: /^(\+84|84|0)[0-9]{9}$/,
  },
} as const

// UI Constants
export const UI = {
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
    LARGE_DESKTOP: 1280,
  },
  ANIMATION: {
    DURATION: 200,
    EASING: 'ease-in-out',
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
  },
} as const

// Status Colors
export const STATUS_COLORS = {
  SUCCESS: {
    LIGHT: 'bg-green-100 text-green-800',
    DARK: 'bg-green-600 text-white',
  },
  WARNING: {
    LIGHT: 'bg-yellow-100 text-yellow-800',
    DARK: 'bg-yellow-600 text-white',
  },
  ERROR: {
    LIGHT: 'bg-red-100 text-red-800',
    DARK: 'bg-red-600 text-white',
  },
  INFO: {
    LIGHT: 'bg-blue-100 text-blue-800',
    DARK: 'bg-blue-600 text-white',
  },
  NEUTRAL: {
    LIGHT: 'bg-gray-100 text-gray-800',
    DARK: 'bg-gray-600 text-white',
  },
} as const

// Contract Status
export const CONTRACT_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  TERMINATED: 'TERMINATED',
  ARCHIVED: 'ARCHIVED',
} as const

export const CONTRACT_STATUS_LABELS = {
  [CONTRACT_STATUS.DRAFT]: 'Nháp',
  [CONTRACT_STATUS.PENDING_REVIEW]: 'Chờ duyệt',
  [CONTRACT_STATUS.APPROVED]: 'Đã duyệt',
  [CONTRACT_STATUS.ACTIVE]: 'Đang hoạt động',
  [CONTRACT_STATUS.EXPIRED]: 'Hết hạn',
  [CONTRACT_STATUS.TERMINATED]: 'Đã chấm dứt',
  [CONTRACT_STATUS.ARCHIVED]: 'Đã lưu trữ',
} as const

// Contract Types
export const CONTRACT_TYPES = {
  EMPLOYMENT: 'EMPLOYMENT',
  SERVICE: 'SERVICE',
  PURCHASE: 'PURCHASE',
  LEASE: 'LEASE',
  PARTNERSHIP: 'PARTNERSHIP',
  CONFIDENTIALITY: 'CONFIDENTIALITY',
  OTHER: 'OTHER',
} as const

export const CONTRACT_TYPE_LABELS = {
  [CONTRACT_TYPES.EMPLOYMENT]: 'Lao động',
  [CONTRACT_TYPES.SERVICE]: 'Dịch vụ',
  [CONTRACT_TYPES.PURCHASE]: 'Mua bán',
  [CONTRACT_TYPES.LEASE]: 'Thuê mướn',
  [CONTRACT_TYPES.PARTNERSHIP]: 'Hợp tác',
  [CONTRACT_TYPES.CONFIDENTIALITY]: 'Bảo mật',
  [CONTRACT_TYPES.OTHER]: 'Khác',
} as const

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER',
  VIEWER: 'VIEWER',
} as const

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Quản trị viên',
  [USER_ROLES.MANAGER]: 'Quản lý',
  [USER_ROLES.USER]: 'Người dùng',
  [USER_ROLES.VIEWER]: 'Người xem',
} as const

// User Status
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING: 'PENDING',
} as const

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Hoạt động',
  [USER_STATUS.INACTIVE]: 'Không hoạt động',
  [USER_STATUS.SUSPENDED]: 'Tạm khóa',
  [USER_STATUS.PENDING]: 'Chờ xác nhận',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
} as const

// Route Paths
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DASHBOARD: '/dashboard',
  CONTRACTS: '/contracts',
  USERS: '/users',
  AI_PROCESSING: '/ai-processing',
  DOCUMENTS: '/documents',
  STORAGE: '/storage',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng, vui lòng kiểm tra lại',
  UNAUTHORIZED: 'Bạn không có quyền truy cập',
  FORBIDDEN: 'Truy cập bị từ chối',
  NOT_FOUND: 'Không tìm thấy tài nguyên',
  SERVER_ERROR: 'Lỗi server, vui lòng thử lại sau',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  UNKNOWN_ERROR: 'Đã xảy ra lỗi không xác định',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Tạo mới thành công',
  UPDATED: 'Cập nhật thành công',
  DELETED: 'Xóa thành công',
  UPLOADED: 'Tải lên thành công',
  DOWNLOADED: 'Tải xuống thành công',
  LOGIN: 'Đăng nhập thành công',
  LOGOUT: 'Đăng xuất thành công',
  REGISTER: 'Đăng ký thành công',
} as const
