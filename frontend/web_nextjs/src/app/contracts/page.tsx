'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout'
import { MagnifyingGlassIcon, TagIcon } from '@heroicons/react/24/outline'
import { contractAPI } from '@/lib/api'
import { InlineLoading } from '@/components/ui/LoadingSpinner'
import { tagAPI } from '@/lib/api'
import { useTranslation } from '@/hooks/useTranslation'
import { translateContractType, translateContractStatus, translateContractTag, getContractTypes, getContractStatuses } from '@/utils/tagTranslations'

type ContractItem = {
  id: string
  title: string
  description?: string
  status: string
  contractType: string
  tags?: string[]
  contractNumber?: string
  createdAt: string
  updatedAt: string
  creatorId: number
  parties: { name: string; role: string }[]
  totalValue: number
  currency: string
  effectiveDate: string
  expiryDate: string
  riskLevel?: string
  reminders?: any[]
}

// STATUS_OPTIONS will be generated dynamically using getContractStatuses
const TYPES = ['ALL','SERVICE_AGREEMENT','PURCHASE_AGREEMENT','PARTNERSHIP_AGREEMENT','EMPLOYMENT_CONTRACT','CONFIDENTIALITY_AGREEMENT','OTHER'] as const
const TAGS = ['ưu_tiên','gấp','gia_hạn','cao_giá','đối_tác_mới','rủi_ro']

