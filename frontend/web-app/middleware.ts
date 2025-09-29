import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/oauth',
  '/auth/oauth2',
  '/unauthorized',
  '/test-no-auth',
  '/test-hot-reload',
  '/test-api',
  '/privacy',
  '/terms',
  '/help-support'
]

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/contracts',
  '/analytics',
  '/profile',
  '/settings',
  '/user-management',
  '/approval-workflow',
  '/e-signature',
  '/collaboration-comments',
  '/contract-versions',
  '/role-based-permissions',
  '/notifications',
  '/calendar',
  '/reports',
  '/integrations',
  '/backup-restore',
  '/ai-processing',
  '/activity-history',
  '/account-approval',
  '/test-auth',
  '/test-token-management'
]

// API routes that don't require authentication
const publicApiRoutes = [
  '/api/health',
  '/api/mock'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/') && !pathname.startsWith('/api/v1/')
  ) {
    return NextResponse.next()
  }

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    // Check for authentication token in cookies (primary) or headers (fallback)
    const authToken = request.cookies.get('auth_token')?.value ||
                     request.headers.get('authorization')?.replace('Bearer ', '')

    // Debug logging for middleware
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Protected route check:', {
        pathname,
        hasCookieToken: !!request.cookies.get('auth_token')?.value,
        hasHeaderToken: !!request.headers.get('authorization'),
        tokenPreview: authToken ? `${authToken.substring(0, 20)}...` : null
      })
    }

    // If no token, redirect to login page instead of unauthorized
    if (!authToken) {
      console.log('[Middleware] No auth token found, redirecting to login')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // If token exists, allow access
    console.log('[Middleware] Auth token found, allowing access')
    return NextResponse.next()
  }

  // For unknown routes (like 404), redirect to home instead of dashboard
  // This prevents the "cần đăng nhập lại" issue
  if (pathname !== '/' && !isPublicRoute && !isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
