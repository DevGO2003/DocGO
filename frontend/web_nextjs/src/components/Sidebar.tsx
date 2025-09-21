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
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { nameKey: 'navigation.dashboard', href: '/dashboard', icon: HomeIcon },
  { nameKey: 'navigation.analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { nameKey: 'navigation.quickCreate', href: '/dashboard/quick-create', icon: PencilSquareIcon },
  { nameKey: 'navigation.contracts', href: '/contracts', icon: DocumentTextIcon },
  { nameKey: 'navigation.createContract', href: '/dashboard/create-contract', icon: DocumentDuplicateIcon },
  { nameKey: 'navigation.eSignature', href: '/dashboard/e-signature', icon: PencilSquareIcon },
  { nameKey: 'navigation.collaboration', href: '/dashboard/collaboration-comments', icon: ChatBubbleLeftRightIcon },
  { nameKey: 'navigation.versions', href: '/dashboard/contract-versions', icon: ClockIcon },
  { nameKey: 'navigation.approval', href: '/dashboard/approval-workflow', icon: CheckCircleIcon },
  { nameKey: 'navigation.permissions', href: '/dashboard/role-based-permissions', icon: ShieldCheckIcon },
  { nameKey: 'navigation.approved', href: '/dashboard/approved', icon: DocumentTextIcon },
  { nameKey: 'navigation.reports', href: '/dashboard/reports', icon: DocumentChartBarIcon },
  { nameKey: 'navigation.users', href: '/dashboard/user-management', icon: UserGroupIcon },
  { nameKey: 'navigation.accountApproval', href: '/dashboard/account-approval', icon: CogIcon },
  { nameKey: 'navigation.notifications', href: '/dashboard/notifications', icon: BellIcon },
  { nameKey: 'navigation.calendar', href: '/dashboard/calendar', icon: CalendarDaysIcon },
  { nameKey: 'navigation.activity', href: '/dashboard/activity-history', icon: ClipboardDocumentListIcon },
  { nameKey: 'navigation.backup', href: '/dashboard/backup-restore', icon: ArrowPathIcon },
  { nameKey: 'navigation.integrations', href: '/dashboard/integrations', icon: CodeBracketIcon },
  { nameKey: 'navigation.help', href: '/dashboard/help-support', icon: QuestionMarkCircleIcon },
  { nameKey: 'navigation.settings', href: '/dashboard/settings', icon: WrenchScrewdriverIcon },
  { nameKey: 'navigation.aiProcessing', href: '/ai-processing', icon: DocumentTextIcon },
]

export default function Sidebar() {
  const { t } = useTranslation()
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
                  key={item.nameKey}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-3">{t(item.nameKey)}</span>
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
                  key={item.nameKey}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-3">{t(item.nameKey)}</span>
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
