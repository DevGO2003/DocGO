// Token Management Utility
// Handles token storage, validation, and cleanup
// Now supports both localStorage and cookies for Next.js middleware compatibility

import { TokenData, TokenValidationResult } from '@/types/auth'

export class TokenManager {
  private static readonly STORAGE_KEY = 'docgo_auth_v1'
  private static readonly LEGACY_TOKEN_KEY = 'auth_token'
  private static readonly LEGACY_REFRESH_KEY = 'refresh_token'
  private static readonly LEGACY_USER_KEY = 'user_data'
  
  // Cookie keys for Next.js middleware compatibility
  private static readonly COOKIE_TOKEN_KEY = 'auth_token'
  private static readonly COOKIE_REFRESH_KEY = 'refresh_token'
  private static readonly COOKIE_USER_KEY = 'user_data'

  // Store tokens with expiration (both localStorage and cookies)
  static storeTokens(tokenData: TokenData, user?: any, rememberMe: boolean = false): void {
    if (typeof window === 'undefined') return

    try {
      const authData = {
        accessToken: tokenData.accessToken,
        user: user,
        tokenData: tokenData,
        rememberMe: rememberMe,
        timestamp: Date.now()
      }

      // Store in localStorage (for client-side access)
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData))
      window.localStorage.setItem(this.LEGACY_TOKEN_KEY, tokenData.accessToken)
      if (tokenData.refreshToken) {
        window.localStorage.setItem(this.LEGACY_REFRESH_KEY, tokenData.refreshToken)
      }
      if (user) {
        window.localStorage.setItem(this.LEGACY_USER_KEY, JSON.stringify(user))
      }

      // Calculate maxAge based on rememberMe
      const defaultMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days vs 1 day
      const tokenMaxAge = tokenData.expiresAt ? Math.floor((tokenData.expiresAt - Date.now()) / 1000) : defaultMaxAge
      const refreshMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60 // 30 days vs 7 days

      // Store in cookies (for Next.js middleware access)
      this.setCookie(this.COOKIE_TOKEN_KEY, tokenData.accessToken, {
        maxAge: tokenMaxAge,
        httpOnly: false, // Allow client-side access for refresh logic
        secure: window.location.protocol === 'https:',
        sameSite: 'lax'
      })
      
      if (tokenData.refreshToken) {
        this.setCookie(this.COOKIE_REFRESH_KEY, tokenData.refreshToken, {
          maxAge: refreshMaxAge,
          httpOnly: false,
          secure: window.location.protocol === 'https:',
          sameSite: 'lax'
        })
      }
      
