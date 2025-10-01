export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationService {
  private static instance: ValidationService;

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  // Validate a single field
  validateField(value: any, rules: ValidationRule, fieldName: string): ValidationResult {
    const errors: string[] = [];

    // Required check
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(`${fieldName} is required`);
      return { isValid: false, errors };
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { isValid: true, errors: [] };
    }

    // String length validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${fieldName} must be at least ${rules.minLength} characters`);
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${fieldName} must be no more than ${rules.maxLength} characters`);
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${fieldName} format is invalid`);
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate multiple fields
  validateFields(fields: Record<string, { value: any; rules: ValidationRule }>): ValidationResult {
    const allErrors: string[] = [];
    let isValid = true;

    for (const [fieldName, { value, rules }] of Object.entries(fields)) {
      const result = this.validateField(value, rules, fieldName);
      if (!result.isValid) {
        isValid = false;
        allErrors.push(...result.errors);
      }
    }

    return { isValid, errors: allErrors };
  }

  // Common validation rules
  static getRules() {
    return {
      // Text validations
      required: { required: true },
      optional: { required: false },
      
      // Length validations
      shortText: { maxLength: 50 },
      mediumText: { maxLength: 200 },
      longText: { maxLength: 1000 },
      
      // Email validation
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value: string) => {
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Please enter a valid email address';
          }
          return null;
        }
      },
      
      // Phone validation
      phone: {
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        custom: (value: string) => {
          if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value)) {
            return 'Please enter a valid phone number';
          }
          return null;
        }
      },
      
      // Date validation
      date: {
        custom: (value: string | Date) => {
          if (!value) return null;
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            return 'Please enter a valid date';
          }
          return null;
        }
      },
      
      // Future date validation
      futureDate: {
        custom: (value: string | Date) => {
          if (!value) return null;
          const date = new Date(value);
          const now = new Date();
          if (date <= now) {
            return 'Date must be in the future';
          }
          return null;
        }
      },
      
      // URL validation
      url: {
        pattern: /^https?:\/\/.+/,
        custom: (value: string) => {
          if (value && !/^https?:\/\/.+/.test(value)) {
            return 'Please enter a valid URL starting with http:// or https://';
          }
          return null;
        }
      },
      
      // Password validation
      password: {
        minLength: 8,
        custom: (value: string) => {
          if (value && value.length < 8) {
            return 'Password must be at least 8 characters';
          }
          if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
          }
          return null;
        }
      },
      
      // Cabin name validation
      cabinName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        custom: (value: string) => {
          if (value && !/^[a-zA-Z0-9\s\-_]+$/.test(value)) {
            return 'Cabin name can only contain letters, numbers, spaces, hyphens, and underscores';
          }
          return null;
        }
      },
      
      // Task title validation
      taskTitle: {
        required: true,
        minLength: 3,
        maxLength: 100,
      },
      
      // Post text validation
      postText: {
        required: true,
        minLength: 1,
        maxLength: 2000,
      },
      
      // Booking date validation
      bookingDate: {
        required: true,
        custom: (value: string | Date) => {
          if (!value) return 'Booking date is required';
          const date = new Date(value);
          const now = new Date();
          const oneYearFromNow = new Date();
          oneYearFromNow.setFullYear(now.getFullYear() + 1);
          
          if (date < now) {
            return 'Booking date cannot be in the past';
          }
          if (date > oneYearFromNow) {
            return 'Booking date cannot be more than one year in the future';
          }
          return null;
        }
      },
      
      // Booking duration validation
      bookingDuration: {
        required: true,
        custom: (value: { startDate: string; endDate: string }) => {
          if (!value.startDate || !value.endDate) {
            return 'Both start and end dates are required';
          }
          
          const start = new Date(value.startDate);
          const end = new Date(value.endDate);
          
          if (start >= end) {
            return 'End date must be after start date';
          }
          
          const diffTime = end.getTime() - start.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 30) {
            return 'Booking duration cannot exceed 30 days';
          }
          
          return null;
        }
      }
    };
  }

  // Sanitize input
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .substring(0, 1000); // Limit length
  }

  // Validate and sanitize
  validateAndSanitize(input: string, rules: ValidationRule, fieldName: string): ValidationResult {
    const sanitized = this.sanitizeInput(input);
    return this.validateField(sanitized, rules, fieldName);
  }
}
