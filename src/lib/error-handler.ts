import { NextResponse } from 'next/server';

// Error types for classification
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
  EXTERNAL_API = 'EXTERNAL_API_ERROR',
  DATABASE = 'DATABASE_ERROR',
  NETWORK = 'NETWORK_ERROR'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

interface ErrorDetails {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage?: string;
  statusCode: number;
  metadata?: Record<string, any>;
  stack?: string;
  timestamp: Date;
  requestId?: string;
  userId?: string;
  ip?: string;
}

interface ErrorResponse {
  error: string;
  code: string;
  timestamp: string;
  requestId?: string;
  details?: any;
}

/**
 * Secure error handler that prevents information leakage
 */
export class SecureErrorHandler {
  private static isDevelopment = process.env.NODE_ENV === 'development';
  private static errorLog: ErrorDetails[] = [];
  private static maxLogSize = 1000;

  /**
   * Handle and format errors securely
   */
  static handleError(
    error: Error | any,
    type: ErrorType = ErrorType.INTERNAL,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    metadata?: Record<string, any>
  ): ErrorDetails {
    const errorDetails: ErrorDetails = {
      type,
      severity,
      message: error.message || 'Unknown error occurred',
      statusCode: this.getStatusCodeForType(type),
      metadata,
      stack: error.stack,
      timestamp: new Date(),
      requestId: this.generateRequestId()
    };

    // Log error internally
    this.logError(errorDetails);

    return errorDetails;
  }

  /**
   * Create safe error response for client
   */
  static createErrorResponse(
    errorDetails: ErrorDetails,
    includeDetails: boolean = false
  ): NextResponse {
    const safeMessage = this.getSafeUserMessage(errorDetails);
    
    const response: ErrorResponse = {
      error: safeMessage,
      code: errorDetails.type,
      timestamp: errorDetails.timestamp.toISOString(),
      requestId: errorDetails.requestId
    };

    // Only include sensitive details in development
    if (this.isDevelopment && includeDetails) {
      response.details = {
        originalMessage: errorDetails.message,
        stack: errorDetails.stack,
        metadata: errorDetails.metadata
      };
    }

    return new NextResponse(
      JSON.stringify(response),
      {
        status: errorDetails.statusCode,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': errorDetails.requestId || ''
        }
      }
    );
  }

  /**
   * Get safe user message that doesn't leak sensitive information
   */
  private static getSafeUserMessage(errorDetails: ErrorDetails): string {
    const safeMessages: Record<ErrorType, string> = {
      [ErrorType.VALIDATION]: 'Invalid input provided. Please check your data and try again.',
      [ErrorType.AUTHENTICATION]: 'Authentication failed. Please check your credentials.',
      [ErrorType.AUTHORIZATION]: 'You do not have permission to access this resource.',
      [ErrorType.RATE_LIMIT]: 'Too many requests. Please try again later.',
      [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
      [ErrorType.INTERNAL]: 'An internal server error occurred. Please try again later.',
      [ErrorType.EXTERNAL_API]: 'External service is temporarily unavailable. Please try again later.',
      [ErrorType.DATABASE]: 'Database operation failed. Please try again later.',
      [ErrorType.NETWORK]: 'Network error occurred. Please check your connection and try again.'
    };

    return errorDetails.userMessage || safeMessages[errorDetails.type] || safeMessages[ErrorType.INTERNAL];
  }

  /**
   * Get appropriate HTTP status code for error type
   */
  private static getStatusCodeForType(type: ErrorType): number {
    const statusCodes: Record<ErrorType, number> = {
      [ErrorType.VALIDATION]: 400,
      [ErrorType.AUTHENTICATION]: 401,
      [ErrorType.AUTHORIZATION]: 403,
      [ErrorType.NOT_FOUND]: 404,
      [ErrorType.RATE_LIMIT]: 429,
      [ErrorType.INTERNAL]: 500,
      [ErrorType.EXTERNAL_API]: 502,
      [ErrorType.DATABASE]: 503,
      [ErrorType.NETWORK]: 503
    };

    return statusCodes[type] || 500;
  }

  /**
   * Log error securely
   */
  private static logError(errorDetails: ErrorDetails): void {
    // Add to in-memory log
    this.errorLog.push(errorDetails);
    
    // Maintain log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Console logging with appropriate level
    const logLevel = this.getLogLevel(errorDetails.severity);
    const logMessage = {
      timestamp: errorDetails.timestamp.toISOString(),
      type: errorDetails.type,
      severity: errorDetails.severity,
      message: errorDetails.message,
      requestId: errorDetails.requestId,
      userId: errorDetails.userId,
      ip: errorDetails.ip,
      metadata: errorDetails.metadata
    };

    // Don't log stack traces in production unless critical
    if (this.isDevelopment || errorDetails.severity === ErrorSeverity.CRITICAL) {
      logMessage.stack = errorDetails.stack;
    }

    console[logLevel]('Error:', JSON.stringify(logMessage, null, 2));

    // In production, you would send to external logging service
    if (!this.isDevelopment && errorDetails.severity === ErrorSeverity.CRITICAL) {
      this.sendToExternalLogging(errorDetails);
    }
  }

  /**
   * Get console log level based on severity
   */
  private static getLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'log';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return 'error';
      default:
        return 'error';
    }
  }

  /**
   * Send critical errors to external logging service
   */
  private static async sendToExternalLogging(errorDetails: ErrorDetails): Promise<void> {
    try {
      // In production, implement integration with services like:
      // - Sentry
      // - LogRocket
      // - DataDog
      // - CloudWatch
      // - etc.
      
      console.error('CRITICAL ERROR - Would send to external logging:', {
        type: errorDetails.type,
        message: errorDetails.message,
        timestamp: errorDetails.timestamp,
        requestId: errorDetails.requestId
      });
    } catch (loggingError) {
      console.error('Failed to send error to external logging:', loggingError);
    }
  }

  /**
   * Generate unique request ID
   */
  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get error statistics for monitoring
   */
  static getErrorStats(): {
    total: number;
    byType: Record<ErrorType, number>;
    bySeverity: Record<ErrorSeverity, number>;
    recent: ErrorDetails[];
  } {
    const byType: Record<ErrorType, number> = {} as any;
    const bySeverity: Record<ErrorSeverity, number> = {} as any;

    this.errorLog.forEach(error => {
      byType[error.type] = (byType[error.type] || 0) + 1;
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
    });

    // Get recent errors (last 10)
    const recent = this.errorLog.slice(-10).map(error => ({
      ...error,
      stack: undefined, // Don't include stack in stats
      metadata: undefined // Don't include metadata in stats
    }));

    return {
      total: this.errorLog.length,
      byType,
      bySeverity,
      recent
    };
  }

  /**
   * Clear error log (for testing or maintenance)
   */
  static clearErrorLog(): void {
    this.errorLog = [];
  }
}

