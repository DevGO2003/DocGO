// Token Monitor Hook
// Monitors token expiration and handles auto-refresh

import { useEffect, useCallback, useRef } from 'react'
import { useAuth } from './useAuth'
import TokenManager from '@/utils/token-manager'

export const useTokenMonitor = () => {
  const { refreshToken, isAuthenticated } = useAuth()
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const monitorIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Check if token needs refresh and handle it
  const checkAndRefreshToken = useCallback(async () => {
    if (!isAuthenticated) return

    const tokenInfo = TokenManager.getTokenInfo()
    
    if (tokenInfo.isExpired) {
      console.log('Token is expired, attempting refresh...')
      const success = await refreshToken()
      if (!success) {
        console.warn('Token refresh failed, user will need to login again')
      }
    } else if (TokenManager.needsRefresh()) {
      console.log('Token needs refresh soon, attempting refresh...')
      const success = await refreshToken()
      if (!success) {
        console.warn('Proactive token refresh failed')
      }
    }
  }, [isAuthenticated, refreshToken])

  // Set up refresh timeout
  const scheduleRefresh = useCallback(() => {
    if (!isAuthenticated) return

    const tokenInfo = TokenManager.getTokenInfo()
    
    if (tokenInfo.timeUntilExpiry && tokenInfo.timeUntilExpiry > 0) {
      // Schedule refresh 15 minutes before expiration (increased from 5 minutes)
      const refreshTime = Math.max(0, tokenInfo.timeUntilExpiry - 15 * 60 * 1000)
      
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }

      refreshTimeoutRef.current = setTimeout(async () => {
        console.log('Scheduled token refresh triggered')
        await checkAndRefreshToken()
      }, refreshTime)

      console.log(`Token refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`)
    }
  }, [isAuthenticated, checkAndRefreshToken])

  // Start monitoring
  useEffect(() => {
    if (isAuthenticated) {
      // Initial check
      checkAndRefreshToken()
      
      // Schedule refresh
      scheduleRefresh()

      // Set up periodic monitoring (every 2 minutes to reduce conflicts)
      monitorIntervalRef.current = setInterval(() => {
        checkAndRefreshToken()
      }, 2 * 60 * 1000)
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
      if (monitorIntervalRef.current) {
        clearInterval(monitorIntervalRef.current)
      }
    }
  }, [isAuthenticated, checkAndRefreshToken, scheduleRefresh])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
      if (monitorIntervalRef.current) {
        clearInterval(monitorIntervalRef.current)
      }
    }
  }, [])

  return {
    checkAndRefreshToken,
    scheduleRefresh
  }
}

// Hook for token info (useful for debugging)
export const useTokenInfo = () => {
  const { isAuthenticated } = useAuth()
  
  const getTokenInfo = useCallback(() => {
    return TokenManager.getTokenInfo()
  }, [])

  const isTokenExpired = useCallback(() => {
    return TokenManager.isTokenExpired()
  }, [])

  const needsRefresh = useCallback(() => {
    return TokenManager.needsRefresh()
  }, [])

  return {
    getTokenInfo,
    isTokenExpired,
    needsRefresh,
    isAuthenticated
  }
}

export default useTokenMonitor


