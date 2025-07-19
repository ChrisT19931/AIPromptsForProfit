import { NextRequest, NextResponse } from 'next/server';
import { InputValidator } from '@/lib/validation';
import { SecureErrorHandler, ErrorType } from '@/lib/error-handler';
import { AuthMiddleware } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateCSRFToken } from '@/lib/csrf';

interface Directory {
  id: string;
  name: string;
  url: string;
  category: 'product_launch' | 'startup_community' | 'software_directory' | 'tech_news' | 'business_listing' | 'ai_tools' | 'general';
  domainAuthority: number;
  submissionType: 'free' | 'paid' | 'freemium';
  status: 'not_submitted' | 'submitted' | 'approved' | 'rejected' | 'pending';
  requirements: string[];
  submissionUrl: string;
  estimatedTraffic: number;
  lastSubmitted?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

const directories: Directory[] = [
  // Product Launch Platforms
  {
    id: 'product_hunt',
    name: 'Product Hunt',
    url: 'https://producthunt.com',
    category: 'product_launch',
    domainAuthority: 87,
    submissionType: 'free',
    status: 'approved',
    requirements: ['Product description', 'Logo/Screenshots', 'Maker profile'],
    submissionUrl: 'https://producthunt.com/posts/new',
    estimatedTraffic: 5000,
    lastSubmitted: '2024-01-15T10:00:00Z',
    priority: 'high'
  },
  {
    id: 'betalist',
    name: 'BetaList',
    url: 'https://betalist.com',
    category: 'product_launch',
    domainAuthority: 72,
    submissionType: 'free',
    status: 'submitted',
    requirements: ['Beta product', 'Description', 'Screenshots'],
    submissionUrl: 'https://betalist.com/submit',
    estimatedTraffic: 2500,
    priority: 'high'
  },
  {
    id: 'launching_next',
    name: 'Launching Next',
    url: 'https://launchingnext.com',
    category: 'product_launch',
    domainAuthority: 45,
    submissionType: 'free',
    status: 'not_submitted',
    requirements: ['Product details', 'Launch date', 'Contact info'],
    submissionUrl: 'https://launchingnext.com/submit',
    estimatedTraffic: 800,
    priority: 'medium'
  },
  
  // Startup Communities
  {
    id: 'indie_hackers',
    name: 'Indie Hackers',
    url: 'https://indiehackers.com',
    category: 'startup_community',
    domainAuthority: 78,
    submissionType: 'free',
    status: 'approved',
    requirements: ['Community participation', 'Product story', 'Metrics'],
    submissionUrl: 'https://indiehackers.com/post',
    estimatedTraffic: 3500,
    lastSubmitted: '2024-01-10T14:30:00Z',
    priority: 'high'
  },
  {
    id: 'angellist',
    name: 'AngelList (Wellfound)',
    url: 'https://wellfound.com',
    category: 'startup_community',
    domainAuthority: 85,
    submissionType: 'free',
    status: 'pending',
    requirements: ['Company profile', 'Team info', 'Funding details'],
    submissionUrl: 'https://wellfound.com/company/new',
    estimatedTraffic: 4200,
    priority: 'high'
  },
  {
    id: 'startup_ranking',
    name: 'Startup Ranking',
    url: 'https://startupranking.com',
    category: 'startup_community',
    domainAuthority: 58,
    submissionType: 'free',
    status: 'not_submitted',
    requirements: ['Startup description', 'Website URL', 'Category'],
    submissionUrl: 'https://startupranking.com/submit',
    estimatedTraffic: 1200,
    priority: 'medium'
  },
  
  // Software Directories
  {
    id: 'g2',
    name: 'G2',
    url: 'https://g2.com',
    category: 'software_directory',
    domainAuthority: 89,
    submissionType: 'freemium',
    status: 'submitted',
    requirements: ['Software details', 'Pricing', 'Features list', 'Screenshots'],
    submissionUrl: 'https://sell.g2.com/products/new',
    estimatedTraffic: 8500,
    priority: 'high'
  },
  {
    id: 'capterra',
    name: 'Capterra',
    url: 'https://capterra.com',
    category: 'software_directory',
    domainAuthority: 86,
    submissionType: 'freemium',
    status: 'not_submitted',
    requirements: ['Product demo', 'Pricing info', 'Customer reviews'],
    submissionUrl: 'https://capterra.com/vendors/sign-up',
    estimatedTraffic: 7200,
    priority: 'high'
  },
  {
    id: 'alternativeto',
    name: 'AlternativeTo',
    url: 'https://alternativeto.net',
    category: 'software_directory',
    domainAuthority: 75,
    submissionType: 'free',
    status: 'approved',
    requirements: ['Software description', 'Platform compatibility', 'License type'],
    submissionUrl: 'https://alternativeto.net/software/new/',
    estimatedTraffic: 2800,
    lastSubmitted: '2024-01-08T09:15:00Z',
    priority: 'medium'
  },
  {
    id: 'saas_hub',
    name: 'SaaS Hub',
    url: 'https://saashub.com',
    category: 'software_directory',
    domainAuthority: 62,
    submissionType: 'free',
    status: 'not_submitted',
    requirements: ['SaaS description', 'Pricing model', 'Features'],
    submissionUrl: 'https://saashub.com/submit-software',
    estimatedTraffic: 1500,
    priority: 'medium'
  },
  
  // AI Tools Directories
  {
    id: 'futurepedia',
    name: 'Futurepedia',
    url: 'https://futurepedia.io',
    category: 'ai_tools',
    domainAuthority: 68,
    submissionType: 'free',
    status: 'submitted',
    requirements: ['AI tool description', 'Use cases', 'Pricing'],
    submissionUrl: 'https://futurepedia.io/submit-tool',
    estimatedTraffic: 3200,
    priority: 'high'
  },
  {
    id: 'ai_tools_directory',
    name: 'AI Tools Directory',
    url: 'https://aitoolsdirectory.com',
    category: 'ai_tools',
    domainAuthority: 45,
    submissionType: 'free',
    status: 'not_submitted',
    requirements: ['Tool description', 'Category', 'Screenshots'],
    submissionUrl: 'https://aitoolsdirectory.com/submit',
    estimatedTraffic: 900,
    priority: 'medium'
  },
  {
    id: 'there_is_an_ai',
    name: 'There\'s An AI For That',
    url: 'https://theresanaiforthat.com',
    category: 'ai_tools',
    domainAuthority: 71,
    submissionType: 'free',
    status: 'pending',
    requirements: ['AI tool details', 'Use case description', 'Pricing info'],
    submissionUrl: 'https://theresanaiforthat.com/submit/',
    estimatedTraffic: 2600,
    priority: 'high'
  },
  
  // Tech News & Blogs
  {
    id: 'hacker_news',
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    category: 'tech_news',
    domainAuthority: 89,
    submissionType: 'free',
    status: 'approved',
    requirements: ['Interesting tech story', 'Community guidelines compliance'],
    submissionUrl: 'https://news.ycombinator.com/submit',
    estimatedTraffic: 15000,
    lastSubmitted: '2024-01-12T16:45:00Z',
    priority: 'high'
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com',
    category: 'tech_news',
    domainAuthority: 94,
    submissionType: 'free',
    status: 'not_submitted',
    requirements: ['Press release', 'Newsworthy story', 'Media kit'],
    submissionUrl: 'https://techcrunch.com/got-a-tip/',
    estimatedTraffic: 25000,
    priority: 'high'
  },
  {
    id: 'startup_buffer',
    name: 'Startup Buffer',
    url: 'https://startupbuffer.com',
    category: 'tech_news',
    domainAuthority: 42,
    submissionType: 'free',
    status: 'not_submitted',
    requirements: ['Startup story', 'Founder interview', 'Product details'],
    submissionUrl: 'https://startupbuffer.com/submit',
    estimatedTraffic: 600,
    priority: 'low'
  },
  
  // Business Listings
  {
    id: 'crunchbase',
    name: 'Crunchbase',
    url: 'https://crunchbase.com',
    category: 'business_listing',
    domainAuthority: 92,
    submissionType: 'freemium',
    status: 'approved',
    requirements: ['Company info', 'Funding details', 'Team profiles'],
    submissionUrl: 'https://crunchbase.com/organization/new',
    estimatedTraffic: 6500,
    lastSubmitted: '2024-01-05T11:20:00Z',
    priority: 'high'
  },
  {
    id: 'startup_stash',
    name: 'Startup Stash',
    url: 'https://startupstash.com',
    category: 'business_listing',
    domainAuthority: 55,
    submissionType: 'free',
    status: 'submitted',
    requirements: ['Tool description', 'Category', 'Pricing'],
    submissionUrl: 'https://startupstash.com/submit-a-resource/',
    estimatedTraffic: 1100,
    priority: 'medium'
  }
  // Add more directories as needed...
];

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 100 });
    const rateLimitResponse = NextResponse.next();
    
    try {
      await rateLimiter.check(rateLimitResponse, 30, `directories-${ip}`);
    } catch {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Rate limit exceeded'), ErrorType.RATE_LIMIT)
      );
    }

    // Authentication and authorization
    const authResult = await AuthMiddleware.requireAuth(request);
    if (!authResult.success) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error(authResult.error || 'Authentication required'), ErrorType.AUTHENTICATION)
      );
    }

    const hasPermission = await AuthMiddleware.checkPermission(authResult.user!, 'admin:read');
    if (!hasPermission) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Insufficient permissions'), ErrorType.AUTHORIZATION)
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Input validation and sanitization
    const querySchema = {
      category: { type: 'string' as const, required: false, allowedValues: ['product_launch', 'startup_community', 'software_directory', 'tech_news', 'business_listing', 'ai_tools', 'general'] },
      status: { type: 'string' as const, required: false, allowedValues: ['not_submitted', 'submitted', 'approved', 'rejected', 'pending'] },
      priority: { type: 'string' as const, required: false, allowedValues: ['low', 'medium', 'high'] },
      search: { type: 'string' as const, required: false, maxLength: 100 },
      limit: { type: 'number' as const, required: false },
      offset: { type: 'number' as const, required: false }
    };

    const queryData = {
      category: searchParams.get('category'),
      status: searchParams.get('status'),
      priority: searchParams.get('priority'),
      search: searchParams.get('search'),
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined
    };

    const validationResult = InputValidator.validate(queryData, querySchema);
    if (!validationResult.isValid) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Invalid query parameters'), ErrorType.VALIDATION)
      );
    }

    const sanitizedData = validationResult.sanitizedData;
    const category = sanitizedData.category;
    const status = sanitizedData.status;
    const priority = sanitizedData.priority;
    const search = sanitizedData.search?.toLowerCase();
    const limit = sanitizedData.limit || 50;
    const offset = sanitizedData.offset || 0;

    let filteredDirectories = [...directories];

    // Apply filters
    if (category) {
      filteredDirectories = filteredDirectories.filter(dir => dir.category === category);
    }
    
    if (status) {
      filteredDirectories = filteredDirectories.filter(dir => dir.status === status);
    }
    
    if (priority) {
      filteredDirectories = filteredDirectories.filter(dir => dir.priority === priority);
    }
    
    if (search) {
      filteredDirectories = filteredDirectories.filter(dir => 
        dir.name.toLowerCase().includes(search) ||
        dir.url.toLowerCase().includes(search) ||
        dir.category.toLowerCase().includes(search)
      );
    }

    // Sort by priority and domain authority
    filteredDirectories.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.domainAuthority - a.domainAuthority;
    });

    // Apply pagination
    const paginatedDirectories = filteredDirectories.slice(offset, offset + limit);

    // Calculate statistics
    const stats = {
      total: directories.length,
      filtered: filteredDirectories.length,
      byStatus: {
        not_submitted: directories.filter(d => d.status === 'not_submitted').length,
        submitted: directories.filter(d => d.status === 'submitted').length,
        approved: directories.filter(d => d.status === 'approved').length,
        rejected: directories.filter(d => d.status === 'rejected').length,
        pending: directories.filter(d => d.status === 'pending').length
      },
      byCategory: {
        product_launch: directories.filter(d => d.category === 'product_launch').length,
        startup_community: directories.filter(d => d.category === 'startup_community').length,
        software_directory: directories.filter(d => d.category === 'software_directory').length,
        ai_tools: directories.filter(d => d.category === 'ai_tools').length,
        tech_news: directories.filter(d => d.category === 'tech_news').length,
        business_listing: directories.filter(d => d.category === 'business_listing').length,
        general: directories.filter(d => d.category === 'general').length
      },
      byPriority: {
        high: directories.filter(d => d.priority === 'high').length,
        medium: directories.filter(d => d.priority === 'medium').length,
        low: directories.filter(d => d.priority === 'low').length
      },
      averageDA: Math.round(
        directories.reduce((sum, d) => sum + d.domainAuthority, 0) / directories.length
      ),
      totalEstimatedTraffic: directories.reduce((sum, d) => sum + d.estimatedTraffic, 0)
    };

    const response = NextResponse.json({
      success: true,
      directories: paginatedDirectories,
      stats,
      pagination: {
        limit,
        offset,
        total: filteredDirectories.length,
        hasMore: offset + limit < filteredDirectories.length
      }
    });

    // Set security headers
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    return response;

  } catch (error) {
    return SecureErrorHandler.createErrorResponse(
      SecureErrorHandler.handleError(new Error('Failed to fetch directories'), ErrorType.INTERNAL)
    );
  }
}

