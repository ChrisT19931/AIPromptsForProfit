// NextRequest import removed as it's no longer used
// Using Web Crypto API instead of Node.js crypto module for Edge Runtime compatibility

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
export async function generateCSRFToken(sessionId?: string): Promise<string> {
  // Generate random bytes using Web Crypto API
  const randomBytes = new Uint8Array(TOKEN_LENGTH);
  crypto.getRandomValues(randomBytes);
  const randomHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const timestamp = Date.now().toString();
  const data = `${randomHex}:${timestamp}:${sessionId || ''}`;
  
  // Create HMAC signature using Web Crypto API
  const encoder = new TextEncoder();
  const keyData = encoder.encode(CSRF_SECRET);
  const secretKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    secretKey,
    encoder.encode(data)
  );
  
  // Convert signature to hex
  const signatureHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const token = `${data}:${signatureHex}`;
  
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
  token: string | null
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
    
    // Verify HMAC signature using Web Crypto API
    const encoder = new TextEncoder();
    const keyData = encoder.encode(CSRF_SECRET);
    const secretKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      secretKey,
      encoder.encode(data)
    );
    
    // Convert expected signature to hex for comparison
    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Compare signatures (using constant-time comparison when possible)
    if (signature !== expectedSignatureHex) {
      return false;
    }

    // Additional validation: check session consistency if available
    // const userAgent = request.headers.get('user-agent') || '';
    // const ip = request.headers.get('x-forwarded-for') || '';
    
    // Optional: Validate against session fingerprint
    if (sessionId && storedToken.sessionId !== sessionId) {
      return false;
    }

    // Token is valid - remove it (one-time use)
    tokenStore.delete(token);
    return true;
    
  } catch (error) {
    return false;
  }
}

/**
 * Generate CSRF token for API response
 */
export async function getCSRFTokenForResponse(sessionId?: string): Promise<{
  token: string;
  expires: number;
}> {
  const token = await generateCSRFToken(sessionId);
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
  
  async generateTokenPair(): Promise<{ cookieValue: string; headerValue: string }> {
    // Generate random bytes using Web Crypto API
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const randomValue = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const timestamp = Date.now().toString();
    
    // Create cookie value (base64 encoded)
    const encoder = new TextEncoder();
    const rawData = encoder.encode(`${randomValue}:${timestamp}`);
    const cookieValue = btoa(String.fromCharCode(...new Uint8Array(rawData)));
    
    // Create header value (HMAC of cookie value)
    const keyData = encoder.encode(CSRF_SECRET);
    const secretKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      secretKey,
      encoder.encode(cookieValue)
    );
    
    // Convert signature to hex
    const headerValue = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return { cookieValue, headerValue };
  }
  
  async validateTokenPair(cookieValue: string, headerValue: string): Promise<boolean> {
    try {
      // Verify header is HMAC of cookie using Web Crypto API
      const encoder = new TextEncoder();
      const keyData = encoder.encode(CSRF_SECRET);
      const secretKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const expectedSignature = await crypto.subtle.sign(
        'HMAC',
        secretKey,
        encoder.encode(cookieValue)
      );
      
      // Convert expected signature to hex for comparison
      const expectedHeader = Array.from(new Uint8Array(expectedSignature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      if (headerValue !== expectedHeader) {
        return false;
      }
      
      // Decode and validate cookie using Web API instead of Node.js Buffer
      const decoded = atob(cookieValue);
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
    } catch {
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
    // Generate random bytes using Web Crypto API
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const token = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
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