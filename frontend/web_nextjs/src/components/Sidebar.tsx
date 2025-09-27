'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { hasPageErrors } from '@/hooks/usePageErrors'
import { LoadingSpinner } from './LoadingSpinner'
import { AnimatedMenuItem } from './MenuItemAnimation'
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
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { nameKey: 'navigation.dashboard', href: '/dashboard', icon: HomeIcon },
  { nameKey: 'navigation.analytics', href: '/analytics', icon: ChartBarIcon },
  { nameKey: 'navigation.contracts', href: '/contracts', icon: DocumentTextIcon },
  { nameKey: 'navigation.importDocument', href: '/import-document', icon: DocumentDuplicateIcon },
  { nameKey: 'navigation.eSignature', href: '/e-signature', icon: PencilSquareIcon },
  { nameKey: 'navigation.collaboration', href: '/collaboration-comments', icon: ChatBubbleLeftRightIcon },
  { nameKey: 'navigation.versions', href: '/contract-versions', icon: ClockIcon },
  { nameKey: 'navigation.approval', href: '/approval-workflow', icon: CheckCircleIcon },
  { nameKey: 'navigation.permissions', href: '/role-based-permissions', icon: ShieldCheckIcon },
  { nameKey: 'navigation.approved', href: '/dashboard/approved', icon: DocumentTextIcon },
  { nameKey: 'navigation.reports', href: '/reports', icon: DocumentChartBarIcon },
  { nameKey: 'navigation.users', href: '/user-management', icon: UserGroupIcon },
  { nameKey: 'navigation.accountApproval', href: '/account-approval', icon: CogIcon },
  { nameKey: 'navigation.notifications', href: '/notifications', icon: BellIcon },
  { nameKey: 'navigation.calendar', href: '/calendar', icon: CalendarDaysIcon },
  { nameKey: 'navigation.activity', href: '/activity-history', icon: ClipboardDocumentListIcon },
  { nameKey: 'navigation.backup', href: '/backup-restore', icon: ArrowPathIcon },
  { nameKey: 'navigation.integrations', href: '/integrations', icon: CodeBracketIcon },
  { nameKey: 'navigation.help', href: '/help-support', icon: QuestionMarkCircleIcon },
  { nameKey: 'navigation.settings', href: '/settings', icon: WrenchScrewdriverIcon },
  { nameKey: 'navigation.aiProcessing', href: '/ai-processing', icon: DocumentTextIcon },
]

export default function Sidebar() {
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [showAll, setShowAll] = useState(false)
  const [clickedItem, setClickedItem] = useState<string | null>(null)
  const visibleItems = showAll ? navigation : navigation.slice(0, 6)

  const handleMenuClick = (href: string, nameKey: string) => {
    // Nếu đang ở trang hiện tại, không làm gì
    if (pathname === href) return
    
    // Set clicked item để hiển thị loading animation
    setClickedItem(nameKey)
    
    // Đóng sidebar mobile nếu đang mở
    setSidebarOpen(false)
    
    // Navigate sau một chút delay để animation kịp hiển thị
    setTimeout(() => {
      router.push(href)
      // Reset clicked item sau khi navigate
      setTimeout(() => {
        setClickedItem(null)
      }, 1000)
    }, 100)
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
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const hasErrors = hasPageErrors(item.href)
              const isClicked = clickedItem === item.nameKey
              
              return (
                <AnimatedMenuItem
                  key={item.nameKey}
                  icon={item.icon}
                  label={t(item.nameKey)}
                  isLoading={isClicked}
                  onClick={() => handleMenuClick(item.href, item.nameKey)}
                  disabled={isClicked}
                  isActive={isActive}
                  hasError={hasErrors}
                  className="sidebar-item"
                />
              )
            })}
          </nav>
          {navigation.length > 6 && (
            <div className="px-2 py-3 border-t border-gray-100">
              <button
                type="button"
                className="w-full text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md px-3 py-2"
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll ? 'Thu gọn' : 'Xem thêm'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <DocumentTextIcon className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">DocGO</span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const hasErrors = hasPageErrors(item.href)
              const isClicked = clickedItem === item.nameKey
              
              return (
                <AnimatedMenuItem
                  key={item.nameKey}
                  icon={item.icon}
                  label={t(item.nameKey)}
                  isLoading={isClicked}
                  onClick={() => handleMenuClick(item.href, item.nameKey)}
                  disabled={isClicked}
                  isActive={isActive}
                  hasError={hasErrors}
                  className="sidebar-item"
                />
              )
            })}
          </nav>
          {navigation.length > 6 && (
            <div className="px-2 py-3 border-t border-gray-100">
              <button
                type="button"
                className="w-full text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md px-3 py-2"
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll ? 'Thu gọn' : 'Xem thêm'}
              </button>
            </div>
          )}
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
