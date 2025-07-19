import { NextRequest, NextResponse } from 'next/server';
import { InputValidator, CommonSchemas } from '@/lib/security/input-validator';
import { SecureErrorHandler } from '@/lib/security/error-handler';
import { AuthMiddleware } from '@/lib/security/auth-middleware';
import { rateLimit } from '@/lib/security/rate-limiter';
import { validateCSRFToken } from '@/lib/security/csrf-validator';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
      keyGenerator: (req) => `generate-verification-${req.ip || 'unknown'}`
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

    // Input validation
    const validator = new InputValidator();
    const validationSchema = {
      verificationType: { type: 'string', required: true, enum: ['meta', 'html', 'dns', 'analytics'] }
    };

    const validationResult = validator.validate(body, validationSchema);
    if (!validationResult.isValid) {
      return SecureErrorHandler.createResponse(
        SecureErrorHandler.createError('VALIDATION', 'Invalid verification type', validationResult.errors),
        request
      );
    }

    const sanitizedData = validator.sanitize(validationResult.data);
    const { verificationType } = sanitizedData;

  const verificationCode = generateVerificationCode();
  const domain = process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', '').replace('http://', '') || 'ventaroai.com';

  let verificationContent = '';
  let instructions = '';

  switch (verificationType) {
    case 'meta':
      verificationContent = `<meta name="google-site-verification" content="${verificationCode}" />`;
      instructions = `Add this meta tag to the <head> section of your website's homepage (${domain}).`;
      break;

    case 'html':
      const fileName = `google${verificationCode}.html`;
      verificationContent = `google-site-verification: ${fileName}`;
      instructions = `Create a file named "${fileName}" in your website's root directory with the content: "google-site-verification: ${verificationCode}"`;
      break;

    case 'dns':
      verificationContent = `google-site-verification=${verificationCode}`;
      instructions = `Add this TXT record to your domain's DNS settings:\n\nName: @\nType: TXT\nValue: ${verificationContent}`;
      break;

    case 'analytics':
      verificationContent = `<!-- Google Analytics verification -->\n<!-- This method uses your existing Google Analytics tracking code -->`;
      instructions = `If you already have Google Analytics installed on your site, you can use that for verification. Make sure the same Google account is used for both Analytics and Search Console.`;
      break;

    default:
      throw new Error('Invalid verification type');
  }

  // In production, you might want to save this verification attempt to a database
  // await saveVerificationAttempt({
  //   type: verificationType,
  //   code: verificationCode,
  //   domain,
  //   createdAt: new Date()
  // });

    const response = NextResponse.json({
      success: true,
      verificationType,
      verificationCode,
      verificationContent,
      instructions,
      domain,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      additionalInfo: getAdditionalInfo(verificationType)
    });
    
    // Set security headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;

  } catch (error) {
    return SecureErrorHandler.createResponse(
      SecureErrorHandler.createError('INTERNAL', 'Failed to generate verification code', error),
      request
    );
  }
}

function generateVerificationCode(): string {
  // Generate a random verification code similar to Google's format
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  
  // Google verification codes are typically 68 characters long
  for (let i = 0; i < 68; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

function getAdditionalInfo(verificationType: string): any {
  const baseInfo = {
    nextSteps: [
      'Add the verification code to your website',
      'Go to Google Search Console',
      'Click "Verify" to complete the process',
      'Once verified, you can remove the verification code if desired'
    ],
    troubleshooting: [
      'Make sure the verification code is exactly as provided',
      'Clear your browser cache and try again',
      'Wait a few minutes after adding the code before verifying',
      'Ensure your website is accessible to Google'
    ]
  };

  switch (verificationType) {
    case 'meta':
      return {
        ...baseInfo,
        placement: 'Add to the <head> section of your homepage',
        example: `<!DOCTYPE html>\n<html>\n<head>\n  <meta name="google-site-verification" content="YOUR_CODE_HERE" />\n  <!-- Other head elements -->\n</head>\n<body>\n  <!-- Page content -->\n</body>\n</html>`,
        pros: ['Quick and easy', 'No file uploads required'],
        cons: ['Must be on homepage', 'Requires code access']
      };

    case 'html':
      return {
        ...baseInfo,
        placement: 'Upload to your website\'s root directory',
        example: 'File should be accessible at: https://yourdomain.com/googleXXXXXXXX.html',
        pros: ['Works without code changes', 'Can be uploaded via FTP'],
        cons: ['Requires file upload access', 'Must remain on server']
      };

    case 'dns':
      return {
        ...baseInfo,
        placement: 'Add to your domain\'s DNS records',
        example: 'TXT record: google-site-verification=YOUR_CODE_HERE',
        pros: ['Works for entire domain', 'No website changes needed'],
        cons: ['Requires DNS access', 'May take time to propagate']
      };

    case 'analytics':
      return {
        ...baseInfo,
        placement: 'Uses existing Google Analytics code',
        example: 'No additional code needed if Analytics is already installed',
        pros: ['No additional setup', 'Uses existing tracking'],
        cons: ['Requires Google Analytics', 'Same Google account needed']
      };

    default:
      return baseInfo;
  }
}

// Placeholder for database logging
// async function saveVerificationAttempt(data: any) {
//   // Save to MongoDB or your preferred database
//   // This helps track verification attempts and codes
// }