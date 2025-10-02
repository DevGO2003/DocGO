// Token Refresh Helper
// Provides proactive token refresh functionality

import TokenManager from './token-manager'
import { userAPI } from '@/lib/apis'

export class TokenRefreshHelper {
  private static refreshPromise: Promise<boolean> | null = null
  private static isRefreshing = false

  // Proactively refresh token if needed
  static async ensureValidToken(): Promise<boolean> {
    const { accessToken, refreshToken, tokenData } = TokenManager.getTokens()
    
    if (!accessToken) {
      console.warn('[TokenRefresh] No access token available')
      return false
    }

    // Check if token needs refresh
    if (TokenManager.needsRefresh()) {
      console.log('[TokenRefresh] Token needs refresh, attempting proactive refresh...')
      return await this.refreshToken()
    }

    return true
  }

  // Refresh token with deduplication
  static async refreshToken(): Promise<boolean> {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      console.log('[TokenRefresh] Token refresh already in progress, waiting...')
      return await this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.performTokenRefresh()

    try {
      const result = await this.refreshPromise
      return result
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  // Perform the actual token refresh
  private static async performTokenRefresh(): Promise<boolean> {
    try {
      const { refreshToken } = TokenManager.getTokens()
      
      if (!refreshToken) {
        console.warn('[TokenRefresh] No refresh token available')
        return false
      }

      console.log('[TokenRefresh] Calling refresh token API...')
      const response = await userAPI.refreshToken(refreshToken)
      const refreshData = response.data?.data

      if ((refreshData as any)?.accessToken) {
        // Update stored tokens
        const newTokenData = {
          accessToken: (refreshData as any).accessToken,
          refreshToken: (refreshData as any).refreshToken || refreshToken,
          expiresAt: Date.now() + (((refreshData as any).expiresIn || 900) * 1000),
          tokenType: (refreshData as any).tokenType || 'Bearer'
        }

        TokenManager.storeTokens(newTokenData)
        console.log('[TokenRefresh] Token refreshed successfully')
        return true
      }

      console.warn('[TokenRefresh] Invalid refresh response')
      return false
    } catch (error) {
      console.error('[TokenRefresh] Token refresh failed:', error)
      return false
    }
  }

  // Check token status for debugging
  static getTokenStatus() {
    const tokens = TokenManager.getTokens()
    const validation = TokenManager.validateToken()
    
    return {
      hasAccessToken: !!tokens.accessToken,
      hasRefreshToken: !!tokens.refreshToken,
      isValid: validation.isValid,
      isExpired: validation.isExpired,
      needsRefresh: TokenManager.needsRefresh(),
      expiresAt: validation.expiresAt,
      timeUntilExpiry: validation.timeUntilExpiry
    }
  }
}

// Export for use in components
export default TokenRefreshHelper
