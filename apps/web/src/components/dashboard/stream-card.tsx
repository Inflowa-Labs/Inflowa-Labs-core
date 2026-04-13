'use client'

import { Button, Card, CardContent, CardHeader, CardTitle } from '@inflowa-labs/ui'
import { useStreamActions } from '@/hooks/use-streams'
import type { Stream } from '@inflowa-labs/sdk'

interface StreamCardProps {
  stream: Stream
  earnings: number
  availableForWithdrawal: number
  metadata?: {
    description?: string
    category?: string
    asset?: string
  }
}

export function StreamCard({ stream, earnings, availableForWithdrawal, metadata }: StreamCardProps) {
  const { pauseStream, resumeStream } = useStreamActions()

  const formatRate = (ratePerSecond: number) => {
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

  const formatEarnings = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-4)}`
  }

  const handleToggleStream = async () => {
    if (stream.paused) {
      await resumeStream(stream.id)
    } else {
      await pauseStream(stream.id)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {metadata?.description || 'Income Stream'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              stream.paused 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {stream.paused ? 'Paused' : 'Active'}
            </span>
            {metadata?.category && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {metadata.category}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sender and Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">From:</span>
            <span className="text-sm font-mono">{formatAddress(stream.sender)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Rate:</span>
            <span className="text-sm font-semibold text-blue-600">
              {formatRate(stream.ratePerSecond)}
            </span>
          </div>
        </div>

        {/* Live Earnings */}
        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Live Earnings:</span>
              <span className="text-lg font-bold text-green-600">
                {formatEarnings(earnings)}
              </span>
            </div>
            {metadata?.asset && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Asset:</span>
                <span className="text-sm font-medium">{metadata.asset}</span>
              </div>
            )}
          </div>
        </div>

        {/* Available for Withdrawal */}
        {availableForWithdrawal > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Available:</span>
              <span className="text-sm font-semibold text-purple-600">
                {formatEarnings(availableForWithdrawal)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant={stream.paused ? "default" : "outline"}
            size="sm"
            onClick={handleToggleStream}
            className="flex-1"
          >
            {stream.paused ? 'Resume' : 'Pause'}
          </Button>
          {availableForWithdrawal > 0 && (
            <Button variant="outline" size="sm" className="flex-1">
              Withdraw
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
