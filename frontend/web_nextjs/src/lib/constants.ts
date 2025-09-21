// Application Constants
export const APP_CONFIG = {
  NAME: 'DocGO',
  VERSION: '1.0.0',
  DESCRIPTION: 'Nền tảng quản lý tài liệu và hợp đồng thông minh',
  COMPANY: 'DevGO2003',
  SUPPORT_EMAIL: 'support@docgo.com',
  SUPPORT_PHONE: '+84 123 456 789',
} as const

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
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
  API_TIME: 'yyyy-MM-dd HH:mm:ss',
  ISO: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx',
} as const

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    DOCUMENTS: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
    SPREADSHEETS: ['.xls', '.xlsx', '.csv'],
    PRESENTATIONS: ['.ppt', '.pptx'],
  },
  MAX_FILES: 10,
} as const

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 20,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const

// UI Constants
export const UI = {
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080,
  },
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
} as const

// Status Colors
export const STATUS_COLORS = {
  SUCCESS: 'green',
  WARNING: 'yellow',
  ERROR: 'red',
  INFO: 'blue',
  NEUTRAL: 'gray',
} as const

// Contract Status
export const CONTRACT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
  ARCHIVED: 'archived',
} as const

export const CONTRACT_STATUS_LABELS = {
  [CONTRACT_STATUS.DRAFT]: 'Nháp',
  [CONTRACT_STATUS.PENDING]: 'Chờ phê duyệt',
  [CONTRACT_STATUS.ACTIVE]: 'Đang hoạt động',
  [CONTRACT_STATUS.EXPIRED]: 'Hết hạn',
  [CONTRACT_STATUS.TERMINATED]: 'Đã chấm dứt',
  [CONTRACT_STATUS.ARCHIVED]: 'Đã lưu trữ',
} as const

// Contract Types
export const CONTRACT_TYPES = {
  EMPLOYMENT: 'employment',
  SERVICE: 'service',
  PURCHASE: 'purchase',
  LEASE: 'lease',
  PARTNERSHIP: 'partnership',
  OTHER: 'other',
} as const

export const CONTRACT_TYPE_LABELS = {
  [CONTRACT_TYPES.EMPLOYMENT]: 'Hợp đồng lao động',
  [CONTRACT_TYPES.SERVICE]: 'Hợp đồng dịch vụ',
  [CONTRACT_TYPES.PURCHASE]: 'Hợp đồng mua bán',
  [CONTRACT_TYPES.LEASE]: 'Hợp đồng thuê',
  [CONTRACT_TYPES.PARTNERSHIP]: 'Hợp đồng hợp tác',
  [CONTRACT_TYPES.OTHER]: 'Khác',
} as const

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  GUEST: 'guest',
} as const

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Quản trị viên',
  [USER_ROLES.MANAGER]: 'Quản lý',
  [USER_ROLES.USER]: 'Người dùng',
  [USER_ROLES.GUEST]: 'Khách',
} as const

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
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
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: '/dashboard',
  CONTRACTS: {
    LIST: '/contracts',
    CREATE: '/contracts/create',
    TEMPLATES: '/contracts/templates',
    DETAIL: (id: string) => `/contracts/${id}`,
    EDIT: (id: string) => `/contracts/${id}/edit`,
    VERSIONS: (id: string) => `/contracts/${id}/versions`,
    APPROVAL: (id: string) => `/contracts/${id}/approval`,
  },
  WORKFLOW: {
    APPROVAL: '/workflow/approval',
    SIGNATURE: '/workflow/signature',
    COLLABORATION: '/workflow/collaboration',
    NOTIFICATIONS: '/workflow/notifications',
    CALENDAR: '/workflow/calendar',
  },
  ANALYTICS: {
    OVERVIEW: '/analytics',
    CONTRACTS: '/analytics/contracts',
    PERFORMANCE: '/analytics/performance',
    REPORTS: '/analytics/reports',
  },
  ADMIN: {
    USERS: '/admin/users',
    PERMISSIONS: '/admin/permissions',
    SYSTEM: '/admin/system',
    AUDIT: '/admin/audit',
  },
  TOOLS: {
    AI_PROCESSING: '/tools/ai-processing',
    OCR: '/tools/ocr',
    IMPORT_EXPORT: '/tools/import-export',
    BACKUP: '/tools/backup',
  },
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập trang này.',
  FORBIDDEN: 'Truy cập bị từ chối.',
  NOT_FOUND: 'Không tìm thấy tài nguyên yêu cầu.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  TIMEOUT: 'Yêu cầu hết thời gian chờ. Vui lòng thử lại.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Tạo mới thành công.',
  UPDATED: 'Cập nhật thành công.',
  DELETED: 'Xóa thành công.',
  SAVED: 'Lưu thành công.',
  UPLOADED: 'Tải lên thành công.',
  PROCESSED: 'Xử lý thành công.',
  SENT: 'Gửi thành công.',
  RESTORED: 'Khôi phục thành công.',
} as const
