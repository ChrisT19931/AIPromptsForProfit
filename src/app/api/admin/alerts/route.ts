import { NextRequest, NextResponse } from 'next/server';
import { InputValidator, CommonSchemas } from '@/lib/validation';
import { SecureErrorHandler } from '@/lib/error-handler';
import { AuthMiddleware } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateCSRFToken } from '@/lib/csrf';

interface Alert {
  id: string;
  type: 'traffic_spike' | 'new_backlink' | 'seo_error' | 'performance' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
  metadata?: any;
}

interface AlertRule {
  id: string;
  type: string;
  enabled: boolean;
  conditions: {
    metric: string;
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    value: number;
    timeframe: string;
  }[];
  notifications: {
    email: boolean;
    slack: boolean;
    discord: boolean;
    webhook?: string;
  };
  cooldown: number; // minutes
}

// GET endpoint to fetch alerts
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, {
      maxRequests: 50,
      windowMs: 60 * 1000, // 1 minute
      keyGenerator: (req) => `alerts-${req.ip || 'unknown'}`
    });
    
    if (!rateLimitResult.success) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('RATE_LIMIT', 'Too many requests'),
        request
      );
    }

    // Authentication and authorization
    const authResult = await AuthMiddleware.requireAuth(request);
    if (!authResult.success) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('AUTH', authResult.error || 'Authentication required'),
        request
      );
    }

    const hasPermission = await AuthMiddleware.checkPermission(authResult.user!, 'admin:read');
    if (!hasPermission) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('AUTH', 'Insufficient permissions'),
        request
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Input validation and sanitization
    const validator = new InputValidator();
    const querySchema = {
      limit: { type: 'number', min: 1, max: 100, optional: true },
      unread: { type: 'string', enum: ['true', 'false'], optional: true },
      severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], optional: true },
      type: { type: 'string', enum: ['traffic_spike', 'new_backlink', 'seo_error', 'performance', 'security'], optional: true }
    };

    const queryData = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      unread: searchParams.get('unread'),
      severity: searchParams.get('severity'),
      type: searchParams.get('type')
    };

    const validationResult = validator.validate(queryData, querySchema);
    if (!validationResult.isValid) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('VALIDATION', 'Invalid query parameters', validationResult.errors),
        request
      );
    }

    const sanitizedData = validator.sanitize(validationResult.data);
    const limit = sanitizedData.limit || 50;
    const unreadOnly = sanitizedData.unread === 'true';
    const severity = sanitizedData.severity;
    const type = sanitizedData.type;

    // Mock alerts data
    const allAlerts: Alert[] = [
      {
        id: 'alert_1',
        type: 'traffic_spike',
        severity: 'high',
        title: 'Traffic Spike Detected',
        message: 'Website traffic increased by 340% in the last hour. Current visitors: 1,247',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        read: false,
        actionRequired: false,
        metadata: {
          currentTraffic: 1247,
          previousTraffic: 367,
          increasePercentage: 340,
          source: 'organic_search'
        }
      },
      {
        id: 'alert_2',
        type: 'new_backlink',
        severity: 'medium',
        title: 'High-Quality Backlink Acquired',
        message: 'New backlink from techcrunch.com (DA: 94) detected',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
        actionRequired: false,
        metadata: {
          domain: 'techcrunch.com',
          domainAuthority: 94,
          anchorText: 'AI prompts for business',
          linkType: 'dofollow'
        }
      },
      {
        id: 'alert_3',
        type: 'seo_error',
        severity: 'critical',
        title: 'Critical SEO Issue',
        message: 'Sitemap.xml is returning 404 error',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        read: true,
        actionRequired: true,
        metadata: {
          url: '/sitemap.xml',
          statusCode: 404,
          lastWorking: '2024-01-20T10:30:00Z'
        }
      },
      {
        id: 'alert_4',
        type: 'performance',
        severity: 'medium',
        title: 'Page Speed Degradation',
        message: 'Homepage load time increased to 3.2s (threshold: 2.5s)',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        read: true,
        actionRequired: true,
        metadata: {
          page: '/',
          currentLoadTime: 3.2,
          threshold: 2.5,
          metric: 'LCP'
        }
      },
      {
        id: 'alert_5',
        type: 'new_backlink',
        severity: 'low',
        title: 'New Backlink Detected',
        message: 'New backlink from reddit.com (DA: 91) detected',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        read: true,
        actionRequired: false,
        metadata: {
          domain: 'reddit.com',
          domainAuthority: 91,
          anchorText: 'check this out',
          linkType: 'nofollow'
        }
      },
      {
        id: 'alert_6',
        type: 'security',
        severity: 'high',
        title: 'Unusual Login Activity',
        message: 'Multiple failed admin login attempts detected',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
        read: true,
        actionRequired: true,
        metadata: {
          attempts: 15,
          ipAddress: '192.168.1.100',
          timeframe: '1 hour'
        }
      }
    ];

    // Apply filters
    let filteredAlerts = allAlerts;
    
    if (unreadOnly) {
      filteredAlerts = filteredAlerts.filter(alert => !alert.read);
    }
    
    if (severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
    }
    
    if (type) {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === type);
    }

    // Apply limit
    const limitedAlerts = filteredAlerts.slice(0, limit);

    const summary = {
      total: allAlerts.length,
      unread: allAlerts.filter(alert => !alert.read).length,
      critical: allAlerts.filter(alert => alert.severity === 'critical').length,
      actionRequired: allAlerts.filter(alert => alert.actionRequired && !alert.read).length,
      byType: {
        traffic_spike: allAlerts.filter(alert => alert.type === 'traffic_spike').length,
        new_backlink: allAlerts.filter(alert => alert.type === 'new_backlink').length,
        seo_error: allAlerts.filter(alert => alert.type === 'seo_error').length,
        performance: allAlerts.filter(alert => alert.type === 'performance').length,
        security: allAlerts.filter(alert => alert.type === 'security').length
      }
    };

    const response = NextResponse.json({
      success: true,
      alerts: limitedAlerts,
      summary
    });

    // Set security headers
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    return response;

  } catch (error) {
    return SecureErrorHandler.createResponse(
      SecureErrorHandler.createError('INTERNAL', 'Failed to fetch alerts', error),
      request
    );
  }
}

