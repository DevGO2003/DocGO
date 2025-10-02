import { NextRequest, NextResponse } from 'next/server'
import { authService } from './lib/services/authService'
import serviceManager from './lib/services'
import { createErrorResponse, generateRequestId, AuthenticationError, AuthorizationError } from './lib/utils/errorHandler'

// Rate limiting configuration
const windowMs = 60_000
const max = 60
const store = new Map<string, { count: number; resetAt: number }>()

// Public routes that don't require authentication
const publicRoutes = [
  // Legacy/public BFF auth endpoints
  '/api/auth/login',
  '/api/auth/refresh',
  // OAuth2 endpoints
  '/oauth2',
  '/login/oauth2',
  // OpenAPI & health
  '/health',
  '/api/docs',
  '/api/swagger.json',
  '/api/oauth2/test',
  // DEVELOPMENT: Bypass auth for all API routes
  '/api'
]

function isPublicAuthPath(pathname: string): boolean {
  // Allow direct proxy calls to authentication service auth endpoints (login/register/refresh, oauth)
  if (pathname.startsWith('/api/v1/user-management-service/v1/auth/login')) return true
  if (pathname.startsWith('/api/v1/user-management-service/v1/auth/register')) return true
  if (pathname.startsWith('/api/v1/user-management-service/v1/auth/refresh')) return true
  if (pathname.startsWith('/api/v1/user-management-service/v1/auth/forgot-password')) return true
  if (pathname.startsWith('/api/v1/user-management-service/v1/auth/reset-password')) return true
  if (pathname.startsWith('/api/v1/user-management-service/v1/auth/oauth2')) return true
  if (pathname.startsWith('/api/v1/user-management-service/v1/oauth2')) return true
  // Public health endpoint of auth service
  if (pathname.startsWith('/api/v1/user-management-service/v1/auth/health')) return true
  return false
}

// Admin routes that require admin role
const adminRoutes = [
  '/api/admin',
  '/api/users',
  '/api/system'
]

// Service health status cache
const serviceHealthCache = new Map<string, { status: boolean; lastCheck: number }>()
const HEALTH_CHECK_INTERVAL = 30000 // 30 seconds

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // Skip middleware for non-API routes
  if (!pathname.startsWith('/api/')) return NextResponse.next()
  
  try {
    // 1. Rate limiting
    const rateLimitResult = await handleRateLimit(req)
    if (rateLimitResult) return rateLimitResult
    
    // Handle health check first
    if (req.nextUrl.pathname === '/health') {
      return NextResponse.json({
        apiVersion: 'v1',
        statusCode: 200,
        shortMessage: 'Success',
        description: 'Service đang hoạt động bình thường',
        data: {
          status: 'healthy',
          service: 'API Gateway BFF',
          version: '1.0.0',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: '/health'
      });
    }

    // Execute middleware chain
    const handlers = [
      handleCORS,
      handleAuthentication,
      handleAuthorization,
      handleServiceHealth
    ];

    let response: NextResponse | null = null;

    for (const handler of handlers) {
      const result = await handler(req);
      if (result instanceof NextResponse) {
        // If a handler returns a response, stop the chain
        return result;
      }
    }
    
    // If no handler returned a response, proceed and attach CORS headers
    const headers = buildCorsHeaders(req)
    return NextResponse.next({
      headers
    });
    
  } catch (error) {
    console.error('[Middleware] Error:', error)
    return createErrorResponse(error as Error, req)
  }
}

async function handleRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const rec = store.get(ip)
  
  if (!rec || rec.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return null
  }
  
  if (rec.count >= max) {
    const body = JSON.stringify({
      apiVersion: 'v1',
      statusCode: 429,
      shortMessage: 'Too Many Requests',
      description: 'Rate limit exceeded',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: req.nextUrl.pathname
    })
    return new NextResponse(body, {
      status: 200,
      headers: { 'content-type': 'application/json' }
    })
  }
  
  rec.count += 1
  return null
}

async function handleCORS(req: NextRequest): Promise<NextResponse | null> {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: buildCorsHeaders(req)
    })
  }
  
  return null
}

