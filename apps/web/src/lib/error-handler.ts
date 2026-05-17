/**
 * Centralized error handling utilities
 * Provides consistent error handling across the application
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Authorization failed') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

/**
 * Error handler for API routes
 */
export function handleApiError(error: unknown): {
  error: string;
  code: string;
  details?: any;
  statusCode: number;
} {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      details: error.details,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    };
  }

  return {
    error: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  };
}

/**
 * Async error wrapper for route handlers
 */
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<any>
) {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (error) {
      const handled = handleApiError(error);
      return new Response(
        JSON.stringify(handled),
        { status: handled.statusCode, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

/**
 * Log error for debugging
 */
export function logError(error: unknown, context?: string): void {
  if (error instanceof Error) {
    console.error(`[${context || 'APP'}] Error:`, error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  } else {
    console.error(`[${context || 'APP'}] Unknown error:`, error);
  }
}
