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

// Contract Types - English Constants
export const CONTRACT_TYPES = {
  SERVICE_AGREEMENT: 'SERVICE_AGREEMENT',
  CONSULTING_AGREEMENT: 'CONSULTING_AGREEMENT',
  MAINTENANCE_AGREEMENT: 'MAINTENANCE_AGREEMENT',
  SUPPORT_AGREEMENT: 'SUPPORT_AGREEMENT',
  TRAINING_AGREEMENT: 'TRAINING_AGREEMENT',
  PURCHASE_AGREEMENT: 'PURCHASE_AGREEMENT',
  SUPPLY_AGREEMENT: 'SUPPLY_AGREEMENT',
  PROCUREMENT_AGREEMENT: 'PROCUREMENT_AGREEMENT',
  LEASE_AGREEMENT: 'LEASE_AGREEMENT',
  RENTAL_AGREEMENT: 'RENTAL_AGREEMENT',
  EQUIPMENT_LEASE: 'EQUIPMENT_LEASE',
  EMPLOYMENT_CONTRACT: 'EMPLOYMENT_CONTRACT',
  CONSULTANT_CONTRACT: 'CONSULTANT_CONTRACT',
  FREELANCER_CONTRACT: 'FREELANCER_CONTRACT',
  INTERN_AGREEMENT: 'INTERN_AGREEMENT',
  CONFIDENTIALITY_AGREEMENT: 'CONFIDENTIALITY_AGREEMENT',
  NON_DISCLOSURE_AGREEMENT: 'NON_DISCLOSURE_AGREEMENT',
  NON_COMPETE_AGREEMENT: 'NON_COMPETE_AGREEMENT',
  PARTNERSHIP_AGREEMENT: 'PARTNERSHIP_AGREEMENT',
  JOINT_VENTURE_AGREEMENT: 'JOINT_VENTURE_AGREEMENT',
  DISTRIBUTION_AGREEMENT: 'DISTRIBUTION_AGREEMENT',
  FRANCHISE_AGREEMENT: 'FRANCHISE_AGREEMENT',
  LICENSING_AGREEMENT: 'LICENSING_AGREEMENT',
  SOFTWARE_LICENSE: 'SOFTWARE_LICENSE',
  TRADEMARK_LICENSE: 'TRADEMARK_LICENSE',
  PATENT_LICENSE: 'PATENT_LICENSE',
  LOAN_AGREEMENT: 'LOAN_AGREEMENT',
  CREDIT_AGREEMENT: 'CREDIT_AGREEMENT',
  INVESTMENT_AGREEMENT: 'INVESTMENT_AGREEMENT',
  INSURANCE_AGREEMENT: 'INSURANCE_AGREEMENT',
  SAAS_AGREEMENT: 'SAAS_AGREEMENT',
  CLOUD_AGREEMENT: 'CLOUD_AGREEMENT',
  HOSTING_AGREEMENT: 'HOSTING_AGREEMENT',
  DEVELOPMENT_AGREEMENT: 'DEVELOPMENT_AGREEMENT',
  ADVERTISING_AGREEMENT: 'ADVERTISING_AGREEMENT',
  MARKETING_AGREEMENT: 'MARKETING_AGREEMENT',
  SPONSORSHIP_AGREEMENT: 'SPONSORSHIP_AGREEMENT',
  PROPERTY_LEASE: 'PROPERTY_LEASE',
  PROPERTY_PURCHASE: 'PROPERTY_PURCHASE',
  CONSTRUCTION_AGREEMENT: 'CONSTRUCTION_AGREEMENT',
  SETTLEMENT_AGREEMENT: 'SETTLEMENT_AGREEMENT',
  ARBITRATION_AGREEMENT: 'ARBITRATION_AGREEMENT',
  MEDIATION_AGREEMENT: 'MEDIATION_AGREEMENT',
  AMENDMENT_AGREEMENT: 'AMENDMENT_AGREEMENT',
  TERMINATION_AGREEMENT: 'TERMINATION_AGREEMENT',
  RENEWAL_AGREEMENT: 'RENEWAL_AGREEMENT',
  ASSIGNMENT_AGREEMENT: 'ASSIGNMENT_AGREEMENT',
  OTHER: 'OTHER',
  GENERAL: 'GENERAL',
  NDA: 'NDA',
} as const