// POST endpoint to create new alert or trigger alert check
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, {
      maxRequests: 10,
      windowMs: 60 * 1000, // 1 minute
      keyGenerator: (req) => `alerts-post-${req.ip || 'unknown'}`
    });
    
    if (!rateLimitResult.success) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('RATE_LIMIT', 'Too many requests'),
        request
      );
    }

    // Authentication and authorization
    const authResult = await AuthMiddleware.requireAuth(request);
    if (!authResult.success) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('AUTH', authResult.error || 'Authentication required'),
        request
      );
    }

    const hasPermission = await AuthMiddleware.checkPermission(authResult.user!, 'admin:write');
    if (!hasPermission) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('AUTH', 'Insufficient permissions'),
        request
      );
    }

    // CSRF validation
    const csrfResult = await validateCSRFToken(request);
    if (!csrfResult.valid) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('CSRF', 'Invalid CSRF token'),
        request
      );
    }

    const body = await request.json();
    const { action, ...data } = body;

    // Input validation
    const validator = new InputValidator();
    if (!action || typeof action !== 'string') {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('VALIDATION', 'Action is required'),
        request
      );
    }

    switch (action) {
      case 'create':
        const createSchema = {
          type: { type: 'string', required: true, enum: ['traffic_spike', 'new_backlink', 'seo_error', 'performance', 'security'] },
          severity: { type: 'string', required: true, enum: ['low', 'medium', 'high', 'critical'] },
          title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
          message: { type: 'string', required: true, minLength: 1, maxLength: 1000 },
          metadata: { type: 'object', optional: true }
        };

        const createValidation = validator.validate(data, createSchema);
        if (!createValidation.isValid) {
          return SecureErrorHandler.createResponse(
            SecureErrorHandler.createError('VALIDATION', 'Invalid alert data', createValidation.errors),
            request
          );
        }

        const sanitizedCreate = validator.sanitize(createValidation.data);
        const { type, severity, title, message, metadata } = sanitizedCreate;

        const newAlert: Alert = {
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type,
          severity,
          title,
          message,
          timestamp: new Date().toISOString(),
          read: false,
          actionRequired: severity === 'critical' || severity === 'high',
          metadata
        };

        // In a real implementation, save to database
        // await saveAlert(newAlert);
        
        // Send notifications based on severity
        if (severity === 'critical' || severity === 'high') {
          await sendNotifications(newAlert);
        }

        const createResponse = NextResponse.json({
          success: true,
          message: 'Alert created successfully',
          alert: newAlert
        });
        createResponse.headers.set('X-Content-Type-Options', 'nosniff');
        return createResponse;

      case 'check':
        // Trigger manual alert check
        const checkResults = await performAlertChecks();
        
        const checkResponse = NextResponse.json({
          success: true,
          message: 'Alert check completed',
          results: checkResults
        });
        checkResponse.headers.set('X-Content-Type-Options', 'nosniff');
        return checkResponse;

      case 'test_notification':
        const testSchema = {
          notificationType: { type: 'string', required: true, enum: ['email', 'slack', 'discord'] }
        };

        const testValidation = validator.validate(data, testSchema);
        if (!testValidation.isValid) {
          return SecureErrorHandler.createResponse(
            SecureErrorHandler.createError('VALIDATION', 'Invalid notification type', testValidation.errors),
            request
          );
        }

        const sanitizedTest = validator.sanitize(testValidation.data);
        const { notificationType } = sanitizedTest;
        
        const testAlert: Alert = {
          id: 'test_alert',
          type: 'traffic_spike',
          severity: 'medium',
          title: 'Test Notification',
          message: 'This is a test notification to verify your alert system is working.',
          timestamp: new Date().toISOString(),
          read: false,
          actionRequired: false
        };

        await sendNotifications(testAlert, notificationType);

        const testResponse = NextResponse.json({
          success: true,
          message: `Test ${notificationType} notification sent`
        });
        testResponse.headers.set('X-Content-Type-Options', 'nosniff');
        return testResponse;

      default:
        return SecureErrorHandler.createResponse(
          SecureErrorHandler.createError('VALIDATION', 'Invalid action'),
          request
        );
    }

  } catch (error) {
    return SecureErrorHandler.createResponse(
      SecureErrorHandler.createError('INTERNAL', 'Failed to process alert request', error),
      request
    );
  }
}

