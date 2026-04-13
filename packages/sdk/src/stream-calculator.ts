import type { 
  Stream, 
  StreamMetadata, 
  StreamCalculation, 
  StreamMetrics, 
  StreamSimulation,
  StreamChartDataPoint,
  StreamMetricsHistory
} from './index'

export class StreamCalculator {
  // Calculate available amount for withdrawal from a stream
  static calculateAvailable(stream: Stream, metadata?: StreamMetadata): number {
    if (stream.paused) return 0
    
    const now = Date.now() / 1000 // Current timestamp in seconds
    const startTime = stream.startTime
    const pausedAt = metadata?.pausedAt
    const resumedAt = metadata?.resumedAt
    
    let elapsedTime = 0
    
    if (pausedAt && !resumedAt) {
      // Stream was paused and never resumed
      elapsedTime = Math.floor(pausedAt - startTime)
    } else if (pausedAt && resumedAt) {
      // Stream was paused and resumed
      const firstPeriod = Math.floor(pausedAt - startTime)
      const secondPeriod = Math.floor(now - resumedAt)
      elapsedTime = firstPeriod + secondPeriod
    } else {
      // Stream never paused or was resumed
      elapsedTime = Math.floor(now - startTime)
    }
    
    const totalEarned = elapsedTime * stream.ratePerSecond
    const totalWithdrawn = metadata?.totalWithdrawn || 0
    const available = totalEarned - totalWithdrawn
    
    return Math.max(0, available)
  }
  
  // Calculate comprehensive stream metrics
  static calculateStreamMetrics(streams: Stream[]): StreamMetrics {
    const activeStreams = streams.filter(s => !s.paused)
    const totalPerSecond = activeStreams.reduce((sum, s) => sum + s.ratePerSecond, 0)
    const secondsInMonth = 30 * 24 * 60 * 60
    const secondsInYear = 365 * 24 * 60 * 60
    
    return {
      totalActiveStreams: activeStreams.length,
      totalPerSecond,
      totalMonthly: totalPerSecond * secondsInMonth,
      totalYearly: totalPerSecond * secondsInYear,
      averageRate: activeStreams.length > 0 ? totalPerSecond / activeStreams.length : 0
    }
  }
  
  // Calculate detailed stream information
  static calculateStreamDetails(stream: Stream, metadata?: StreamMetadata): StreamCalculation {
    const available = this.calculateAvailable(stream, metadata)
    const now = Date.now() / 1000
    const startTime = stream.startTime
    const elapsedTime = Math.floor(now - startTime)
    const totalEarned = elapsedTime * stream.ratePerSecond
    
    const secondsInMonth = 30 * 24 * 60 * 60
    const secondsInYear = 365 * 24 * 60 * 60
    
    return {
      streamId: stream.id,
      availableAmount: available,
      totalEarned,
      elapsedTime,
      currentRate: stream.ratePerSecond,
      projectedMonthly: stream.ratePerSecond * secondsInMonth,
      projectedYearly: stream.ratePerSecond * secondsInYear
    }
  }
  
  // Simulate future income for a stream
  static simulateStreamIncome(
    stream: Stream, 
    timeframe: '1d' | '1w' | '1m' | '3m' | '6m' | '1y'
  ): StreamSimulation {
    const now = Date.now() / 1000
    const timeframeSeconds = this.getTimeframeSeconds(timeframe)
    
    const dataPoints: StreamChartDataPoint[] = []
    const interval = Math.max(1, Math.floor(timeframeSeconds / 100)) // 100 data points max
    
    for (let i = 0; i <= 100; i++) {
      const timestamp = new Date((now + i * interval) * 1000)
      const cumulativeValue = i * interval * stream.ratePerSecond
      
      dataPoints.push({
        timestamp: timestamp.toISOString(),
        value: cumulativeValue,
        streamId: stream.id,
        cumulative: true
      })
    }
    
    const projectedIncome = timeframeSeconds * stream.ratePerSecond
    
    return {
      streamId: stream.id,
      timeframe,
      projectedIncome,
      dataPoints
    }
  }
  
