/**
 * Environment variable validation
 * Ensures all required environment variables are present and valid
 */

export interface EnvConfig {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_ENABLE_BLOCKCHAIN: string;
  NODE_ENV: string;
}

const requiredEnvVars: (keyof EnvConfig)[] = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_ENABLE_BLOCKCHAIN',
];

export function validateEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }

  // Validate specific formats
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      new URL(process.env.NEXT_PUBLIC_API_URL);
    } catch {
      errors.push('NEXT_PUBLIC_API_URL must be a valid URL');
    }
  }

  if (process.env.NEXT_PUBLIC_ENABLE_BLOCKCHAIN) {
    if (!['true', 'false'].includes(process.env.NEXT_PUBLIC_ENABLE_BLOCKCHAIN.toLowerCase())) {
      errors.push('NEXT_PUBLIC_ENABLE_BLOCKCHAIN must be "true" or "false"');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getEnv(): EnvConfig {
  const validation = validateEnv();
  if (!validation.valid) {
    throw new Error(`Environment validation failed: ${validation.errors.join(', ')}`);
  }

  return {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
    NEXT_PUBLIC_ENABLE_BLOCKCHAIN: process.env.NEXT_PUBLIC_ENABLE_BLOCKCHAIN!,
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}
