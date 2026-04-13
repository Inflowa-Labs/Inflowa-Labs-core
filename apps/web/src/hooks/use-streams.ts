'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { streamService } from '@inflowa-labs/sdk'
import type { Stream } from '@inflowa-labs/sdk'
import { useEffect, useState, useCallback } from 'react'

export function useStreams(userId: string = 'user_1') {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const queryClient = useQueryClient()

  // Optimized real-time updates with performance considerations
  useEffect(() => {
    let intervalId: NodeJS.Timeout
    
    const updateCurrentTime = () => {
      const now = Date.now()
      
      // Only update if at least 1 second has passed
      if (now - lastUpdate >= 1000) {
        setCurrentTime(Math.floor(now / 1000))
        setLastUpdate(now)
      }
    }

    // Use setInterval for consistent 1-second updates
    intervalId = setInterval(updateCurrentTime, 100) // Check every 100ms for precision

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [lastUpdate])

  // Fetch streams with live earnings - optimized query
  const {
    data: streamsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['streams', userId, currentTime],
    queryFn: () => streamService.getStreamsEarnings(userId),
    refetchInterval: 1000, // Refetch every second for live updates
    staleTime: 500, // Consider data stale after 500ms
    refetchIntervalInBackground: false, // Don't refetch when tab is hidden
  })

  // Manual refresh function for immediate updates
  const refresh = useCallback(() => {
    setCurrentTime(Math.floor(Date.now() / 1000))
    setLastUpdate(Date.now())
    refetch()
  }, [refetch])

  // Calculate total earnings with real-time updates
  const totalEarnings = streamsData?.reduce(
    (sum: number, stream: any) => sum + stream.earnings,
    0
  ) || 0

  // Get active streams only
  const activeStreams = streamsData?.filter(
    (stream: any) => !stream.stream.paused
  ) || []

  // Calculate earnings rate per second for all active streams
  const totalRatePerSecond = activeStreams.reduce(
    (sum: number, stream: any) => sum + stream.stream.ratePerSecond,
    0
  )

  return {
    streams: streamsData || [],
    activeStreams,
    totalEarnings,
    totalRatePerSecond,
    isLoading,
    error,
    currentTime,
    lastUpdate: new Date(lastUpdate),
    refresh
  }
}

export function useStreamActions() {
  const queryClient = useQueryClient()

  const pauseStream = async (streamId: string) => {
    await streamService.pauseStream(streamId)
    queryClient.invalidateQueries({ queryKey: ['streams'] })
  }

  const resumeStream = async (streamId: string) => {
    await streamService.resumeStream(streamId)
    queryClient.invalidateQueries({ queryKey: ['streams'] })
  }

  const withdrawFromStream = async (streamId: string, amount: number) => {
    const result = await streamService.withdrawFromStream(streamId, amount)
    queryClient.invalidateQueries({ queryKey: ['streams'] })
    return result
  }

  return {
    pauseStream,
    resumeStream,
    withdrawFromStream
  }
}