// PUT endpoint to update alert status
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, {
      maxRequests: 20,
      windowMs: 60 * 1000, // 1 minute
      keyGenerator: (req) => `alerts-put-${req.ip || 'unknown'}`
    });
    
    if (!rateLimitResult.success) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('RATE_LIMIT', 'Too many requests'),
        request
      );
    }

    // Authentication and authorization
    const authResult = await AuthMiddleware.requireAuth(request);
    if (!authResult.success) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('AUTH', authResult.error || 'Authentication required'),
        request
      );
    }

    const hasPermission = await AuthMiddleware.checkPermission(authResult.user!, 'admin:write');
    if (!hasPermission) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('AUTH', 'Insufficient permissions'),
        request
      );
    }

    // CSRF validation
    const csrfResult = await validateCSRFToken(request);
    if (!csrfResult.valid) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('CSRF', 'Invalid CSRF token'),
        request
      );
    }

    const body = await request.json();
    const { alertIds, action } = body;
    
    // Input validation
    const validator = new InputValidator();
    const updateSchema = {
      alertIds: { type: 'array', required: true, minLength: 1, maxLength: 100 },
      action: { type: 'string', required: true, enum: ['mark_read', 'mark_unread', 'delete'] }
    };

    const validationResult = validator.validate({ alertIds, action }, updateSchema);
    if (!validationResult.isValid) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('VALIDATION', 'Invalid update data', validationResult.errors),
        request
      );
    }

    const sanitizedData = validator.sanitize(validationResult.data);
    const sanitizedAlertIds = sanitizedData.alertIds;
    const sanitizedAction = sanitizedData.action;

    // Validate each alert ID
    for (const id of sanitizedAlertIds) {
      if (typeof id !== 'string' || id.length === 0) {
        return SecureErrorHandler.createResponse(
          SecureErrorHandler.createError('VALIDATION', 'Invalid alert ID in array'),
          request
        );
      }
    }

    switch (sanitizedAction) {
      case 'mark_read':
        // In a real implementation, update database
        // await markAlertsAsRead(sanitizedAlertIds);
        
        const markReadResponse = NextResponse.json({
          success: true,
          message: `${sanitizedAlertIds.length} alerts marked as read`,
          updatedCount: sanitizedAlertIds.length
        });
        markReadResponse.headers.set('X-Content-Type-Options', 'nosniff');
        return markReadResponse;

      case 'mark_unread':
        // In a real implementation, update database
        // await markAlertsAsUnread(sanitizedAlertIds);
        
        const markUnreadResponse = NextResponse.json({
          success: true,
          message: `${sanitizedAlertIds.length} alerts marked as unread`,
          updatedCount: sanitizedAlertIds.length
        });
        markUnreadResponse.headers.set('X-Content-Type-Options', 'nosniff');
        return markUnreadResponse;

      case 'delete':
        // In a real implementation, delete from database
        // await deleteAlerts(sanitizedAlertIds);
        
        const deleteResponse = NextResponse.json({
          success: true,
          message: `${sanitizedAlertIds.length} alerts deleted`,
          deletedCount: sanitizedAlertIds.length
        });
        deleteResponse.headers.set('X-Content-Type-Options', 'nosniff');
        return deleteResponse;

      default:
        return SecureErrorHandler.createResponse(
          SecureErrorHandler.createError('VALIDATION', 'Invalid action'),
          request
        );
    }

  } catch (error) {
    return SecureErrorHandler.createResponse(
      SecureErrorHandler.createError('INTERNAL', 'Failed to update alerts', error),
      request
    );
  }
}

