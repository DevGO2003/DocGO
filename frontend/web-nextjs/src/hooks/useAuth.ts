import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Custom hook to access authentication context
 * This is a re-export of the useAuth hook from AuthContext for convenience
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
