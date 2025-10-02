// Authentication Integration Test Utilities
// This file contains utilities to test the authentication integration with backend

import { userAPI } from '@/lib/apis'
import { LoginCredentials, RegisterData, User } from '@/types/auth'

export interface AuthTestResult {
  success: boolean
  message: string
  data?: any
  error?: any
}

export class AuthIntegrationTester {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  }

  // Test backend connectivity
  async testBackendConnectivity(): Promise<AuthTestResult> {
    try {
      const response = await userAPI.testOAuth()

      if (response.data && response.data.statusCode === 200) {
        return {
          success: true,
          message: 'Backend connectivity test passed',
          data: response.data
        }
      } else {
        return {
          success: false,
          message: `Backend connectivity test failed: ${response.data?.statusCode || 'Unknown error'}`,
          error: response.data
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Backend connectivity test error: ${error.message}`,
        error: error
      }
    }
  }

  // Test login endpoint
  async testLoginEndpoint(credentials: LoginCredentials): Promise<AuthTestResult> {
    try {
      const response = await userAPI.login(credentials)
      
      // Check if response has expected structure
      if ((response.data as any)?.data?.accessToken && (response.data as any)?.data?.user) {
        return {
          success: true,
          message: 'Login endpoint test passed',
          data: {
            hasToken: !!(response.data as any).data.accessToken,
            hasUser: !!(response.data as any).data.user,
            userRole: (response.data as any).data.user.role,
            userStatus: (response.data as any).data.user.status
          }
        }
      } else {
        return {
          success: false,
          message: 'Login endpoint returned unexpected data structure',
          data: response.data
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Login endpoint test error: ${error.message}`,
        error: error.response?.data || error
      }
    }
  }

  // Test register endpoint
  async testRegisterEndpoint(registerData: RegisterData): Promise<AuthTestResult> {
    try {
      const response = await userAPI.register(registerData)
      
      return {
        success: true,
        message: 'Register endpoint test passed',
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Register endpoint test error: ${error.message}`,
        error: error.response?.data || error
      }
    }
  }

  // Test profile endpoint
  async testProfileEndpoint(token: string): Promise<AuthTestResult> {
    try {
      // Temporarily set token for this request
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('auth_token', token)
      }

      const response = await userAPI.getProfile()
      
      if ((response.data as any)?.data) {
        return {
          success: true,
          message: 'Profile endpoint test passed',
          data: {
            userId: (response.data as any).data.id,
            username: (response.data as any).data.username,
            email: (response.data as any).data.email,
            role: (response.data as any).data.role
          }
        }
      } else {
        return {
          success: false,
          message: 'Profile endpoint returned unexpected data structure',
          data: response.data
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Profile endpoint test error: ${error.message}`,
        error: error.response?.data || error
      }
    }
  }

  // Test OAuth status endpoint
  async testOAuthStatusEndpoint(): Promise<AuthTestResult> {
    try {
      const response = await userAPI.getOAuthStatus()
      
      return {
        success: true,
        message: 'OAuth status endpoint test passed',
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        message: `OAuth status endpoint test error: ${error.message}`,
        error: error.response?.data || error
      }
    }
  }

  // Run all tests
  async runAllTests(): Promise<{
    connectivity: AuthTestResult
    oauthStatus: AuthTestResult
    summary: {
      total: number
      passed: number
      failed: number
    }
  }> {
    console.log('🧪 Starting Authentication Integration Tests...')
    
    const connectivity = await this.testBackendConnectivity()
    const oauthStatus = await this.testOAuthStatusEndpoint()
    
    const results = [connectivity, oauthStatus]
    const passed = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length
    
    console.log('📊 Test Results:', {
      total: results.length,
      passed,
      failed
    })

    return {
      connectivity,
      oauthStatus,
      summary: {
        total: results.length,
        passed,
        failed
      }
    }
  }
}

// Utility function to run tests from browser console
export const runAuthTests = async () => {
  const tester = new AuthIntegrationTester()
  return await tester.runAllTests()
}

// Test data for development
export const testCredentials: LoginCredentials = {
  username: 'test@example.com',
  password: 'testpassword123'
}

export const testRegisterData: RegisterData = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpassword123',
  firstName: 'Test',
  lastName: 'User',
  role: 'USER' as any
}

// Make tester available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).authTester = new AuthIntegrationTester()
  (window as any).runAuthTests = runAuthTests
}


