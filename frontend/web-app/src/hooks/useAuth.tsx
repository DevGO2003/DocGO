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
    if (!raw) {
      console.log('[Auth] No stored auth data found')
      return { accessToken: null, user: null, tokenData: null }
    }
    
    const parsed = JSON.parse(raw)
    console.log('[Auth] Reading storage:', {
      hasTokenData: !!parsed.tokenData,
      hasLegacyToken: !!parsed.token,
      hasAccessToken: !!parsed.accessToken,
      timestamp: parsed.timestamp ? new Date(parsed.timestamp).toISOString() : 'unknown'
    })
    
    // Check if we have the new format with tokenData
    if (parsed.tokenData && parsed.tokenData.accessToken) {
      const tokenData = parsed.tokenData as TokenData
      const now = Date.now()
      
      console.log('[Auth] Token validation:', {
        hasAccessToken: !!tokenData.accessToken,
        tokenLength: tokenData.accessToken?.length,
        expiresAt: tokenData.expiresAt ? new Date(tokenData.expiresAt).toISOString() : 'no expiration',
        now: new Date(now).toISOString(),
        isExpired: tokenData.expiresAt ? now >= tokenData.expiresAt : false,
        timeUntilExpiry: tokenData.expiresAt ? tokenData.expiresAt - now : 'unknown'
      })
      
      // Validate token format and expiration with buffer time
      if (tokenData.accessToken && typeof tokenData.accessToken === 'string' && tokenData.accessToken.length > 10) {
        // Add 5 minutes buffer time to prevent premature clearing
        const bufferTime = 5 * 60 * 1000 // 5 minutes
        const isExpired = tokenData.expiresAt ? now >= (tokenData.expiresAt - bufferTime) : false
        
        if (!isExpired) {
          console.log('[Auth] Token is valid, returning stored data')
          return {
            accessToken: tokenData.accessToken,
            user: parsed.user,
            tokenData: tokenData
          }
        } else {
          console.log('[Auth] Token expired, but not clearing storage yet - will let refresh logic handle')
          // Don't clear storage immediately, let the refresh logic handle it
          return { accessToken: null, user: parsed.user, tokenData: tokenData }
        }
      } else {
        console.log('[Auth] Invalid token format, clearing storage')
        clearStorage()
        return { accessToken: null, user: null, tokenData: null }
      }
    }
    
    // Legacy format support
    if (parsed.accessToken && typeof parsed.accessToken === 'string' && parsed.accessToken.length > 10) {
      console.log('[Auth] Using legacy token format')
      return {
        accessToken: parsed.accessToken,
        user: parsed.user,
        tokenData: null
      }
    }
    
    // If no valid token found, don't clear storage immediately
    console.log('[Auth] No valid token found in storage')
    return { accessToken: null, user: null, tokenData: null }
  } catch (error) {
    console.error('[Auth] Error reading auth storage:', error)
    // Only clear storage if there's a critical error (JSON parse failure, etc.)
    if (error instanceof SyntaxError) {
      console.log('[Auth] JSON parse error, clearing corrupted storage')
      clearStorage()
    }
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
      
      // Use TokenManager to store in both localStorage and cookies
      if (data.tokenData) {
        TokenManager.storeTokens(data.tokenData, data.user)
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
    
    // Use TokenManager to clear both localStorage and cookies
    TokenManager.clearTokens()
  } catch (error) {
    console.error('Error clearing auth storage:', error)
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with null values - no mock user
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Load from localStorage on mount
  useEffect(() => {
    // Sync cookies to localStorage first
    TokenManager.syncFromCookies()
    
    const stored = readStorage()
    setUser(stored.user)
    setAccessToken(stored.accessToken)
    setTokenData(stored.tokenData)
    
    // Cleanup expired tokens on mount
    TokenManager.cleanupExpiredTokens()
    
    // Add a small delay to ensure all auth state is properly initialized
    setTimeout(() => {
      setLoading(false)
    }, 100)
  }, [])

  useEffect(() => {
    writeStorage({ accessToken, user, tokenData })
  }, [accessToken, user, tokenData])

  // Token validation and expiration checking with buffer time
  const validateToken = useCallback((): TokenValidationResult => {
    if (!accessToken || !tokenData) {
      return { isValid: false, isExpired: true }
    }

    const now = Date.now()
    const expiresAt = tokenData.expiresAt
    const bufferTime = 5 * 60 * 1000 // 5 minutes buffer
    const isExpired = expiresAt ? now >= (expiresAt - bufferTime) : false
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

  // Check if token needs refresh (with buffer time)
  const needsRefresh = useCallback((): boolean => {
    if (!accessToken || !tokenData) return false
    
    const now = Date.now()
    const expiresAt = tokenData.expiresAt
    const bufferTime = 10 * 60 * 1000 // 10 minutes buffer for refresh
    
    return expiresAt ? now >= (expiresAt - bufferTime) : false
  }, [accessToken, tokenData])

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true)
    try {
      console.log('[Auth] Fetching current user profile...')
      const res = await authAPI.getProfile()
      const payload = res.data?.data as any
      const current: User | null = payload?.user || null
      if (current) {
        console.log('[Auth] Successfully fetched user profile:', current.email || current.username)
        setUser(current)
      } else {
        console.log('[Auth] No user field in response, payload:', payload)
      }
    } catch (error) {
      console.error('[Auth] Error fetching current user:', error)
      
      // Only clear auth data if it's a 401/403 (unauthorized) error
      // Other errors (network, server) should not clear the session
      if ((error as any)?.response?.status === 401 || (error as any)?.response?.status === 403) {
        console.log('[Auth] Unauthorized error, clearing auth data')
        setAccessToken(null)
        setTokenData(null)
        setUser(null)
        clearStorage()
      } else {
        console.log('[Auth] Non-auth error, keeping session but not setting user')
        // Don't clear the session for network/server errors
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // If there is a token in storage, try to fetch current user
    if (accessToken && !user && !isTokenExpired()) {
      fetchCurrentUser()
    } else if (needsRefresh() && tokenData?.refreshToken) {
      // Token needs refresh, try to refresh proactively
      console.log('[Auth] Token needs refresh, attempting proactive refresh...')
      refreshToken()
    } else if (isTokenExpired() && tokenData?.refreshToken) {
      // Token expired, try to refresh only if we have refresh token
      console.log('[Auth] Token expired, attempting refresh...')
      refreshToken()
    } else if (!accessToken && !user && !loading) {
      // No token and no user, check if we can restore from storage
      const stored = readStorage()
      if (stored.accessToken && stored.tokenData) {
        // Check if stored token is expired
        const now = Date.now()
        const expiresAt = stored.tokenData.expiresAt
        const bufferTime = 5 * 60 * 1000 // 5 minutes buffer
        const isStoredTokenExpired = expiresAt ? now >= (expiresAt - bufferTime) : true
        
        if (!isStoredTokenExpired) {
          // Restore valid token from storage
          setAccessToken(stored.accessToken)
          setTokenData(stored.tokenData)
          setUser(stored.user)
        } else if (stored.tokenData.refreshToken) {
          // Stored token expired but we have refresh token, try to refresh
          console.log('[Auth] Stored token expired, attempting refresh from storage...')
          setAccessToken(stored.accessToken)
          setTokenData(stored.tokenData)
          setUser(stored.user)
          refreshToken()
        }
      }
    }
  }, [accessToken, user, fetchCurrentUser, isTokenExpired, needsRefresh, tokenData?.refreshToken, loading])

  const login = useCallback(async (credentials: LoginCredentials, rememberMe: boolean = false): Promise<boolean> => {
    setLoading(true)
    try {
      const res = await authAPI.login(credentials)
      // Chấp nhận cả 2 dạng response: bọc trong data (RestResponse) hoặc trả thẳng payload
      const raw = res.data as any
      const authData = (raw?.data ?? raw) as unknown as AuthResponse
      
      if (!authData) {
        throw new Error('Invalid response from server')
      }
      
      // Hỗ trợ cả field token cũ
      const accessToken = (authData as any).accessToken || (authData as any).token
      const refreshToken = (authData as any).refreshToken
      const expiresIn = (authData as any).expiresIn ?? 900
      const tokenType = (authData as any).tokenType || 'Bearer'
      const user = (authData as any).user
      
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
        tokenType
      }
      
      setAccessToken(accessToken)
      setTokenData(newTokenData)

      // Store tokens immediately (cookie + localStorage) for middleware compatibility
      try {
        TokenManager.storeTokens(newTokenData, user || null, rememberMe)
        console.log('[Auth] Tokens stored successfully:', {
          hasAccessToken: !!accessToken,
          hasTokenData: !!newTokenData,
          rememberMe: rememberMe
        })
      } catch (error) {
        console.error('[Auth] Error storing tokens:', error)
      }

      // Always fetch profile to normalize user fields like Google flow
      try {
        const me = await authAPI.getProfile()
        const apiData = me.data?.data as any
        if (apiData?.user) {
          setUser(apiData.user as User)
          return true
        }
      } catch (e) {
        console.warn('Fetching profile after login failed:', e)
      }

      // Fallback to user from login response if present
      if (user) {
        setUser(user as unknown as User)
        return true
      }

      // As a last resort, fail gracefully and clear
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

  const setTokens = useCallback((accessToken: string, refreshToken: string) => {
    try {
      if (accessToken && accessToken.length > 10) {
        // Calculate expiration time (default 1 hour)
        const expiresAt = Date.now() + (3600 * 1000) // 1 hour
        
        // Create token data object
        const newTokenData: TokenData = {
          accessToken,
          refreshToken,
          expiresAt,
          tokenType: 'Bearer'
        }
        
        setAccessToken(accessToken)
        setTokenData(newTokenData)
        
        // Store tokens immediately
        TokenManager.storeTokens(newTokenData, null)
        
        console.log('[Auth] Tokens set successfully via OAuth2 callback')
      }
    } catch (error) {
      console.error('Error setting tokens:', error)
    }
  }, [])

  const refreshToken = useCallback(async (retryCount = 0): Promise<boolean> => {
    const maxRetries = 3
    const baseDelay = 1000 // 1 second
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
        
        console.log('Token refreshed successfully')
        return true
      }
      
      return false
    } catch (error: unknown) {
      console.error(`Token refresh error (attempt ${retryCount + 1}):`, error)
      
      // Check if it's a retryable error (network issues)
      const errorObj = error as any
      const isRetryableError = error && typeof error === 'object' && 
        (errorObj.code === 'NETWORK_ERROR' || !errorObj.response) // No response = network error
      
      if (isRetryableError && retryCount < maxRetries) {
        // Exponential backoff retry
        const delay = baseDelay * Math.pow(2, retryCount)
        console.log(`Retrying token refresh in ${delay}ms...`)
        
        await new Promise<void>(resolve => setTimeout(resolve, delay))
        return refreshToken(retryCount + 1)
      }
      
      // Only logout if it's a critical error, not network issues
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
          // Invalid refresh token, logout user
          console.log('Refresh token invalid, logging out user')
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
    // Chỉ check accessToken và token validity, không phụ thuộc vào user object
    // User sẽ được fetch sau khi đã authenticated
    return !!(accessToken && accessToken.length > 10 && !isTokenExpired())
  }, [accessToken, isTokenExpired])

  const value = useMemo<AuthContextValue>(() => ({ 
    user, 
    accessToken, 
    loading, 
    isAuthenticated,
    login, 
    register, 
    logout, 
    setAuthData, 
    setTokens,
    refreshToken, 
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    validateToken,
    isTokenExpired
  }), [user, accessToken, loading, isAuthenticated, login, register, logout, setAuthData, setTokens, refreshToken, updateProfile, changePassword, forgotPassword, resetPassword, validateToken, isTokenExpired])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


