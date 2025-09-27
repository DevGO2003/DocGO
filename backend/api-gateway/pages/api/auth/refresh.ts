import { NextApiRequest, NextApiResponse } from 'next'
import { authService, RefreshTokenRequest } from '../../../lib/services/authService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../lib/utils/errorHandler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      apiVersion: 'v1',
      statusCode: 405,
      shortMessage: 'Method Not Allowed',
      description: 'Only POST method is allowed',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: req.url || '/api/auth/refresh'
    })
  }

  try {
    // Validate request body
    const { refreshToken } = req.body

    if (!refreshToken) {
      const requestId = generateRequestId()
      throw new ValidationError(
        'Refresh token is required',
        requestId,
        '/api/auth/refresh'
      )
    }

    // Create refresh token request
    const refreshRequest: RefreshTokenRequest = {
      refreshToken
    }

    // Call auth service
    const result = await authService.refreshToken(refreshRequest)

    // Set rotated cookies
    try {
      const token = result?.data?.token
      const newRefresh = result?.data?.refreshToken

      const isSecure = false // dev over http
      const sameSite = 'Lax'
      const cookieBase = `Path=/; HttpOnly; SameSite=${sameSite}${isSecure ? '; Secure' : ''}`

      const setCookies: string[] = []
      if (typeof token === 'string' && token.length > 0) {
        // Assume 15 minutes default if backend not providing expiresIn here
        setCookies.push(`auth_token=${encodeURIComponent(token)}; Max-Age=${15 * 60}; ${cookieBase}`)
      }
      if (typeof newRefresh === 'string' && newRefresh.length > 0) {
        setCookies.push(`refresh_token=${encodeURIComponent(newRefresh)}; Max-Age=${7 * 24 * 60 * 60}; ${cookieBase}`)
      }
      if (setCookies.length) {
        res.setHeader('Set-Cookie', setCookies)
      }
    } catch (e) {
      console.warn('[Auth Refresh] Failed setting cookies:', e)
    }

    // Return success response
    return res.status(200).json(result)

  } catch (error: any) {
    console.error('[Auth Refresh] Error:', error)
    
    if (error.name === 'ValidationError') {
      return res.status(200).json(createErrorResponse(error, req as any))
    }

    // Handle service errors
    const requestId = generateRequestId()
    const errorResponse = createErrorResponse(
      new Error(error.message || 'Token refresh failed'),
      req as any,
      500
    )

    return res.status(200).json(errorResponse)
  }
}

// Disable body parsing for this route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
