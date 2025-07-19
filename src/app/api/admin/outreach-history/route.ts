import { NextRequest, NextResponse } from 'next/server';
import { InputValidator, CommonSchemas } from '@/lib/validation';
import { SecureErrorHandler, ErrorType, ErrorSeverity, withErrorHandler } from '@/lib/error-handler';
import { AuthMiddleware } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

// Mock data for demonstration
// In production, this would fetch from MongoDB
const mockOutreachHistory = [
  {
    website: 'https://techcrunch.com/contact',
    status: 'success',
    date: '2024-01-15T10:30:00Z',
    notes: 'Contact form submitted successfully'
  },
  {
    website: 'https://producthunt.com/posts/new',
    status: 'success',
    date: '2024-01-14T15:45:00Z',
    notes: 'Product submitted to Product Hunt'
  },
  {
    website: 'https://indiehackers.com/contact',
    status: 'pending',
    date: '2024-01-14T09:20:00Z',
    notes: 'Awaiting response from Indie Hackers'
  },
  {
    website: 'https://betalist.com/submit',
    status: 'success',
    date: '2024-01-13T14:15:00Z',
    notes: 'Successfully submitted to BetaList'
  },
  {
    website: 'https://example-blog.com/contact',
    status: 'failed',
    date: '2024-01-13T11:30:00Z',
    notes: 'Contact form not found'
  },
  {
    website: 'https://startup-directory.com/submit',
    status: 'success',
    date: '2024-01-12T16:45:00Z',
    notes: 'Listed in startup directory'
  },
  {
    website: 'https://ai-news-blog.com/contact',
    status: 'pending',
    date: '2024-01-12T13:20:00Z',
    notes: 'Email sent, awaiting response'
  },
  {
    website: 'https://tech-review-site.com/submit',
    status: 'failed',
    date: '2024-01-11T10:15:00Z',
    notes: 'Website blocked automated access'
  }
];

export const GET = withErrorHandler(async (request: NextRequest) => {
  // Rate limiting
  const rateLimitResult = await rateLimit(request, { windowMs: 60000, max: 30 });
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

  const { searchParams } = new URL(request.url);
  
  // Input validation for query parameters
  const queryValidation = InputValidator.validate({
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
    status: searchParams.get('status'),
    search: searchParams.get('search')
  }, {
    page: {
      type: 'string' as const,
      pattern: /^[1-9]\d*$/,
      transform: (val: string) => Math.min(Math.max(parseInt(val), 1), 100)
    },
    limit: {
      type: 'string' as const,
      pattern: /^[1-9]\d*$/,
      transform: (val: string) => Math.min(Math.max(parseInt(val), 1), 50)
    },
    status: {
      type: 'string' as const,
      enum: ['success', 'pending', 'failed'],
      optional: true,
      sanitize: true
    },
    search: {
      ...CommonSchemas.searchQuery,
      optional: true
    }
  });

  if (!queryValidation.isValid) {
    const errorDetails = SecureErrorHandler.handleError(
      new Error('Invalid query parameters'),
      ErrorType.VALIDATION,
      ErrorSeverity.LOW,
      { errors: queryValidation.errors }
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }

  const { page, limit, status, search } = queryValidation.sanitizedData;

  try {
    let filteredHistory = [...mockOutreachHistory];

    // Apply filters
    if (status) {
      filteredHistory = filteredHistory.filter(record => record.status === status);
    }

    if (search) {
      const searchLower = InputValidator.sanitizeInput(search).toLowerCase();
      filteredHistory = filteredHistory.filter(record => 
        record.website.toLowerCase().includes(searchLower) ||
        record.notes.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date (newest first)
    filteredHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

    // Format results with sanitized data
    const results = paginatedHistory.map(result => ({
      website: InputValidator.sanitizeInput(result.website),
      status: result.status,
      date: new Date(result.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      notes: InputValidator.sanitizeInput(result.notes)
    }));

    const totalPages = Math.ceil(filteredHistory.length / limit);

    return NextResponse.json({
      success: true,
      results,
      total: filteredHistory.length,
      pagination: {
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: {
        successful: filteredHistory.filter(r => r.status === 'success').length,
        pending: filteredHistory.filter(r => r.status === 'pending').length,
        failed: filteredHistory.filter(r => r.status === 'failed').length
      }
    }, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    const errorDetails = SecureErrorHandler.handleError(
      error as Error,
      ErrorType.INTERNAL,
      ErrorSeverity.HIGH
    );
    return SecureErrorHandler.createErrorResponse(errorDetails);
  }
}, ErrorType.INTERNAL);

// Placeholder for MongoDB integration
// async function getOutreachHistory(limit = 50, offset = 0) {
//   // Connect to MongoDB
//   // Query outreach_campaigns collection
//   // Return paginated results with stats
// }