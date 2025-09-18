'use client'

import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'USER' | 'VIEWER'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'
  createdAt: string
  lastLogin?: string
  department?: string
  permissions?: string[]
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/mock/users')
        const json = await res.json()
        setUsers(json?.items || [])
      } catch (e: any) {
        setError(e?.message || 'Lỗi tải người dùng')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filtered = users.filter(u =>
    (!query || (u.name?.toLowerCase().includes(query.toLowerCase()) || u.email?.toLowerCase().includes(query.toLowerCase()))) &&
    (!role || u.role === role) &&
    (!status || u.status === status)
  )

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAll = () => {
    setSelectedUsers(filtered.map(u => u.id))
  }

  const clearSelection = () => {
    setSelectedUsers([])
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return
    
    try {
      // Mock delete API call
      setUsers(prev => prev.filter(u => u.id !== userId))
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    } catch (error) {
      setError('Không thể xóa người dùng')
    }
  }

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.length === 0) return
    
    try {
      if (action === 'delete') {
        if (!confirm(`Bạn có chắc muốn xóa ${selectedUsers.length} người dùng?`)) return
        setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)))
      } else {
        const newStatus = action === 'activate' ? 'ACTIVE' : 'INACTIVE'
        setUsers(prev => prev.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: newStatus } : u
        ))
      }
      setSelectedUsers([])
    } catch (error) {
      setError('Không thể thực hiện thao tác')
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-50 text-red-700 border-red-200'
      case 'MANAGER': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'STAFF': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'USER': return 'bg-green-50 text-green-700 border-green-200'
      case 'VIEWER': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'INACTIVE': return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'SUSPENDED': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-50 via-fuchsia-50 to-pink-50 opacity-50" />
          <div className="relative px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="mt-1 text-gray-600">Create, edit, suspend, and manage user permissions.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
        </div>

        {/* Search and Actions */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <h2 className="text-base font-semibold text-gray-900">Search & Filter</h2>
            <div className="flex items-center gap-2">
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedUsers.length} selected</span>
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-1 text-xs rounded-md bg-gray-600 text-white hover:bg-gray-700"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Clear Selection
                  </button>
                </div>
              )}
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-3 py-2 text-sm rounded-md bg-violet-600 text-white hover:bg-violet-700"
              >
                + Thêm người dùng
              </button>
            </div>
          </div>
          <div className="p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input 
              value={query} 
              onChange={e=>setQuery(e.target.value)} 
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" 
              placeholder="Name / Email" 
            />
            <select 
              value={role} 
              onChange={e=>setRole(e.target.value)} 
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="STAFF">Staff</option>
              <option value="USER">User</option>
              <option value="VIEWER">Viewer</option>
            </select>
            <select 
              value={status} 
              onChange={e=>setStatus(e.target.value)} 
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            <button className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-black">Tìm</button>
          </div>
        </div>

        {error && <div className="rounded-xl border p-4 text-sm text-rose-700 bg-rose-50">{error}</div>}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filtered.length && filtered.length > 0}
                    onChange={selectedUsers.length === filtered.length ? clearSelection : selectAll}
                    className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium">Tên</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Vai trò</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                <th className="px-4 py-3 text-left font-medium">Lần đăng nhập cuối</th>
                <th className="px-4 py-3 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 w-4 bg-gray-200 rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-40 bg-gray-200 rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                  <td className="px-4 py-3 text-right"><div className="h-4 w-24 bg-gray-200 rounded ml-auto" /></td>
                </tr>
              ))}
              {!loading && filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u.id)}
                      onChange={() => toggleSelectUser(u.id)}
                      className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-medium">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{u.name}</div>
                        {u.department && <div className="text-xs text-gray-500">{u.department}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getRoleBadgeClass(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(u.status)}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditUser(u)}
                        className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-2 py-1 text-xs rounded border border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Xóa
                      </button>
                      <div className="relative">
                        <button className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                          ⋮
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm người dùng mới</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Nhập tên người dùng"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                    <option value="USER">User</option>
                    <option value="STAFF">Staff</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Nhập phòng ban"
                  />
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
                    className="px-4 py-2 text-sm rounded-md bg-violet-600 text-white hover:bg-violet-700"
                  >
                    Tạo người dùng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chỉnh sửa người dùng</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                  <input
                    type="text"
                    defaultValue={editingUser.name}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={editingUser.email}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <select 
                    defaultValue={editingUser.role}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="USER">User</option>
                    <option value="STAFF">Staff</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select 
                    defaultValue={editingUser.status}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
                  <input
                    type="text"
                    defaultValue={editingUser.department || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Nhập phòng ban"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingUser(null)
                    }}
                    className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm rounded-md bg-violet-600 text-white hover:bg-violet-700"
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

