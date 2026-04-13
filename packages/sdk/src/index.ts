// User types
export interface User {
  id: string
  email: string
  name: string
  address: string // Stellar address
  createdAt: string
  updatedAt: string
}

// Core Stream data model
export type Stream = {
  id: string;
  sender: string;
  recipient: string;
  ratePerSecond: number;
  startTime: number;
  endTime?: number;
  paused: boolean;
};

// Extended stream metadata (optional additional fields)
export interface StreamMetadata {
  asset: string // Asset symbol or address
  totalWithdrawn: number
  pausedAt?: number
  resumedAt?: number
  description?: string
  category: StreamCategory
}

export type StreamCategory = 
  | 'salary'
  | 'grant'
  | 'freelance'
  | 'investment'
  | 'rental'
  | 'dividend'
  | 'other'

export interface StreamCalculation {
  streamId: string
  availableAmount: number
  totalEarned: number
  elapsedTime: number // in seconds
  currentRate: number // per second
  projectedMonthly: number
  projectedYearly: number
}

export interface StreamMetrics {
  totalActiveStreams: number
  totalPerSecond: number
  totalMonthly: number
  totalYearly: number
  averageRate: number
}

// Transaction types (stream withdrawals)
export interface StreamTransaction {
  id: string
  streamId: string
  amount: number
  timestamp: string
  type: 'withdrawal' | 'deposit'
  status: 'completed' | 'pending' | 'failed'
  txHash?: string
}

// Chart data types
export interface StreamChartDataPoint {
  timestamp: string
  value: number
  streamId?: string
  cumulative?: boolean
}

export interface StreamMetricsHistory {
  timestamp: string
  totalPerSecond: number
  activeStreams: number
  totalVolume: number
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  hasNext: boolean
  hasPrev: boolean
}

// Blockchain types (Stellar Soroban integration)
export interface BlockchainTransaction {
  id: string
  hash: string
  from: string
  to: string
  amount: string
  asset: string
  timestamp: string
  status: 'pending' | 'completed' | 'failed'
}

export interface ContractInfo {
  address: string
  name: string
  network: 'testnet' | 'mainnet'
  deployedAt: string
}

// Stream creation request
export interface CreateStreamRequest {
  from: string
  to: string
  amountPerSecond: number
  asset: string
  description?: string
  category: StreamCategory
}

// Stream simulation for projections
export interface StreamSimulation {
  streamId: string
  timeframe: '1d' | '1w' | '1m' | '3m' | '6m' | '1y'
  projectedIncome: number
  dataPoints: StreamChartDataPoint[]
}

// Export stream service (mock SDK)
export { StreamService, streamService } from './streamService'

// Export stream engine (core business logic)
export { StreamEngine } from './stream-engine'

// Export stream calculator and mock data
export { StreamCalculator } from './stream-calculator'
export { 
  mockUsers, 
  mockStreams, 
  mockStreamMetadata,
  mockStreamTransactions, 
  mockContractInfo,
  generateMockStream,
  generateMockUserStreams,
  generateUserTransactions 
} from './mock-data'
