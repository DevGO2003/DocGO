'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authAPI } from '../lib/api'
import TokenManager from '../utils/token-manager'
import { 
  User, 
  UserRole, 
  UserStatus, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  AuthContextValue, 
  OAuthUserData,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthError,
  TokenData,
  TokenValidationResult,
  RefreshTokenResponse
} from '../types/auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'docgo_auth_v1'

function readStorage(): { accessToken: string | null; user: User | null; tokenData: TokenData | null } {
  if (typeof window === 'undefined') return { accessToken: null, user: null, tokenData: null }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { accessToken: null, user: null, tokenData: null }
    const parsed = JSON.parse(raw)
    
    // Check if we have the new format with tokenData
    if (parsed.tokenData && parsed.tokenData.accessToken) {
      const tokenData = parsed.tokenData as TokenData
      // Validate token format and expiration
      if (tokenData.accessToken && typeof tokenData.accessToken === 'string' && tokenData.accessToken.length > 10) {
        // Check if token is expired
        if (tokenData.expiresAt && Date.now() < tokenData.expiresAt) {
          return {
            accessToken: tokenData.accessToken,
            user: parsed.user,
            tokenData: tokenData
          }
        } else {
          // Token expired, clear storage
          clearStorage()
          return { accessToken: null, user: null, tokenData: null }
        }
      }
    }
    
    // Legacy format support
    if (parsed.token && typeof parsed.token === 'string' && parsed.token.length > 10) {
      return {
        accessToken: parsed.token,
        user: parsed.user,
        tokenData: null
      }
    }
    
    // If token is invalid, clear storage
    clearStorage()
    return { accessToken: null, user: null, tokenData: null }
  } catch (error) {
    console.error('Error reading auth storage:', error)
    clearStorage()
    return { accessToken: null, user: null, tokenData: null }
  }
}

function writeStorage(data: { accessToken: string | null; user: User | null; tokenData?: TokenData | null }) {
  if (typeof window === 'undefined') return
  try {
    // Validate data before storing
    if (data.accessToken && typeof data.accessToken === 'string' && data.accessToken.length > 10) {
      const storageData = {
        accessToken: data.accessToken,
        user: data.user,
        tokenData: data.tokenData
      }
      
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData))
      
      // Also sync with legacy storage keys for backward compatibility
      window.localStorage.setItem('auth_token', data.accessToken)
      if (data.user) {
        window.localStorage.setItem('user_data', JSON.stringify(data.user))
      }
      
      // Store refresh token separately if available
      if (data.tokenData?.refreshToken) {
        window.localStorage.setItem('refresh_token', data.tokenData.refreshToken)
      }
    } else {
      clearStorage()
    }
  } catch (error) {
    console.error('Error writing auth storage:', error)
  }
}

