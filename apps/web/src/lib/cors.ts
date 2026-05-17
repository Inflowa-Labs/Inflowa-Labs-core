/**
 * CORS configuration utilities
 * Provides CORS configuration for API routes
 */

export interface CorsConfig {
  origin: string | string[] | ((origin: string) => boolean);
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

export const defaultCorsConfig: CorsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://inflowalabs.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string, config: CorsConfig): boolean {
  if (typeof config.origin === 'function') {
    return config.origin(origin);
  }

  if (Array.isArray(config.origin)) {
    return config.origin.includes(origin);
  }

  return config.origin === origin;
}

/**
 * Get CORS headers for response
 */
export function getCorsHeaders(origin: string, config: CorsConfig = defaultCorsConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': config.methods.join(', '),
    'Access-Control-Allow-Headers': config.allowedHeaders.join(', '),
    'Access-Control-Max-Age': config.maxAge.toString(),
  };

  if (isOriginAllowed(origin, config)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  if (config.credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return headers;
}

/**
 * Handle preflight request
 */
export function handlePreflightRequest(origin: string, config: CorsConfig = defaultCorsConfig): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin, config),
  });
}
