import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from './lib/rate-limit';
import { validateCSRFToken } from './lib/csrf';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 unique IPs per minute
});

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  const method = request.method;
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Strict Transport Security (HTTPS only)
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com https://www.google-analytics.com",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspHeader);

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    try {
      // Different rate limits for different endpoints
      let limit = 60; // Default: 60 requests per minute
      
      if (pathname.includes('/admin/')) {
        limit = 30; // Admin endpoints: 30 requests per minute
      } else if (pathname.includes('/verify-') || pathname.includes('/login')) {
        limit = 10; // Auth endpoints: 10 requests per minute
      } else if (pathname.includes('/outreach') || pathname.includes('/submit')) {
        limit = 5; // Sensitive operations: 5 requests per minute
      }

      await limiter.check(response, limit, ip + pathname);
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      );
    }
  }

  // CSRF Protection for state-changing operations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && pathname.startsWith('/api/')) {
    // Skip CSRF for Stripe webhooks and public endpoints
    const skipCSRF = [
      '/api/webhooks/',
      '/api/verify-session',
      '/api/verify-purchase'
    ].some(path => pathname.startsWith(path));

    if (!skipCSRF) {
      const csrfToken = request.headers.get('x-csrf-token');
      const isValidCSRF = await validateCSRFToken(csrfToken, request);
      
      if (!isValidCSRF) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Invalid CSRF token',
            code: 'CSRF_TOKEN_INVALID'
          }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Check for admin authentication
    const adminToken = request.cookies.get('admin-token')?.value;
    
    if (!adminToken) {
      // Redirect to login if no admin token
      return NextResponse.redirect(new URL('/login?redirect=' + encodeURIComponent(pathname), request.url));
    }
    
    // Validate admin token (implement proper JWT validation)
    try {
      // This would validate the JWT token in a real implementation
      // For now, we'll check if it exists and is not expired
      const isValidToken = await validateAdminToken(adminToken);
      
      if (!isValidToken) {
        const response = NextResponse.redirect(new URL('/login?error=session_expired', request.url));
        response.cookies.delete('admin-token');
        return response;
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
      response.cookies.delete('admin-token');
      return response;
    }
  }

  // Prevent access to sensitive files
  const sensitiveFiles = [
    '.env',
    '.env.local',
    '.env.production',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'next.config.ts'
  ];
  
  if (sensitiveFiles.some(file => pathname.includes(file))) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Prevent directory traversal
  if (pathname.includes('../') || pathname.includes('..\\')) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  return response;
}

// Helper function to validate admin tokens
async function validateAdminToken(token: string): Promise<boolean> {
  try {
    // In a real implementation, you would:
    // 1. Verify JWT signature
    // 2. Check expiration
    // 3. Validate against database/cache
    // 4. Check user permissions
    
    // For now, basic validation
    if (!token || token.length < 10) {
      return false;
    }
    
    // Simulate token validation
    return token.startsWith('admin_') && token.length > 20;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};