export interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  isRead: boolean
  createdAt: string
  actionUrl?: string
  actionText?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

// Mock data cho notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Hợp đồng mới cần phê duyệt',
    message: 'Hợp đồng lao động #HD-001 đã được tạo và đang chờ phê duyệt từ bạn.',
    type: 'WARNING',
    isRead: false,
    createdAt: '2024-01-15T10:30:00Z',
    actionUrl: '/dashboard/hop-dong/1',
    actionText: 'Xem hợp đồng',
    priority: 'HIGH'
  },
  {
    id: '2',
    title: 'Chữ ký điện tử hoàn thành',
    message: 'Hợp đồng mua bán #HD-002 đã được ký thành công bởi tất cả các bên.',
    type: 'SUCCESS',
    isRead: false,
    createdAt: '2024-01-15T10:25:00Z',
    actionUrl: '/dashboard/hop-dong/2',
    actionText: 'Xem hợp đồng',
    priority: 'MEDIUM'
  },
  {
    id: '3',
    title: 'Hợp đồng sắp hết hạn',
    message: 'Hợp đồng dịch vụ #HD-003 sẽ hết hạn trong 3 ngày tới.',
    type: 'WARNING',
    isRead: true,
    createdAt: '2024-01-15T10:20:00Z',
    actionUrl: '/dashboard/hop-dong/3',
    actionText: 'Xem hợp đồng',
    priority: 'HIGH'
  },
  {
    id: '4',
    title: 'Tài khoản mới đăng ký',
    message: 'Nguyễn Văn A đã đăng ký tài khoản và đang chờ phê duyệt.',
    type: 'INFO',
    isRead: false,
    createdAt: '2024-01-15T10:15:00Z',
    actionUrl: '/dashboard/phe-duyet-tai-khoan',
    actionText: 'Phê duyệt',
    priority: 'MEDIUM'
  },
  {
    id: '5',
    title: 'Lỗi xử lý tài liệu',
    message: 'Không thể xử lý tài liệu PDF do định dạng không hỗ trợ.',
    type: 'ERROR',
    isRead: true,
    createdAt: '2024-01-15T10:10:00Z',
    actionUrl: '/dashboard/upload',
    actionText: 'Thử lại',
    priority: 'LOW'
  },
  {
    id: '6',
    title: 'Báo cáo hàng tháng',
    message: 'Báo cáo thống kê tháng 1/2024 đã sẵn sàng để xem.',
    type: 'INFO',
    isRead: false,
    createdAt: '2024-01-15T10:05:00Z',
    actionUrl: '/dashboard/reports',
    actionText: 'Xem báo cáo',
    priority: 'LOW'
  },
  {
    id: '7',
    title: 'Cập nhật hệ thống',
    message: 'Hệ thống sẽ được cập nhật vào 2:00 AM ngày mai.',
    type: 'WARNING',
    isRead: false,
    createdAt: '2024-01-15T10:00:00Z',
    actionUrl: '/dashboard/maintenance',
    actionText: 'Chi tiết',
    priority: 'MEDIUM'
  },
  {
    id: '8',
    title: 'Backup dữ liệu thành công',
    message: 'Quá trình sao lưu dữ liệu đã hoàn thành thành công.',
    type: 'SUCCESS',
    isRead: true,
    createdAt: '2024-01-15T09:55:00Z',
    actionUrl: '/dashboard/backup',
    actionText: 'Xem chi tiết',
    priority: 'LOW'
  }
]

// Helper functions
export const getTypeIcon = (type: Notification['type']): string => {
  switch (type) {
    case 'SUCCESS':
      return '✅'
    case 'WARNING':
      return '⚠️'
    case 'ERROR':
      return '❌'
    case 'INFO':
    default:
      return 'ℹ️'
  }
}

export const getTypeColor = (type: Notification['type']): string => {
  switch (type) {
    case 'SUCCESS':
      return 'text-green-600 bg-green-50'
    case 'WARNING':
      return 'text-yellow-600 bg-yellow-50'
    case 'ERROR':
      return 'text-red-600 bg-red-50'
    case 'INFO':
    default:
      return 'text-blue-600 bg-blue-50'
  }
}

export const getPriorityColor = (priority: Notification['priority']): string => {
  switch (priority) {
    case 'URGENT':
      return 'text-red-600 bg-red-100'
    case 'HIGH':
      return 'text-orange-600 bg-orange-100'
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-100'
    case 'LOW':
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export const formatNotificationTime = (createdAt: string): string => {
  const now = new Date()
  const notificationTime = new Date(createdAt)
  const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Vừa xong'
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} giờ trước`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} ngày trước`
  
  return notificationTime.toLocaleDateString('vi-VN')
}

