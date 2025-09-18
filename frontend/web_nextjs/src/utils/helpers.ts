import { format, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CONTRACT_STATUS, CONTRACT_TYPES, USER_ROLES, USER_STATUS } from '@/lib/constants'

// Date formatting helpers
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatStr, { locale: vi })
  } catch (error) {
    return 'N/A'
  }
}

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm')
}

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Vừa xong'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`
    
    return formatDate(dateObj)
  } catch (error) {
    return 'N/A'
  }
}

// String manipulation helpers
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const capitalizeFirst = (text: string): string => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+84|84|0)[0-9]{9,10}$/
  return phoneRegex.test(phone)
}

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && 
         /[a-z]/.test(password) && 
         /[A-Z]/.test(password) && 
         /[0-9]/.test(password)
}

// Storage helpers
export const storage = {
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

// Permission helpers
export const hasPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    [USER_ROLES.GUEST]: 0,
    [USER_ROLES.USER]: 1,
    [USER_ROLES.MANAGER]: 2,
    [USER_ROLES.ADMIN]: 3,
  }
  
  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= 
         roleHierarchy[requiredRole as keyof typeof roleHierarchy]
}

export const canEditContract = (userRole: string, contractStatus: string): boolean => {
  if (userRole === USER_ROLES.ADMIN) return true
  if (userRole === USER_ROLES.MANAGER) return contractStatus !== CONTRACT_STATUS.ARCHIVED
  return contractStatus === CONTRACT_STATUS.DRAFT
}

export const canDeleteContract = (userRole: string, contractStatus: string): boolean => {
  if (userRole === USER_ROLES.ADMIN) return true
  if (userRole === USER_ROLES.MANAGER) return contractStatus === CONTRACT_STATUS.DRAFT
  return false
}

// File helpers
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export const isImageFile = (file: File): boolean => {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  return imageTypes.indexOf(file.type) !== -1
}

export const isDocumentFile = (file: File): boolean => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf'
  ]
  return documentTypes.indexOf(file.type) !== -1
}

export const validateFile = (file: File, maxSize: number = 10 * 1024 * 1024): string | null => {
  if (file.size > maxSize) {
    return `Kích thước file không được vượt quá ${formatFileSize(maxSize)}`
  }
  
  return null
}
