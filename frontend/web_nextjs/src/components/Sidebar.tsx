'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
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
  QuestionMarkCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Hợp đồng',
    href: '/contracts',
    icon: DocumentTextIcon,
    children: [
      { name: 'Danh sách', href: '/contracts' },
      { name: 'Tạo mới', href: '/contracts/create' },
      { name: 'Mẫu hợp đồng', href: '/contracts/templates' },
    ]
  },
  {
    name: 'Workflow',
    href: '/workflow/approval',
    icon: CogIcon,
    children: [
      { name: 'Phê duyệt', href: '/workflow/approval' },
      { name: 'Chữ ký điện tử', href: '/workflow/signature' },
      { name: 'Cộng tác', href: '/workflow/collaboration' },
      { name: 'Thông báo', href: '/workflow/notifications' },
      { name: 'Lịch', href: '/workflow/calendar' },
    ]
  },
  {
    name: 'Phân tích',
    href: '/analytics',
    icon: ChartBarIcon,
    children: [
      { name: 'Tổng quan', href: '/analytics' },
      { name: 'Hợp đồng', href: '/analytics/contracts' },
      { name: 'Hiệu suất', href: '/analytics/performance' },
      { name: 'Báo cáo', href: '/analytics/reports' },
    ]
  },
  {
    name: 'Quản trị',
    href: '/admin/users',
    icon: UserGroupIcon,
    children: [
      { name: 'Người dùng', href: '/admin/users' },
      { name: 'Phân quyền', href: '/admin/permissions' },
      { name: 'Hệ thống', href: '/admin/system' },
      { name: 'Audit log', href: '/admin/audit' },
    ]
  },
  {
    name: 'Công cụ',
    href: '/tools/ai-processing',
    icon: WrenchScrewdriverIcon,
    children: [
      { name: 'Xử lý AI', href: '/tools/ai-processing' },
      { name: 'OCR', href: '/tools/ocr' },
      { name: 'Import/Export', href: '/tools/import-export' },
      { name: 'Backup', href: '/tools/backup' },
    ]
  },
  {
    name: 'Cài đặt',
    href: '/settings',
    icon: CogIcon,
  },
]

export default function Sidebar() {
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const renderNavigationItem = (item: any, isMobile = false) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    const isExpanded = expandedItems.includes(item.name)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.name}>
        <div className="flex items-center">
          <Link
            href={item.href}
            className={`sidebar-item flex-1 ${isActive ? 'active' : ''}`}
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <item.icon className="h-5 w-5" />
            <span className="ml-3">{item.name}</span>
          </Link>
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(item.name)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children.map((child: any) => {
              const isChildActive = pathname === child.href
              return (
                <Link
                  key={child.name}
                  href={child.href}
                  className={`sidebar-item text-sm ${isChildActive ? 'active' : ''}`}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <span className="ml-3">{child.name}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

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
            {navigation.map((item) => renderNavigationItem(item, true))}
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
            {navigation.map((item) => renderNavigationItem(item))}
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
