import type { Stream, StreamMetadata } from './index'
import { StreamEngine } from './stream-engine'

// Mock in-memory storage (structured like blockchain data)
interface StreamStore {
  streams: Map<string, Stream>
  metadata: Map<string, StreamMetadata>
  userStreams: Map<string, string[]> // userId -> streamId[]
}

// Initialize mock store with sample data
const mockStore: StreamStore = {
  streams: new Map(),
  metadata: new Map(),
  userStreams: new Map()
}

// Initialize with mock data
function initializeMockStore() {
  // Sample streams
  const sampleStreams: Stream[] = [
    {
      id: 'stream_1',
      sender: 'GABCDEF1234567890ABCDEF1234567890ABCDEF12',
      recipient: 'G1234567890ABCDEF1234567890ABCDEF12345678',
      ratePerSecond: 0.00011574, // ~$10/day
      startTime: Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60), // Started 7 days ago
      paused: false
    },
    {
      id: 'stream_2', 
      sender: 'GXYZ1234567890ABCDEF1234567890ABCDEF123456',
      recipient: 'G1234567890ABCDEF1234567890ABCDEF12345678',
      ratePerSecond: 0.00002315, // ~$2/day
      startTime: Math.floor(Date.now() / 1000) - (3 * 24 * 60 * 60), // Started 3 days ago
      paused: false
    },
    {
      id: 'stream_3',
      sender: 'GDEF4567890ABCDEF1234567890ABCDEF123456789',
      recipient: 'G1234567890ABCDEF1234567890ABCDEF12345678',
      ratePerSecond: 0.00005787, // ~$5/day
      startTime: Math.floor(Date.now() / 1000) - (5 * 24 * 60 * 60), // Started 5 days ago
      paused: true
    }
  ]

  // Sample metadata
  const sampleMetadata: StreamMetadata[] = [
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
      pausedAt: Math.floor(Date.now() / 1000) - (2 * 24 * 60 * 60), // Paused 2 days ago
      description: 'Freelance project payment',
      category: 'freelance'
    }
  ]

  // Populate store
  sampleStreams.forEach(stream => {
    mockStore.streams.set(stream.id, stream)
  })

  sampleMetadata.forEach((metadata, index) => {
    const streamId = `stream_${index + 1}`
    mockStore.metadata.set(streamId, metadata)
  })

  // Set up user-stream relationships
  mockStore.userStreams.set('user_1', ['stream_1', 'stream_2', 'stream_3'])
  mockStore.userStreams.set('user_2', ['stream_1'])
}

// Initialize store on module load
initializeMockStore()

/**
 * Mock Stream Service
 * Structured like a blockchain SDK but uses in-memory storage
 */
