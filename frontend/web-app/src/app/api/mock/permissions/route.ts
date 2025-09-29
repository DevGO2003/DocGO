import { NextResponse } from 'next/server'

const permissions = [
  // Contract permissions
  {
    id: 'CONTRACT_VIEW',
    name: 'Xem hợp đồng',
    description: 'Xem danh sách và chi tiết hợp đồng',
    category: 'CONTRACT',
    actions: ['READ']
  },
  {
    id: 'CONTRACT_CREATE',
    name: 'Tạo hợp đồng',
    description: 'Tạo hợp đồng mới',
    category: 'CONTRACT',
    actions: ['CREATE']
  },
  {
    id: 'CONTRACT_EDIT',
    name: 'Chỉnh sửa hợp đồng',
    description: 'Chỉnh sửa thông tin hợp đồng',
    category: 'CONTRACT',
    actions: ['UPDATE']
  },
  {
    id: 'CONTRACT_DELETE',
    name: 'Xóa hợp đồng',
    description: 'Xóa hợp đồng khỏi hệ thống',
    category: 'CONTRACT',
    actions: ['DELETE']
  },
  {
    id: 'CONTRACT_APPROVE',
    name: 'Phê duyệt hợp đồng',
    description: 'Phê duyệt hoặc từ chối hợp đồng',
    category: 'CONTRACT',
    actions: ['APPROVE', 'REJECT']
  },
  {
    id: 'CONTRACT_SIGN',
    name: 'Ký hợp đồng',
    description: 'Ký điện tử hợp đồng',
    category: 'CONTRACT',
    actions: ['SIGN']
  },
  {
    id: 'CONTRACT_VERSION',
    name: 'Quản lý phiên bản',
    description: 'Tạo và quản lý phiên bản hợp đồng',
    category: 'CONTRACT',
    actions: ['VERSION', 'COMPARE']
  },
  {
    id: 'CONTRACT_COMMENT',
    name: 'Bình luận hợp đồng',
    description: 'Thêm bình luận và cộng tác trên hợp đồng',
    category: 'CONTRACT',
    actions: ['COMMENT', 'REPLY']
  },
  
  // User permissions
  {
    id: 'USER_VIEW',
    name: 'Xem người dùng',
    description: 'Xem danh sách và thông tin người dùng',
    category: 'USER',
    actions: ['READ']
  },
  {
    id: 'USER_CREATE',
    name: 'Tạo người dùng',
    description: 'Tạo tài khoản người dùng mới',
    category: 'USER',
    actions: ['CREATE']
  },
  {
    id: 'USER_EDIT',
    name: 'Chỉnh sửa người dùng',
    description: 'Chỉnh sửa thông tin người dùng',
    category: 'USER',
    actions: ['UPDATE']
  },
  {
    id: 'USER_DELETE',
    name: 'Xóa người dùng',
    description: 'Xóa tài khoản người dùng',
    category: 'USER',
    actions: ['DELETE']
  },
  {
    id: 'USER_ROLE',
    name: 'Phân quyền người dùng',
    description: 'Thay đổi vai trò và quyền hạn người dùng',
    category: 'USER',
    actions: ['ASSIGN_ROLE', 'CHANGE_PERMISSION']
  },
  {
    id: 'USER_APPROVE',
    name: 'Phê duyệt tài khoản',
    description: 'Phê duyệt hoặc từ chối tài khoản mới',
    category: 'USER',
    actions: ['APPROVE', 'REJECT']
  },
  
  // System permissions
  {
    id: 'SYSTEM_CONFIG',
    name: 'Cấu hình hệ thống',
    description: 'Thay đổi cấu hình hệ thống',
    category: 'SYSTEM',
    actions: ['CONFIG']
  },
  {
    id: 'SYSTEM_BACKUP',
    name: 'Sao lưu dữ liệu',
    description: 'Tạo và khôi phục sao lưu dữ liệu',
    category: 'SYSTEM',
    actions: ['BACKUP', 'RESTORE']
  },
  {
    id: 'SYSTEM_LOG',
    name: 'Xem nhật ký hệ thống',
    description: 'Xem nhật ký hoạt động hệ thống',
    category: 'SYSTEM',
    actions: ['VIEW_LOG']
  },
  {
    id: 'SYSTEM_MAINTENANCE',
    name: 'Bảo trì hệ thống',
    description: 'Thực hiện bảo trì và cập nhật hệ thống',
    category: 'SYSTEM',
    actions: ['MAINTENANCE', 'UPDATE']
  },
  
  // Report permissions
  {
    id: 'REPORT_VIEW',
    name: 'Xem báo cáo',
    description: 'Xem các báo cáo thống kê',
    category: 'REPORT',
    actions: ['READ']
  },
  {
    id: 'REPORT_CREATE',
    name: 'Tạo báo cáo',
    description: 'Tạo báo cáo tùy chỉnh',
    category: 'REPORT',
    actions: ['CREATE']
  },
  {
    id: 'REPORT_EXPORT',
    name: 'Xuất báo cáo',
    description: 'Xuất báo cáo ra file',
    category: 'REPORT',
    actions: ['EXPORT']
  },
  {
    id: 'REPORT_SCHEDULE',
    name: 'Lập lịch báo cáo',
    description: 'Tự động tạo và gửi báo cáo',
    category: 'REPORT',
    actions: ['SCHEDULE']
  }
]

export async function GET() {
  return NextResponse.json({ 
    items: permissions,
    total: permissions.length,
    page: 1,
    pageSize: permissions.length
  })
}
