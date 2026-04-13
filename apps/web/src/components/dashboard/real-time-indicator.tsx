'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@inflowa-labs/ui'

export function RealTimeIndicator() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
      setIsUpdating(true)
      
      // Briefly show updating indicator
      setTimeout(() => setIsUpdating(false), 200)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isUpdating ? 'bg-green-500 animate-pulse' : 'bg-green-500'
            }`} />
            <span className="text-sm font-medium text-gray-700">
              Live Updates
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last: {formatTime(lastUpdate)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