// POST endpoint to update directory status or add new directory
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 100 });
    const rateLimitResponse = NextResponse.next();
    
    try {
      await rateLimiter.check(rateLimitResponse, 10, `directories-post-${ip}`);
    } catch {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Rate limit exceeded'), ErrorType.RATE_LIMIT)
      );
    }

    // Authentication and authorization
    const authResult = await AuthMiddleware.requireAuth(request);
    if (!authResult.success) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error(authResult.error || 'Authentication required'), ErrorType.AUTHENTICATION)
      );
    }

    const hasPermission = await AuthMiddleware.checkPermission(authResult.user!, 'admin:write');
    if (!hasPermission) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Insufficient permissions'), ErrorType.AUTHORIZATION)
      );
    }

    // CSRF validation
    const csrfToken = request.headers.get('x-csrf-token');
    const csrfResult = await validateCSRFToken(csrfToken);
    if (!csrfResult) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Invalid CSRF token'), ErrorType.AUTHENTICATION)
      );
    }

    const body = await request.json();
    const { action, ...data } = body;

    // Input validation
    if (!action || typeof action !== 'string') {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Action is required'), ErrorType.VALIDATION)
      );
    }

    switch (action) {
      case 'update_status':
        const updateStatusSchema = {
          directoryId: { type: 'string' as const, required: true, minLength: 1 },
          status: { type: 'string' as const, required: true, enum: ['not_submitted', 'submitted', 'approved', 'rejected', 'pending'] },
          notes: { type: 'string' as const, maxLength: 500, optional: true }
        };

        const updateValidation = InputValidator.validate(data, updateStatusSchema);
        if (!updateValidation.isValid) {
          return SecureErrorHandler.createErrorResponse(
            SecureErrorHandler.handleError(new Error('Invalid update data'), ErrorType.VALIDATION)
          );
        }

        const sanitizedUpdate = updateValidation.sanitizedData;
        const { directoryId, status, notes } = sanitizedUpdate;

        // In a real implementation, update database
        const directoryIndex = directories.findIndex(d => d.id === directoryId);
        if (directoryIndex === -1) {
          return SecureErrorHandler.createErrorResponse(
            SecureErrorHandler.handleError(new Error('Directory not found'), ErrorType.NOT_FOUND)
          );
        }

        directories[directoryIndex].status = status;
        if (status === 'submitted') {
          directories[directoryIndex].lastSubmitted = new Date().toISOString();
        }
        if (notes) {
          directories[directoryIndex].notes = notes;
        }

        const response = NextResponse.json({
          success: true,
          message: 'Directory status updated successfully',
          directory: directories[directoryIndex]
        });
        response.headers.set('X-Content-Type-Options', 'nosniff');
        return response;

      case 'bulk_update':
        const bulkUpdateSchema = {
          directoryIds: { type: 'array' as const, required: true, minLength: 1, maxLength: 50 },
          newStatus: { type: 'string' as const, required: true, enum: ['not_submitted', 'submitted', 'approved', 'rejected', 'pending'] }
        };

        const bulkValidation = InputValidator.validate(data, bulkUpdateSchema);
        if (!bulkValidation.isValid) {
          return SecureErrorHandler.createErrorResponse(
            SecureErrorHandler.handleError(new Error('Invalid bulk update data'), ErrorType.VALIDATION)
          );
        }

        const sanitizedBulk = bulkValidation.sanitizedData;
        const { directoryIds, newStatus } = sanitizedBulk;

        // Validate each directory ID
        for (const id of directoryIds) {
          if (typeof id !== 'string' || id.length === 0) {
            return SecureErrorHandler.createErrorResponse(
              SecureErrorHandler.handleError(new Error('Invalid directory ID in array'), ErrorType.VALIDATION)
            );
          }
        }

        let updatedCount = 0;
        directoryIds.forEach((id: string) => {
          const index = directories.findIndex(d => d.id === id);
          if (index !== -1) {
            directories[index].status = newStatus;
            if (newStatus === 'submitted') {
              directories[index].lastSubmitted = new Date().toISOString();
            }
            updatedCount++;
          }
        });

        const bulkResponse = NextResponse.json({
          success: true,
          message: `${updatedCount} directories updated successfully`,
          updatedCount
        });
        bulkResponse.headers.set('X-Content-Type-Options', 'nosniff');
        return bulkResponse;

      case 'add_directory':
        const addDirectorySchema = {
          name: { type: 'string' as const, required: true, minLength: 1, maxLength: 100 },
          url: { type: 'url' as const, required: true },
          category: { type: 'string' as const, required: true, enum: ['product_launch', 'startup_community', 'software_directory', 'tech_news', 'business_listing', 'ai_tools', 'general'] },
          domainAuthority: { type: 'number' as const, min: 0, max: 100, optional: true },
          submissionType: { type: 'string' as const, enum: ['free', 'paid', 'freemium'], optional: true },
          requirements: { type: 'array' as const, optional: true },
          submissionUrl: { type: 'url' as const, optional: true },
          estimatedTraffic: { type: 'number' as const, min: 0, optional: true },
          priority: { type: 'string' as const, enum: ['low', 'medium', 'high'], optional: true }
        };

        const addValidation = InputValidator.validate(data, addDirectorySchema);
        if (!addValidation.isValid) {
          return SecureErrorHandler.createErrorResponse(
            SecureErrorHandler.handleError(new Error('Invalid directory data'), ErrorType.VALIDATION)
          );
        }

        const sanitizedDirectory = addValidation.sanitizedData;
        const newDirectory = {
          id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: sanitizedDirectory.name,
          url: sanitizedDirectory.url,
          category: sanitizedDirectory.category,
          status: 'not_submitted' as const,
          domainAuthority: sanitizedDirectory.domainAuthority || 0,
          submissionType: sanitizedDirectory.submissionType || 'free' as const,
          requirements: sanitizedDirectory.requirements || [],
          submissionUrl: sanitizedDirectory.submissionUrl || '',
          estimatedTraffic: sanitizedDirectory.estimatedTraffic || 0,
          priority: sanitizedDirectory.priority || 'medium' as const
        };

        directories.push(newDirectory);

        const addResponse = NextResponse.json({
          success: true,
          message: 'Directory added successfully',
          directory: newDirectory
        });
        addResponse.headers.set('X-Content-Type-Options', 'nosniff');
        return addResponse;

      default:
        return SecureErrorHandler.createErrorResponse(
          SecureErrorHandler.handleError(new Error('Invalid action'), ErrorType.VALIDATION)
        );
    }

  } catch (error) {
    return SecureErrorHandler.createErrorResponse(
      SecureErrorHandler.handleError(new Error('Failed to update directory'), ErrorType.INTERNAL)
    );
  }
}

