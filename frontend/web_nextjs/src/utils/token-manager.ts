// Token Management Utility
// Handles token storage, validation, and cleanup

import { TokenData, TokenValidationResult } from '@/types/auth'

export class TokenManager {
  private static readonly STORAGE_KEY = 'docgo_auth_v1'
  private static readonly LEGACY_TOKEN_KEY = 'auth_token'
  private static readonly LEGACY_REFRESH_KEY = 'refresh_token'
  private static readonly LEGACY_USER_KEY = 'user_data'

  // Store tokens with expiration
  static storeTokens(tokenData: TokenData, user?: any): void {
    if (typeof window === 'undefined') return

    try {
      const authData = {
        accessToken: tokenData.accessToken,
        user: user,
        tokenData: tokenData,
        timestamp: Date.now()
      }

      // Store in new format
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData))

      // Store in legacy format for backward compatibility
      window.localStorage.setItem(this.LEGACY_TOKEN_KEY, tokenData.accessToken)
      if (tokenData.refreshToken) {
        window.localStorage.setItem(this.LEGACY_REFRESH_KEY, tokenData.refreshToken)
      }
      if (user) {
        window.localStorage.setItem(this.LEGACY_USER_KEY, JSON.stringify(user))
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
    const { accessToken, tokenData } = this.getTokens()

    if (!accessToken) {
      return { isValid: false, isExpired: true }
    }

    if (!tokenData) {
      // Legacy token without expiration data
      return { 
        isValid: accessToken.length > 10, 
        isExpired: false 
      }
    }

    const now = Date.now()
    const expiresAt = tokenData.expiresAt
    const isExpired = expiresAt ? now >= expiresAt : false
    const timeUntilExpiry = expiresAt ? Math.max(0, expiresAt - now) : 0

    return {
      isValid: !isExpired && accessToken.length > 10,
      isExpired,
      expiresAt,
      timeUntilExpiry
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

  // Clear all tokens
  static clearTokens(): void {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.removeItem(this.STORAGE_KEY)
      window.localStorage.removeItem(this.LEGACY_TOKEN_KEY)
      window.localStorage.removeItem(this.LEGACY_REFRESH_KEY)
      window.localStorage.removeItem(this.LEGACY_USER_KEY)
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
}

// Auto-cleanup on page load
if (typeof window !== 'undefined') {
  // Cleanup expired tokens when the page loads
  TokenManager.cleanupExpiredTokens()

  // Set up periodic cleanup (every 5 minutes)
  setInterval(() => {
    TokenManager.cleanupExpiredTokens()
  }, 5 * 60 * 1000)
}

// Export for use in other modules
export default TokenManager


