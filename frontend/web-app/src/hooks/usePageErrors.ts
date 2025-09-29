'use client'

import { useState, useEffect } from 'react'

export interface PageError {
  page: string
  feature: string
  status: 'critical' | 'warning' | 'info'
  description: string
}

export interface PageErrorSummary {
  hasErrors: boolean
  criticalCount: number
  warningCount: number
  infoCount: number
  errors: PageError[]
}

// Định nghĩa tất cả các lỗi theo từng trang
const PAGE_ERRORS: Record<string, PageError[]> = {
  '/': [
    {
      page: 'Trang chủ (/)',
      feature: 'Tìm kiếm tài liệu',
      status: 'warning',
      description: 'Chức năng tìm kiếm chưa được kết nối với backend'
    }
  ],
  
  '/auth/login': [
    {
      page: 'Đăng nhập (/auth/login)',
      feature: 'Google OAuth',
      status: 'critical',
      description: 'Google OAuth chưa được cấu hình đầy đủ, có thể gây lỗi'
    }
  ],
  
  '/dashboard': [
    {
      page: 'Dashboard (/dashboard)',
      feature: 'Dữ liệu thống kê',
      status: 'critical',
      description: 'Đang sử dụng dữ liệu mock, chưa kết nối API thật'
    }
  ],
  
  '/contracts': [
    {
      page: 'Hợp đồng (/contracts)',
      feature: 'Chỉnh sửa hàng loạt',
      status: 'warning',
      description: 'Chức năng chỉnh sửa hàng loạt hợp đồng chưa được triển khai'
    },
    {
      page: 'Hợp đồng (/contracts)',
      feature: 'Xóa hàng loạt',
      status: 'warning',
      description: 'Chức năng xóa hàng loạt hợp đồng chưa được triển khai'
    },
    {
      page: 'Hợp đồng (/contracts)',
      feature: 'Gửi duyệt hàng loạt',
      status: 'warning',
      description: 'Chức năng gửi duyệt hàng loạt hợp đồng chưa được triển khai'
    }
  ],
  
  '/analytics': [
    {
      page: 'Thống kê (/analytics)',
      feature: 'Dữ liệu biểu đồ',
      status: 'critical',
      description: 'Đang sử dụng dữ liệu mock, chưa kết nối API thật'
    }
  ],
  
  '/settings': [
    {
      page: 'Cài đặt (/settings)',
      feature: 'Lưu cài đặt',
      status: 'critical',
      description: 'Chức năng lưu cài đặt chưa được triển khai'
    }
  ],
  
  '/user-management': [
    {
      page: 'Quản lý người dùng (/user-management)',
      feature: 'Tạo người dùng',
      status: 'critical',
      description: 'Form tạo người dùng chưa có logic xử lý'
    },
    {
      page: 'Quản lý người dùng (/user-management)',
      feature: 'Chỉnh sửa người dùng',
      status: 'critical',
      description: 'Form chỉnh sửa người dùng chưa có logic xử lý'
    },
    {
      page: 'Quản lý người dùng (/user-management)',
      feature: 'Dữ liệu người dùng',
      status: 'critical',
      description: 'Đang sử dụng dữ liệu mock, chưa kết nối API thật'
    }
  ],
  
  '/profile': [
    {
      page: 'Hồ sơ (/profile)',
      feature: 'Cập nhật thông tin',
      status: 'critical',
      description: 'Các component ProfileForm, ProfileAvatar, ProfileSettings, ProfileStats chưa được triển khai'
    }
  ],
  
  '/approval-workflow': [
    {
      page: 'Quy trình phê duyệt (/approval-workflow)',
      feature: 'Tạo quy trình mới',
      status: 'critical',
      description: 'Chức năng tạo quy trình phê duyệt mới chưa được triển khai'
    },
    {
      page: 'Quy trình phê duyệt (/approval-workflow)',
      feature: 'Dữ liệu quy trình',
      status: 'critical',
      description: 'Đang sử dụng dữ liệu mock, chưa kết nối API thật'
    }
  ],
  
  '/e-signature': [
    {
      page: 'Chữ ký điện tử (/e-signature)',
      feature: 'Tạo yêu cầu ký',
      status: 'critical',
      description: 'Chức năng tạo yêu cầu chữ ký điện tử chưa được triển khai'
    },
    {
      page: 'Chữ ký điện tử (/e-signature)',
      feature: 'Dữ liệu yêu cầu ký',
      status: 'critical',
      description: 'Đang sử dụng dữ liệu mock, chưa kết nối API thật'
    }
  ],
  
  '/notifications': [
    {
      page: 'Thông báo (/notifications)',
      feature: 'Chức năng thông báo',
      status: 'critical',
      description: 'Trang thông báo chưa được kiểm tra chi tiết - cần kiểm tra và triển khai'
    }
  ],
  
  '/calendar': [
    {
      page: 'Lịch (/calendar)',
      feature: 'Quản lý lịch',
      status: 'critical',
      description: 'Trang lịch chưa được kiểm tra chi tiết - cần kiểm tra và triển khai'
    }
  ],
  
  '/reports': [
    {
      page: 'Báo cáo (/reports)',
      feature: 'Tạo báo cáo',
      status: 'critical',
      description: 'Trang báo cáo chưa được kiểm tra chi tiết - cần kiểm tra và triển khai'
    }
  ],
  
  '/integrations': [
    {
      page: 'Tích hợp (/integrations)',
      feature: 'Quản lý tích hợp',
      status: 'critical',
      description: 'Trang tích hợp chưa được kiểm tra chi tiết - cần kiểm tra và triển khai'
    }
  ],
  
  '/backup-restore': [
    {
      page: 'Sao lưu & Khôi phục (/backup-restore)',
      feature: 'Sao lưu dữ liệu',
      status: 'critical',
      description: 'Trang sao lưu & khôi phục chưa được kiểm tra chi tiết - cần kiểm tra và triển khai'
    }
  ],
  
  '/activity-history': [
    {
      page: 'Lịch sử hoạt động (/activity-history)',
      feature: 'Theo dõi hoạt động',
      status: 'critical',
      description: 'Trang lịch sử hoạt động chưa được kiểm tra chi tiết - cần kiểm tra và triển khai'
    }
  ],
  
  '/account-approval': [
    {
      page: 'Phê duyệt tài khoản (/account-approval)',
      feature: 'Duyệt tài khoản',
      status: 'critical',
      description: 'Trang phê duyệt tài khoản chưa được kiểm tra chi tiết - cần kiểm tra và triển khai'
    }
  ],
  
  '/collaboration-comments': [
    {
      page: 'Bình luận & Cộng tác (/collaboration-comments)',
      feature: 'Quản lý bình luận',
      status: 'critical',
      description: 'Trang bình luận & cộng tác chưa được kiểm tra chi tiết - cần kiểm tra và triển khai'
    }
  ],
  
  '/contract-versions': [
    {
      page: 'Phiên bản hợp đồng (/contract-versions)',
      feature: 'Quản lý phiên bản',
      status: 'critical',
      description: 'Trang phiên bản hợp đồng chưa được kiểm tra chi tiết - cần kiểm tra và triển khai'
    }
  ],
  
  '/role-based-permissions': [
    {
      page: 'Phân quyền theo vai trò (/role-based-permissions)',
      feature: 'Quản lý phân quyền',
      status: 'critical',
      description: 'Trang phân quyền theo vai trò chưa được kiểm tra chi tiết - cần kiểm tra và triển khai'
    }
  ]
}

export function usePageErrors(pagePath: string): PageErrorSummary {
  const [errorSummary, setErrorSummary] = useState<PageErrorSummary>({
    hasErrors: false,
    criticalCount: 0,
    warningCount: 0,
    infoCount: 0,
    errors: []
  })

  useEffect(() => {
    const errors = PAGE_ERRORS[pagePath] || []
    const criticalCount = errors.filter(e => e.status === 'critical').length
    const warningCount = errors.filter(e => e.status === 'warning').length
    const infoCount = errors.filter(e => e.status === 'info').length
    
    setErrorSummary({
      hasErrors: errors.length > 0,
      criticalCount,
      warningCount,
      infoCount,
      errors
    })
  }, [pagePath])

  return errorSummary
}

export function hasPageErrors(pagePath: string): boolean {
  return (PAGE_ERRORS[pagePath] || []).length > 0
}

export function getPageErrorCount(pagePath: string): number {
  return (PAGE_ERRORS[pagePath] || []).length
}

