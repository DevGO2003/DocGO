import { NextApiRequest, NextApiResponse } from 'next'
import { createErrorResponse, generateRequestId, ValidationError } from '../../lib/utils/errorHandler'
import { authService } from '../../lib/services/authService'

export class UserController {
  private req: NextApiRequest
  private res: NextApiResponse

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.req = req
    this.res = res
  }

  async handleRequest() {
    const method = this.req.method
    const path = this.req.url || ''

    try {
      // Route based on path
      if (path.includes('/auth/login')) {
        return await this.handleLogin()
      } else if (path.includes('/auth/logout')) {
        return await this.handleLogout()
      } else if (path.includes('/auth/refresh')) {
        return await this.handleRefresh()
      } else if (path.includes('/auth/me')) {
        return await this.handleGetMe()
      } else if (path.includes('/auth/validate')) {
        return await this.handleValidate()
      } else {
        return this.methodNotAllowed(['POST', 'GET'])
      }
    } catch (error: any) {
      console.error('[UserController] Error:', error)
      return this.res.status(200).json(createErrorResponse(error, this.req as any))
    }
  }

  private async handleLogin() {
    if (!this.validateMethod(['POST'])) return

    try {
      const { email, password } = this.req.body

      if (!email || !password) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'Email and password are required',
          requestId,
          this.req.url || '/api/auth/login'
        )
      }

      const result = await authService.login({ email, password })
      return this.success(result, 200, 'Login successful')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleLogout() {
    if (!this.validateMethod(['POST'])) return

    try {
      const token = this.getToken()
      if (!token) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'Token is required',
          requestId,
          this.req.url || '/api/auth/logout'
        )
      }

      const result = await authService.logout(token)
      return this.success(result, 200, 'Logout successful')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleRefresh() {
    if (!this.validateMethod(['POST'])) return

    try {
      const { refreshToken } = this.req.body

      if (!refreshToken) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'Refresh token is required',
          requestId,
          this.req.url || '/api/auth/refresh'
        )
      }

      const result = await authService.refreshToken({ refreshToken })
      return this.success(result, 200, 'Token refreshed successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleGetMe() {
    if (!this.validateMethod(['GET'])) return

    try {
      const token = this.getToken()
      if (!token) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'Token is required',
          requestId,
          this.req.url || '/api/auth/me'
        )
      }

      const result = await authService.getMe(token)
      return this.success(result, 200, 'User information retrieved successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleValidate() {
    if (!this.validateMethod(['GET'])) return

    try {
      const token = this.getToken()
      if (!token) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'Token is required',
          requestId,
          this.req.url || '/api/auth/validate'
        )
      }

      const result = await authService.validateToken(token)
      return this.success(result, 200, 'Token validated successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  // Helper methods
  private validateMethod(allowedMethods: string[]): boolean {
    const method = this.req.method
    if (!allowedMethods.includes(method || '')) {
      this.res.status(405).json({
        apiVersion: 'v1',
        statusCode: 405,
        shortMessage: 'Method Not Allowed',
        description: `Method ${method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
        data: null,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: this.req.url || ''
      })
      return false
    }
    return true
  }

  private methodNotAllowed(allowedMethods: string[]) {
    return this.validateMethod(allowedMethods)
  }

  private success(data: any, statusCode: number = 200, message: string = 'Success') {
    return this.res.status(statusCode).json({
      apiVersion: 'v1',
      statusCode,
      shortMessage: message,
      description: message,
      data,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: this.req.url || ''
    })
  }

  private error(error: any) {
    console.error(`[UserController] Error:`, error)
    return this.res.status(200).json(createErrorResponse(error, this.req as any))
  }

  private getToken(): string | undefined {
    return this.req.headers['x-user-token'] as string
  }
}

// Helper function for backward compatibility
export async function handleUserRequest(req: NextApiRequest, res: NextApiResponse) {
  const controller = new UserController(req, res)
  return await controller.handleRequest()
}
