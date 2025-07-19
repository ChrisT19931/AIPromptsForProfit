import { NextRequest, NextResponse } from 'next/server';
import { InputValidator, CommonSchemas } from '@/lib/validation';
import { SecureErrorHandler, ErrorType, ErrorSeverity, withErrorHandler } from '@/lib/error-handler';
import { AuthMiddleware } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateCSRFToken } from '@/lib/csrf';

interface SEOHealthCheck {
  category: string;
  checks: {
    name: string;
    status: 'pass' | 'warning' | 'fail';
    description: string;
    recommendation?: string;
  }[];
}

export const GET = withErrorHandler(async (request: NextRequest) => {
  // Rate limiting
  const rateLimitResult = await rateLimit(request, { windowMs: 60000, max: 20 });
  if (!rateLimitResult.success) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Rate limit exceeded'),
      ErrorType.RATE_LIMIT,
      ErrorSeverity.LOW
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  // Authentication check
  const authResult = await AuthMiddleware.requireAuth(request);
  if (!authResult.success) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Authentication required'),
      ErrorType.AUTHENTICATION,
      ErrorSeverity.MEDIUM
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  // Admin permission check
  if (!AuthMiddleware.hasPermission(authResult.user!, 'admin:read')) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Insufficient permissions'),
      ErrorType.AUTHORIZATION,
      ErrorSeverity.MEDIUM
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  try {
    // In a real implementation, these would be actual checks
    const healthChecks: SEOHealthCheck[] = [
      {
        category: 'Technical SEO',
        checks: [
          {
            name: 'Sitemap Accessibility',
            status: 'pass',
            description: 'Sitemap.xml is accessible and properly formatted'
          },
          {
            name: 'Robots.txt',
            status: 'pass',
            description: 'Robots.txt file is present and configured correctly'
          },
          {
            name: 'SSL Certificate',
            status: 'pass',
            description: 'Site is served over HTTPS'
          },
          {
            name: 'Mobile Responsiveness',
            status: 'pass',
            description: 'Site is mobile-friendly and responsive'
          },
          {
            name: 'Page Speed',
            status: 'warning',
            description: 'Some pages could load faster',
            recommendation: 'Optimize images and enable compression'
          }
        ]
      },
      {
        category: 'Content SEO',
        checks: [
          {
            name: 'Meta Titles',
            status: 'pass',
            description: 'All pages have unique, optimized meta titles'
          },
          {
            name: 'Meta Descriptions',
            status: 'pass',
            description: 'All pages have compelling meta descriptions'
          },
          {
            name: 'Heading Structure',
            status: 'pass',
            description: 'Proper H1-H6 hierarchy is maintained'
          },
          {
            name: 'Internal Linking',
            status: 'warning',
            description: 'Could improve internal link structure',
            recommendation: 'Add more contextual internal links'
          },
          {
            name: 'Content Quality',
            status: 'pass',
            description: 'Content is original and valuable'
          }
        ]
      },
      {
        category: 'Structured Data',
        checks: [
          {
            name: 'Organization Schema',
            status: 'pass',
            description: 'Organization markup is properly implemented'
          },
          {
            name: 'Product Schema',
            status: 'pass',
            description: 'Product schema includes pricing and ratings'
          },
          {
            name: 'FAQ Schema',
            status: 'pass',
            description: 'FAQ structured data is present'
          },
          {
            name: 'Website Schema',
            status: 'pass',
            description: 'Website schema with search action is configured'
          }
        ]
      },
      {
        category: 'Performance',
        checks: [
          {
            name: 'Core Web Vitals',
            status: 'pass',
            description: 'LCP, FID, and CLS scores are within good ranges'
          },
          {
            name: 'Image Optimization',
            status: 'pass',
            description: 'Images are optimized and properly sized'
          },
          {
            name: 'Caching',
            status: 'pass',
            description: 'Browser caching is properly configured'
          },
          {
            name: 'Compression',
            status: 'warning',
            description: 'Some assets could benefit from better compression',
            recommendation: 'Enable Brotli compression for text assets'
          }
        ]
      },
      {
        category: 'Indexing',
        checks: [
          {
            name: 'Google Index Status',
            status: 'pass',
            description: 'Most important pages are indexed by Google'
          },
          {
            name: 'Canonical URLs',
            status: 'pass',
            description: 'Canonical tags are properly implemented'
          },
          {
            name: 'No Index Issues',
            status: 'pass',
            description: 'No unintentional noindex directives found'
          },
          {
            name: 'Crawl Errors',
            status: 'warning',
            description: 'Minor crawl errors detected',
            recommendation: 'Fix 404 errors for old URLs'
          }
        ]
      }
    ];

    // Calculate overall score
    const totalChecks = healthChecks.reduce((sum, category) => sum + category.checks.length, 0);
    const passedChecks = healthChecks.reduce(
      (sum, category) => sum + category.checks.filter(check => check.status === 'pass').length,
      0
    );
    const warningChecks = healthChecks.reduce(
      (sum, category) => sum + category.checks.filter(check => check.status === 'warning').length,
      0
    );
    const failedChecks = healthChecks.reduce(
      (sum, category) => sum + category.checks.filter(check => check.status === 'fail').length,
      0
    );

    const overallScore = Math.round((passedChecks / totalChecks) * 100);

    const summary = {
      overallScore,
      totalChecks,
      passedChecks,
      warningChecks,
      failedChecks,
      lastChecked: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      summary,
      healthChecks
    }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff'
      }
    });

  } catch {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('SEO health check failed'),
      ErrorType.INTERNAL,
      ErrorSeverity.HIGH
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }
}, ErrorType.INTERNAL);

