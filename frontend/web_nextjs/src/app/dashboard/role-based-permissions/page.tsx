'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface Permission {
  id: string
  name: string
  description: string
  category: string
  actions: string[]
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

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'ACTIVE' | 'INACTIVE'
  lastLogin?: string
}

export default function RoleBasedPermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'permissions' | 'roles' | 'users'>('permissions')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [permissionsRes, rolesRes, usersRes] = await Promise.all([
          fetch('/api/mock/permissions'),
          fetch('/api/mock/roles'),
          fetch('/api/mock/users')
        ])
        
        const [permissionsData, rolesData, usersData] = await Promise.all([
          permissionsRes.json(),
          rolesRes.json(),
          usersRes.json()
        ])
        
        setPermissions(permissionsData?.items || [])
        setRoles(rolesData?.items || [])
        setUsers(usersData?.items || [])
      } catch (e: any) {
        setError(e?.message || 'Lỗi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCreateRole = async (roleData: any) => {
    try {
      const res = await fetch('/api/mock/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData)
      })
      if (!res.ok) throw new Error('Không thể tạo vai trò')
      
      const json = await res.json()
      setRoles(prev => [json.data, ...prev])
      setShowCreateModal(false)
    } catch (error) {
      setError('Không thể tạo vai trò')
    }
  }

  const handleUpdateRole = async (roleId: string, roleData: any) => {
    try {
      const res = await fetch('/api/mock/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: roleId, ...roleData })
      })
      if (!res.ok) throw new Error('Không thể cập nhật vai trò')
      
      const json = await res.json()
      setRoles(prev => prev.map(role => role.id === roleId ? json.data : role))
      setShowEditModal(false)
      setSelectedRole(null)
    } catch (error) {
      setError('Không thể cập nhật vai trò')
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Bạn có chắc muốn xóa vai trò này?')) return
    
    try {
      const res = await fetch('/api/mock/roles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: roleId })
      })
      if (!res.ok) throw new Error('Không thể xóa vai trò')
      
      setRoles(prev => prev.filter(role => role.id !== roleId))
    } catch (error) {
      setError('Không thể xóa vai trò')
    }
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setSelectedPermissions(role.permissions)
    setShowEditModal(true)
  }

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const getRoleBadgeClass = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN': return 'bg-red-50 text-red-700 border-red-200'
      case 'MANAGER': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'STAFF': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'USER': return 'bg-green-50 text-green-700 border-green-200'
      case 'VIEWER': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPermissionCategoryClass = (category: string) => {
    switch (category) {
      case 'CONTRACT': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'USER': return 'bg-green-50 text-green-700 border-green-200'
      case 'SYSTEM': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'REPORT': return 'bg-orange-50 text-orange-700 border-orange-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Quyền sửa theo vai trò</h1>
            <p className="mt-1 text-gray-600">Quản lý quyền hạn và vai trò người dùng trong hệ thống.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        </div>

        {/* Tabs */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4">
            <nav className="flex space-x-8">
              {[
                { id: 'permissions', name: 'Quyền hạn', count: permissions.length },
                { id: 'roles', name: 'Vai trò', count: roles.length },
                { id: 'users', name: 'Người dùng', count: users.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {error && <div className="rounded border p-3 text-sm text-rose-700 bg-rose-50">{error}</div>}
        
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {!loading && activeTab === 'permissions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Danh sách quyền hạn</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <div key={category} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPermissionCategoryClass(category)}`}>
                      {category}
                    </span>
                    <h3 className="text-base font-semibold text-gray-900">{category}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{permission.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {permission.actions.map((action, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                  {action}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Danh sách vai trò</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                + Tạo vai trò mới
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <div key={role.id} className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getRoleBadgeClass(role.name)}`}>
                          {role.name}
                        </span>
                        <span className="text-sm text-gray-500">{role.userCount} người dùng</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Quyền hạn:</div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permissionId, index) => {
                        const permission = permissions.find(p => p.id === permissionId)
                        return (
                          <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {permission?.name || permissionId}
                          </span>
                        )
                      })}
                      {role.permissions.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          +{role.permissions.length - 3} khác
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Tạo: {new Date(role.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span>Cập nhật: {new Date(role.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditRole(role)}
                      className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Danh sách người dùng</h2>
            </div>
            
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Người dùng</th>
                    <th className="px-4 py-3 text-left font-medium">Vai trò</th>
                    <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                    <th className="px-4 py-3 text-left font-medium">Lần đăng nhập cuối</th>
                    <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          user.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                          Chỉnh sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Role Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tạo vai trò mới</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên vai trò</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Nhập tên vai trò..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Nhập mô tả vai trò..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Quyền hạn</label>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                      <div key={category} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getPermissionCategoryClass(category)}`}>
                            {category}
                          </span>
                          <h4 className="font-medium text-gray-900">{category}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categoryPermissions.map((permission) => (
                            <label key={permission.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={() => togglePermission(permission.id)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700">{permission.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Tạo vai trò
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {showEditModal && selectedRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chỉnh sửa vai trò</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên vai trò</label>
                  <input
                    type="text"
                    defaultValue={selectedRole.name}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    rows={3}
                    defaultValue={selectedRole.description}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Quyền hạn</label>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                      <div key={category} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getPermissionCategoryClass(category)}`}>
                            {category}
                          </span>
                          <h4 className="font-medium text-gray-900">{category}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categoryPermissions.map((permission) => (
                            <label key={permission.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={() => togglePermission(permission.id)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <span className="text-sm text-gray-700">{permission.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setSelectedRole(null)
                    }}
                    className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
