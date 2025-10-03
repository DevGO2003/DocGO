	'use client'

import { useEffect, useMemo, useState } from 'react'
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
  AdjustmentsHorizontalIcon,
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
import { BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

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
  { nameKey: 'navigation.organization', href: '/organization', icon: BuildingOfficeIcon },
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
  const [isEditMode, setIsEditMode] = useState(false)
  const [menuOrder, setMenuOrder] = useState<string[]>([])
  const [pinnedKeys, setPinnedKeys] = useState<string[]>([])
  const [draggingKey, setDraggingKey] = useState<string | null>(null)

  const ORDER_STORAGE_KEY = 'sidebar_menu_order'
  const PIN_STORAGE_KEY = 'sidebar_menu_pins'

  useEffect(() => {
    const defaultOrder = navigation.map((n) => n.nameKey)
    try {
      const savedOrder = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || '[]') as string[]
      const savedPins = JSON.parse(localStorage.getItem(PIN_STORAGE_KEY) || '[]') as string[]
      const mergedOrder = Array.from(new Set([...(savedOrder || []), ...defaultOrder]))
      setMenuOrder(mergedOrder)
      setPinnedKeys((savedPins || []).filter((k) => defaultOrder.includes(k)))
    } catch {
      setMenuOrder(defaultOrder)
      setPinnedKeys([])
    }
  }, [])

  const orderedItems = useMemo(() => {
    const keyToItem = new Map(navigation.map((n) => [n.nameKey, n]))
    const allKeys = navigation.map((n) => n.nameKey)
    const orderIndex = new Map(menuOrder.map((k, i) => [k, i]))
    const pins = pinnedKeys.filter((k) => allKeys.includes(k)).sort((a, b) => (orderIndex.get(a)! - orderIndex.get(b)!))
    const normals = menuOrder.filter((k) => allKeys.includes(k) && !pinnedKeys.includes(k))
    return [...pins, ...normals].map((k) => keyToItem.get(k)!).filter(Boolean) as typeof navigation
  }, [menuOrder, pinnedKeys])

  const visibleItems = showAll ? orderedItems : orderedItems.slice(0, 6)

  const handleMenuClick = (href: string, nameKey: string) => {
    // Nếu đang ở trang hiện tại, không làm gì
    if (pathname === href) return
    if (isEditMode) return
    
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

  const togglePin = (nameKey: string) => {
    setPinnedKeys((prev) => {
      const next = prev.includes(nameKey) ? prev.filter((k) => k !== nameKey) : [...prev, nameKey]
      localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const onDragStart = (nameKey: string) => setDraggingKey(nameKey)
  const onDragOver = (e: React.DragEvent) => {
    if (isEditMode) e.preventDefault()
  }
  const onDrop = (targetKey: string) => {
    if (!isEditMode || !draggingKey || draggingKey === targetKey) return
    setMenuOrder((prev) => {
      const next = prev.filter((k) => k !== draggingKey)
      const targetIndex = next.indexOf(targetKey)
      next.splice(targetIndex, 0, draggingKey)
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(next))
      return [...next]
    })
    setDraggingKey(null)
  }

  const renderMenuRow = (item: typeof navigation[number]) => {
    const isActive = Boolean(pathname === item.href || (pathname && pathname.startsWith(item.href + '/')))
    const hasErrors = hasPageErrors(item.href)
    const isClicked = clickedItem === item.nameKey
    const isPinned = pinnedKeys.includes(item.nameKey)

    if (!isEditMode) {
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
    }

    return (
      <div
        key={item.nameKey}
        className={`flex items-center justify-between px-2 py-2 rounded-md border ${draggingKey === item.nameKey ? 'bg-gray-50 border-primary-200' : 'bg-white border-gray-200'} cursor-move`}
        draggable={true}
        onDragStart={() => onDragStart(item.nameKey)}
        onDragOver={onDragOver}
        onDrop={() => onDrop(item.nameKey)}
      >
        <div className="flex items-center space-x-3">
          <Bars3Icon className="h-5 w-5 text-gray-400" />
          <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${isActive ? 'text-primary-700' : 'text-gray-700'}`}>{t(item.nameKey)}</span>
          {hasErrors && <span className="ml-1 inline-block h-2 w-2 rounded-full bg-red-400" />}
        </div>
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100"
          onClick={() => togglePin(item.nameKey)}
          aria-label={isPinned ? 'Unpin' : 'Pin'}
        >
          {isPinned ? (
            <StarSolidIcon className="h-5 w-5 text-yellow-400" />
          ) : (
            <StarOutlineIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
		<div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white h-[50vh] overflow-hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">DocGO</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className={`${isEditMode ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} p-2 rounded-md`}
                onClick={() => setIsEditMode((v) => !v)}
                title="Chỉnh menu"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <nav className="flex-1 space-y-2 px-2 py-4 overflow-y-auto">
            {visibleItems.map((item) => renderMenuRow(item))}
          </nav>
          {navigation.length > 6 && (
            <div className="mt-auto bg-gradient-to-r from-gray-50 to-gray-100 px-2 py-3 border-t border-gray-200">
              <button
                type="button"
                className="group relative w-full text-sm font-medium text-gray-700 hover:text-white bg-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-200 hover:border-transparent"
                onClick={() => setShowAll((v) => !v)}
              >
                <div className="flex items-center justify-center gap-2">
                  {showAll ? (
                    <>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span>Thu gọn</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>Xem thêm</span>
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}
        </div>
      </div>

		{/* Desktop sidebar */}
		<div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
			<div className="sticky top-16 flex flex-col bg-white border-r border-gray-200 max-h-[calc(100vh-6rem)] overflow-hidden">
          <div className="flex h-16 items-center px-4 justify-between">
            <DocumentTextIcon className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">DocGO</span>
            <button
              type="button"
              className={`${isEditMode ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} ml-auto p-2 rounded-md`}
              onClick={() => setIsEditMode((v) => !v)}
              title="Chỉnh menu"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-2 py-4 overflow-y-auto">
            {visibleItems.map((item) => renderMenuRow(item))}
          </nav>
          {navigation.length > 6 && (
            <div className="mt-auto bg-gradient-to-r from-gray-50 to-gray-100 px-2 py-3 border-t border-gray-200">
              <button
                type="button"
                className="group relative w-full text-sm font-medium text-gray-700 hover:text-white bg-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-200 hover:border-transparent"
                onClick={() => setShowAll((v) => !v)}
              >
                <div className="flex items-center justify-center gap-2">
                  {showAll ? (
                    <>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span>Thu gọn</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>Xem thêm</span>
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
