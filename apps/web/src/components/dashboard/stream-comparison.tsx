'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@inflowa-labs/ui'
import { Stream } from '@inflowa-labs/sdk'

interface StreamComparisonProps {
  streams: Array<{ stream: Stream; earnings: number; metadata?: any }>
  selectedStreamIds: string[]
  onSelectionChange: (streamIds: string[]) => void
}

interface ComparisonData {
  streamId: string
  ratePerSecond: number
  earnings: number
  projectedMonthly: number
  projectedYearly: number
  efficiency: number
  uptime: number
}

export function StreamComparison({ streams, selectedStreamIds, onSelectionChange }: StreamComparisonProps) {
  const comparisonData: ComparisonData[] = selectedStreamIds
    .map(id => {
      const streamData = streams.find(s => s.stream.id === id)
      if (!streamData) return null

      return {
        streamId: streamData.stream.id,
        ratePerSecond: streamData.stream.ratePerSecond,
        earnings: streamData.earnings,
        projectedMonthly: streamData.stream.ratePerSecond * 2592000,
        projectedYearly: streamData.stream.ratePerSecond * 31536000,
        efficiency: 85 + Math.random() * 15, // Mock efficiency
        uptime: 95 + Math.random() * 5, // Mock uptime
      }
    })
    .filter((data): data is ComparisonData => data !== null)

  const handleToggleStream = (streamId: string) => {
    if (selectedStreamIds.includes(streamId)) {
      onSelectionChange(selectedStreamIds.filter(id => id !== streamId))
    } else {
      onSelectionChange([...selectedStreamIds, streamId])
    }
  }

  const getBestStream = (metric: keyof ComparisonData): ComparisonData | null => {
    if (comparisonData.length === 0) return null
    return comparisonData.reduce((best, current) => 
      current[metric] > best[metric] ? current : best
    )
  }

  const getWorstStream = (metric: keyof ComparisonData): ComparisonData | null => {
    if (comparisonData.length === 0) return null
    return comparisonData.reduce((worst, current) => 
      current[metric] < worst[metric] ? current : worst
    )
  }

  if (selectedStreamIds.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stream Comparison</CardTitle>
          <CardDescription>Select at least 2 streams to compare</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {streams.map(streamData => (
              <label key={streamData.stream.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStreamIds.includes(streamData.stream.id)}
                  onChange={() => handleToggleStream(streamData.stream.id)}
                  className="rounded"
                />
                <span className="text-sm">
                  {streamData.stream.id.slice(0, 8)}... (${streamData.stream.ratePerSecond.toFixed(6)}/s)
                </span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const bestRate = getBestStream('ratePerSecond')
  const bestEarnings = getBestStream('earnings')
  const bestEfficiency = getBestStream('efficiency')
  const bestUptime = getBestStream('uptime')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stream Comparison</CardTitle>
          <CardDescription>Compare performance metrics across selected streams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            {streams.map(streamData => (
              <label key={streamData.stream.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStreamIds.includes(streamData.stream.id)}
                  onChange={() => handleToggleStream(streamData.stream.id)}
                  className="rounded"
                />
                <span className="text-sm">
                  {streamData.stream.id.slice(0, 8)}... (${streamData.stream.ratePerSecond.toFixed(6)}/s)
                </span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Metric Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Metric</th>
                  {comparisonData.map(data => (
                    <th key={data.streamId} className="text-right py-2">
                      {data.streamId.slice(0, 8)}...
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Rate/sec</td>
                  {comparisonData.map(data => (
                    <td key={data.streamId} className="text-right py-2">
                      <span className={data === bestRate ? 'text-green-600 font-bold' : ''}>
                        ${data.ratePerSecond.toFixed(6)}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Earnings</td>
                  {comparisonData.map(data => (
                    <td key={data.streamId} className="text-right py-2">
                      <span className={data === bestEarnings ? 'text-green-600 font-bold' : ''}>
                        ${data.earnings.toFixed(2)}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Projected Monthly</td>
                  {comparisonData.map(data => (
                    <td key={data.streamId} className="text-right py-2">
                      ${data.projectedMonthly.toFixed(2)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Projected Yearly</td>
                  {comparisonData.map(data => (
                    <td key={data.streamId} className="text-right py-2">
                      ${data.projectedYearly.toFixed(2)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Efficiency</td>
                  {comparisonData.map(data => (
                    <td key={data.streamId} className="text-right py-2">
                      <span className={data === bestEfficiency ? 'text-green-600 font-bold' : ''}>
                        {data.efficiency.toFixed(1)}%
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2">Uptime</td>
                  {comparisonData.map(data => (
                    <td key={data.streamId} className="text-right py-2">
                      <span className={data === bestUptime ? 'text-green-600 font-bold' : ''}>
                        {data.uptime.toFixed(1)}%
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Visual Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Visual Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Rate Comparison */}
            <div>
              <div className="text-sm font-medium mb-2">Rate per Second</div>
              <div className="space-y-2">
                {comparisonData.map(data => {
                  const maxRate = Math.max(...comparisonData.map(d => d.ratePerSecond))
                  const percentage = (data.ratePerSecond / maxRate) * 100
                  return (
                    <div key={data.streamId} className="flex items-center gap-2">
                      <span className="text-xs w-20">{data.streamId.slice(0, 8)}...</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-blue-500 h-4 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs w-24 text-right">${data.ratePerSecond.toFixed(6)}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Earnings Comparison */}
            <div>
              <div className="text-sm font-medium mb-2">Total Earnings</div>
              <div className="space-y-2">
                {comparisonData.map(data => {
                  const maxEarnings = Math.max(...comparisonData.map(d => d.earnings))
                  const percentage = maxEarnings > 0 ? (data.earnings / maxEarnings) * 100 : 0
                  return (
                    <div key={data.streamId} className="flex items-center gap-2">
                      <span className="text-xs w-20">{data.streamId.slice(0, 8)}...</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-green-500 h-4 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs w-24 text-right">${data.earnings.toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Efficiency Comparison */}
            <div>
              <div className="text-sm font-medium mb-2">Efficiency</div>
              <div className="space-y-2">
                {comparisonData.map(data => (
                  <div key={data.streamId} className="flex items-center gap-2">
                    <span className="text-xs w-20">{data.streamId.slice(0, 8)}...</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-purple-500 h-4 rounded-full"
                        style={{ width: `${data.efficiency}%` }}
                      />
                    </div>
                    <span className="text-xs w-24 text-right">{data.efficiency.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {bestRate && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>
                  <strong>Best Rate:</strong> {bestRate.streamId.slice(0, 8)}... at ${bestRate.ratePerSecond.toFixed(6)}/s
                </span>
              </div>
            )}
            {bestEarnings && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>
                  <strong>Most Earnings:</strong> {bestEarnings.streamId.slice(0, 8)}... at ${bestEarnings.earnings.toFixed(2)}
                </span>
              </div>
            )}
            {bestEfficiency && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>
                  <strong>Highest Efficiency:</strong> {bestEfficiency.streamId.slice(0, 8)}... at {bestEfficiency.efficiency.toFixed(1)}%
                </span>
              </div>
            )}
            {bestUptime && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>
                  <strong>Best Uptime:</strong> {bestUptime.streamId.slice(0, 8)}... at {bestUptime.uptime.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
