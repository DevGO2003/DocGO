'use client'

import React, { useState } from 'react'
import { 
  LanguageIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useTranslation } from '@/hooks/useTranslation'

interface LanguageSwitcherProps {
  className?: string
}

const languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { t, changeLanguage, currentLanguage } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  const handleLanguageChange = (language: typeof languages[0]) => {
    changeLanguage(language.code)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Chọn ngôn ngữ"
      >
        <LanguageIcon className="h-5 w-5" />
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {currentLang.flag}
        </span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 ${
                  currentLang.code === language.code 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
                {currentLang.code === language.code && (
                  <span className="ml-auto text-primary-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
