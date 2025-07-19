import DOMPurify from 'isomorphic-dompurify';

// Input validation schemas
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  type?: 'string' | 'number' | 'email' | 'url' | 'boolean' | 'array' | 'object';
  sanitize?: boolean;
  allowedValues?: any[];
  customValidator?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string[] };
  sanitizedData: { [key: string]: any };
}

/**
 * Comprehensive input validator and sanitizer
 */
export class InputValidator {
  private static emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private static urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  private static phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  private static alphanumericRegex = /^[a-zA-Z0-9]+$/;
  private static slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  /**
   * Validate input data against schema
   */
  static validate(data: any, schema: ValidationSchema): ValidationResult {
    const errors: { [key: string]: string[] } = {};
    const sanitizedData: { [key: string]: any } = {};

    for (const [field, rule] of Object.entries(schema)) {
      const value = data[field];
      const fieldErrors: string[] = [];

      // Check required fields
      if (rule.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(`${field} is required`);
        continue;
      }

      // Skip validation for optional empty fields
      if (!rule.required && (value === undefined || value === null || value === '')) {
        sanitizedData[field] = value;
        continue;
      }

      // Type validation
      if (rule.type) {
        const typeError = this.validateType(value, rule.type, field);
        if (typeError) {
          fieldErrors.push(typeError);
          continue;
        }
      }

      // Length validation
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        fieldErrors.push(`${field} must be at least ${rule.minLength} characters`);
      }

      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        fieldErrors.push(`${field} must not exceed ${rule.maxLength} characters`);
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        fieldErrors.push(`${field} format is invalid`);
      }

      // Allowed values validation
      if (rule.allowedValues && !rule.allowedValues.includes(value)) {
        fieldErrors.push(`${field} must be one of: ${rule.allowedValues.join(', ')}`);
      }

      // Custom validation
      if (rule.customValidator) {
        const customResult = rule.customValidator(value);
        if (customResult !== true) {
          fieldErrors.push(typeof customResult === 'string' ? customResult : `${field} is invalid`);
        }
      }

      // Sanitization
      if (fieldErrors.length === 0) {
        sanitizedData[field] = rule.sanitize ? this.sanitizeInput(value, rule.type) : value;
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    };
  }

  /**
   * Validate data type
   */
  private static validateType(value: any, type: string, field: string): string | null {
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          return `${field} must be a string`;
        }
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return `${field} must be a valid number`;
        }
        break;
      case 'email':
        if (typeof value !== 'string' || !this.emailRegex.test(value)) {
          return `${field} must be a valid email address`;
        }
        break;
      case 'url':
        if (typeof value !== 'string' || !this.urlRegex.test(value)) {
          return `${field} must be a valid URL`;
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          return `${field} must be a boolean`;
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          return `${field} must be an array`;
        }
        break;
      case 'object':
        if (typeof value !== 'object' || Array.isArray(value) || value === null) {
          return `${field} must be an object`;
        }
        break;
    }
    return null;
  }

  /**
   * Sanitize input based on type
   */
  private static sanitizeInput(value: any, type?: string): any {
    if (typeof value === 'string') {
      // Basic HTML sanitization
      let sanitized = DOMPurify.sanitize(value, { 
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
      });

      // Additional sanitization based on type
      switch (type) {
        case 'email':
          sanitized = sanitized.toLowerCase().trim();
          break;
        case 'url':
          sanitized = sanitized.trim();
          break;
        default:
          sanitized = sanitized.trim();
      }

      return sanitized;
    }

    return value;
  }

  /**
   * Sanitize HTML content while preserving safe tags
   */
  static sanitizeHTML(html: string, allowedTags?: string[]): string {
    const defaultAllowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const tags = allowedTags || defaultAllowedTags;

    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: tags,
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false
    });
  }

  /**
   * Validate and sanitize file uploads
   */
  static validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  }): { isValid: boolean; error?: string } {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = [], allowedExtensions = [] } = options;

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must not exceed ${Math.round(maxSize / 1024 / 1024)}MB`
      };
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`
      };
    }

    // Check file extension
    if (allowedExtensions.length > 0) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        return {
          isValid: false,
          error: `File extension .${extension} is not allowed`
        };
      }
    }

    return { isValid: true };
  }

  /**
   * SQL injection prevention
   */
  static preventSQLInjection(input: string): string {
    if (typeof input !== 'string') return input;

    // Remove or escape dangerous SQL characters
    return input
      .replace(/'/g, "''")
      .replace(/"/g, '""')
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '')
      .replace(/xp_/gi, '')
      .replace(/sp_/gi, '')
      .replace(/exec/gi, '')
      .replace(/execute/gi, '')
      .replace(/union/gi, '')
      .replace(/select/gi, '')
      .replace(/insert/gi, '')
      .replace(/update/gi, '')
      .replace(/delete/gi, '')
      .replace(/drop/gi, '')
      .replace(/create/gi, '')
      .replace(/alter/gi, '')
      .replace(/truncate/gi, '');
  }

  /**
   * NoSQL injection prevention
   */
  static preventNoSQLInjection(input: any): any {
    if (typeof input === 'string') {
      // Remove MongoDB operators
      return input.replace(/\$\w+/g, '');
    }

    if (typeof input === 'object' && input !== null) {
      const sanitized: any = Array.isArray(input) ? [] : {};
      
      for (const key in input) {
        // Skip MongoDB operators
        if (key.startsWith('$')) {
          continue;
        }
        
        sanitized[key] = this.preventNoSQLInjection(input[key]);
      }
      
      return sanitized;
    }

    return input;
  }
}

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  email: {
    email: {
      required: true,
      type: 'email' as const,
      maxLength: 254,
      sanitize: true
    }
  },

  contact: {
    name: {
      required: true,
      type: 'string' as const,
      minLength: 2,
      maxLength: 100,
      sanitize: true,
      pattern: /^[a-zA-Z\s'-]+$/
    },
    email: {
      required: true,
      type: 'email' as const,
      maxLength: 254,
      sanitize: true
    },
    message: {
      required: true,
      type: 'string' as const,
      minLength: 10,
      maxLength: 1000,
      sanitize: true
    }
  },

  admin: {
    username: {
      required: true,
      type: 'string' as const,
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9_]+$/,
      sanitize: true
    },
    password: {
      required: true,
      type: 'string' as const,
      minLength: 8,
      maxLength: 128,
      customValidator: (value: string) => {
        // Password strength validation
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
          return 'Password must contain uppercase, lowercase, number, and special character';
        }
        return true;
      }
    }
  },

  url: {
    url: {
      required: true,
      type: 'url' as const,
      maxLength: 2048,
      sanitize: true
    }
  },

  searchQuery: {
    query: {
      required: true,
      type: 'string' as const,
      minLength: 1,
      maxLength: 200,
      sanitize: true,
      customValidator: (value: string) => {
        // Prevent search injection
        const dangerous = /[<>"'&\\]/;
        return !dangerous.test(value) || 'Search query contains invalid characters';
      }
    }
  }
};