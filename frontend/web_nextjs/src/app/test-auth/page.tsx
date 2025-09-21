'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AuthIntegrationTester, AuthTestResult } from '@/utils/auth-test'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function TestAuthPage() {
  const [testResults, setTestResults] = useState<{
    connectivity: AuthTestResult | null
    oauthStatus: AuthTestResult | null
    summary: {
      total: number
      passed: number
      failed: number
    } | null
  } | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    setTestResults(null)
    
    try {
      const tester = new AuthIntegrationTester()
      const results = await tester.runAllTests()
      setTestResults(results)
    } catch (error) {
      console.error('Test execution error:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    } else {
      return <XCircleIcon className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authentication Integration Test
          </h1>
          <p className="text-gray-600">
            Test the integration between frontend and backend authentication services
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
              <span>Test Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Click the button below to run authentication integration tests. 
                This will test connectivity, OAuth status, and API endpoints.
              </p>
              <Button
                onClick={runTests}
                disabled={isRunning}
                className="w-full sm:w-auto"
              >
                {isRunning ? 'Running Tests...' : 'Run Authentication Tests'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {testResults && (
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Test Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {testResults.summary?.total || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Tests</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {testResults.summary?.passed || 0}
                    </div>
                    <div className="text-sm text-gray-600">Passed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.summary?.failed || 0}
                    </div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connectivity Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(testResults.connectivity?.success || false)}
                  <span>Backend Connectivity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className={getStatusColor(testResults.connectivity?.success || false)}>
                    {testResults.connectivity?.message || 'No message'}
                  </p>
                  {testResults.connectivity?.data && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <pre className="text-xs text-gray-600 overflow-auto">
                        {JSON.stringify(testResults.connectivity?.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  {testResults.connectivity?.error && (
                    <div className="mt-2 p-3 bg-red-50 rounded-md">
                      <pre className="text-xs text-red-600 overflow-auto">
                        {JSON.stringify(testResults.connectivity?.error, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* OAuth Status Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(testResults.oauthStatus?.success || false)}
                  <span>OAuth Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className={getStatusColor(testResults.oauthStatus?.success || false)}>
                    {testResults.oauthStatus?.message || 'No message'}
                  </p>
                  {testResults.oauthStatus?.data && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <pre className="text-xs text-gray-600 overflow-auto">
                        {JSON.stringify(testResults.oauthStatus?.data, null, 2)}
                      </pre>
                    </div>
                  )}
                  {testResults.oauthStatus?.error && (
                    <div className="mt-2 p-3 bg-red-50 rounded-md">
                      <pre className="text-xs text-red-600 overflow-auto">
                        {JSON.stringify(testResults.oauthStatus?.error, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">1. Backend Connectivity Test</h4>
                <p>Tests if the frontend can connect to the authentication service backend.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">2. OAuth Status Test</h4>
                <p>Tests if Google OAuth is properly configured and available.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">3. Browser Console Testing</h4>
                <p>You can also run tests from the browser console:</p>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs">
                  {`// Run all tests
await runAuthTests()

// Or use the tester directly
const tester = new AuthIntegrationTester()
await tester.testBackendConnectivity()`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


