'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layout'

interface Setting {
  id: string
  name: string
  category: 'GENERAL' | 'SECURITY' | 'NOTIFICATIONS' | 'INTEGRATIONS'
  type: 'TEXT' | 'BOOLEAN' | 'NUMBER' | 'SELECT'
  value: string | boolean | number
  description: string
  options?: string[]
  required: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'GENERAL' | 'SECURITY' | 'NOTIFICATIONS' | 'INTEGRATIONS'>('ALL')
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'SECURITY' | 'NOTIFICATIONS' | 'INTEGRATIONS'>('GENERAL')

  const filteredSettings = settings.filter(setting => filter === 'ALL' || setting.category === filter)

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'GENERAL': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'SECURITY': return 'bg-red-50 text-red-700 border-red-200'
      case 'NOTIFICATIONS': return 'bg-green-50 text-green-700 border-green-200'
      case 'INTEGRATIONS': return 'bg-purple-50 text-purple-700 border-purple-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleSettingChange = (id: string, value: string | boolean | number) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, value } : setting
    ))
  }

  const saveSettings = () => {
    // Save settings logic
    console.log('Saving settings:', settings)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-2 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-gray-50 to-zinc-50 opacity-50" />
          <div className="relative px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
            <p className="mt-1 text-gray-600">Quản lý cài đặt hệ thống và tùy chỉnh</p>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-slate-500 via-gray-500 to-zinc-500" />
        </div>

        {/* Tabs */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b px-5 py-4 flex items-center justify-between bg-gray-50/60">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Cài đặt</h2>
              <div className="flex items-center gap-1">
                {['GENERAL', 'SECURITY', 'NOTIFICATIONS', 'INTEGRATIONS'].map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category as any)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      activeTab === category 
                        ? 'bg-slate-600 text-white' 
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={saveSettings}
                className="px-3 py-2 text-sm rounded-md bg-slate-600 text-white hover:bg-slate-700"
              >
                Lưu cài đặt
              </button>
              <button className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="rounded-2xl border bg-white shadow-sm ring-1 ring-gray-100 p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Cài đặt {activeTab.toLowerCase()}</h3>
            
            {filteredSettings.map(setting => (
              <div key={setting.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-base font-medium text-gray-900">{setting.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryBadgeClass(setting.category)}`}>
                        {setting.category}
                      </span>
                      {setting.required && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                          Bắt buộc
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                  </div>
                  
                  <div className="ml-4">
                    {setting.type === 'TEXT' && (
                      <input
                        type="text"
                        value={setting.value as string}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    )}
                    {setting.type === 'BOOLEAN' && (
                      <input
                        type="checkbox"
                        checked={setting.value as boolean}
                        onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                        className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                      />
                    )}
                    {setting.type === 'NUMBER' && (
                      <input
                        type="number"
                        value={setting.value as number}
                        onChange={(e) => handleSettingChange(setting.id, Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    )}
                    {setting.type === 'SELECT' && setting.options && (
                      <select
                        value={setting.value as string}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        {setting.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
