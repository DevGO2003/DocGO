'use client'

import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { useEffect, useState } from 'react'

const createI18nInstance = async (lng: string) => {
  const i18nInstance = createInstance()
  
  // Fetch JSON files
  const [viResponse, enResponse] = await Promise.all([
    fetch('/locales/vi/common.json'),
    fetch('/locales/en/common.json')
  ])
  
  const [viCommon, enCommon] = await Promise.all([
    viResponse.json(),
    enResponse.json()
  ])
  
  i18nInstance.init({
    lng,
    fallbackLng: 'vi',
    debug: process.env.NODE_ENV === 'development',
    resources: {
      vi: {
        common: viCommon
      },
      en: {
        common: enCommon
      }
    },
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false,
    },
  })
  
  return i18nInstance
}

interface I18nProviderProps {
  children: React.ReactNode
  locale?: string
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children, locale = 'vi' }) => {
  const [i18nInstance, setI18nInstance] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initI18n = async () => {
      try {
        const instance = await createI18nInstance(locale)
        setI18nInstance(instance)
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initI18n()
  }, [locale])

  if (isLoading || !i18nInstance) {
    return <div>Loading...</div>
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  )
}
