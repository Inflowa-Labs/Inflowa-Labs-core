// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const

// Blockchain Configuration (Stellar Soroban - Mock)
export const BLOCKCHAIN_CONFIG = {
  STELLAR_NETWORK: 'testnet',
  SOROBAN_RPC_URL: process.env.SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
  CONTRACT_IDS: {
    TOKEN: process.env.TOKEN_CONTRACT_ID || '',
    EXCHANGE: process.env.EXCHANGE_CONTRACT_ID || '',
  },
} as const

// Chart Configuration
export const CHART_CONFIG = {
  DEFAULT_TIMEFRAME: '1D',
  REFRESH_INTERVAL: 30000, // 30 seconds
  ANIMATION_DURATION: 300,
  COLORS: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#10b981',
    DANGER: '#ef4444',
    WARNING: '#f59e0b',
  },
} as const

// Application Configuration
export const APP_CONFIG = {
  NAME: 'Inflowa Labs',
  VERSION: '1.0.0',
  DESCRIPTION: 'Decentralized Finance Platform',
  AUTHOR: 'Inflowa Labs Team',
  SUPPORT_EMAIL: 'support@inflowalabs.com',
} as const

// Feature Flags
export const FEATURE_FLAGS = {
  BLOCKCHAIN_INTEGRATION: process.env.NEXT_PUBLIC_ENABLE_BLOCKCHAIN === 'true',
  ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  DARK_MODE: true,
  NOTIFICATIONS: true,
} as const
