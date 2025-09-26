import { authService } from '../../../lib/services/authService'
import { generateRequestId } from '../../../lib/utils/errorHandler'

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      apiVersion: 'v1',
      statusCode: 405,
      shortMessage: 'Method Not Allowed',
      description: 'Only GET method is allowed',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: req.url || '/api/auth/me'
    })
  }

  try {
    // Read token from Authorization header or cookie
    const authHeader = req.headers['authorization']
    const bearer = typeof authHeader === 'string' ? authHeader : undefined
    const tokenFromHeader = bearer?.startsWith('Bearer ') ? bearer.substring(7) : undefined
    const tokenFromCookie = req.cookies?.auth_token
    const token = tokenFromHeader || tokenFromCookie

    if (!token) {
      return res.status(200).json({
        apiVersion: 'v1',
        statusCode: 401,
        shortMessage: 'Unauthorized',
        description: 'Missing Authorization token',
        data: null,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: req.url || '/api/auth/me'
      })
    }

    const result = await authService.getProfile(token)

    // Ensure CORS for browser access
    const origin = 'http://localhost:3000'
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    return res.status(200).json(result)
  } catch (error: any) {
    const requestId = generateRequestId()
    return res.status(200).json({
      apiVersion: 'v1',
      statusCode: 500,
      shortMessage: 'Internal Server Error',
      description: error.message || 'Get profile failed',
      data: null,
      timestamp: new Date().toISOString(),
      requestId,
      path: req.url || '/api/auth/me'
    })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}