export default function ContractsPage() {
  const { t } = useTranslation()
  const [items, setItems] = useState<ContractItem[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [status, setStatus] = useState<string>('ALL')
  const [type, setType] = useState<string>('ALL')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [page, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(9)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const abortRef = useRef<AbortController | null>(null)

  // Removed manual queryString builder; fetchData composes params directly

  const fetchData = async () => {
    console.log('[Contracts] Starting fetchData...')
    setLoading(true)
    try {
      // Abort previous in-flight request
      if (abortRef.current) {
        console.log('[Contracts] Aborting previous request')
        try { 
          abortRef.current.abort() 
        } catch (e) {
          console.warn('[Contracts] Error aborting previous request:', e)
        }
      }
      const controller = new AbortController()
      abortRef.current = controller

      const params: any = {
        pageNumber: page,
        pageSize,
        includeDeleted: false,
      }
      const trimmed = debouncedSearch.trim()
      if (trimmed.length >= 2) params.searchTerm = trimmed
      if (sortBy) params.sortBy = sortBy
      if (sortDirection) params.sortDirection = sortDirection.toUpperCase()
      if (status && status !== 'ALL') params.status = status
      if (type && type !== 'ALL') params.type = type
      if (selectedTags.length > 0) params.tags = selectedTags.join(',')

      console.log('[Contracts] Request params:', params)

      // Ensure valid token before making request
      const { default: TokenRefreshHelper } = await import('@/utils/token-refresh-helper')
      const tokenValid = await TokenRefreshHelper.ensureValidToken()
      
      if (!tokenValid) {
        console.warn('[Contracts] Token validation failed, request may fail')
      }

      console.log('[Contracts] Making API request...')
      const res = await contractAPI.getContracts(params, { signal: controller.signal })
      const payload: any = res.data?.data || {}
      const content = Array.isArray(payload.content) ? payload.content : []

      const computeExpiryDate = (effectiveDate: string, term: string | undefined): string => {
        if (!effectiveDate || !term) return ''
        // Try to parse term as number of months (e.g., "12", "12M", "12 months")
        const match = String(term).match(/(\d{1,3})\s*(m|mo|mon|month|months)?/i)
        if (match) {
          const months = parseInt(match[1], 10)
          if (!isNaN(months)) {
            const d = new Date(effectiveDate)
            if (!isNaN(d.getTime())) {
              d.setMonth(d.getMonth() + months)
              return d.toISOString().slice(0, 10)
            }
          }
        }
        return ''
      }

      const mapped: ContractItem[] = content.map((c: any) => ({
        id: String(c.id),
        title: c.title || c.contractNumber || `Contract ${c.id}`,
        description: c.object || c.description || '',
        status: c.status || 'DRAFT',
        contractType: c.contractType || 'Other',
        tags: c.tags || [],
        contractNumber: c.contractNumber,
        createdAt: c.createdAt || '',
        updatedAt: c.updatedAt || '',
        creatorId: 0,
        parties: (c.parties || []).map((p: any) => ({ name: p.name || '', role: p.role || '' })),
        totalValue: Number(c.paymentDetails?.totalValue || 0),
        currency: c.paymentDetails?.currency || 'VND',
        effectiveDate: c.effectiveDate || '',
        expiryDate: c.expiryDate || computeExpiryDate(c.effectiveDate, c.term),
        riskLevel: c.riskAssessment?.riskLevel,
        reminders: Array.isArray(c.reminders) ? c.reminders : [],
      }))

      setItems(mapped)
      const totalPagesFromApi = payload?.result?.totalPages ?? payload?.totalPages ?? 1
      setTotalPages(Number(totalPagesFromApi) || 1)
      console.log('[Contracts] Successfully fetched data:', {
        itemsCount: mapped.length,
        totalPages: totalPagesFromApi,
        response: res.data
      })
    } catch (e: any) {
      console.error('[Contracts] Error fetching data:', {
        error: e,
        message: e?.message,
        response: e?.response?.data,
        status: e?.response?.status,
        params: {
          page,
          pageSize,
          status,
          type,
          selectedTags,
          sortBy,
          sortDirection,
          search: debouncedSearch
        }
      })
      setItems([])
      setTotalPages(1)
    } finally {
      setLoading(false)
      console.log('[Contracts] Fetch completed')
    }
  }

  // Load available tags once
  useEffect(() => {
    const loadTags = async () => {
      try {
        const res = await tagAPI.getAllTags()
        const payload: any = res.data?.data
        const tagsFromApi: string[] = Array.isArray(payload) ? payload : []
        setAvailableTags(tagsFromApi)
      } catch {
        setAvailableTags([])
      }
    }
    loadTags()
  }, [])

  // Unified data fetching with debounce for all filters
  useEffect(() => {
    const handler = setTimeout(() => {
      console.log('[Contracts] Fetching data with params:', {
        page,
        pageSize,
        status,
        type,
        selectedTags,
        sortBy,
        sortDirection,
        search: debouncedSearch
      })
      fetchData()
    }, 300) // Reduced debounce time for better UX
    
    return () => clearTimeout(handler)
  }, [page, pageSize, status, type, selectedTags, sortBy, sortDirection, debouncedSearch])

  // Separate effect for search input to update debouncedSearch
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(0) // Reset to first page when searching
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  const toggleTag = (t: string) => {
    setPage(0)
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedItems(items.map(item => item.id))
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  // Removed handleSearch; using debounced search

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Fancy Header */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-sm">
          <div className="relative z-10 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Quản lý Hợp đồng
              </h1>
              <p className="text-gray-600">Tìm kiếm, lọc trạng thái/loại và gắn thẻ nhanh</p>
            </div>
            <div className="flex gap-2">
              <Link href="/import-document" className="px-4 py-2 rounded-lg bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 shadow-sm">
                + Tạo hợp đồng
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-purple-200/30 blur-3xl" />
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm theo tiêu đề hoặc mô tả"
                  className="w-full rounded-lg border-gray-300 pl-10 pr-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(0) }}
                className="w-full rounded-lg border-gray-300 py-2 px-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {getContractStatuses(t).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <select
                value={type}
                onChange={(e) => { setType(e.target.value); setPage(0) }}
                className="w-full rounded-lg border-gray-300 py-2 px-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {getContractTypes(t).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <span>{showAdvanced ? 'Ẩn' : 'Hiện'} tùy chọn nâng cao</span>
              <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {showAdvanced && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sắp xếp theo:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border-gray-300 py-1 px-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="createdAt">Ngày tạo</option>
                    <option value="title">Tên hợp đồng</option>
                    <option value="status">Trạng thái</option>
                    <option value="totalValue">Giá trị</option>
                    <option value="effectiveDate">Ngày hiệu lực</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Thứ tự:</label>
                  <button
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
                  >
                    {sortDirection === 'asc' ? '↑ Tăng dần' : '↓ Giảm dần'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(availableTags.length > 0 ? availableTags : TAGS).map(t => {
              const active = selectedTags.includes(t)
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition ${active ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  <TagIcon className="h-4 w-4" />
                  {t}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <span className="text-sm text-gray-600">
              {items.length} hợp đồng
              {selectedItems.length > 0 && ` · ${selectedItems.length} đã chọn`}
            </span>
          </div>
          
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={clearSelection}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Bỏ chọn
              </button>
              <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
                🗑️ Xóa ({selectedItems.length})
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                📤 Gửi duyệt ({selectedItems.length})
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          {loading ? (
            <InlineLoading text="Đang tải hợp đồng..." size="lg" />
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600">Không tìm thấy hợp đồng phù hợp.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map(c => (
                <div key={c.id} className="group bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition relative">
                  <div className="absolute top-4 left-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(c.id)}
                      onChange={() => toggleSelectItem(c.id)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </div>
                  <Link href={`/contracts/${c.id}`} className="block">
                    <div className="flex justify-between items-start gap-4 ml-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-700 transition">{c.title}</h3>
                        {c.contractNumber && (
                          <div className="mt-1 text-xs text-gray-500">Mã HĐ: {c.contractNumber}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {c.reminders && c.reminders.length > 0 && (
                          <span title="Có nhắc nhở" className="text-amber-600">🔔</span>
                        )}
                        {c.riskLevel && (
                          <span className={`text-xs px-2 py-1 rounded-full border ${
                            c.riskLevel === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            c.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>{c.riskLevel}</span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full border ${badgeClass(c.status)}`}>{translateContractStatus(c.status, t)}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3 ml-6">{c.description || 'Không có mô tả'}</p>
                    <div className="mt-3 flex flex-wrap gap-2 ml-6">
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">{translateContractType(c.contractType, t)}</span>
                      {c.tags?.slice(0,3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200">#{translateContractTag(tag, t)}</span>
                      ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-500 space-y-1 ml-6">
                      <div className="flex justify-between"><span>Hiệu lực</span><span>{c.effectiveDate}</span></div>
                      <div className="flex justify-between"><span>Hết hạn</span><span>{c.expiryDate}</span></div>
                      <div className="flex justify-between"><span>Giá trị</span><span>{c.totalValue.toLocaleString('vi-VN')} {c.currency}</span></div>
                      {c.parties && c.parties.length > 0 && (
                        <div className="flex justify-between"><span>Đối tác</span><span className="truncate max-w-[60%]">{c.parties.map(p => p.name).filter(Boolean).slice(0,2).join(' · ')}</span></div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === items.length && items.length > 0}
                          onChange={selectedItems.length === items.length ? clearSelection : selectAll}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hợp đồng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã HĐ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hiệu lực</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hết hạn</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rủi ro</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(c.id)}
                            onChange={() => toggleSelectItem(c.id)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <Link href={`/contracts/${c.id}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                              {c.title}
                            </Link>
                            <p className="text-sm text-gray-500 line-clamp-1">{c.description || 'Không có mô tả'}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {c.tags?.slice(0,2).map(t => (
                                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">#{t}</span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{c.contractNumber || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full border ${badgeClass(c.status)}`}>{translateContractStatus(c.status, t)}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{c.contractType}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{c.totalValue.toLocaleString('vi-VN')} {c.currency}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{c.effectiveDate}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{c.expiryDate || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {c.riskLevel ? (
                            <span className={`text-xs px-2 py-1 rounded-full border ${
                              c.riskLevel === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              c.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>{c.riskLevel}</span>
                          ) : '-'}
                          {c.reminders && c.reminders.length > 0 && (
                            <span title="Có nhắc nhở" className="ml-2">🔔</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/contracts/${c.id}`} className="text-indigo-600 hover:text-indigo-900 text-sm">
                              Xem
                            </Link>
                            <button className="text-gray-400 hover:text-gray-600 text-sm">
                              ⋮
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-2 text-sm rounded-md border bg-white text-gray-700 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-600">Trang {page + 1} / {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-2 text-sm rounded-md border bg-white text-gray-700 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              )}
        </div>
      </div>
    </DashboardLayout>
  )
}

function badgeClass(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'bg-gray-50 text-gray-700 border-gray-200'
    case 'PENDING_REVIEW':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'APPROVED':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'ACTIVE':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'EXPIRED':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'TERMINATED':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'ARCHIVED':
      return 'bg-slate-50 text-slate-700 border-slate-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}
