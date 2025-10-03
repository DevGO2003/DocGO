'use client'

import { useTranslation as useI18nTranslation } from 'react-i18next'
import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export const useTranslation = (namespace = 'common') => {
  const { t, i18n } = useI18nTranslation(namespace)
  const router = useRouter()
  const pathname = usePathname()

  const changeLanguage = useCallback((lng: string) => {
    i18n.changeLanguage(lng)
    
    // Update URL with new locale
    const segments = (pathname || '').split('/')
    if (segments[1] === 'vi' || segments[1] === 'en') {
      segments[1] = lng
    } else {
      segments.splice(1, 0, lng)
    }
    
    const newPath = segments.join('/')
    router.push(newPath)
  }, [i18n, pathname, router])

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language,
    isReady: i18n.isInitialized
  }
}
