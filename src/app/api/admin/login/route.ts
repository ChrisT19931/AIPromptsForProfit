import { NextRequest, NextResponse } from 'next/server';
import { InputValidator, CommonSchemas } from '@/lib/security/validation';
import { SecureErrorHandler } from '@/lib/security/error-handler';
import { AuthMiddleware, SessionManager, CookieManager } from '@/lib/security/auth';
import { validateCSRFToken } from '@/lib/security/csrf';

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; resetTime: number; lockedUntil?: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkLoginRateLimit(ip: string): { allowed: boolean; remainingAttempts?: number; lockedUntil?: number } {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  
  if (!attempts || now > attempts.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1 };
  }
  
  // Check if IP is locked out
  if (attempts.lockedUntil && now < attempts.lockedUntil) {
    return { allowed: false, lockedUntil: attempts.lockedUntil };
  }
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    // Lock the IP
    attempts.lockedUntil = now + LOCKOUT_DURATION;
    loginAttempts.set(ip, attempts);
    return { allowed: false, lockedUntil: attempts.lockedUntil };
  }
  
  attempts.count++;
  loginAttempts.set(ip, attempts);
  return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - attempts.count };
}

function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export async function POST(request: NextRequest) {
  try {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
    // Check rate limiting
    const rateLimitResult = checkLoginRateLimit(ip);
    if (!rateLimitResult.allowed) {
      const response = SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('RATE_LIMIT', 'Too many login attempts', {
          ip, 
          lockedUntil: rateLimitResult.lockedUntil,
          endpoint: '/api/admin/login'
        }),
        request
      );
      
      if (rateLimitResult.lockedUntil) {
        response.headers.set('Retry-After', Math.ceil((rateLimitResult.lockedUntil - Date.now()) / 1000).toString());
      }
      return response;
    }

    // CSRF validation
    const csrfToken = request.headers.get('x-csrf-token');
    const isValidCSRF = await validateCSRFToken(csrfToken, request);
    if (!isValidCSRF) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('AUTHENTICATION', 'Invalid CSRF token'),
        request
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('VALIDATION', 'Invalid JSON payload'),
        request
      );
    }

  // Input validation
  const validationSchema = {
    username: {
      required: true,
      type: 'string' as const,
      minLength: 3,
      maxLength: 50,
      sanitize: true,
      pattern: /^[a-zA-Z0-9_]+$/
    },
    password: {
      required: true,
      type: 'string' as const,
      minLength: 8,
      maxLength: 128,
      sanitize: false // Don't sanitize passwords
    }
  };

  const validation = InputValidator.validate(body, validationSchema);
  if (!validation.isValid) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Invalid login credentials'),
      ErrorType.VALIDATION,
      ErrorSeverity.LOW,
      { errors: validation.errors }
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  const { username, password } = validation.sanitizedData;

  try {
    // Authenticate admin
    const authResult = await AuthMiddleware.authenticateAdmin(username, password);
    
    if (!authResult.success || !authResult.user) {
      // Log failed attempt but don't reveal specific reason
      console.warn('Failed admin login attempt:', {
        ip,
        username: InputValidator.preventSQLInjection(username),
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent')
      });
      
      const errorDetails = SecureErrorHandler.handleError(
        new Error('Invalid credentials'),
        ErrorType.AUTHENTICATION,
        ErrorSeverity.MEDIUM,
        { 
          ip, 
          username,
          remainingAttempts: rateLimitResult.remainingAttempts
        }
      );
      return SecureErrorHandler.createErrorResponse(errorDetails);
    }

    // Reset login attempts on successful login
    resetLoginAttempts(ip);

    // Create session
    const session = SessionManager.createSession(authResult.user);
    
    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: authResult.user.id,
        username: authResult.user.username,
        role: authResult.user.role,
        permissions: authResult.user.permissions
      },
      expiresAt: session.expiresAt.toISOString(),
      csrfToken: generateCSRFToken()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Content-Type-Options': 'nosniff'
      }
    });

    // Set secure cookies
    CookieManager.setSecureCookie(response, 'admin-token', session.accessToken, {
      maxAge: 24 * 60 * 60, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    CookieManager.setSecureCookie(response, 'refresh-token', session.refreshToken, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/admin/refresh'
    });

    // Log successful login
    console.log('Successful admin login:', {
      userId: authResult.user.id,
      username: authResult.user.username,
      ip: InputValidator.preventSQLInjection(ip),
      timestamp: new Date().toISOString(),
      userAgent: InputValidator.preventSQLInjection(request.headers.get('user-agent') || '')
    });

    return response;
  } catch (error) {
    const errorDetails = SecureErrorHandler.handleError(
      error as Error,
      ErrorType.INTERNAL,
      ErrorSeverity.HIGH,
      { ip, username }
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }
}, ErrorType.AUTHENTICATION);

// Logout endpoint
export const DELETE = withErrorHandler(async (request: NextRequest) => {
  const adminToken = request.cookies.get('admin-token')?.value;
  
  if (adminToken) {
    // Invalidate session
    const sessionData = SessionManager.validateSession(adminToken);
    if (sessionData) {
      SessionManager.invalidateSession(sessionData.sessionId, adminToken);
    }
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  // Clear cookies
  CookieManager.clearCookie(response, 'admin-token');
  CookieManager.clearCookie(response, 'refresh-token', '/api/admin/refresh');
  
  return response;
}, ErrorType.AUTHENTICATION);

// Get current session info
export const GET = withErrorHandler(async (request: NextRequest) => {
  const adminToken = request.cookies.get('admin-token')?.value;
  
  if (!adminToken) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('No active session'),
      ErrorType.AUTHENTICATION,
      ErrorSeverity.LOW
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  const sessionData = SessionManager.validateSession(adminToken);
  if (!sessionData) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Invalid or expired session'),
      ErrorType.AUTHENTICATION,
      ErrorSeverity.LOW
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  return NextResponse.json({
    success: true,
    user: {
      id: sessionData.userId,
      username: sessionData.username,
      role: sessionData.role,
      permissions: sessionData.permissions
    },
    expiresAt: new Date(sessionData.exp * 1000).toISOString(),
    csrfToken: generateCSRFToken()
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}, ErrorType.AUTHENTICATION);