async function handleAuthentication(req: NextRequest): Promise<NextResponse | null> {
  const pathname = req.nextUrl.pathname
  
  // Skip authentication for public routes or public auth paths
  if (publicRoutes.some(route => pathname.startsWith(route)) || isPublicAuthPath(pathname)) {
    return null
  }
  
  // Get authorization header
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const requestId = generateRequestId()
    throw new AuthenticationError(
      'Missing or invalid authorization header',
      requestId,
      pathname
    )
  }
  
  const token = authHeader.substring(7)
  
  try {
    // Validate token with auth service
    const isValid = await authService.validateToken(token)
    if (!isValid) {
      const requestId = generateRequestId()
      throw new AuthenticationError(
        'Invalid or expired token',
        requestId,
        pathname
      )
    }
    
    // Add user info to headers for downstream services
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-token', token)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    
  } catch (error) {
    const requestId = generateRequestId()
    throw new AuthenticationError(
      'Token validation failed',
      requestId,
      pathname,
      error
    )
  }
}

async function handleAuthorization(req: NextRequest): Promise<NextResponse | null> {
  const pathname = req.nextUrl.pathname
  
  // Skip authorization for non-admin routes
  if (!adminRoutes.some(route => pathname.startsWith(route))) {
    return null
  }
  
  // Get user token from headers
  const token = req.headers.get('x-user-token')
  if (!token) {
    const requestId = generateRequestId()
    throw new AuthorizationError(
      'User token not found',
      requestId,
      pathname
    )
  }
  
  try {
    // TODO: Implement role-based authorization
    // For now, we'll assume all authenticated users have access
    // In a real implementation, you would:
    // 1. Decode the JWT token
    // 2. Extract user roles
    // 3. Check if user has required permissions
    
    return null
    
  } catch (error) {
    const requestId = generateRequestId()
    throw new AuthorizationError(
      'Authorization check failed',
      requestId,
      pathname,
      error
    )
  }
}

async function handleServiceHealth(req: NextRequest): Promise<NextResponse | null> {
  const pathname = req.nextUrl.pathname
  
  // Check service health for specific routes
  if (pathname.startsWith('/api/contracts') || pathname.startsWith('/api/ai') || pathname.startsWith('/api/files')) {
    const serviceName = getServiceNameFromPath(pathname)
    const isHealthy = await checkServiceHealth(serviceName)
    
    if (!isHealthy) {
      const requestId = generateRequestId()
      return createErrorResponse(
        new Error(`Service ${serviceName} is unavailable`),
        req,
        503
      )
    }
  }
  
  return null
}

function getServiceNameFromPath(pathname: string): string {
  if (pathname.startsWith('/api/contracts')) return 'contract'
  if (pathname.startsWith('/api/ai')) return 'ai'
  if (pathname.startsWith('/api/files')) return 'file'
  return 'unknown'
}

async function checkServiceHealth(serviceName: string): Promise<boolean> {
  const now = Date.now()
  const cached = serviceHealthCache.get(serviceName)
  
  // Return cached result if it's still fresh
  if (cached && (now - cached.lastCheck) < HEALTH_CHECK_INTERVAL) {
    return cached.status
  }
  
  try {
    let isHealthy = false
    
    switch (serviceName) {
      case 'contract':
        isHealthy = await serviceManager.checkServiceHealth('document-management-service')
        break
      case 'ai':
        isHealthy = await serviceManager.checkServiceHealth('automation-service')
        break
      case 'file':
        isHealthy = await serviceManager.checkServiceHealth('file-storage-asset-service')
        break
      default:
        isHealthy = true
    }
    
    // Cache the result
    serviceHealthCache.set(serviceName, {
      status: isHealthy,
      lastCheck: now
    })
    
    return isHealthy
    
  } catch (error) {
    console.error(`[Middleware] Health check failed for ${serviceName}:`, error)
    
    // Cache negative result
    serviceHealthCache.set(serviceName, {
      status: false,
      lastCheck: now
    })
    
    return false
  }
}

export const config = {
  matcher: ['/api/:path*'],
}

function buildCorsHeaders(req: NextRequest): HeadersInit {
  const origin = req.headers.get('origin') || ''
  const envOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map(o => o.trim()).filter(Boolean)
  const isAllowed = origin && envOrigins.some(allowed => allowed === origin)
  const allowOrigin = isAllowed ? origin : envOrigins[0] || ''

  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  }
  return headers
}


