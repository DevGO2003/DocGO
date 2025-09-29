// API Retry Utility
// Handles retry logic for expired tokens and 401 responses

import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { authAPI } from '@/lib/api'
import TokenManager from '@/utils/token-manager'

export interface RetryConfig {
  maxRetries: number
  retryDelay: number
  retryCondition: (error: any) => boolean
}

export class ApiRetry {
  private static readonly DEFAULT_CONFIG: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    retryCondition: (error) => {
      return error.response?.status === 401 || 
             error.response?.status === 403 ||
             error.code === 'NETWORK_ERROR'
    }
  }

  // Retry a request with token refresh
  static async retryWithTokenRefresh<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    config: Partial<RetryConfig> = {}
  ): Promise<AxiosResponse<T>> {
    const retryConfig = { ...this.DEFAULT_CONFIG, ...config }
    let lastError: any

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        // Check if token needs refresh before making request
        if (TokenManager.needsRefresh() && attempt === 0) {
          await this.refreshTokenIfNeeded()
        }

        const response = await requestFn()
        return response
      } catch (error: any) {
        lastError = error

        // Check if we should retry
        if (!retryConfig.retryCondition(error) || attempt >= retryConfig.maxRetries) {
          break
        }

        // Handle 401/403 errors with token refresh
        if (error.response?.status === 401 || error.response?.status === 403) {
          const refreshSuccess = await this.refreshTokenIfNeeded()
          if (!refreshSuccess) {
            // If refresh fails, don't retry
            break
          }
        }

        // Wait before retrying
        if (attempt < retryConfig.maxRetries) {
          await this.delay(retryConfig.retryDelay * Math.pow(2, attempt)) // Exponential backoff
        }
      }
    }

    throw lastError
  }

  // Refresh token if needed
  private static async refreshTokenIfNeeded(): Promise<boolean> {
    try {
      const { refreshToken } = TokenManager.getTokens()
      
      if (!refreshToken) {
        console.warn('No refresh token available')
        return false
      }

      const response = await authAPI.refreshToken(refreshToken)
      const refreshData = response.data?.data

      if (refreshData?.accessToken) {
        // Update stored tokens
        const newTokenData = {
          accessToken: refreshData.accessToken,
          refreshToken: refreshData.refreshToken || refreshToken,
          expiresAt: Date.now() + (refreshData.expiresIn * 1000),
          tokenType: refreshData.tokenType || 'Bearer'
        }

        TokenManager.storeTokens(newTokenData)
        console.log('Token refreshed successfully')
        return true
      }

      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  // Delay utility
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Create a retry wrapper for API calls
  static createRetryWrapper<T>(
    apiCall: () => Promise<AxiosResponse<T>>,
    config?: Partial<RetryConfig>
  ): () => Promise<AxiosResponse<T>> {
    return () => this.retryWithTokenRefresh(apiCall, config)
  }

  // Handle specific error types
  static shouldRetry(error: any): boolean {
    if (!error) return false

    // Network errors
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      return true
    }

    // HTTP status codes
    const status = error.response?.status
    if (status === 401 || status === 403 || status === 429 || status >= 500) {
      return true
    }

    // Timeout errors
    if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
      return true
    }

    return false
  }

  // Get retry delay with jitter
  static getRetryDelay(attempt: number, baseDelay: number = 1000): number {
    const exponentialDelay = baseDelay * Math.pow(2, attempt)
    const jitter = Math.random() * 0.1 * exponentialDelay // 10% jitter
    return Math.min(exponentialDelay + jitter, 30000) // Max 30 seconds
  }
}

// Higher-order function to wrap API calls with retry logic
export function withRetry<T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  config?: Partial<RetryConfig>
): () => Promise<AxiosResponse<T>> {
  return ApiRetry.createRetryWrapper(apiCall, config)
}

// Utility for handling common retry scenarios
export const RetryUtils = {
  // Retry on 401/403 with token refresh
  onAuthError: <T>(apiCall: () => Promise<AxiosResponse<T>>) => {
    return withRetry(apiCall, {
      retryCondition: (error) => error.response?.status === 401 || error.response?.status === 403
    })
  },

  // Retry on network errors
  onNetworkError: <T>(apiCall: () => Promise<AxiosResponse<T>>) => {
    return withRetry(apiCall, {
      retryCondition: (error) => 
        error.code === 'NETWORK_ERROR' || 
        error.code === 'ECONNABORTED' ||
        error.message?.includes('timeout')
    })
  },

  // Retry on server errors (5xx)
  onServerError: <T>(apiCall: () => Promise<AxiosResponse<T>>) => {
    return withRetry(apiCall, {
      retryCondition: (error) => error.response?.status >= 500
    })
  },

  // Retry on rate limiting (429)
  onRateLimit: <T>(apiCall: () => Promise<AxiosResponse<T>>) => {
    return withRetry(apiCall, {
      retryCondition: (error) => error.response?.status === 429,
      retryDelay: 2000 // Longer delay for rate limiting
    })
  }
}

export default ApiRetry


