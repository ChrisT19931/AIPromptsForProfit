import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
// Using Web Crypto API instead of Node.js crypto module

// Environment variables with fallbacks (should be set in production)
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production-very-long-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret-in-production';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  permissions: string[];
  lastLogin?: Date;
  loginAttempts?: number;
  lockedUntil?: Date;
}

interface SessionData {
  userId: string;
  username: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
  sessionId: string;
}

interface RefreshTokenData {
  userId: string;
  sessionId: string;
  tokenFamily: string;
}

/**
 * Secure password hashing and verification
 */
export class PasswordManager {
  private static readonly SALT_ROUNDS = 12;
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCK_TIME = 30 * 60 * 1000; // 30 minutes

  /**
   * Hash password with bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) {
      return false;
    }

    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * Generate secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required set
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Check password strength
   */
  static checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
    isStrong: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Password should be at least 8 characters long');

    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Add numbers');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('Add special characters');

    if (!/(..).*\1/.test(password)) score += 1;
    else feedback.push('Avoid repeated patterns');

    return {
      score,
      feedback,
      isStrong: score >= 5
    };
  }
}

/**
 * JWT token management
 */
export class TokenManager {
  /**
   * Generate access token
   */
  static generateAccessToken(user: User): string {
    // Generate UUID using Web Crypto API
    const sessionId = self.crypto.randomUUID();
    const payload: Omit<SessionData, 'iat' | 'exp'> = {
      userId: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
      sessionId
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '24h',
      issuer: 'ventaro-ai',
      audience: 'ventaro-ai-users'
    });
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(userId: string, sessionId: string): string {
    // Generate UUID using Web Crypto API
    const tokenFamily = self.crypto.randomUUID();
    const payload: RefreshTokenData = {
      userId,
      sessionId,
      tokenFamily
    };

    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
      issuer: 'ventaro-ai',
      audience: 'ventaro-ai-refresh'
    });
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): SessionData | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'ventaro-ai',
        audience: 'ventaro-ai-users'
      }) as SessionData;

      return decoded;
    } catch (error) {
      console.error('Access token verification failed:', error);
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenData | null {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: 'ventaro-ai',
        audience: 'ventaro-ai-refresh'
      }) as RefreshTokenData;

      return decoded;
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

/**
 * Session management
 */
export class SessionManager {
  private static activeSessions = new Map<string, SessionData>();
  private static blacklistedTokens = new Set<string>();

  /**
   * Create new session
   */
  static createSession(user: User): {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  } {
    const accessToken = TokenManager.generateAccessToken(user);
    const sessionData = TokenManager.verifyAccessToken(accessToken);
    
    if (!sessionData) {
      throw new Error('Failed to create session');
    }

    const refreshToken = TokenManager.generateRefreshToken(user.id, sessionData.sessionId);
    
    // Store session data
    this.activeSessions.set(sessionData.sessionId, sessionData);
    
    return {
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + SESSION_DURATION)
    };
  }

  /**
   * Validate session
   */
  static validateSession(token: string): SessionData | null {
    // Check if token is blacklisted
    if (this.blacklistedTokens.has(token)) {
      return null;
    }

    const sessionData = TokenManager.verifyAccessToken(token);
    if (!sessionData) {
      return null;
    }

    // Check if session exists in active sessions
    const activeSession = this.activeSessions.get(sessionData.sessionId);
    if (!activeSession) {
      return null;
    }

    return sessionData;
  }

  /**
   * Refresh session
   */
  static refreshSession(refreshToken: string): {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  } | null {
    const refreshData = TokenManager.verifyRefreshToken(refreshToken);
    if (!refreshData) {
      return null;
    }

    // Check if session exists
    const session = this.activeSessions.get(refreshData.sessionId);
    if (!session) {
      return null;
    }

    // Create new tokens
    const user: User = {
      id: session.userId,
      username: session.username,
      role: session.role as 'admin' | 'user',
      permissions: session.permissions
    };

    return this.createSession(user);
  }

  /**
   * Invalidate session
   */
  static invalidateSession(sessionId: string, token?: string): void {
    this.activeSessions.delete(sessionId);
    if (token) {
      this.blacklistedTokens.add(token);
    }
  }

  /**
   * Cleanup expired sessions
   */
  static cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.exp * 1000 < now) {
        this.activeSessions.delete(sessionId);
      }
    }

    // Cleanup blacklisted tokens (keep for 24 hours)
    // In production, you might want to use a more sophisticated cleanup
    if (this.blacklistedTokens.size > 1000) {
      this.blacklistedTokens.clear();
    }
  }
}

/**
 * Authentication middleware
 */
export class AuthMiddleware {
  /**
   * Require authentication
   */
  static requireAuth(requiredRole?: string, requiredPermissions?: string[]) {
    return async (request: NextRequest): Promise<NextResponse | null> => {
      const authHeader = request.headers.get('authorization');
      const token = TokenManager.extractTokenFromHeader(authHeader);

      if (!token) {
        return new NextResponse(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const session = SessionManager.validateSession(token);
      if (!session) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid or expired session' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check role
      if (requiredRole && session.role !== requiredRole) {
        return new NextResponse(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Check permissions
      if (requiredPermissions) {
        const hasPermissions = requiredPermissions.every(permission => 
          session.permissions.includes(permission)
        );
        
        if (!hasPermissions) {
          return new NextResponse(
            JSON.stringify({ error: 'Insufficient permissions' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }

      // Add user data to request headers for downstream use
      const response = NextResponse.next();
      response.headers.set('x-user-id', session.userId);
      response.headers.set('x-user-role', session.role);
      response.headers.set('x-session-id', session.sessionId);

      return null; // Continue to next middleware/handler
    };
  }

  /**
   * Admin authentication for admin routes
   */
  static async authenticateAdmin(username: string, password: string): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      // In production, this should check against a database
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPasswordHash = ADMIN_PASSWORD_HASH;

      if (!adminPasswordHash) {
        throw new Error('Admin password not configured');
      }

      if (username !== adminUsername) {
        return { success: false, error: 'Invalid credentials' };
      }

      const isValidPassword = await PasswordManager.verifyPassword(password, adminPasswordHash);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' };
      }

      const user: User = {
        id: 'admin-1',
        username: adminUsername,
        role: 'admin',
        permissions: ['admin:read', 'admin:write', 'admin:delete', 'seo:manage', 'analytics:view'],
        lastLogin: new Date()
      };

      return { success: true, user };
    } catch (error) {
      console.error('Admin authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }
}

/**
 * Secure cookie management
 */
export class CookieManager {
  /**
   * Set secure cookie
   */
  static setSecureCookie(
    response: NextResponse,
    name: string,
    value: string,
    options: {
      maxAge?: number;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
      path?: string;
    } = {}
  ): void {
    const {
      maxAge = SESSION_DURATION / 1000,
      httpOnly = true,
      secure = process.env.NODE_ENV === 'production',
      sameSite = 'strict',
      path = '/'
    } = options;

    const cookieValue = [
      `${name}=${value}`,
      `Max-Age=${maxAge}`,
      `Path=${path}`,
      `SameSite=${sameSite}`,
      httpOnly ? 'HttpOnly' : '',
      secure ? 'Secure' : ''
    ].filter(Boolean).join('; ');

    response.headers.set('Set-Cookie', cookieValue);
  }

  /**
   * Clear cookie
   */
  static clearCookie(response: NextResponse, name: string, path: string = '/'): void {
    const cookieValue = `${name}=; Max-Age=0; Path=${path}; HttpOnly; SameSite=strict`;
    response.headers.set('Set-Cookie', cookieValue);
  }
}