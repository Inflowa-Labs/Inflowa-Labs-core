'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

/**
 * Real-time updating hook with 1-second intervals
 * Provides optimized real-time updates without page refresh
 */
export function useRealTime(updateInterval: number = 1000) {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
  const [isRunning, setIsRunning] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start real-time updates
  const start = useCallback(() => {
    if (intervalRef.current) return // Already running
    
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000))
    }, updateInterval)
  }, [updateInterval])

  // Stop real-time updates
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
  }, [])

  // Toggle real-time updates
  const toggle = useCallback(() => {
    if (isRunning) {
      stop()
    } else {
      start()
    }
  }, [isRunning, start, stop])

  // Auto-start on mount
  useEffect(() => {
    start()
    
    // Cleanup on unmount
    return () => {
      stop()
    }
  }, [start, stop])

  return {
    currentTime,
    isRunning,
    start,
    stop,
    toggle
  }
}

/**
 * Hook for real-time earnings calculations
 * Combines time updates with earnings recalculation
 */
export function useRealTimeEarnings(streams: Array<{
  stream: any
  earnings: number
}>) {
  const { currentTime } = useRealTime(1000) // Update every 1 second

  // Recalculate earnings based on current time
  const recalculateEarnings = useCallback(() => {
    return streams.map(streamData => {
      const stream = streamData.stream
      if (stream.paused) {
        return {
          ...streamData,
          earnings: streamData.earnings // Paused streams don't earn
        }
      }

      const elapsedTime = currentTime - stream.startTime
      const newEarnings = stream.ratePerSecond * Math.max(0, elapsedTime)
      
      return {
        ...streamData,
        earnings: newEarnings
      }
    })
  }, [streams, currentTime])

  const updatedStreams = recalculateEarnings()
  const totalEarnings = updatedStreams.reduce((sum, s) => sum + s.earnings, 0)

  return {
    streams: updatedStreams,
    totalEarnings,
    currentTime,
    lastUpdate: new Date(currentTime * 1000)
  }
}

/**
 * Performance-optimized real-time hook
 * Uses requestAnimationFrame for smooth updates
 */
export function useOptimizedRealTime() {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
  const frameRef = useRef<number>()
  const lastUpdateRef = useRef<number>(Date.now())

  useEffect(() => {
    const animate = () => {
      const now = Date.now()
      
      // Update every second (1000ms)
      if (now - lastUpdateRef.current >= 1000) {
        setCurrentTime(Math.floor(now / 1000))
        lastUpdateRef.current = now
      }
      
      frameRef.current = requestAnimationFrame(animate)
    }
    
    frameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return currentTime
}

/**
 * Real-time hook with visibility API integration
 * Pauses updates when tab is not visible to save resources
 */
export function useSmartRealTime(updateInterval: number = 1000) {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
  const [isVisible, setIsVisible] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Set up interval based on visibility
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (isVisible) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(Math.floor(Date.now() / 1000))
      }, updateInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isVisible, updateInterval])

  return {
    currentTime,
    isVisible,
    isUpdating: isVisible
  }
}