function clearStorage() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem('auth_token')
    window.localStorage.removeItem('refresh_token')
    window.localStorage.removeItem('user_data')
  } catch (error) {
    console.error('Error clearing auth storage:', error)
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // MOCK ADMIN FOR DEVELOPMENT
  const [user, setUser] = useState<User | null>({
    id: '1',
    username: 'admin',
    email: 'admin@docgo.local',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    department: 'IT',
    position: 'System Administrator',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  })
  // MOCK TOKEN FOR DEVELOPMENT
  const [accessToken, setAccessToken] = useState<string | null>('mock-admin-token')
  const [tokenData, setTokenData] = useState<TokenData | null>({
    accessToken: 'mock-admin-token',
    refreshToken: 'mock-refresh-token',
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    tokenType: 'Bearer'
  })
  const [loading, setLoading] = useState<boolean>(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = readStorage()
    setUser(stored.user)
    setAccessToken(stored.accessToken)
    setTokenData(stored.tokenData)
    
    // Cleanup expired tokens on mount
    TokenManager.cleanupExpiredTokens()
    
    setLoading(false)
  }, [])

  useEffect(() => {
    writeStorage({ accessToken, user, tokenData })
  }, [accessToken, user, tokenData])

  // Token validation and expiration checking
  const validateToken = useCallback((): TokenValidationResult => {
    if (!accessToken || !tokenData) {
      return { isValid: false, isExpired: true }
    }

    const now = Date.now()
    const expiresAt = tokenData.expiresAt
    const isExpired = expiresAt ? now >= expiresAt : false
    const timeUntilExpiry = expiresAt ? expiresAt - now : 0

    return {
      isValid: !isExpired && accessToken.length > 10,
      isExpired,
      expiresAt,
      timeUntilExpiry: timeUntilExpiry > 0 ? timeUntilExpiry : 0
    }
  }, [accessToken, tokenData])

  const isTokenExpired = useCallback((): boolean => {
    return validateToken().isExpired
  }, [validateToken])

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authAPI.getProfile()
      const current = res.data?.data as unknown as User
      if (current) setUser(current)
    } catch (error) {
      console.error('Error fetching current user:', error)
      // If profile fetch fails, clear auth data
      setAccessToken(null)
      setTokenData(null)
      setUser(null)
      clearStorage()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // If there is a token in storage, try to fetch current user
    if (accessToken && !user && !isTokenExpired()) {
      fetchCurrentUser()
    } else if (isTokenExpired() && tokenData?.refreshToken) {
      // Token expired, try to refresh only if we have refresh token
      console.log('Token expired, attempting refresh...')
      refreshToken()
    }
  }, [accessToken, user, fetchCurrentUser, isTokenExpired, tokenData?.refreshToken])

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true)
    try {
      const res = await authAPI.login(credentials)
      const authData = res.data?.data as unknown as AuthResponse
      
      if (!authData) {
        throw new Error('Invalid response from server')
      }
      
      const { accessToken, refreshToken, expiresIn, tokenType, user } = authData
      
      // Validate token before storing
      if (!accessToken || typeof accessToken !== 'string' || accessToken.length < 10) {
        throw new Error('Invalid token received')
      }
      
      // Calculate expiration time
      const expiresAt = Date.now() + (expiresIn * 1000)
      
      // Create token data object
      const newTokenData: TokenData = {
        accessToken,
        refreshToken,
        expiresAt,
        tokenType: tokenType || 'Bearer'
      }
      
      setAccessToken(accessToken)
      setTokenData(newTokenData)
      // Prefer server user; if missing, fetch profile before considering success
      if (user) {
        setUser(user)
        return true
      }

      try {
        const me = await authAPI.getProfile()
        const current = me.data?.data as unknown as User
        if (current) {
          setUser(current)
          return true
        }
      } catch (e) {
        // fall through to failure handling below
        console.warn('Login succeeded but fetching profile failed:', e)
      }

      // If we cannot obtain user info, treat as failed to prevent redirect loop
      setAccessToken(null)
      setTokenData(null)
      setUser(null)
      clearStorage()
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setLoading(true)
    try {
      await authAPI.register({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      })
      return true
    } catch (error) {
      console.error('Register error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      // Send refresh token to backend for logout
      const refreshTokenValue = tokenData?.refreshToken || 
        (typeof window !== 'undefined' ? window.localStorage.getItem('refresh_token') : null)
      
      if (refreshTokenValue) {
        await authAPI.logout(refreshTokenValue)
      }
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with local logout even if API call fails
    } finally {
      setAccessToken(null)
      setTokenData(null)
      setUser(null)
      clearStorage()
      setLoading(false)
    }
  }, [tokenData])

  const setAuthData = useCallback((userData: OAuthUserData) => {
    try {
      // Validate user data
      if (userData && typeof userData === 'object') {
        const authUser: User = {
          id: userData.id || userData.userId || userData.username || '',
          username: userData.username || '',
          email: userData.email || userData.username || '',
          firstName: userData.name?.split(' ')[0] || userData.username || '',
          lastName: userData.name?.split(' ').slice(1).join(' ') || '',
          fullName: userData.name || userData.username || '',
          role: userData.role || UserRole.USER,
          status: userData.status || UserStatus.ACTIVE,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setUser(authUser)
        
        // Get token from localStorage if available
        const storedToken = typeof window !== 'undefined' ? 
          window.localStorage.getItem('auth_token') : null
        if (storedToken && storedToken.length > 10) {
          setAccessToken(storedToken)
        }
      }
    } catch (error) {
      console.error('Error setting auth data:', error)
    }
  }, [])

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshTokenValue = tokenData?.refreshToken || 
        (typeof window !== 'undefined' ? window.localStorage.getItem('refresh_token') : null)
      
      if (!refreshTokenValue) {
        console.warn('No refresh token available')
        return false
      }
      
      // Call refresh token API
      const res = await authAPI.refreshToken(refreshTokenValue)
      const refreshData = res.data?.data as unknown as RefreshTokenResponse
      
      if (!refreshData) {
        throw new Error('Invalid refresh response from server')
      }
      
      const { accessToken, refreshToken: newRefreshToken, expiresIn, tokenType } = refreshData
      
      if (accessToken && accessToken.length > 10) {
        // Calculate new expiration time
        const expiresAt = Date.now() + (expiresIn * 1000)
        
        // Create new token data object
        const newTokenData: TokenData = {
          accessToken,
          refreshToken: newRefreshToken || refreshTokenValue,
          expiresAt,
          tokenType: tokenType || 'Bearer'
        }
        
        setAccessToken(accessToken)
        setTokenData(newTokenData)
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Token refresh error:', error)
      // Only logout if it's a critical error, not network issues
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
          // Invalid refresh token, logout user
          logout()
        } else {
          // Network or other errors, don't logout immediately
          console.warn('Token refresh failed due to network error, will retry later')
        }
      } else {
        // Unknown error, don't logout immediately
        console.warn('Token refresh failed with unknown error, will retry later')
      }
      return false
    }
  }, [tokenData, logout])

  const updateProfile = useCallback(async (data: UpdateProfileRequest): Promise<boolean> => {
    setLoading(true)
    try {
      const res = await authAPI.updateProfile(data)
      const updatedUser = res.data?.data as unknown as User
      if (updatedUser) {
        setUser(updatedUser)
      }
      return true
    } catch (error) {
      console.error('Update profile error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const changePassword = useCallback(async (data: ChangePasswordRequest): Promise<boolean> => {
    setLoading(true)
    try {
      await authAPI.changePassword(data)
      return true
    } catch (error) {
      console.error('Change password error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      return true
    } catch (error) {
      console.error('Forgot password error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (data: ResetPasswordRequest): Promise<boolean> => {
    setLoading(true)
    try {
      await authAPI.resetPassword(data.token, data.newPassword)
      return true
    } catch (error) {
      console.error('Reset password error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const isAuthenticated = useMemo(() => {
    return !!(accessToken && user && accessToken.length > 10 && !isTokenExpired())
  }, [accessToken, user, isTokenExpired])

  const value = useMemo<AuthContextValue>(() => ({ 
    user, 
    accessToken, 
    loading, 
    isAuthenticated,
    login, 
    register, 
    logout, 
    setAuthData, 
    refreshToken, 
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    validateToken,
    isTokenExpired
  }), [user, accessToken, loading, isAuthenticated, login, register, logout, setAuthData, refreshToken, updateProfile, changePassword, forgotPassword, resetPassword, validateToken, isTokenExpired])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