  // Simulate combined income from multiple streams
  static simulateCombinedIncome(
    streams: Stream[], 
    timeframe: '1d' | '1w' | '1m' | '3m' | '6m' | '1y'
  ): StreamChartDataPoint[] {
    const now = Date.now() / 1000
    const timeframeSeconds = this.getTimeframeSeconds(timeframe)
    const interval = Math.max(1, Math.floor(timeframeSeconds / 100))
    
    const combinedData: StreamChartDataPoint[] = []
    
    for (let i = 0; i <= 100; i++) {
      const timestamp = new Date((now + i * interval) * 1000)
      let totalValue = 0
      
      streams.forEach(stream => {
        if (!stream.paused) {
          totalValue += i * interval * stream.ratePerSecond
        }
      })
      
      combinedData.push({
        timestamp: timestamp.toISOString(),
        value: totalValue,
        cumulative: true
      })
    }
    
    return combinedData
  }
  
  // Get historical metrics for charting
  static generateHistoricalMetrics(
    streams: Stream[],
    metadatas: StreamMetadata[],
    days: number = 30
  ): StreamMetricsHistory[] {
    const history: StreamMetricsHistory[] = []
    const now = Date.now() / 1000
    
    for (let i = days; i >= 0; i--) {
      const timestamp = now - i * 24 * 60 * 60
      
      // Simulate historical state (in real app, this would come from database)
      const activeStreams = streams.filter(s => {
        // For demo purposes, assume we have metadata for each stream
        const streamCreated = s.startTime <= timestamp
        // In a real app, we would look up metadata by stream.id
        const streamPaused = false // Simplified for demo
        const streamResumed = false // Simplified for demo
        
        return streamCreated && !s.paused && !streamPaused
      })
      
      const totalPerSecond = activeStreams.reduce((sum, s) => sum + s.ratePerSecond, 0)
      
      history.push({
        timestamp: new Date(timestamp * 1000).toISOString(),
        totalPerSecond,
        activeStreams: activeStreams.length,
        totalVolume: totalPerSecond * 24 * 60 * 60 // Daily volume
      })
    }
    
    return history
  }
  
  // Helper method to get seconds for timeframe
  private static getTimeframeSeconds(timeframe: '1d' | '1w' | '1m' | '3m' | '6m' | '1y'): number {
    const multipliers = {
      '1d': 1,
      '1w': 7,
      '1m': 30,
      '3m': 90,
      '6m': 180,
      '1y': 365
    }
    
    return multipliers[timeframe] * 24 * 60 * 60
  }
  
  // Format rate for display
  static formatRate(ratePerSecond: number): string {
    const perMinute = ratePerSecond * 60
    const perHour = ratePerSecond * 60 * 60
    const perDay = ratePerSecond * 24 * 60 * 60
    
    if (perDay >= 1) {
      return `$${perDay.toFixed(2)}/day`
    } else if (perHour >= 1) {
      return `$${perHour.toFixed(2)}/hour`
    } else if (perMinute >= 1) {
      return `$${perMinute.toFixed(2)}/minute`
    } else {
      return `$${ratePerSecond.toFixed(6)}/second`
    }
  }
  
  // Calculate time until next milestone
  static calculateTimeToMilestone(
    stream: Stream, 
    targetAmount: number,
    metadata?: StreamMetadata
  ): { days: number; hours: number; minutes: number } | null {
    if (stream.paused || stream.ratePerSecond <= 0) return null
    
    const available = this.calculateAvailable(stream, metadata)
    const remaining = targetAmount - available
    
    if (remaining <= 0) {
      return { days: 0, hours: 0, minutes: 0 }
    }
    
    const secondsNeeded = Math.ceil(remaining / stream.ratePerSecond)
    const days = Math.floor(secondsNeeded / (24 * 60 * 60))
    const hours = Math.floor((secondsNeeded % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((secondsNeeded % (60 * 60)) / 60)
    
    return { days, hours, minutes }
  }
}
