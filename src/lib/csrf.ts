import { NextRequest } from 'next/server';
import crypto from 'crypto';

// CSRF token configuration
const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
const TOKEN_LENGTH = 32;
const TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds

interface CSRFToken {
  token: string;
  timestamp: number;
  sessionId?: string;
}

// In-memory store for CSRF tokens
// In production, consider using Redis or database
const tokenStore = new Map<string, CSRFToken>();

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCSRFToken(sessionId?: string): string {
  const randomBytes = crypto.randomBytes(TOKEN_LENGTH);
  const timestamp = Date.now().toString();
  const data = `${randomBytes.toString('hex')}:${timestamp}:${sessionId || ''}`;
  
  // Create HMAC signature
  const hmac = crypto.createHmac('sha256', CSRF_SECRET);
  hmac.update(data);
  const signature = hmac.digest('hex');
  
  const token = `${data}:${signature}`;
  
  // Store token with metadata
  tokenStore.set(token, {
    token,
    timestamp: Date.now(),
    sessionId
  });
  
  // Clean up expired tokens periodically
  cleanupExpiredTokens();
  
  return token;
}

/**
 * Validate CSRF token
 */
export async function validateCSRFToken(
  token: string | null,
  request: NextRequest
): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    // Check if token exists in store
    const storedToken = tokenStore.get(token);
    if (!storedToken) {
      return false;
    }

    // Check if token is expired
    if (Date.now() - storedToken.timestamp > TOKEN_EXPIRY) {
      tokenStore.delete(token);
      return false;
    }

    // Parse token components
    const parts = token.split(':');
    if (parts.length !== 4) {
      return false;
    }

    const [randomHex, timestamp, sessionId, signature] = parts;
    const data = `${randomHex}:${timestamp}:${sessionId}`;
    
    // Verify HMAC signature
    const hmac = crypto.createHmac('sha256', CSRF_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');
    
    // Use timing-safe comparison
    if (!crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )) {
      return false;
    }

    // Additional validation: check session consistency if available
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.ip || request.headers.get('x-forwarded-for') || '';
    
    // Optional: Validate against session fingerprint
    if (sessionId && storedToken.sessionId !== sessionId) {
      return false;
    }

    // Token is valid - remove it (one-time use)
    tokenStore.delete(token);
    return true;
    
  } catch (error) {
    console.error('CSRF token validation error:', error);
    return false;
  }
}

/**
 * Generate CSRF token for API response
 */
export function getCSRFTokenForResponse(sessionId?: string): {
  token: string;
  expires: number;
} {
  const token = generateCSRFToken(sessionId);
  return {
    token,
    expires: Date.now() + TOKEN_EXPIRY
  };
}

/**
 * Clean up expired tokens from memory
 */
function cleanupExpiredTokens(): void {
  const now = Date.now();
  const expiredTokens: string[] = [];
  
  for (const [token, data] of tokenStore.entries()) {
    if (now - data.timestamp > TOKEN_EXPIRY) {
      expiredTokens.push(token);
    }
  }
  
  expiredTokens.forEach(token => tokenStore.delete(token));
}

/**
 * Double Submit Cookie pattern for CSRF protection
 */
export class DoubleSubmitCSRF {
  private cookieName = '__csrf-token';
  private headerName = 'x-csrf-token';
  
  generateTokenPair(): { cookieValue: string; headerValue: string } {
    const randomValue = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now().toString();
    
    // Create cookie value (base64 encoded)
    const cookieValue = Buffer.from(`${randomValue}:${timestamp}`).toString('base64');
    
    // Create header value (HMAC of cookie value)
    const hmac = crypto.createHmac('sha256', CSRF_SECRET);
    hmac.update(cookieValue);
    const headerValue = hmac.digest('hex');
    
    return { cookieValue, headerValue };
  }
  
  validateTokenPair(cookieValue: string, headerValue: string): boolean {
    try {
      // Verify header is HMAC of cookie
      const hmac = crypto.createHmac('sha256', CSRF_SECRET);
      hmac.update(cookieValue);
      const expectedHeader = hmac.digest('hex');
      
      if (!crypto.timingSafeEqual(
        Buffer.from(headerValue, 'hex'),
        Buffer.from(expectedHeader, 'hex')
      )) {
        return false;
      }
      
      // Decode and validate cookie
      const decoded = Buffer.from(cookieValue, 'base64').toString('utf-8');
      const [randomValue, timestamp] = decoded.split(':');
      
      if (!randomValue || !timestamp) {
        return false;
      }
      
      // Check if token is expired
      const tokenAge = Date.now() - parseInt(timestamp);
      if (tokenAge > TOKEN_EXPIRY) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Synchronizer Token pattern for forms
 */
export class SynchronizerToken {
  private tokens = new Map<string, { token: string; expires: number }>();
  
  generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + TOKEN_EXPIRY;
    
    this.tokens.set(sessionId, { token, expires });
    return token;
  }
  
  validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId);
    
    if (!stored) {
      return false;
    }
    
    if (Date.now() > stored.expires) {
      this.tokens.delete(sessionId);
      return false;
    }
    
    if (stored.token !== token) {
      return false;
    }
    
    // Remove token after use (one-time use)
    this.tokens.delete(sessionId);
    return true;
  }
  
  cleanup(): void {
    const now = Date.now();
    for (const [sessionId, data] of this.tokens.entries()) {
      if (now > data.expires) {
        this.tokens.delete(sessionId);
      }
    }
  }
}