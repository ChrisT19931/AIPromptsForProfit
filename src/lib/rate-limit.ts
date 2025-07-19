import { NextResponse } from 'next/server';

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max unique tokens per interval
}

interface TokenBucket {
  count: number;
  lastReset: number;
}

// In-memory store for rate limiting
// In production, you might want to use Redis or another persistent store
const tokenStore = new Map<string, TokenBucket>();

export function rateLimit(options: RateLimitOptions) {
  const { interval, uniqueTokenPerInterval } = options;

  return {
    check: async (response: NextResponse, limit: number, token: string): Promise<void> => {
      const now = Date.now();
      const key = `${token}:${Math.floor(now / interval)}`;
      
      // Clean up old entries periodically
      if (tokenStore.size > uniqueTokenPerInterval * 2) {
        const cutoff = now - interval * 2;
        for (const [storeKey, bucket] of tokenStore.entries()) {
          if (bucket.lastReset < cutoff) {
            tokenStore.delete(storeKey);
          }
        }
      }

      const bucket = tokenStore.get(key) || { count: 0, lastReset: now };
      
      // Reset bucket if interval has passed
      if (now - bucket.lastReset >= interval) {
        bucket.count = 0;
        bucket.lastReset = now;
      }

      bucket.count++;
      tokenStore.set(key, bucket);

      // Set rate limit headers
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', Math.max(0, limit - bucket.count).toString());
      response.headers.set('X-RateLimit-Reset', (bucket.lastReset + interval).toString());

      if (bucket.count > limit) {
        throw new Error('Rate limit exceeded');
      }
    }
  };
}

// Advanced rate limiting with different strategies
export class AdvancedRateLimit {
  private store = new Map<string, TokenBucket>();
  private options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = options;
  }

  // Sliding window rate limiting
  async slidingWindow(token: string, limit: number, windowMs: number): Promise<boolean> {
    const now = Date.now();
    const key = `sliding:${token}`;
    const bucket = this.store.get(key) || { count: 0, lastReset: now };

    // Remove expired requests
    if (now - bucket.lastReset > windowMs) {
      bucket.count = 0;
      bucket.lastReset = now;
    }

    if (bucket.count >= limit) {
      return false;
    }

    bucket.count++;
    this.store.set(key, bucket);
    return true;
  }

  // Token bucket rate limiting
  async tokenBucket(token: string, capacity: number, refillRate: number): Promise<boolean> {
    const now = Date.now();
    const key = `bucket:${token}`;
    const bucket = this.store.get(key) || { count: capacity, lastReset: now };

    // Refill tokens based on time passed
    const timePassed = now - bucket.lastReset;
    const tokensToAdd = Math.floor((timePassed / 1000) * refillRate);
    bucket.count = Math.min(capacity, bucket.count + tokensToAdd);
    bucket.lastReset = now;

    if (bucket.count < 1) {
      this.store.set(key, bucket);
      return false;
    }

    bucket.count--;
    this.store.set(key, bucket);
    return true;
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    const cutoff = now - this.options.interval * 2;
    
    for (const [key, bucket] of this.store.entries()) {
      if (bucket.lastReset < cutoff) {
        this.store.delete(key);
      }
    }
  }
}

// IP-based rate limiting with progressive penalties
export class IPRateLimit {
  private violations = new Map<string, { count: number, lastViolation: number }>();
  private baseLimit: number;
  private penaltyMultiplier: number;

  constructor(baseLimit: number = 60, penaltyMultiplier: number = 0.5) {
    this.baseLimit = baseLimit;
    this.penaltyMultiplier = penaltyMultiplier;
  }

  getLimit(ip: string): number {
    const violation = this.violations.get(ip);
    if (!violation) {
      return this.baseLimit;
    }

    // Reset violations after 1 hour
    if (Date.now() - violation.lastViolation > 3600000) {
      this.violations.delete(ip);
      return this.baseLimit;
    }

    // Progressive penalty: reduce limit based on violation count
    const penalty = Math.pow(this.penaltyMultiplier, violation.count);
    return Math.max(1, Math.floor(this.baseLimit * penalty));
  }

  recordViolation(ip: string): void {
    const violation = this.violations.get(ip) || { count: 0, lastViolation: 0 };
    violation.count++;
    violation.lastViolation = Date.now();
    this.violations.set(ip, violation);
  }

  isBlocked(ip: string): boolean {
    const violation = this.violations.get(ip);
    if (!violation) return false;

    // Block IP for 1 hour after 5 violations
    return violation.count >= 5 && (Date.now() - violation.lastViolation) < 3600000;
  }
}