'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface BackupItem {
  id: string
  name: string
  createdAt: string
  size: string
  type: 'FULL' | 'INCREMENTAL' | 'DIFFERENTIAL'
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED'
  description: string
}

export default function BackupRestorePage() {
  const [activeTab, setActiveTab] = useState('backup')
  const [backups, setBackups] = useState<BackupItem[]>([
    {
      id: '1',
      name: 'backup_full_2024_01_15',
      createdAt: '2024-01-15T10:00:00Z',
      size: '2.5 GB',
      type: 'FULL',
      status: 'COMPLETED',
      description: 'Backup đầy đủ hệ thống'
    },
    {
      id: '2',
      name: 'backup_incremental_2024_01_14',
      createdAt: '2024-01-14T10:00:00Z',
      size: '150 MB',
      type: 'INCREMENTAL',
      status: 'COMPLETED',
      description: 'Backup tăng trưởng'
    },
    {
      id: '3',
      name: 'backup_differential_2024_01_13',
      createdAt: '2024-01-13T10:00:00Z',
      size: '800 MB',
      type: 'DIFFERENTIAL',
      status: 'COMPLETED',
      description: 'Backup khác biệt'
    },
    {
      id: '4',
      name: 'backup_full_2024_01_12',
      createdAt: '2024-01-12T10:00:00Z',
      size: '2.3 GB',
      type: 'FULL',
      status: 'IN_PROGRESS',
      description: 'Backup đang thực hiện...'
    }
  ])

  const [newBackup, setNewBackup] = useState({
    name: '',
    type: 'FULL' as BackupItem['type'],
    description: ''
  })

  const [restoreData, setRestoreData] = useState({
    backupId: '',
    restoreType: 'FULL' as 'FULL' | 'SELECTIVE',
    selectedTables: [] as string[]
  })

  const handleCreateBackup = async () => {
    if (!newBackup.name || !newBackup.description) {
      alert('Vui lòng điền đầy đủ thông tin')
      return
    }

    const backup: BackupItem = {
      id: Date.now().toString(),
      name: newBackup.name,
      createdAt: new Date().toISOString(),
      size: '0 MB',
      type: newBackup.type,
      status: 'IN_PROGRESS',
      description: newBackup.description
    }

    setBackups(prev => [backup, ...prev])
    setNewBackup({ name: '', type: 'FULL', description: '' })
    
    // Mock backup process
    setTimeout(() => {
      setBackups(prev => prev.map(b => 
        b.id === backup.id 
          ? { ...b, status: 'COMPLETED', size: '1.2 GB' }
          : b
      ))
    }, 3000)
  }

  const handleRestore = async (backupId: string) => {
    if (!backupId) {
      alert('Vui lòng chọn backup để khôi phục')
      return
    }

    if (confirm('Bạn có chắc chắn muốn khôi phục dữ liệu? Hành động này không thể hoàn tác!')) {
      alert('Đang khôi phục dữ liệu...')
      // Mock restore process
    }
  }

  const handleDeleteBackup = async (backupId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa backup này?')) {
      setBackups(prev => prev.filter(b => b.id !== backupId))
    }
  }

  const getStatusBadge = (status: BackupItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeBadge = (type: BackupItem['type']) => {
    switch (type) {
      case 'FULL':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'INCREMENTAL':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'DIFFERENTIAL':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
            <p className="mt-1 text-gray-600">Quản lý sao lưu và khôi phục dữ liệu hệ thống.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'backup'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📦 Tạo Backup
          </button>
          <button
            onClick={() => setActiveTab('restore')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'restore'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔄 Khôi phục
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 Lịch sử
          </button>
        </div>

        {/* Backup Tab */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tạo Backup mới</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên backup</label>
                  <input
                    type="text"
                    value={newBackup.name}
                    onChange={(e) => setNewBackup(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="backup_full_2024_01_15"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại backup</label>
                  <select
                    value={newBackup.type}
                    onChange={(e) => setNewBackup(prev => ({ ...prev, type: e.target.value as BackupItem['type'] }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FULL">Full Backup</option>
                    <option value="INCREMENTAL">Incremental Backup</option>
                    <option value="DIFFERENTIAL">Differential Backup</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={newBackup.description}
                  onChange={(e) => setNewBackup(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Mô tả về backup này..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCreateBackup}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Tạo Backup
                </button>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin Backup</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2.5 GB</div>
                  <div className="text-sm text-blue-800">Dung lượng trung bình</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">15</div>
                  <div className="text-sm text-green-800">Backup thành công</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">3 ngày</div>
                  <div className="text-sm text-purple-800">Chu kỳ backup</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restore Tab */}
        {activeTab === 'restore' && (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Khôi phục dữ liệu</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chọn backup</label>
                  <select
                    value={restoreData.backupId}
                    onChange={(e) => setRestoreData(prev => ({ ...prev, backupId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn backup để khôi phục</option>
                    {backups.filter(b => b.status === 'COMPLETED').map(backup => (
                      <option key={backup.id} value={backup.id}>
                        {backup.name} - {formatDate(backup.createdAt)} ({backup.size})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại khôi phục</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="restoreType"
                        value="FULL"
                        checked={restoreData.restoreType === 'FULL'}
                        onChange={(e) => setRestoreData(prev => ({ ...prev, restoreType: e.target.value as 'FULL' | 'SELECTIVE' }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Khôi phục toàn bộ</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="restoreType"
                        value="SELECTIVE"
                        checked={restoreData.restoreType === 'SELECTIVE'}
                        onChange={(e) => setRestoreData(prev => ({ ...prev, restoreType: e.target.value as 'FULL' | 'SELECTIVE' }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Khôi phục có chọn lọc</span>
                    </label>
                  </div>
                </div>
                {restoreData.restoreType === 'SELECTIVE' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chọn bảng dữ liệu</label>
                    <div className="space-y-2">
                      {['contracts', 'users', 'approvals', 'signatures', 'comments'].map(table => (
                        <label key={table} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={restoreData.selectedTables.includes(table)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRestoreData(prev => ({
                                  ...prev,
                                  selectedTables: [...prev.selectedTables, table]
                                }))
                              } else {
                                setRestoreData(prev => ({
                                  ...prev,
                                  selectedTables: prev.selectedTables.filter(t => t !== table)
                                }))
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700 capitalize">{table}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleRestore(restoreData.backupId)}
                  disabled={!restoreData.backupId}
                  className="px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Khôi phục dữ liệu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Lịch sử Backup</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Tên</th>
                      <th className="px-4 py-3 text-left font-medium">Loại</th>
                      <th className="px-4 py-3 text-left font-medium">Kích thước</th>
                      <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                      <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                      <th className="px-4 py-3 text-left font-medium">Mô tả</th>
                      <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {backups.map((backup) => (
                      <tr key={backup.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {backup.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeBadge(backup.type)}`}>
                            {backup.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {backup.size}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatDate(backup.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(backup.status)}`}>
                            {backup.status === 'COMPLETED' ? 'Hoàn thành' :
                             backup.status === 'IN_PROGRESS' ? 'Đang thực hiện' : 'Thất bại'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {backup.description}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {backup.status === 'COMPLETED' && (
                              <button
                                onClick={() => handleRestore(backup.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Khôi phục
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteBackup(backup.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
