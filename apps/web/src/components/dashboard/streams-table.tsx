'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@inflowa-labs/ui'
import type { Stream } from '@inflowa-labs/sdk'

interface StreamsTableProps {
  streams: Array<{
    stream: Stream
    earnings: number
    availableForWithdrawal: number
    metadata?: {
      description?: string
      category?: string
      asset?: string
    }
  }>
}

export function StreamsTable({ streams }: StreamsTableProps) {
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
      return `$${ratePerSecond.toFixed(6)}/sec`
    }
  }

  const formatEarnings = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-4)}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Streams Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Sender</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Rate/sec</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Earned</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Available</th>
              </tr>
            </thead>
            <tbody>
              {streams.map((streamData) => (
                <tr key={streamData.stream.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-mono text-sm">
                      {formatAddress(streamData.stream.sender)}
                    </div>
                    {streamData.metadata?.description && (
                      <div className="text-xs text-gray-500 mt-1">
                        {streamData.metadata.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-blue-600">
                      {formatRate(streamData.stream.ratePerSecond)}
                    </div>
                    {streamData.metadata?.asset && (
                      <div className="text-xs text-gray-500">
                        {streamData.metadata.asset}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      streamData.stream.paused
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {streamData.stream.paused ? 'Paused' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-green-600">
                      {formatEarnings(streamData.earnings)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-purple-600">
                      {formatEarnings(streamData.availableForWithdrawal)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {streams.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No streams found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
