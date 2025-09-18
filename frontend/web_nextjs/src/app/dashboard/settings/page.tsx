'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    general: {
      companyName: 'Công ty DocGO',
      companyAddress: '123 Đường ABC, Quận 1, TP.HCM',
      companyPhone: '0123456789',
      companyEmail: 'info@docgo.com',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi',
      dateFormat: 'DD/MM/YYYY'
    },
    approval: {
      autoApproval: false,
      maxApprovalDays: 7,
      reminderDays: [3, 1],
      requireComments: true,
      approvalLevels: [
        { minValue: 0, maxValue: 100000000, approvers: ['Trưởng phòng', 'Kế toán trưởng'] },
        { minValue: 100000000, maxValue: 500000000, approvers: ['Trưởng phòng', 'Kế toán trưởng', 'Phó giám đốc'] },
        { minValue: 500000000, maxValue: 1000000000, approvers: ['Trưởng phòng', 'Kế toán trưởng', 'Phó giám đốc', 'Giám đốc'] },
        { minValue: 1000000000, maxValue: Infinity, approvers: ['Trưởng phòng', 'Kế toán trưởng', 'Phó giám đốc', 'Giám đốc', 'Luật sư', 'Hội đồng'] }
      ]
    },
    signature: {
      requireDigitalSignature: true,
      signatureExpiryDays: 30,
      allowMultipleSigners: true,
      requireWitness: false,
      signatureTypes: ['Digital', 'Biometric', 'OTP']
    },
    notification: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      reminderFrequency: 'daily',
      notificationChannels: ['email', 'in-app']
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 30,
      twoFactorAuth: false,
      ipWhitelist: [],
      auditLogging: true
    }
  })

  const tabs = [
    { id: 'general', title: 'Tổng quan', icon: '⚙️' },
    { id: 'approval', title: 'Phê duyệt', icon: '✅' },
    { id: 'signature', title: 'Chữ ký', icon: '✍️' },
    { id: 'notification', title: 'Thông báo', icon: '🔔' },
    { id: 'security', title: 'Bảo mật', icon: '🔒' }
  ]

  const handleSave = () => {
    // Mock save settings
    alert('Đã lưu cài đặt thành công!')
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin công ty</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên công ty</label>
            <input
              type="text"
              value={settings.general.companyName}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, companyName: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
            <input
              type="text"
              value={settings.general.companyAddress}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, companyAddress: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
            <input
              type="text"
              value={settings.general.companyPhone}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, companyPhone: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={settings.general.companyEmail}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, companyEmail: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt hệ thống</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Múi giờ</label>
            <select
              value={settings.general.timezone}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, timezone: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
            <select
              value={settings.general.language}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, language: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Định dạng ngày</label>
            <select
              value={settings.general.dateFormat}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                general: { ...prev.general, dateFormat: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderApprovalSettings = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt phê duyệt</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Tự động phê duyệt</label>
              <p className="text-xs text-gray-500">Tự động phê duyệt hợp đồng dưới ngưỡng nhất định</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.approval.autoApproval}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  approval: { ...prev.approval, autoApproval: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số ngày tối đa phê duyệt</label>
            <input
              type="number"
              value={settings.approval.maxApprovalDays}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                approval: { ...prev.approval, maxApprovalDays: parseInt(e.target.value) }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cấp độ phê duyệt</h3>
        <div className="space-y-4">
          {settings.approval.approvalLevels.map((level, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {level.minValue === 0 ? 'Dưới' : 'Từ'} {new Intl.NumberFormat('vi-VN').format(level.minValue)} VND
                  {level.maxValue !== Infinity && ` - ${new Intl.NumberFormat('vi-VN').format(level.maxValue)} VND`}
                </span>
                <span className="text-xs text-gray-500">{level.approvers.length} người phê duyệt</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {level.approvers.map((approver, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {approver}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSignatureSettings = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt chữ ký điện tử</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Yêu cầu chữ ký số</label>
              <p className="text-xs text-gray-500">Bắt buộc sử dụng chữ ký số cho tất cả hợp đồng</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.signature.requireDigitalSignature}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  signature: { ...prev.signature, requireDigitalSignature: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thời hạn chữ ký (ngày)</label>
              <input
                type="number"
                value={settings.signature.signatureExpiryDays}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  signature: { ...prev.signature, signatureExpiryDays: parseInt(e.target.value) }
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại chữ ký</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Digital</option>
                <option>Biometric</option>
                <option>OTP</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt thông báo</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Thông báo email</label>
              <p className="text-xs text-gray-500">Gửi thông báo qua email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notification.emailNotifications}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notification: { ...prev.notification, emailNotifications: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Thông báo SMS</label>
              <p className="text-xs text-gray-500">Gửi thông báo qua SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notification.smsNotifications}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notification: { ...prev.notification, smsNotifications: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt bảo mật</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Độ dài mật khẩu tối thiểu</label>
              <input
                type="number"
                value={settings.security.passwordMinLength}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, passwordMinLength: parseInt(e.target.value) }
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian timeout (phút)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Xác thực 2 yếu tố</label>
              <p className="text-xs text-gray-500">Yêu cầu mã OTP khi đăng nhập</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, twoFactorAuth: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'approval':
        return renderApprovalSettings()
      case 'signature':
        return renderSignatureSettings()
      case 'notification':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-gray-50 to-zinc-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
            <p className="mt-1 text-gray-600">Quản lý cấu hình và thiết lập hệ thống DocGO.</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-slate-400 via-gray-400 to-zinc-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-4 sticky top-4">
              <h2 className="font-semibold text-gray-900 mb-4">Danh mục</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {renderContent()}
            
            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
