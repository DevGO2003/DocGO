import { NextApiRequest, NextApiResponse } from 'next'
import { authService, LogoutRequest } from '../../../lib/services/authService'
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
      path: req.url || '/api/auth/logout'
    })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const requestId = generateRequestId()
      throw new ValidationError(
        'Authorization header with Bearer token is required',
        requestId,
        '/api/auth/logout'
      )
    }

    const token = authHeader.substring(7)

    // Create logout request
    const logoutRequest: LogoutRequest = {
      token
    }

    // Call auth service
    const result = await authService.logout(logoutRequest)

    // Return success response
    return res.status(200).json(result)

  } catch (error: any) {
    console.error('[Auth Logout] Error:', error)
    
    if (error.name === 'ValidationError') {
      return res.status(200).json(createErrorResponse(error, req as any))
    }

    // Handle service errors
    const requestId = generateRequestId()
    const errorResponse = createErrorResponse(
      new Error(error.message || 'Logout failed'),
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
