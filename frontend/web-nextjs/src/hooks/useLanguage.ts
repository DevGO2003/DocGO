import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

/**
 * Custom hook to access language context
 * This is a re-export of the useLanguage hook from LanguageContext for convenience
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default useLanguage;

