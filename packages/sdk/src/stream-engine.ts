import type { Stream } from './index'

/**
 * Core business logic for stream earnings calculation
 * This is the fundamental stream engine that powers the entire system
 */

export function calculateStreamEarnings(stream: Stream, currentTime: number): number {
  // Rule 1: If stream is paused, earnings do NOT increase
  if (stream.paused) {
    return 0
  }
  
  // Rule 2: If stream has ended, stop at endTime
  if (stream.endTime && currentTime >= stream.endTime) {
    const activeTime = stream.endTime - stream.startTime
    return stream.ratePerSecond * activeTime
  }
  
  // Rule 3: Calculate earnings for active stream
  if (currentTime <= stream.startTime) {
    // Stream hasn't started yet
    return 0
  }
  
  const elapsedTime = currentTime - stream.startTime
  return stream.ratePerSecond * elapsedTime
}

/**
 * Calculate available amount for withdrawal
 * This accounts for any previously withdrawn amounts
 */
export function calculateAvailableForWithdrawal(
  stream: Stream, 
  currentTime: number, 
  totalWithdrawn: number = 0
): number {
  const totalEarned = calculateStreamEarnings(stream, currentTime)
  return Math.max(0, totalEarned - totalWithdrawn)
}

/**
 * Check if a stream is currently active
 */
export function isStreamActive(stream: Stream, currentTime: number): boolean {
  if (stream.paused) return false
  if (currentTime < stream.startTime) return false
  if (stream.endTime && currentTime >= stream.endTime) return false
  return true
}

/**
 * Get stream status information
 */
export function getStreamStatus(stream: Stream, currentTime: number): {
  status: 'pending' | 'active' | 'paused' | 'ended'
  earnings: number
  availableForWithdrawal: number
} {
  const earnings = calculateStreamEarnings(stream, currentTime)
  
  let status: 'pending' | 'active' | 'paused' | 'ended'
  
  if (stream.paused) {
    status = 'paused'
  } else if (currentTime < stream.startTime) {
    status = 'pending'
  } else if (stream.endTime && currentTime >= stream.endTime) {
    status = 'ended'
  } else {
    status = 'active'
  }
  
  return {
    status,
    earnings,
    availableForWithdrawal: earnings // Simplified - would subtract withdrawals in real implementation
  }
}

/**
 * Calculate projected earnings for a timeframe
 */
export function calculateProjectedEarnings(
  stream: Stream, 
  timeframeSeconds: number,
  currentTime?: number
): number {
  const now = currentTime || Math.floor(Date.now() / 1000)
  
  if (stream.paused) return 0
  
  let effectiveTimeframe = timeframeSeconds
  
  // Adjust for stream end time
  if (stream.endTime) {
    const remainingTime = stream.endTime - now
    effectiveTimeframe = Math.min(timeframeSeconds, remainingTime)
  }
  
  return stream.ratePerSecond * effectiveTimeframe
}

/**
 * Calculate time until stream reaches a target amount
 */
export function calculateTimeToTarget(
  stream: Stream, 
  targetAmount: number,
  currentTime?: number
): { seconds: number; days: number; hours: number; minutes: number } | null {
  const now = currentTime || Math.floor(Date.now() / 1000)
  
  if (stream.paused || stream.ratePerSecond <= 0) {
    return null
  }
  
  const currentEarnings = calculateStreamEarnings(stream, now)
  const remaining = targetAmount - currentEarnings
  
  if (remaining <= 0) {
    return { seconds: 0, days: 0, hours: 0, minutes: 0 }
  }
  
  const secondsNeeded = Math.ceil(remaining / stream.ratePerSecond)
  
  // Adjust for stream end time
  if (stream.endTime) {
    const maxPossibleTime = stream.endTime - now
    if (secondsNeeded > maxPossibleTime) {
      return null // Target cannot be reached before stream ends
    }
  }
  
  const days = Math.floor(secondsNeeded / (24 * 60 * 60))
  const hours = Math.floor((secondsNeeded % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((secondsNeeded % (60 * 60)) / 60)
  
  return { seconds: secondsNeeded, days, hours, minutes }
}

/**
 * Stream Engine - Main export with all core functions
 */
export const StreamEngine = {
  calculateStreamEarnings,
  calculateAvailableForWithdrawal,
  isStreamActive,
  getStreamStatus,
  calculateProjectedEarnings,
  calculateTimeToTarget
}
