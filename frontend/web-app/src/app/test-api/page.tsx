'use client'

import React, { useState } from 'react'
import { PublicLayout } from '@/components/layout'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { authAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface TestResult {
  success: boolean
  data?: any
  error?: any
}

interface TestResults {
  [key: string]: TestResult
}

export default function TestAPIPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TestResults>({})

  const testAuthAPI = async () => {
    setLoading(true)
    try {
      // Test login endpoint
      const loginResponse = await authAPI.login({
        username: 'test@example.com',
        password: 'password123'
      })
      
      setResults((prev: TestResults) => ({
        ...prev,
        login: {
          success: true,
          data: loginResponse.data
        }
      }))
      
      toast.success('Auth API test successful!')
    } catch (error: any) {
      setResults((prev: TestResults) => ({
        ...prev,
        login: {
          success: false,
          error: error.response?.data || error.message
        }
      }))
      
      toast.error('Auth API test failed')
    } finally {
      setLoading(false)
    }
  }

  const testHealthCheck = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      
      setResults((prev: TestResults) => ({
        ...prev,
        health: {
          success: true,
          data
        }
      }))
      
      toast.success('Health check successful!')
    } catch (error: any) {
      setResults((prev: TestResults) => ({
        ...prev,
        health: {
          success: false,
          error: error.message
        }
      }))
      
      toast.error('Health check failed')
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults({})
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">API Gateway Test</h1>
            <p className="text-gray-600 mt-2">
              Test kết nối đến API Gateway và các microservices
            </p>
          </div>

          <div className="grid gap-6">
            {/* Test Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Test Controls</CardTitle>
                <CardDescription>
                  Chọn test để kiểm tra kết nối API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={testHealthCheck}
                    disabled={loading}
                    variant="outline"
                  >
                    {loading ? 'Testing...' : 'Test Health Check'}
                  </Button>
                  
                  <Button
                    onClick={testAuthAPI}
                    disabled={loading}
                    variant="outline"
                  >
                    {loading ? 'Testing...' : 'Test Auth API'}
                  </Button>
                  
                  <Button
                    onClick={clearResults}
                    variant="outline"
                  >
                    Clear Results
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {Object.keys(results).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                  <CardDescription>
                    Kết quả các test đã thực hiện
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(results).map(([testName, result]: [string, TestResult]) => (
                      <div key={testName} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2 capitalize">
                          {testName} Test
                        </h3>
                        <div className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                          Status: {result.success ? '✅ Success' : '❌ Failed'}
                        </div>
                        <div className="mt-2">
                          <details className="text-sm">
                            <summary className="cursor-pointer hover:text-gray-600">
                              {result.success ? 'View Response Data' : 'View Error Details'}
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                              {JSON.stringify(result.success ? result.data : result.error, null, 2)}
                            </pre>
                          </details>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Gateway Info */}
            <Card>
              <CardHeader>
                <CardTitle>API Gateway Information</CardTitle>
                <CardDescription>
                  Thông tin về API Gateway và các services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Base URL</h3>
                    <p className="text-sm text-gray-600">
                      {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Available Services</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• authentication-identity-service (Port 8001)</li>
                      <li>• user-management-service (Port 8002)</li>
                      <li>• contract-management-service (Port 8003)</li>
                      <li>• ai-processing-service (Port 8017)</li>
                      <li>• file-storage-asset-service (Port 8012)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">API Endpoints</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• GET /api/health - Health check</li>
                      <li>• POST /api/v1/authentication-identity-service/auth/login - Login</li>
                      <li>• POST /api/v1/authentication-identity-service/auth/register - Register</li>
                      <li>• GET /api/v1/contract-management-service/contracts - Get contracts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
