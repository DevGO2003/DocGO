'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  Bars3Icon,
  XMarkIcon,
  PencilSquareIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  CodeBracketIcon,
  BellIcon,
  CalendarDaysIcon,
  DocumentChartBarIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Bảng điều khiển', href: '/dashboard', icon: HomeIcon },
  { name: 'Tải lên', href: '/dashboard/upload', icon: CloudArrowUpIcon },
  { name: 'Hợp đồng', href: '/contracts', icon: DocumentTextIcon },
  { name: 'Tạo hợp đồng', href: '/dashboard/create-contract', icon: DocumentDuplicateIcon },
  { name: 'Tạo nhanh', href: '/dashboard/quick-create', icon: PencilSquareIcon },
  { name: 'Chữ ký điện tử', href: '/dashboard/e-signature', icon: PencilSquareIcon },
  { name: 'Bình luận & Cộng tác', href: '/dashboard/collaboration-comments', icon: ChatBubbleLeftRightIcon },
  { name: 'Phiên bản hợp đồng', href: '/dashboard/contract-versions', icon: ClockIcon },
  { name: 'Luồng phê duyệt', href: '/dashboard/approval-workflow', icon: CheckCircleIcon },
  { name: 'Phân quyền theo vai trò', href: '/dashboard/role-based-permissions', icon: ShieldCheckIcon },
  { name: 'Đã duyệt', href: '/dashboard/approved', icon: DocumentTextIcon },
  { name: 'Thống kê', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Báo cáo', href: '/dashboard/reports', icon: DocumentChartBarIcon },
  { name: 'Quản lý người dùng', href: '/dashboard/user-management', icon: UserGroupIcon },
  { name: 'Phê duyệt tài khoản', href: '/dashboard/account-approval', icon: CogIcon },
  { name: 'Thông báo', href: '/dashboard/notifications', icon: BellIcon },
  { name: 'Lịch', href: '/dashboard/calendar', icon: CalendarDaysIcon },
  { name: 'Lịch sử hoạt động', href: '/dashboard/activity-history', icon: ClipboardDocumentListIcon },
  { name: 'Sao lưu & Khôi phục', href: '/dashboard/backup-restore', icon: ArrowPathIcon },
  { name: 'Tài liệu API', href: '/dashboard/api-docs', icon: CodeBracketIcon },
  { name: 'Trợ giúp & Hỗ trợ', href: '/dashboard/help-support', icon: QuestionMarkCircleIcon },
  { name: 'Cài đặt', href: '/dashboard/settings', icon: WrenchScrewdriverIcon },
  { name: 'Hướng dẫn', href: '/dashboard/guide', icon: DocumentTextIcon },
]

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">DocGO</span>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-3">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <DocumentTextIcon className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">DocGO</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-3">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
    </>
  )
}
