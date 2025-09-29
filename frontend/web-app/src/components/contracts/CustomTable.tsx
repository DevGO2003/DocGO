'use client'

import React from 'react'
import Link from 'next/link'
import { TableColumn } from './TableSettings'

interface ContractItem {
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

interface CustomTableProps {
  items: ContractItem[]
  columns: TableColumn[]
  selectedItems: string[]
  onToggleSelect: (id: string) => void
  onSelectAll: () => void
  onClearSelection: () => void
  translateContractStatus: (status: string, t: any) => string
  translateContractType: (type: string, t: any) => string
  translateContractTag: (tag: string, t: any) => string
  badgeClass: (status: string) => string
  t: any
}

export default function CustomTable({
  items,
  columns,
  selectedItems,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  translateContractStatus,
  translateContractType,
  translateContractTag,
  badgeClass,
  t
}: CustomTableProps) {
  const visibleColumns = columns.filter(col => col.visible).sort((a, b) => a.order - b.order)
  const allSelected = selectedItems.length === items.length && items.length > 0

  const renderCellContent = (column: TableColumn, item: ContractItem) => {
    switch (column.key) {
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => onToggleSelect(item.id)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        )
      
      case 'title':
        return (
          <div>
            <Link href={`/contracts/${item.id}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">
              {item.title}
            </Link>
            <p className="text-sm text-gray-500 line-clamp-1">{item.description || 'Không có mô tả'}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.tags?.slice(0,2).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  #{translateContractTag(tag, t)}
                </span>
              ))}
            </div>
          </div>
        )
      
      case 'contractNumber':
        return <span className="text-sm text-gray-900">{item.contractNumber || '-'}</span>
      
      case 'status':
        return (
          <span className={`text-xs px-2 py-1 rounded-full border ${badgeClass(item.status)}`}>
            {translateContractStatus(item.status, t)}
          </span>
        )
      
      case 'contractType':
        return <span className="text-sm text-gray-900">{translateContractType(item.contractType, t)}</span>
      
      case 'totalValue':
        return (
          <span className="text-sm text-gray-900">
            {item.totalValue.toLocaleString('vi-VN')} {item.currency}
          </span>
        )
      
      case 'effectiveDate':
        return <span className="text-sm text-gray-900">{item.effectiveDate}</span>
      
      case 'expiryDate':
        return <span className="text-sm text-gray-900">{item.expiryDate || '-'}</span>
      
      case 'riskLevel':
        return (
          <div className="flex items-center gap-2">
            {item.riskLevel ? (
              <span className={`text-xs px-2 py-1 rounded-full border ${
                item.riskLevel === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                item.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>{item.riskLevel}</span>
            ) : '-'}
            {item.reminders && item.reminders.length > 0 && (
              <span title="Có nhắc nhở" className="ml-2">🔔</span>
            )}
          </div>
        )
      
      case 'parties':
        return (
          <span className="text-sm text-gray-900 truncate max-w-[200px]">
            {item.parties.map(p => p.name).filter(Boolean).slice(0,2).join(' · ')}
          </span>
        )
      
      case 'createdAt':
        return <span className="text-sm text-gray-900">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
      
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            <Link href={`/contracts/${item.id}`} className="text-indigo-600 hover:text-indigo-900 text-sm">
              Xem
            </Link>
            <button className="text-gray-400 hover:text-gray-600 text-sm">
              ⋮
            </button>
          </div>
        )
      
      default:
        return <span className="text-sm text-gray-900">-</span>
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns.map(column => (
                <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.key === 'checkbox' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={allSelected ? onClearSelection : onSelectAll}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-xs text-gray-500">
                        {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                      </span>
                    </div>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                {visibleColumns.map(column => (
                  <td key={column.key} className="px-6 py-4">
                    {renderCellContent(column, item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
