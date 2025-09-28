import { NextApiRequest, NextApiResponse } from 'next'
import { authService, LoginRequest } from '../../../lib/services/authService'
import { createErrorResponse, generateRequestId, ValidationError } from '../../../lib/utils/errorHandler'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    const corsOrigin = 'http://localhost:3000'; // Hardcode for now
    console.log(`🌐 CORS Origin: ${corsOrigin}`);
    
    res.setHeader('Access-Control-Allow-Origin', corsOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      apiVersion: 'v1',
      statusCode: 405,
      shortMessage: 'Method Not Allowed',
      description: 'Only POST method is allowed',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: req.url || '/api/auth/login'
    })
  }

  try {
    // Validate request body
    const { username, password } = req.body

    if (!username || !password) {
      const requestId = generateRequestId()
      throw new ValidationError(
        'Username and password are required',
        requestId,
        '/api/auth/login'
      )
    }

    // Create login request
    const loginRequest: LoginRequest = {
      username,
      password
    }

    // Call auth service
    const result = await authService.login(loginRequest)

    // Set cookies for middleware-based auth persistence
    try {
      const origin = 'http://localhost:3000'
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
      res.setHeader('Access-Control-Allow-Credentials', 'true')

      const token = result?.data?.token
      const refreshToken = result?.data?.refreshToken

      const isSecure = false // dev over http
      const sameSite = 'Lax'
      const cookieBase = `Path=/; HttpOnly; SameSite=${sameSite}${isSecure ? '; Secure' : ''}`

      const setCookies: string[] = []
      if (typeof token === 'string' && token.length > 0) {
        // Default 24h if backend does not include expiresIn
        const maxAge = 24 * 60 * 60
        setCookies.push(`auth_token=${encodeURIComponent(token)}; Max-Age=${maxAge}; ${cookieBase}`)
      }
      if (typeof refreshToken === 'string' && refreshToken.length > 0) {
        // 7 days for refresh token
        setCookies.push(`refresh_token=${encodeURIComponent(refreshToken)}; Max-Age=${7 * 24 * 60 * 60}; ${cookieBase}`)
      }
      if (setCookies.length) {
        res.setHeader('Set-Cookie', setCookies)
      }
    } catch (e) {
      console.warn('[Auth Login] Failed setting cookies:', e)
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Return success response
    return res.status(200).json(result)

  } catch (error: any) {
    console.error('[Auth Login] Error:', error)
    
    if (error.name === 'ValidationError') {
      const requestId = generateRequestId()
      
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      
      return res.status(200).json({
        apiVersion: 'v1',
        statusCode: 400,
        shortMessage: 'Bad Request',
        description: error.message || 'Validation failed',
        data: null,
        timestamp: new Date().toISOString(),
        requestId: requestId,
        path: req.url || '/api/auth/login'
      })
    }

    // Handle service errors
    const requestId = generateRequestId()
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    return res.status(200).json({
      apiVersion: 'v1',
      statusCode: 500,
      shortMessage: 'Internal Server Error',
      description: error.message || 'Login failed',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: requestId,
      path: req.url || '/api/auth/login'
    })
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