export class StreamService {
  /**
   * Create a new stream
   * In real implementation: Call Stellar contract
   */
  static async createStream(streamData: Omit<Stream, 'id'>): Promise<Stream> {
    // Validate input
    if (!streamData.sender || !streamData.recipient) {
      throw new Error('Sender and recipient addresses are required')
    }
    if (streamData.ratePerSecond <= 0) {
      throw new Error('Rate per second must be positive')
    }
    if (streamData.startTime <= 0) {
      throw new Error('Start time must be valid')
    }

    // Generate unique stream ID (like transaction hash)
    const streamId = `stream_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    
    const stream: Stream = {
      ...streamData,
      id: streamId
    }

    // Store in memory (mock blockchain)
    mockStore.streams.set(streamId, stream)
    
    // Add to user's stream list
    const userStreams = mockStore.userStreams.get(streamData.recipient) || []
    userStreams.push(streamId)
    mockStore.userStreams.set(streamData.recipient, userStreams)

    // In real implementation: 
    // - Submit transaction to Stellar
    // - Wait for confirmation
    // - Return transaction receipt
    
    return stream
  }

  /**
   * Pause an active stream
   * In real implementation: Call contract pause function
   */
  static async pauseStream(streamId: string): Promise<Stream> {
    // Validate stream ID
    if (!streamId || streamId.trim() === '') {
      throw new Error('Stream ID is required')
    }

    const stream = mockStore.streams.get(streamId)
    if (!stream) {
      throw new Error(`Stream ${streamId} not found`)
    }

    if (stream.paused) {
      throw new Error(`Stream ${streamId} is already paused`)
    }

    // Update stream state
    const pausedStream: Stream = {
      ...stream,
      paused: true
    }

    // Update metadata with pause time
    const metadata = mockStore.metadata.get(streamId)
    if (metadata) {
      const updatedMetadata: StreamMetadata = {
        ...metadata,
        pausedAt: Math.floor(Date.now() / 1000)
      }
      mockStore.metadata.set(streamId, updatedMetadata)
    }

    mockStore.streams.set(streamId, pausedStream)

    // In real implementation:
    // - Submit pause transaction to Stellar
    // - Wait for confirmation
    // - Update local state

    return pausedStream
  }

  /**
   * Resume a paused stream
   * In real implementation: Call contract resume function
   */
  static async resumeStream(streamId: string): Promise<Stream> {
    // Validate stream ID
    if (!streamId || streamId.trim() === '') {
      throw new Error('Stream ID is required')
    }

    const stream = mockStore.streams.get(streamId)
    if (!stream) {
      throw new Error(`Stream ${streamId} not found`)
    }

    if (!stream.paused) {
      throw new Error(`Stream ${streamId} is not paused`)
    }

    // Update stream state
    const resumedStream: Stream = {
      ...stream,
      paused: false
    }

    // Update metadata with resume time
    const metadata = mockStore.metadata.get(streamId)
    if (metadata) {
      const updatedMetadata: StreamMetadata = {
        ...metadata,
        resumedAt: Math.floor(Date.now() / 1000)
      }
      mockStore.metadata.set(streamId, updatedMetadata)
    }

    mockStore.streams.set(streamId, resumedStream)

    // In real implementation:
    // - Submit resume transaction to Stellar
    // - Wait for confirmation
    // - Update local state

    return resumedStream
  }

  /**
   * Get all streams for a user
   * In real implementation: Query blockchain for user's streams
   */
  static async getStreams(userId: string): Promise<Stream[]> {
    const streamIds = mockStore.userStreams.get(userId) || []
    const streams: Stream[] = []

    for (const streamId of streamIds) {
      const stream = mockStore.streams.get(streamId)
      if (stream) {
        streams.push(stream)
      }
    }

    // In real implementation:
    // - Query contract for streams where recipient = userId
    // - Or query index/registry contract
    // - Handle pagination for large datasets

    return streams
  }

  /**
   * Calculate earnings for a stream
   * In real implementation: Use contract state + off-chain calculation
   */
  static calculateEarnings(stream: Stream, currentTime?: number): number {
    const now = currentTime || Math.floor(Date.now() / 1000)
    return StreamEngine.calculateStreamEarnings(stream, now)
  }

  /**
   * Get detailed stream information including metadata
   */
  static async getStreamDetails(streamId: string): Promise<{
    stream: Stream
    metadata?: StreamMetadata
    earnings: number
    availableForWithdrawal: number
  }> {
    const stream = mockStore.streams.get(streamId)
    if (!stream) {
      throw new Error(`Stream ${streamId} not found`)
    }

    const metadata = mockStore.metadata.get(streamId)
    const earnings = this.calculateEarnings(stream)
    const availableForWithdrawal = metadata 
      ? earnings - metadata.totalWithdrawn 
      : earnings

    return {
      stream,
      metadata,
      earnings,
      availableForWithdrawal: Math.max(0, availableForWithdrawal)
    }
  }

  /**
   * Get all streams with their current earnings
   */
  static async getStreamsEarnings(userId: string): Promise<Array<{
    stream: Stream
    metadata?: StreamMetadata
    earnings: number
    availableForWithdrawal: number
  }>> {
    const streams = await this.getStreams(userId)
    const results = []

    for (const stream of streams) {
      const details = await this.getStreamDetails(stream.id)
      results.push(details)
    }

    return results
  }

  /**
   * Mock withdrawal function
   * In real implementation: Call contract withdraw function
   */
  static async withdrawFromStream(
    streamId: string, 
    amount: number
  ): Promise<{ success: boolean; txHash?: string }> {
    // Validate inputs
    if (!streamId || streamId.trim() === '') {
      throw new Error('Stream ID is required')
    }
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive')
    }

    const stream = mockStore.streams.get(streamId)
    if (!stream) {
      throw new Error(`Stream ${streamId} not found`)
    }

    const metadata = mockStore.metadata.get(streamId)
    const earnings = this.calculateEarnings(stream)
    const available = metadata ? earnings - metadata.totalWithdrawn : earnings

    if (amount > available) {
      throw new Error('Insufficient available amount')
    }

    // Update metadata with new withdrawal total
    if (metadata) {
      const updatedMetadata: StreamMetadata = {
        ...metadata,
        totalWithdrawn: metadata.totalWithdrawn + amount
      }
      mockStore.metadata.set(streamId, updatedMetadata)
    }

    // Generate mock transaction hash
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`

    // In real implementation:
    // - Submit withdrawal transaction to Stellar
    // - Wait for confirmation
    // - Update local state
    // - Return transaction hash

    return { success: true, txHash }
  }

  /**
   * Get mock contract info
   */
  static getContractInfo() {
    return {
      address: 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZSW75ENI6XGUYJ3E2K2V7M4JQND',
      network: 'testnet' as const,
      name: 'Inflowa Stream Contract'
    }
  }
}

// Export singleton instance for easy usage
export const streamService = StreamService
