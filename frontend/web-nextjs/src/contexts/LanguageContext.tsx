'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { availableLanguages, changeLanguage, getCurrentLanguage } from '@/i18n';

// Types
interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  availableLanguages: Language[];
  currentLanguage: Language;
  t: (key: string, options?: any) => string;
  isRTL: boolean;
}

// Create context
const LanguageContext = createContext<LanguageContextType | null>(null);

// Language provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(getCurrentLanguage());
  const { t, i18n } = useTranslation();

  // Get current language info
  const currentLanguage = availableLanguages.find(lang => lang.code === language) || availableLanguages[0];
  const isRTL = currentLanguage?.rtl || false;

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  // Set language function
  const setLanguage = async (newLanguage: string) => {
    try {
      await changeLanguage(newLanguage);
      setLanguageState(newLanguage);
      
      // Store in localStorage
      localStorage.setItem('i18nextLng', newLanguage);
      
      // Update document
      document.documentElement.lang = newLanguage;
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Initialize language from localStorage or browser
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split('-')[0];
      const supportedLanguage = availableLanguages.find(lang => lang.code === browserLanguage);
      if (supportedLanguage) {
        setLanguage(supportedLanguage.code);
      }
    }
  }, []);

  // Listen for i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguageState(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    availableLanguages,
    currentLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;

