import { NextRequest, NextResponse } from 'next/server';
import { TokenManager } from '@/lib/auth';
import { generateCSRFToken } from '@/lib/csrf';

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
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
    // Check rate limiting
    const rateLimitResult = checkLoginRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many login attempts' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Simple input validation
    const { username, password } = body;
    
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid login credentials' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (username.length < 3 || username.length > 50 || password.length < 8) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid login credentials' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      // Simple authentication check (mock implementation)
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (username !== adminUsername || password !== adminPassword) {
        console.warn('Failed admin login attempt:', {
          ip,
          username,
          timestamp: new Date().toISOString()
        });
        
        return new NextResponse(
          JSON.stringify({ error: 'Invalid credentials' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Reset login attempts on successful login
      resetLoginAttempts(ip);

      // Create simple token
      const accessToken = TokenManager.generateAccessToken({ id: '1', username, role: 'admin' });
      
      // Create response
      const response = NextResponse.json({
        success: true,
        user: {
          id: '1',
          username,
          role: 'admin',
          permissions: ['admin:read', 'admin:write']
        },
        token: accessToken,
        csrfToken: generateCSRFToken()
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Content-Type-Options': 'nosniff'
        }
      });

      // Set simple cookie
      response.cookies.set('admin-token', accessToken, {
        maxAge: 24 * 60 * 60, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      console.log('Successful admin login:', {
        username,
        ip,
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
       console.error('Login error:', error);
       return new NextResponse(
         JSON.stringify({ error: 'Internal server error' }),
         { status: 500, headers: { 'Content-Type': 'application/json' } }
       );
     }
  } catch {
    console.error('Login error');
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Logout endpoint
export async function DELETE(request: NextRequest) {
  try {
    // Clear admin token
     const adminToken = request.cookies.get('admin-token')?.value;
     console.log('Logging out admin token:', adminToken ? 'present' : 'not found');
    
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    
    // Clear cookies
    response.cookies.set('admin-token', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return response;
  } catch {
    console.error('Logout error');
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Get current session info
export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('admin-token')?.value;
    
    if (!adminToken) {
      return new NextResponse(
        JSON.stringify({ error: 'No active session' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Simple token validation
    try {
      const decoded = TokenManager.verifyAccessToken(adminToken);
      
      return NextResponse.json({
        success: true,
        user: {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
          permissions: ['admin:read', 'admin:write']
        },
        csrfToken: generateCSRFToken()
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Content-Type-Options': 'nosniff'
        }
      });
    } catch {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch {
    console.error('Session check error');
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}