// Helper function to send notifications
async function sendNotifications(alert: Alert, specificType?: string) {
  try {
    // In a real implementation, integrate with:
    // - Email service (SendGrid, AWS SES, etc.)
    // - Slack API
    // - Discord webhooks
    // - Custom webhooks
    
    const notifications = [];
    
    if (!specificType || specificType === 'email') {
      // Send email notification
      notifications.push(sendEmailAlert(alert));
    }
    
    if (!specificType || specificType === 'slack') {
      // Send Slack notification
      notifications.push(sendSlackAlert(alert));
    }
    
    if (!specificType || specificType === 'discord') {
      // Send Discord notification
      notifications.push(sendDiscordAlert(alert));
    }
    
    await Promise.all(notifications);
    
  } catch (error) {
    console.error('Notification sending error:', error);
  }
}

// Mock notification functions
async function sendEmailAlert(alert: Alert) {
  // Mock email sending
  console.log(`📧 Email alert sent: ${alert.title}`);
  return Promise.resolve();
}

async function sendSlackAlert(alert: Alert) {
  // Mock Slack notification
  console.log(`💬 Slack alert sent: ${alert.title}`);
  return Promise.resolve();
}

async function sendDiscordAlert(alert: Alert) {
  // Mock Discord notification
  console.log(`🎮 Discord alert sent: ${alert.title}`);
  return Promise.resolve();
}

// Mock alert checking function
async function performAlertChecks() {
  // In a real implementation, this would:
  // 1. Check current metrics against thresholds
  // 2. Scan for new backlinks
  // 3. Monitor SEO health
  // 4. Check performance metrics
  // 5. Monitor security events
  
  return {
    checksPerformed: 5,
    newAlerts: 0,
    timestamp: new Date().toISOString()
  };
}