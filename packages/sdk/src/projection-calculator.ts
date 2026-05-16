import { Stream, StreamCalculation } from './index'

export interface ProjectionResult {
  timeframe: '1d' | '1w' | '1m' | '3m' | '6m' | '1y'
  projectedIncome: number
  dataPoints: Array<{
    timestamp: number
    projectedAmount: number
    cumulativeAmount: number
  }>
}

export interface ProjectionParameters {
  ratePerSecond: number
  startTime: number
  endTime?: number
  includePauses?: boolean
  pauseSchedule?: Array<{
    start: number
    end: number
  }>
}

export class ProjectionCalculator {
  /**
   * Calculate projected income for a stream over a given timeframe
   */
  static calculateProjection(
    stream: Stream,
    timeframe: ProjectionResult['timeframe']
  ): ProjectionResult {
    const now = Date.now()
    const startTime = stream.startTime
    const ratePerSecond = stream.ratePerSecond
    
    const secondsInTimeframe = this.getSecondsInTimeframe(timeframe)
    const endTime = Math.min(now + secondsInTimeframe * 1000, stream.endTime || Infinity)
    
    const dataPoints: ProjectionResult['dataPoints'] = []
    const interval = Math.max(1, Math.floor(secondsInTimeframe / 100)) // 100 data points
    
    let cumulativeAmount = 0
    
    for (let i = 0; i <= 100; i++) {
      const timestamp = now + (i * interval * 1000)
      if (timestamp > endTime) break
      
      const elapsedSeconds = (timestamp - startTime) / 1000
      const projectedAmount = elapsedSeconds * ratePerSecond
      cumulativeAmount = projectedAmount
      
      dataPoints.push({
        timestamp,
        projectedAmount,
        cumulativeAmount,
      })
    }
    
    const projectedIncome = cumulativeAmount
    
    return {
      timeframe,
      projectedIncome,
      dataPoints,
    }
  }
  
  /**
   * Calculate projections for multiple streams combined
   */
  static calculateCombinedProjection(
    streams: Stream[],
    timeframe: ProjectionResult['timeframe']
  ): ProjectionResult {
    const projections = streams.map(stream => 
      this.calculateProjection(stream, timeframe)
    )
    
    const combinedDataPoints: ProjectionResult['dataPoints'] = []
    const maxLength = Math.max(...projections.map(p => p.dataPoints.length))
    
    for (let i = 0; i < maxLength; i++) {
      const timestamp = projections[0]?.dataPoints[i]?.timestamp || Date.now()
      const combinedProjectedAmount = projections.reduce(
        (sum, proj) => sum + (proj.dataPoints[i]?.projectedAmount || 0),
        0
      )
      const combinedCumulativeAmount = projections.reduce(
        (sum, proj) => sum + (proj.dataPoints[i]?.cumulativeAmount || 0),
        0
      )
      
      combinedDataPoints.push({
        timestamp,
        projectedAmount: combinedProjectedAmount,
        cumulativeAmount: combinedCumulativeAmount,
      })
    }
    
    const projectedIncome = combinedDataPoints[combinedDataPoints.length - 1]?.cumulativeAmount || 0
    
    return {
      timeframe,
      projectedIncome,
      dataPoints: combinedDataPoints,
    }
  }
  
  /**
   * Calculate when a stream will reach a target amount
   */
  static calculateTimeToTarget(
    stream: Stream,
    targetAmount: number
  ): { seconds: number; date: Date; reachable: boolean } {
    const ratePerSecond = stream.ratePerSecond
    
    if (ratePerSecond <= 0) {
      return { seconds: Infinity, date: new Date(Infinity), reachable: false }
    }
    
    const seconds = targetAmount / ratePerSecond
    const targetDate = new Date(Date.now() + seconds * 1000)
    
    // Check if stream ends before reaching target
    if (stream.endTime && targetDate.getTime() > stream.endTime) {
      return { seconds: Infinity, date: new Date(Infinity), reachable: false }
    }
    
    return { seconds, date: targetDate, reachable: true }
  }
  
  /**
   * Calculate required rate to reach target in timeframe
   */
  static calculateRequiredRate(
    targetAmount: number,
    timeframe: ProjectionResult['timeframe']
  ): { ratePerSecond: number; ratePerHour: number; ratePerDay: number; ratePerMonth: number } {
    const seconds = this.getSecondsInTimeframe(timeframe)
    const ratePerSecond = targetAmount / seconds
    
    return {
      ratePerSecond,
      ratePerHour: ratePerSecond * 3600,
      ratePerDay: ratePerSecond * 86400,
      ratePerMonth: ratePerSecond * 2592000, // 30 days
    }
  }
  
  /**
   * Compare two streams and return analysis
   */
  static compareStreams(stream1: Stream, stream2: Stream): {
    moreProfitable: Stream
    difference: number
    percentageDifference: number
    recommendation: string
  } {
    const rate1 = stream1.ratePerSecond
    const rate2 = stream2.ratePerSecond
    
    const moreProfitable = rate1 > rate2 ? stream1 : stream2
    const difference = Math.abs(rate1 - rate2)
    const percentageDifference = (difference / Math.min(rate1, rate2)) * 100
    
    let recommendation = ''
    if (percentageDifference > 50) {
      recommendation = 'Significant difference - consider focusing on the more profitable stream'
    } else if (percentageDifference > 20) {
      recommendation = 'Moderate difference - both streams are viable'
    } else {
      recommendation = 'Similar rates - both streams perform equally well'
    }
    
    return {
      moreProfitable,
      difference,
      percentageDifference,
      recommendation,
    }
  }
  
  /**
   * Calculate optimal stream allocation for multiple targets
   */
  static calculateOptimalAllocation(
    streams: Stream[],
    targets: Array<{ amount: number; priority: number }>
  ): Array<{ streamId: string; allocation: number }> {
    // Sort streams by rate (highest first)
    const sortedStreams = [...streams].sort((a, b) => b.ratePerSecond - a.ratePerSecond)
    // Sort targets by priority (highest first)
    const sortedTargets = [...targets].sort((a, b) => b.priority - a.priority)
    
    const allocations: Array<{ streamId: string; allocation: number }> = []
    
    for (const target of sortedTargets) {
      let remainingAmount = target.amount
      
      for (const stream of sortedStreams) {
        if (remainingAmount <= 0) break
        
        const streamCapacity = stream.ratePerSecond * 86400 // Daily capacity
        const allocation = Math.min(remainingAmount, streamCapacity)
        
        allocations.push({
          streamId: stream.id,
          allocation,
        })
        
        remainingAmount -= allocation
      }
    }
    
    return allocations
  }
  
  private static getSecondsInTimeframe(timeframe: ProjectionResult['timeframe']): number {
    const timeframes = {
      '1d': 86400,      // 24 hours
      '1w': 604800,     // 7 days
      '1m': 2592000,    // 30 days
      '3m': 7776000,    // 90 days
      '6m': 15552000,   // 180 days
      '1y': 31536000,   // 365 days
    }
    
    return timeframes[timeframe]
  }
}
