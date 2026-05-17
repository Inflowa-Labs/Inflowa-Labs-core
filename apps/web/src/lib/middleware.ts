/**
 * Middleware utilities for API routes
 * Provides request/response middleware for authentication, rate limiting, etc.
 */

import { authService } from './auth';
import { rateLimiter } from './security';
import { AuthenticationError, RateLimitError } from './error-handler';
import { logger } from './logger';

export interface MiddlewareContext {
  request: Request;
  params?: Record<string, string>;
}

export type MiddlewareFunction = (
  context: MiddlewareContext,
  next: () => Promise<Response>
) => Promise<Response>;

/**
 * Authentication middleware
 */
export const authMiddleware: MiddlewareFunction = async (context, next) => {
  const token = context.request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new AuthenticationError('No authentication token provided');
  }

  const session = authService.getSession();
  if (!session || session.user.token !== token) {
    throw new AuthenticationError('Invalid or expired token');
  }

  return next();
};

/**
 * Rate limiting middleware
 */
export const rateLimitMiddleware: MiddlewareFunction = async (context, next) => {
  const identifier = context.request.headers.get('X-Forwarded-For') || 
                     context.request.headers.get('X-Real-IP') || 
                     'unknown';

  if (!rateLimiter.isAllowed(identifier)) {
    throw new RateLimitError('Too many requests');
  }

  return next();
};

/**
 * Logging middleware
 */
export const loggingMiddleware: MiddlewareFunction = async (context, next) => {
  const start = Date.now();
  const url = context.request.url;
  const method = context.request.method;

  logger.info(`${method} ${url}`, 'REQUEST');

  try {
    const response = await next();
    const duration = Date.now() - start;
    logger.info(`${method} ${url} - ${response.status} (${duration}ms)`, 'RESPONSE');
    return response;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`${method} ${url} - Error (${duration}ms)`, 'ERROR', error);
    throw error;
  }
};

/**
 * CORS middleware
 */
export const corsMiddleware: MiddlewareFunction = async (context, next) => {
  const origin = context.request.headers.get('Origin') || '*';
  
  const response = await next();
  
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
};

/**
 * Compose multiple middleware functions
 */
export function composeMiddleware(...middlewares: MiddlewareFunction[]): MiddlewareFunction {
  return async (context: MiddlewareContext, next: () => Promise<Response>) => {
    let index = -1;

    const dispatch = (i: number): Promise<Response> => {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }
      index = i;

      const fn = middlewares[i];
      if (!fn) {
        return next();
      }

      return fn(context, () => dispatch(i + 1));
    };

    return dispatch(0);
  };
};
