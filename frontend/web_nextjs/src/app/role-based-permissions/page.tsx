'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
  category: 'CONTRACT' | 'USER' | 'SYSTEM' | 'REPORT'
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  createdAt: string
  updatedAt: string
}

export default function RoleBasedPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'CONTRACT' | 'USER' | 'SYSTEM' | 'REPORT'>('ALL')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const filteredPermissions = permissions.filter(permission => filter === 'ALL' || permission.category === filter)

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'CONTRACT': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'USER': return 'bg-green-50 text-green-700 border-green-200'
      case 'SYSTEM': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'REPORT': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setShowEditModal(true)
  }

  const handleDeleteRole = (roleId: string) => {
    if (confirm('Bạn có chắc muốn xóa vai trò này?')) {
      setRoles(prev => prev.filter(role => role.id !== roleId))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Phân quyền theo vai trò</h1>
            <p className="mt-1 text-gray-600">Quản lý vai trò và quyền hạn người dùng</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
        </div>

        {/* Filters and Actions */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Vai trò</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="CONTRACT">Hợp đồng</option>
                <option value="USER">Người dùng</option>
                <option value="SYSTEM">Hệ thống</option>
                <option value="REPORT">Báo cáo</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-3 py-2 text-sm rounded-md bg-violet-600 text-white hover:bg-violet-700"
              >
                + Tạo vai trò
              </button>
              <button className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                📚 Tài liệu
              </button>
            </div>
          </div>
        </div>

        {/* Roles List */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Tên vai trò</th>
                  <th className="px-4 py-3 text-left font-medium">Mô tả</th>
                  <th className="px-4 py-3 text-left font-medium">Số quyền</th>
                  <th className="px-4 py-3 text-left font-medium">Số người dùng</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                  <th className="px-4 py-3 text-left font-medium">Cập nhật</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {roles.map(role => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{role.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate text-gray-600">{role.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                        {role.permissions.length}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {role.userCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(role.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(role.updatedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditRole(role)}
                          className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Chỉnh sửa
                        </button>
                        <button 
                          onClick={() => handleDeleteRole(role.id)}
                          className="px-2 py-1 text-xs rounded border border-red-300 text-red-700 hover:bg-red-50"
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

        {/* Permissions List */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 bg-gray-50/60">
            <h3 className="text-base font-semibold text-gray-900">Danh sách quyền</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPermissions.map(permission => (
                <div key={permission.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{permission.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryBadgeClass(permission.category)}`}>
                      {permission.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{permission.description}</p>
                  <div className="text-xs text-gray-500">
                    {permission.resource} • {permission.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
