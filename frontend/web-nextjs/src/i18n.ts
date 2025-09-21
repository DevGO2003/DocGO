import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import viCommon from '@/locales/vi/common.json';
import viContracts from '@/locales/vi/contracts.json';
import enCommon from '@/locales/en/common.json';
import enContracts from '@/locales/en/contracts.json';

// Available languages
export const availableLanguages = [
  {
    code: 'vi',
    name: 'Tiếng Việt',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    rtl: false,
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
  }
];

// Resources for i18next
const resources = {
  vi: {
    common: viCommon,
    contracts: viContracts,
  },
  en: {
    common: enCommon,
    contracts: enContracts,
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Language resources
    resources,
    
    // Default language
    lng: 'vi',
    fallbackLng: 'vi',
    
    // Namespaces
    defaultNS: 'common',
    ns: ['common', 'contracts'],
    
    // Debug mode
    debug: process.env.NODE_ENV === 'development',
    
    // Interpolation
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // Backend configuration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Language detection
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      checkWhitelist: true,
    },
    
    // React i18next options
    react: {
      useSuspense: false,
    },
    
    // Namespace separator
    nsSeparator: ':',
    keySeparator: '.',
    
    // Plural separator
    pluralSeparator: '_',
    
    // Context separator
    contextSeparator: '_',
    
    // Save missing keys
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${lng}:${ns}:${key}`);
      }
    },
    
    // Parse missing key handler
    parseMissingKeyHandler: (key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Parse missing key: ${key}`);
      }
      return key;
    },
  });

// Helper function to get language info
export const getLanguageInfo = (code: string) => {
  return availableLanguages.find(lang => lang.code === code) || availableLanguages[0];
};

// Helper function to change language
export const changeLanguage = (code: string) => {
  return i18n.changeLanguage(code);
};

// Helper function to get current language
export const getCurrentLanguage = () => {
  return i18n.language;
};

// Helper function to get all available languages
export const getAllLanguages = () => {
  return availableLanguages;
};

// Helper function to check if language is RTL
export const isRTL = (code?: string) => {
  const langCode = code || getCurrentLanguage();
  const langInfo = getLanguageInfo(langCode);
  return langInfo?.rtl || false;
};

export default i18n;

