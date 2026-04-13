import type { 
  Stream, 
  StreamMetadata,
  User, 
  StreamTransaction,
  StreamCategory 
} from './index'

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    address: 'GABCDEF1234567890ABCDEF1234567890ABCDEF12',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'bob@example.com',
    name: 'Bob Smith',
    address: 'G1234567890ABCDEF1234567890ABCDEF12345678',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  }
]

export const mockStreams: Stream[] = [
  {
    id: '1',
    sender: 'GABCDEF1234567890ABCDEF1234567890ABCDEF12',
    recipient: 'G1234567890ABCDEF1234567890ABCDEF12345678',
    ratePerSecond: 0.00011574, // ~$10/day
    startTime: Math.floor(new Date('2024-01-01T00:00:00Z').getTime() / 1000),
    paused: false
  },
  {
    id: '2',
    sender: 'GXYZ1234567890ABCDEF1234567890ABCDEF123456',
    recipient: 'G1234567890ABCDEF1234567890ABCDEF12345678',
    ratePerSecond: 0.00002315, // ~$2/day
    startTime: Math.floor(new Date('2024-01-05T00:00:00Z').getTime() / 1000),
    paused: false
  },
  {
    id: '3',
    sender: 'GDEF4567890ABCDEF1234567890ABCDEF123456789',
    recipient: 'G1234567890ABCDEF1234567890ABCDEF12345678',
    ratePerSecond: 0.00005787, // ~$5/day
    startTime: Math.floor(new Date('2024-01-10T00:00:00Z').getTime() / 1000),
    paused: true
  },
  {
    id: '4',
    sender: 'G7890ABCDEF1234567890ABCDEF1234567890ABCD',
    recipient: 'G1234567890ABCDEF1234567890ABCDEF12345678',
    ratePerSecond: 0.00001157, // ~$1/day
    startTime: Math.floor(new Date('2024-01-12T00:00:00Z').getTime() / 1000),
    paused: false
  }
]

export const mockStreamMetadata: StreamMetadata[] = [
  {
    asset: 'USDC',
    totalWithdrawn: 0,
    description: 'Monthly salary payment',
    category: 'salary'
  },
  {
    asset: 'USDC',
    totalWithdrawn: 150.50,
    description: 'Grant funding',
    category: 'grant'
  },
  {
    asset: 'USDC',
    totalWithdrawn: 75.25,
    pausedAt: Math.floor(new Date('2024-01-15T12:00:00Z').getTime() / 1000),
    description: 'Freelance project payment',
    category: 'freelance'
  },
  {
    asset: 'USDC',
    totalWithdrawn: 25.00,
    description: 'Investment returns',
    category: 'investment'
  }
]

export const mockStreamTransactions: StreamTransaction[] = [
  {
    id: '1',
    streamId: '2',
    amount: 150.50,
    timestamp: '2024-01-20T10:30:00Z',
    type: 'withdrawal',
    status: 'completed',
    txHash: '0x1234567890abcdef1234567890abcdef12345678'
  },
  {
    id: '2',
    streamId: '3',
    amount: 75.25,
    timestamp: '2024-01-15T14:20:00Z',
    type: 'withdrawal',
    status: 'completed',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef12'
  },
  {
    id: '3',
    streamId: '4',
    amount: 25.00,
    timestamp: '2024-01-18T09:15:00Z',
    type: 'withdrawal',
    status: 'completed',
    txHash: '0x7890abcdef1234567890abcdef1234567890abcdef'
  }
]

// Mock blockchain contract info
export const mockContractInfo = {
  address: 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZSW75ENI6XGUYJ3E2K2V7M4JQND',
  name: 'Inflowa Stream Contract',
  network: 'testnet' as const,
  deployedAt: '2024-01-01T00:00:00Z'
}

// Helper functions for generating mock data
export function generateMockStream(
  sender: string,
  recipient: string,
  amountPerDay: number,
  asset: string = 'USDC',
  category: StreamCategory = 'other',
  description?: string
): { stream: Stream; metadata: StreamMetadata } {
  return {
    stream: {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      recipient,
      ratePerSecond: amountPerDay / (24 * 60 * 60),
      startTime: Math.floor(Date.now() / 1000),
      paused: false
    },
    metadata: {
      asset,
      totalWithdrawn: 0,
      description,
      category
    }
  }
}

export function generateMockUserStreams(userId: string): Stream[] {
  const user = mockUsers.find(u => u.id === userId)
  if (!user) return []
  
  return mockStreams.filter(stream => stream.recipient === user.address)
}

export function generateUserTransactions(userId: string): StreamTransaction[] {
  const user = mockUsers.find(u => u.id === userId)
  if (!user) return []
  
  const userStreams = generateMockUserStreams(userId)
  const streamIds = userStreams.map(s => s.id)
  
  return mockStreamTransactions.filter(tx => streamIds.indexOf(tx.streamId) !== -1)
}