/**
 * Async error wrapper for API routes
 */
export function withErrorHandler(
  handler: (req: any, res?: any) => Promise<any>,
  errorType: ErrorType = ErrorType.INTERNAL
) {
  return async (req: any, res?: any) => {
    try {
      return await handler(req, res);
    } catch (error) {
      const errorDetails = SecureErrorHandler.handleError(
        error,
        errorType,
        ErrorSeverity.HIGH,
        {
          url: req.url,
          method: req.method,
          userAgent: req.headers?.['user-agent'],
          ip: req.ip || req.headers?.['x-forwarded-for']
        }
      );

      return SecureErrorHandler.createErrorResponse(errorDetails);
    }
  };
}

/**
 * Validation error helper
 */
export function createValidationError(
  message: string,
  field?: string,
  value?: any
): ErrorDetails {
  return SecureErrorHandler.handleError(
    new Error(message),
    ErrorType.VALIDATION,
    ErrorSeverity.LOW,
    { field, value }
  );
}

/**
 * Authentication error helper
 */
export function createAuthError(
  message: string = 'Authentication failed',
  metadata?: Record<string, any>
): ErrorDetails {
  return SecureErrorHandler.handleError(
    new Error(message),
    ErrorType.AUTHENTICATION,
    ErrorSeverity.MEDIUM,
    metadata
  );
}

/**
 * Authorization error helper
 */
export function createAuthzError(
  message: string = 'Insufficient permissions',
  requiredPermissions?: string[]
): ErrorDetails {
  return SecureErrorHandler.handleError(
    new Error(message),
    ErrorType.AUTHORIZATION,
    ErrorSeverity.MEDIUM,
    { requiredPermissions }
  );
}

/**
 * Rate limit error helper
 */
export function createRateLimitError(
  limit: number,
  windowMs: number,
  retryAfter?: number
): ErrorDetails {
  return SecureErrorHandler.handleError(
    new Error('Rate limit exceeded'),
    ErrorType.RATE_LIMIT,
    ErrorSeverity.LOW,
    { limit, windowMs, retryAfter }
  );
}

/**
 * Database error helper
 */
export function createDatabaseError(
  operation: string,
  originalError?: Error
): ErrorDetails {
  return SecureErrorHandler.handleError(
    originalError || new Error(`Database ${operation} failed`),
    ErrorType.DATABASE,
    ErrorSeverity.HIGH,
    { operation }
  );
}