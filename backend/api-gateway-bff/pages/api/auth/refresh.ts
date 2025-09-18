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
