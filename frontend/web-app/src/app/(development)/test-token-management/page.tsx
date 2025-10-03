'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useTokenInfo } from '@/hooks/useTokenMonitor'
import TokenManager from '@/utils/token-manager'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function TestTokenManagementPage() {
  const { user, accessToken, isAuthenticated, login, logout, refreshToken } = useAuth()
  const { getTokenInfo, isTokenExpired, needsRefresh } = useTokenInfo()
  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const [testResults, setTestResults] = useState<any[]>([])

  // Update token info periodically
  useEffect(() => {
    const updateTokenInfo = () => {
      setTokenInfo(getTokenInfo())
    }

    updateTokenInfo()
    const interval = setInterval(updateTokenInfo, 1000)

    return () => clearInterval(interval)
  }, [getTokenInfo])

  const runTests = async () => {
    const results: any[] = []

    // Test 1: Token Storage
    try {
      const testTokenData = {
        accessToken: 'test-access-token-123',
        refreshToken: 'test-refresh-token-456',
        expiresAt: Date.now() + 3600000, // 1 hour
        tokenType: 'Bearer'
      }
      
      TokenManager.storeTokens(testTokenData, { id: 'test', username: 'testuser' })
      const stored = TokenManager.getTokens()
      
      results.push({
        test: 'Token Storage',
        success: stored.accessToken === testTokenData.accessToken,
        message: stored.accessToken === testTokenData.accessToken ? 'Token stored successfully' : 'Token storage failed'
      })
    } catch (error) {
      results.push({
        test: 'Token Storage',
        success: false,
        message: `Token storage error: ${error}`
      })
    }

    // Test 2: Token Validation
    try {
      const validation = TokenManager.validateToken()
      results.push({
        test: 'Token Validation',
        success: validation.isValid !== undefined,
        message: `Token valid: ${validation.isValid}, Expired: ${validation.isExpired}`
      })
    } catch (error) {
      results.push({
        test: 'Token Validation',
        success: false,
        message: `Token validation error: ${error}`
      })
    }

    // Test 3: Token Expiration Check
    try {
      const isExpired = TokenManager.isTokenExpired()
      const needsRefreshCheck = TokenManager.needsRefresh()
      results.push({
        test: 'Token Expiration',
        success: true,
        message: `Expired: ${isExpired}, Needs Refresh: ${needsRefreshCheck}`
      })
    } catch (error) {
      results.push({
        test: 'Token Expiration',
        success: false,
        message: `Expiration check error: ${error}`
      })
    }

    // Test 4: Token Cleanup
    try {
      TokenManager.clearTokens()
      const afterClear = TokenManager.getTokens()
      results.push({
        test: 'Token Cleanup',
        success: !afterClear.accessToken,
        message: afterClear.accessToken ? 'Tokens not cleared' : 'Tokens cleared successfully'
      })
    } catch (error) {
      results.push({
        test: 'Token Cleanup',
        success: false,
        message: `Cleanup error: ${error}`
      })
    }

    setTestResults(results)
  }

  const testLogin = async () => {
    try {
      const success = await login({
        username: 'test@example.com',
        password: 'testpassword123'
      })
      
      setTestResults(prev => [...prev, {
        test: 'Login Test',
        success,
        message: success ? 'Login successful' : 'Login failed'
      }])
    } catch (error) {
      setTestResults(prev => [...prev, {
        test: 'Login Test',
        success: false,
        message: `Login error: ${error}`
      }])
    }
  }

  const testRefresh = async () => {
    try {
      const success = await refreshToken()
      
      setTestResults(prev => [...prev, {
        test: 'Token Refresh',
        success,
        message: success ? 'Token refresh successful' : 'Token refresh failed'
      }])
    } catch (error) {
      setTestResults(prev => [...prev, {
        test: 'Token Refresh',
        success: false,
        message: `Refresh error: ${error}`
      }])
    }
  }

  const clearAllTests = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Token Management Test
          </h1>
          <p className="text-gray-600">
            Test the token management system with accessToken and refreshToken
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Token Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-6 w-6 text-blue-500" />
                <span>Current Token Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Authenticated:</span>
                    <span className={`ml-2 ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                      {isAuthenticated ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Has Access Token:</span>
                    <span className={`ml-2 ${tokenInfo?.hasAccessToken ? 'text-green-600' : 'text-red-600'}`}>
                      {tokenInfo?.hasAccessToken ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Has Refresh Token:</span>
                    <span className={`ml-2 ${tokenInfo?.hasRefreshToken ? 'text-green-600' : 'text-red-600'}`}>
                      {tokenInfo?.hasRefreshToken ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Is Expired:</span>
                    <span className={`ml-2 ${tokenInfo?.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                      {tokenInfo?.isExpired ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {tokenInfo?.expiresAt && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <div className="text-sm">
                      <div><strong>Expires At:</strong> {new Date(tokenInfo.expiresAt).toLocaleString()}</div>
                      {tokenInfo.timeUntilExpiry && (
                        <div><strong>Time Until Expiry:</strong> {Math.round(tokenInfo.timeUntilExpiry / 1000)} seconds</div>
                      )}
                    </div>
                  </div>
                )}

                {user && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <div className="text-sm">
                      <div><strong>User:</strong> {user.username}</div>
                      <div><strong>Email:</strong> {user.email}</div>
                      <div><strong>Role:</strong> {user.role}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={runTests} variant="outline">
                    Run Token Tests
                  </Button>
                  <Button onClick={testLogin} variant="outline">
                    Test Login
                  </Button>
                  <Button onClick={testRefresh} variant="outline">
                    Test Refresh
                  </Button>
                  <Button onClick={logout} variant="outline">
                    Logout
                  </Button>
                </div>
                
                <Button onClick={clearAllTests} className="w-full" variant="outline">
                  Clear Test Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    {result.success ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{result.test}</div>
                      <div className="text-sm text-gray-600">{result.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">1. Token Management Tests</h4>
                <p>Tests token storage, validation, expiration checking, and cleanup functionality.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">2. Login Test</h4>
                <p>Tests the login flow with proper accessToken and refreshToken handling.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">3. Token Refresh Test</h4>
                <p>Tests the token refresh functionality when tokens are expired or about to expire.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">4. Real-time Monitoring</h4>
                <p>The token status updates every second to show current token state and expiration info.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


