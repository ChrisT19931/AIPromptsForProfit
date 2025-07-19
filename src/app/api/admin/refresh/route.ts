import { NextRequest, NextResponse } from 'next/server';
import { SecureErrorHandler, ErrorType, ErrorSeverity, withErrorHandler } from '@/lib/error-handler';
import { SessionManager, CookieManager } from '@/lib/auth';
import { generateCSRFToken } from '@/lib/csrf';

// Rate limiting for refresh attempts
const refreshAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_REFRESH_ATTEMPTS = 10;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRefreshRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = refreshAttempts.get(ip);
  
  if (!attempts || now > attempts.resetTime) {
    refreshAttempts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (attempts.count >= MAX_REFRESH_ATTEMPTS) {
    return false;
  }
  
  attempts.count++;
  refreshAttempts.set(ip, attempts);
  return true;
}

export const POST = withErrorHandler(async (request: NextRequest) => {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Check rate limiting
  if (!checkRefreshRateLimit(ip)) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Too many refresh attempts'),
      ErrorType.RATE_LIMIT,
      ErrorSeverity.LOW,
      { ip, endpoint: '/api/admin/refresh' }
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  // Get refresh token from cookie
  const refreshToken = request.cookies.get('refresh-token')?.value;
  
  if (!refreshToken) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('No refresh token provided'),
      ErrorType.AUTHENTICATION,
      ErrorSeverity.LOW
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  try {
    // Refresh session
    const newSession = SessionManager.refreshSession(refreshToken);
    
    if (!newSession) {
      const errorDetails = SecureErrorHandler.handleError(
        new Error('Invalid or expired refresh token'),
        ErrorType.AUTHENTICATION,
        ErrorSeverity.MEDIUM,
        { ip }
      );
      
      // Clear invalid cookies
      const response = SecureErrorHandler.createErrorResponse(errorDetails);
      CookieManager.clearCookie(response, 'admin-token');
      CookieManager.clearCookie(response, 'refresh-token', '/api/admin/refresh');
      return response;
    }

    // Create response with new tokens
    const response = NextResponse.json({
      success: true,
      expiresAt: newSession.expiresAt.toISOString(),
      csrfToken: generateCSRFToken()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Content-Type-Options': 'nosniff'
      }
    });

    // Set new secure cookies
    CookieManager.setSecureCookie(response, 'admin-token', newSession.accessToken, {
      maxAge: 24 * 60 * 60, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    CookieManager.setSecureCookie(response, 'refresh-token', newSession.refreshToken, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/admin/refresh'
    });

    // Log successful refresh
    console.log('Session refreshed:', {
      ip,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent')
    });

    return response;
  } catch (error) {
    const errorDetails = SecureErrorHandler.handleError(
      error as Error,
      ErrorType.INTERNAL,
      ErrorSeverity.HIGH,
      { ip }
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }
}, ErrorType.AUTHENTICATION);