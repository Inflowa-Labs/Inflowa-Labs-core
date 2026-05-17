/**
 * Application constants
 * Centralized constants for the application
 */

export const APP_NAME = 'Inflowa Labs';
export const APP_VERSION = '1.0.0';

export const STREAM_CATEGORIES = [
  'salary',
  'grant',
  'freelance',
  'investment',
  'rental',
  'dividend',
  'other'
] as const;

export const STREAM_STATUSES = [
  'active',
  'paused',
  'completed'
] as const;

export const ASSET_SYMBOLS = [
  'XLM',
  'USDC',
  'EURC',
  'BTC',
  'ETH'
] as const;

export const TIMEFRAMES = [
  '1d',
  '1w',
  '1m',
  '3m',
  '6m',
  '1y'
] as const;

export const NETWORKS = {
  TESTNET: 'testnet',
  MAINNET: 'mainnet'
} as const;

export const API_ENDPOINTS = {
  USERS: '/api/users',
  STREAMS: '/api/streams',
  TRANSACTIONS: '/api/transactions',
  PORTFOLIO: '/api/portfolio',
  CONTRACTS: '/api/contracts',
  BALANCE: '/api/balance',
} as const;

export const STELLAR_CONFIG = {
  TESTNET_RPC: 'https://soroban-testnet.stellar.org',
  MAINNET_RPC: 'https://soroban-mainnet.stellar.org',
  NETWORK_PASSPHRASE_TESTNET: 'Test SDF Network ; September 2015',
  NETWORK_PASSPHRASE_MAINNET: 'Public Global Stellar Network ; September 2015',
} as const;

export const RATE_LIMITS = {
  API_REQUESTS_PER_MINUTE: 100,
  STREAM_CREATIONS_PER_HOUR: 10,
  WITHDRAWALS_PER_HOUR: 20,
} as const;

export const VALIDATION_RULES = {
  MIN_STREAM_RATE: 0.0000001,
  MAX_STREAM_RATE: 1000000,
  MIN_DESCRIPTION_LENGTH: 0,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
} as const;
