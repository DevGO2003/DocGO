// Authentication Hook
import { useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export interface User {
  id: string;
  username: string;
  roles: string[];
  exp: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null
  });

  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      if (!authService.isAuthenticated()) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null
        });
        return;
      }

      const isValid = await authService.validateToken();
      if (isValid) {
        const user = authService.getCurrentUser();
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'Token expired'
        });
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      });
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.login({ username, password });
      const user = authService.getCurrentUser();
      
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null
      });
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authService.register(userData);
      const user = authService.getCurrentUser();
      
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null
      });
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      });
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      await authService.refreshToken();
      const user = authService.getCurrentUser();
      setAuthState(prev => ({
        ...prev,
        user,
        error: null
      }));
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
    }
  }, [logout]);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!authState.user?.exp) return;

    const expiryTime = authState.user.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;
    
    // Refresh token 5 minutes before expiry
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);
    
    const timeoutId = setTimeout(() => {
      refreshToken();
    }, refreshTime);

    return () => clearTimeout(timeoutId);
  }, [authState.user?.exp, refreshToken]);

  return {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    checkAuth
  };
};