export const CONTRACT_TYPE_LABELS = {
  [CONTRACT_TYPES.SERVICE_AGREEMENT]: 'Hợp đồng dịch vụ',
  [CONTRACT_TYPES.CONSULTING_AGREEMENT]: 'Hợp đồng tư vấn',
  [CONTRACT_TYPES.MAINTENANCE_AGREEMENT]: 'Hợp đồng bảo trì',
  [CONTRACT_TYPES.SUPPORT_AGREEMENT]: 'Hợp đồng hỗ trợ',
  [CONTRACT_TYPES.TRAINING_AGREEMENT]: 'Hợp đồng đào tạo',
  [CONTRACT_TYPES.PURCHASE_AGREEMENT]: 'Hợp đồng mua bán',
  [CONTRACT_TYPES.SUPPLY_AGREEMENT]: 'Hợp đồng cung ứng',
  [CONTRACT_TYPES.PROCUREMENT_AGREEMENT]: 'Hợp đồng mua sắm',
  [CONTRACT_TYPES.LEASE_AGREEMENT]: 'Hợp đồng thuê',
  [CONTRACT_TYPES.RENTAL_AGREEMENT]: 'Hợp đồng cho thuê',
  [CONTRACT_TYPES.EQUIPMENT_LEASE]: 'Hợp đồng thuê thiết bị',
  [CONTRACT_TYPES.EMPLOYMENT_CONTRACT]: 'Hợp đồng lao động',
  [CONTRACT_TYPES.CONSULTANT_CONTRACT]: 'Hợp đồng tư vấn viên',
  [CONTRACT_TYPES.FREELANCER_CONTRACT]: 'Hợp đồng freelancer',
  [CONTRACT_TYPES.INTERN_AGREEMENT]: 'Hợp đồng thực tập',
  [CONTRACT_TYPES.CONFIDENTIALITY_AGREEMENT]: 'Hợp đồng bảo mật',
  [CONTRACT_TYPES.NON_DISCLOSURE_AGREEMENT]: 'Thỏa thuận bảo mật',
  [CONTRACT_TYPES.NON_COMPETE_AGREEMENT]: 'Thỏa thuận không cạnh tranh',
  [CONTRACT_TYPES.PARTNERSHIP_AGREEMENT]: 'Hợp đồng đối tác',
  [CONTRACT_TYPES.JOINT_VENTURE_AGREEMENT]: 'Hợp đồng liên doanh',
  [CONTRACT_TYPES.DISTRIBUTION_AGREEMENT]: 'Hợp đồng phân phối',
  [CONTRACT_TYPES.FRANCHISE_AGREEMENT]: 'Hợp đồng nhượng quyền',
  [CONTRACT_TYPES.LICENSING_AGREEMENT]: 'Hợp đồng cấp phép',
  [CONTRACT_TYPES.SOFTWARE_LICENSE]: 'Giấy phép phần mềm',
  [CONTRACT_TYPES.TRADEMARK_LICENSE]: 'Giấy phép thương hiệu',
  [CONTRACT_TYPES.PATENT_LICENSE]: 'Giấy phép bằng sáng chế',
  [CONTRACT_TYPES.LOAN_AGREEMENT]: 'Hợp đồng vay',
  [CONTRACT_TYPES.CREDIT_AGREEMENT]: 'Hợp đồng tín dụng',
  [CONTRACT_TYPES.INVESTMENT_AGREEMENT]: 'Hợp đồng đầu tư',
  [CONTRACT_TYPES.INSURANCE_AGREEMENT]: 'Hợp đồng bảo hiểm',
  [CONTRACT_TYPES.SAAS_AGREEMENT]: 'Hợp đồng SaaS',
  [CONTRACT_TYPES.CLOUD_AGREEMENT]: 'Hợp đồng đám mây',
  [CONTRACT_TYPES.HOSTING_AGREEMENT]: 'Hợp đồng hosting',
  [CONTRACT_TYPES.DEVELOPMENT_AGREEMENT]: 'Hợp đồng phát triển',
  [CONTRACT_TYPES.ADVERTISING_AGREEMENT]: 'Hợp đồng quảng cáo',
  [CONTRACT_TYPES.MARKETING_AGREEMENT]: 'Hợp đồng marketing',
  [CONTRACT_TYPES.SPONSORSHIP_AGREEMENT]: 'Hợp đồng tài trợ',
  [CONTRACT_TYPES.PROPERTY_LEASE]: 'Hợp đồng thuê bất động sản',
  [CONTRACT_TYPES.PROPERTY_PURCHASE]: 'Hợp đồng mua bất động sản',
  [CONTRACT_TYPES.CONSTRUCTION_AGREEMENT]: 'Hợp đồng xây dựng',
  [CONTRACT_TYPES.SETTLEMENT_AGREEMENT]: 'Thỏa thuận dàn xếp',
  [CONTRACT_TYPES.ARBITRATION_AGREEMENT]: 'Thỏa thuận trọng tài',
  [CONTRACT_TYPES.MEDIATION_AGREEMENT]: 'Thỏa thuận hòa giải',
  [CONTRACT_TYPES.AMENDMENT_AGREEMENT]: 'Phụ lục hợp đồng',
  [CONTRACT_TYPES.TERMINATION_AGREEMENT]: 'Thỏa thuận chấm dứt',
  [CONTRACT_TYPES.RENEWAL_AGREEMENT]: 'Thỏa thuận gia hạn',
  [CONTRACT_TYPES.ASSIGNMENT_AGREEMENT]: 'Thỏa thuận chuyển nhượng',
  [CONTRACT_TYPES.OTHER]: 'Khác',
  [CONTRACT_TYPES.GENERAL]: 'Chung',
  [CONTRACT_TYPES.NDA]: 'Thỏa thuận bảo mật',
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
