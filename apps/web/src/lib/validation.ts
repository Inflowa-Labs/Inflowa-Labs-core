/**
 * Input validation schemas and utilities
 * Provides type-safe validation for API inputs
 */

import { validateEmail, validateStellarAddress, validateStreamRate, validateTimestamp } from './security';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class Validator {
  static validateCreateStreamRequest(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data.from || !validateStellarAddress(data.from)) {
      errors.push('Invalid sender address');
    }

    if (!data.to || !validateStellarAddress(data.to)) {
      errors.push('Invalid recipient address');
    }

    if (!data.amountPerSecond || !validateStreamRate(data.amountPerSecond)) {
      errors.push('Invalid stream rate');
    }

    if (!data.asset || typeof data.asset !== 'string') {
      errors.push('Invalid asset');
    }

    if (!data.category || !['salary', 'grant', 'freelance', 'investment', 'rental', 'dividend', 'other'].includes(data.category)) {
      errors.push('Invalid stream category');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static validateUserUpdate(data: any): ValidationResult {
    const errors: string[] = [];

    if (data.email && !validateEmail(data.email)) {
      errors.push('Invalid email address');
    }

    if (data.name && typeof data.name !== 'string') {
      errors.push('Invalid name');
    }

    if (data.address && !validateStellarAddress(data.address)) {
      errors.push('Invalid Stellar address');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static validateStreamFilter(data: any): ValidationResult {
    const errors: string[] = [];

    if (data.category && !['salary', 'grant', 'freelance', 'investment', 'rental', 'dividend', 'other'].includes(data.category)) {
      errors.push('Invalid filter category');
    }

    if (data.status && !['active', 'paused', 'completed'].includes(data.status)) {
      errors.push('Invalid filter status');
    }

    if (data.minRate && (isNaN(data.minRate) || data.minRate < 0)) {
      errors.push('Invalid minimum rate');
    }

    if (data.maxRate && (isNaN(data.maxRate) || data.maxRate < 0)) {
      errors.push('Invalid maximum rate');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static validateSimulationParams(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data.timeframe || !['1d', '1w', '1m', '3m', '6m', '1y'].includes(data.timeframe)) {
      errors.push('Invalid simulation timeframe');
    }

    if (data.streamIds && !Array.isArray(data.streamIds)) {
      errors.push('Stream IDs must be an array');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