      if (user) {
        this.setCookie(this.COOKIE_USER_KEY, JSON.stringify(user), {
          maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days vs 24 hours
          httpOnly: false,
          secure: window.location.protocol === 'https:',
          sameSite: 'lax'
        })
      }
    } catch (error) {
      console.error('Error storing tokens:', error)
    }
  }

  // Get stored tokens
  static getTokens(): { accessToken: string | null; refreshToken: string | null; tokenData: TokenData | null } {
    if (typeof window === 'undefined') {
      return { accessToken: null, refreshToken: null, tokenData: null }
    }

    try {
      const authData = window.localStorage.getItem(this.STORAGE_KEY)
      if (authData) {
        const parsed = JSON.parse(authData)
        const tokenData = parsed.tokenData as TokenData

        if (tokenData?.accessToken) {
          return {
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            tokenData: tokenData
          }
        }

        // Legacy format support
        if (parsed.accessToken) {
          return {
            accessToken: parsed.accessToken,
            refreshToken: parsed.refreshToken || null,
            tokenData: null
          }
        }
      }
    } catch (error) {
      console.error('Error reading tokens:', error)
    }

    return { accessToken: null, refreshToken: null, tokenData: null }
  }

  // Validate token and check expiration
  static validateToken(): TokenValidationResult {
    try {
      const { accessToken, tokenData } = this.getTokens()
      
      // Get rememberMe flag from localStorage
      let rememberMe = false
      try {
        const authData = window.localStorage.getItem(this.STORAGE_KEY)
        if (authData) {
          const parsed = JSON.parse(authData)
          rememberMe = parsed.rememberMe || false
        }
      } catch (e) {
        // Ignore parsing errors
      }

      console.log('[TokenManager] Validating token:', {
        hasAccessToken: !!accessToken,
        hasTokenData: !!tokenData,
        tokenLength: accessToken?.length,
        rememberMe: rememberMe
      })

      if (!accessToken) {
        console.log('[TokenManager] No access token found')
        return { isValid: false, isExpired: true }
      }

      if (!tokenData) {
        // Legacy token without expiration data - assume valid if format is correct
        console.log('[TokenManager] Legacy token format, validating format only')
        return { 
          isValid: accessToken.length > 10, 
          isExpired: false 
        }
      }

      const now = Date.now()
      const expiresAt = tokenData.expiresAt
      
      // Adjust buffer time based on rememberMe
      const bufferTime = rememberMe ? 30 * 60 * 1000 : 5 * 60 * 1000 // 30 minutes vs 5 minutes
      const isExpired = expiresAt ? now >= (expiresAt - bufferTime) : false
      const timeUntilExpiry = expiresAt ? Math.max(0, expiresAt - now) : 0

      console.log('[TokenManager] Token validation result:', {
        isValid: !isExpired && accessToken.length > 10,
        isExpired,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : 'no expiration',
        timeUntilExpiry: timeUntilExpiry > 0 ? Math.round(timeUntilExpiry / 1000) + 's' : 'expired'
      })

      return {
        isValid: !isExpired && accessToken.length > 10,
        isExpired,
        expiresAt,
        timeUntilExpiry
      }
    } catch (error) {
      console.error('[TokenManager] Error validating token:', error)
      // Return invalid on any error to be safe
      return { isValid: false, isExpired: true }
    }
  }

  // Check if token is expired
  static isTokenExpired(): boolean {
    return this.validateToken().isExpired
  }

  // Check if token needs refresh (expires within 15 minutes)
  static needsRefresh(): boolean {
    const validation = this.validateToken()
    if (!validation.isValid || validation.isExpired) {
      return true
    }

    // Refresh if expires within 15 minutes (increased from 5 minutes)
    return validation.timeUntilExpiry ? validation.timeUntilExpiry < 15 * 60 * 1000 : false
  }

  // Update access token
  static updateAccessToken(newAccessToken: string, expiresIn?: number): void {
    if (typeof window === 'undefined') return

    try {
      const authData = window.localStorage.getItem(this.STORAGE_KEY)
      if (authData) {
        const parsed = JSON.parse(authData)
        
        if (parsed.tokenData) {
          parsed.tokenData.accessToken = newAccessToken
          if (expiresIn) {
            parsed.tokenData.expiresAt = Date.now() + (expiresIn * 1000)
          }
        } else {
          parsed.accessToken = newAccessToken
        }

        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed))
        window.localStorage.setItem(this.LEGACY_TOKEN_KEY, newAccessToken)
      }
    } catch (error) {
      console.error('Error updating access token:', error)
    }
  }

  // Update refresh token
  static updateRefreshToken(newRefreshToken: string): void {
    if (typeof window === 'undefined') return

    try {
      const authData = window.localStorage.getItem(this.STORAGE_KEY)
      if (authData) {
        const parsed = JSON.parse(authData)
        
        if (parsed.tokenData) {
          parsed.tokenData.refreshToken = newRefreshToken
        } else {
          parsed.refreshToken = newRefreshToken
        }

        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed))
        window.localStorage.setItem(this.LEGACY_REFRESH_KEY, newRefreshToken)
      }
    } catch (error) {
      console.error('Error updating refresh token:', error)
    }
  }

  // Clear all tokens (both localStorage and cookies)
  static clearTokens(): void {
    if (typeof window === 'undefined') return

    try {
      // Clear localStorage
      window.localStorage.removeItem(this.STORAGE_KEY)
      window.localStorage.removeItem(this.LEGACY_TOKEN_KEY)
      window.localStorage.removeItem(this.LEGACY_REFRESH_KEY)
      window.localStorage.removeItem(this.LEGACY_USER_KEY)
      
      // Clear cookies
      this.deleteCookie(this.COOKIE_TOKEN_KEY)
      this.deleteCookie(this.COOKIE_REFRESH_KEY)
      this.deleteCookie(this.COOKIE_USER_KEY)
    } catch (error) {
      console.error('Error clearing tokens:', error)
    }
  }

  // Get token info for debugging
  static getTokenInfo(): {
    hasAccessToken: boolean
    hasRefreshToken: boolean
    isExpired: boolean
    expiresAt?: number
    timeUntilExpiry?: number
  } {
    const { accessToken, refreshToken, tokenData } = this.getTokens()
    const validation = this.validateToken()

    return {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      isExpired: validation.isExpired,
      expiresAt: validation.expiresAt,
      timeUntilExpiry: validation.timeUntilExpiry
    }
  }

  // Cleanup expired tokens
  static cleanupExpiredTokens(): void {
    if (this.isTokenExpired()) {
      console.log('Cleaning up expired tokens')
      this.clearTokens()
    }
  }

  // Auto-refresh token if needed
  static async autoRefreshIfNeeded(): Promise<boolean> {
    if (!this.needsRefresh()) {
      return true
    }

    const { refreshToken } = this.getTokens()
    if (!refreshToken) {
      console.warn('No refresh token available for auto-refresh')
      return false
    }

    try {
      // This would typically call your refresh API
      // For now, we'll just return false to indicate refresh is needed
      console.log('Token needs refresh, but auto-refresh not implemented in utility')
      return false
    } catch (error) {
      console.error('Auto-refresh failed:', error)
      return false
    }
  }

  // Cookie helper methods
  private static setCookie(name: string, value: string, options: {
    maxAge?: number
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  } = {}): void {
    if (typeof window === 'undefined') return

    let cookieString = `${name}=${encodeURIComponent(value)}`
    
    if (options.maxAge !== undefined) {
      cookieString += `; Max-Age=${options.maxAge}`
    }
    
    if (options.httpOnly) {
      cookieString += '; HttpOnly'
    }
    
    if (options.secure) {
      cookieString += '; Secure'
    }
    
    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`
    }
    
    // Set path to root for all routes
    cookieString += '; Path=/'
    
    document.cookie = cookieString
  }

  private static deleteCookie(name: string): void {
    if (typeof window === 'undefined') return
    
    document.cookie = `${name}=; Max-Age=0; Path=/`
  }

  // Get cookie value
  private static getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null
    
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  }

  // Sync tokens from cookies to localStorage (for backward compatibility)
  static syncFromCookies(): void {
    if (typeof window === 'undefined') return

    try {
      const tokenFromCookie = this.getCookie(this.COOKIE_TOKEN_KEY)
      const refreshFromCookie = this.getCookie(this.COOKIE_REFRESH_KEY)
      const userFromCookie = this.getCookie(this.COOKIE_USER_KEY)

      if (tokenFromCookie) {
        // Update localStorage with cookie values
        window.localStorage.setItem(this.LEGACY_TOKEN_KEY, tokenFromCookie)
        
        if (refreshFromCookie) {
          window.localStorage.setItem(this.LEGACY_REFRESH_KEY, refreshFromCookie)
        }
        
        if (userFromCookie) {
          window.localStorage.setItem(this.LEGACY_USER_KEY, userFromCookie)
        }
      }
    } catch (error) {
      console.error('Error syncing from cookies:', error)
    }
  }
}

// Auto-cleanup on page load
if (typeof window !== 'undefined') {
  // Cleanup expired tokens when the page loads
  TokenManager.cleanupExpiredTokens()
  
  // Sync cookies to localStorage on page load
  TokenManager.syncFromCookies()

  // Set up periodic cleanup (every 5 minutes)
  setInterval(() => {
    TokenManager.cleanupExpiredTokens()
  }, 5 * 60 * 1000)
}

// Export for use in other modules
export default TokenManager