// DELETE endpoint to remove directories
export async function DELETE(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimiter = rateLimit({
      interval: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 500
    });
    
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResponse = NextResponse.next();
    
    try {
      await rateLimiter.check(rateLimitResponse, 5, ip + '/admin/directories/delete');
    } catch (error) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Too many requests'), ErrorType.RATE_LIMIT)
      );
    }

    // Authentication and authorization
    const authResult = await AuthMiddleware.requireAuth(request);
    if (!authResult.success) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error(authResult.error || 'Authentication required'), ErrorType.AUTHENTICATION)
      );
    }

    const hasPermission = await AuthMiddleware.checkPermission(authResult.user!, 'admin:delete');
    if (!hasPermission) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Insufficient permissions'), ErrorType.AUTHORIZATION)
      );
    }

    // CSRF validation
    const csrfToken = request.headers.get('x-csrf-token');
    const csrfResult = await validateCSRFToken(csrfToken);
    if (!csrfResult) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Invalid CSRF token'), ErrorType.AUTHENTICATION)
      );
    }

    const { searchParams } = new URL(request.url);
    const directoryId = searchParams.get('id');
    
    // Input validation
    const idSchema = {
      id: { type: 'string' as const, required: true, minLength: 1, maxLength: 100 }
    };

    const validationResult = InputValidator.validate({ id: directoryId }, idSchema);
    if (!validationResult.isValid) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Invalid directory ID'), ErrorType.VALIDATION)
      );
    }

    const sanitizedData = validationResult.sanitizedData;
    const sanitizedDirectoryId = sanitizedData.id;

    const directoryIndex = directories.findIndex(d => d.id === sanitizedDirectoryId);
    if (directoryIndex === -1) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Directory not found'), ErrorType.NOT_FOUND)
      );
    }

    // Only allow deletion of custom directories
    if (!sanitizedDirectoryId.startsWith('custom_')) {
      return SecureErrorHandler.createErrorResponse(
        SecureErrorHandler.handleError(new Error('Cannot delete built-in directories'), ErrorType.AUTHORIZATION)
      );
    }

    directories.splice(directoryIndex, 1);

    const response = NextResponse.json({
      success: true,
      message: 'Directory deleted successfully'
    });
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;

  } catch (error) {
    return SecureErrorHandler.createErrorResponse(
      SecureErrorHandler.handleError(new Error('Failed to delete directory'), ErrorType.INTERNAL)
    );
  }
}