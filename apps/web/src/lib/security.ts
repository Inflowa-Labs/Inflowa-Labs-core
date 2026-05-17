/**
 * Security utilities for the Inflowa Labs platform
 * Provides input validation, sanitization, and security helpers
 */

/**
 * Validates and sanitizes email addresses
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates Stellar addresses
 */
export function validateStellarAddress(address: string): boolean {
  // Stellar addresses are 56 characters starting with 'G'
  const stellarAddressRegex = /^G[A-Z0-9]{55}$/;
  return stellarAddressRegex.test(address);
}

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates numeric input within a range
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number
): boolean {
  return !isNaN(value) && value >= min && value <= max;
}

/**
 * Validates stream rate per second (must be positive)
 */
export function validateStreamRate(rate: number): boolean {
  return validateNumberRange(rate, 0.0000001, Number.MAX_SAFE_INTEGER);
}

/**
 * Validates timestamp (must be positive and not in the past for start time)
 */
export function validateTimestamp(timestamp: number, allowPast: boolean = false): boolean {
  const now = Date.now() / 1000; // Convert to seconds
  if (!allowPast && timestamp < now) return false;
  return timestamp > 0;
}

/**
 * Rate limiting utility using in-memory storage
 * In production, use Redis or similar for distributed systems
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    let requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    requests = requests.filter(time => time > windowStart);
    
    if (requests.length >= this.maxRequests) {
      return false;
    }
    
    requests.push(now);
    this.requests.set(identifier, requests);
    
    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

// Export rate limiter instance
export const rateLimiter = new RateLimiter(60000, 100); // 100 requests per minute

/**
 * Content Security Policy builder
 */
export function buildCSP(): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://soroban-testnet.stellar.org",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ];
  
  return directives.join('; ');
}