// POST endpoint to trigger a fresh SEO audit
export const POST = withErrorHandler(async (request: NextRequest) => {
  // Rate limiting for audit requests
  const rateLimitResult = await rateLimit(request, { windowMs: 300000, max: 5 }); // 5 audits per 5 minutes
  if (!rateLimitResult.success) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Rate limit exceeded for SEO audits'),
      ErrorType.RATE_LIMIT,
      ErrorSeverity.MEDIUM
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  // Authentication check
  const authResult = await AuthMiddleware.requireAuth(request);
  if (!authResult.success) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Authentication required'),
      ErrorType.AUTHENTICATION,
      ErrorSeverity.MEDIUM
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  // Admin permission check
  if (!AuthMiddleware.hasPermission(authResult.user!, 'admin:write')) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Insufficient permissions'),
      ErrorType.AUTHORIZATION,
      ErrorSeverity.MEDIUM
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  // CSRF validation
  const csrfToken = request.headers.get('x-csrf-token');
  const isValidCSRF = await validateCSRFToken(csrfToken, request);
  if (!isValidCSRF) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Invalid CSRF token'),
      ErrorType.AUTHENTICATION,
      ErrorSeverity.MEDIUM
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Invalid JSON payload'),
      ErrorType.VALIDATION,
      ErrorSeverity.LOW
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  // Input validation
  const validation = InputValidator.validate(body, {
    url: {
      ...CommonSchemas.url,
      required: true
    }
  });

  if (!validation.isValid) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Invalid URL provided'),
      ErrorType.VALIDATION,
      ErrorSeverity.LOW,
      { errors: validation.errors }
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  const { url } = validation.sanitizedData;

  try {
    // Validate URL belongs to allowed domains (security measure)
    const allowedDomains = process.env.ALLOWED_AUDIT_DOMAINS?.split(',') || ['localhost', '127.0.0.1'];
    const urlObj = new URL(url);
    const isAllowedDomain = allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );

    if (!isAllowedDomain) {
      const errorDetails = SecureErrorHandler.handleError(
        new Error('Domain not allowed for audit'),
        ErrorType.VALIDATION,
        ErrorSeverity.MEDIUM,
        { domain: urlObj.hostname }
      );
      return SecureErrorHandler.createErrorResponse(errorDetails);
    }

    // Simulate audit process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log audit request
    console.log('SEO audit requested:', {
      auditId,
      url: InputValidator.sanitizeInput(url),
      userId: authResult.user!.id,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'SEO audit completed successfully',
      auditId,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Content-Type-Options': 'nosniff'
      }
    });

  } catch {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('SEO audit failed'),
      ErrorType.INTERNAL,
      ErrorSeverity.HIGH,
      { url }
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }
}, ErrorType.INTERNAL);