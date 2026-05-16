'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@inflowa-labs/ui'
import { Stream, StreamCalculation, StreamCategory } from '@inflowa-labs/sdk'

interface StreamAnalyticsProps {
  streams: Array<{ stream: Stream; earnings: number; metadata?: any }>
}

interface AnalyticsData {
  totalEarnings: number
  averageEarningsPerStream: number
  topEarningStream: { id: string; earnings: number } | null
  categoryBreakdown: Record<StreamCategory, { count: number; earnings: number }>
  earningsTrend: Array<{ date: string; earnings: number }>
}

export function StreamAnalytics({ streams }: StreamAnalyticsProps) {
  const analytics: AnalyticsData = {
    totalEarnings: streams.reduce((sum, s) => sum + s.earnings, 0),
    averageEarningsPerStream: streams.length > 0 ? streams.reduce((sum, s) => sum + s.earnings, 0) / streams.length : 0,
    topEarningStream: streams.length > 0 
      ? streams.reduce((max, s) => s.earnings > max.earnings ? { id: s.stream.id, earnings: s.earnings } : max, { id: streams[0].stream.id, earnings: streams[0].earnings })
      : null,
    categoryBreakdown: streams.reduce((acc, s) => {
      const category = s.metadata?.category || 'other'
      if (!acc[category]) {
        acc[category] = { count: 0, earnings: 0 }
      }
      acc[category].count += 1
      acc[category].earnings += s.earnings
      return acc
    }, {} as Record<StreamCategory, { count: number; earnings: number }>),
    earningsTrend: generateMockTrendData(streams),
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Stream Analytics</h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${analytics.totalEarnings.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average per Stream</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${analytics.averageEarningsPerStream.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Top Earning Stream</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${analytics.topEarningStream?.earnings.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ID: {analytics.topEarningStream?.id.slice(0, 8)}...
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Streams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {streams.filter(s => !s.stream.paused).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              of {streams.length} total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings by Category</CardTitle>
          <CardDescription>Distribution of earnings across stream categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analytics.categoryBreakdown).map(([category, data]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium capitalize">{category}</span>
                  <span className="text-xs text-gray-500">({data.count} streams)</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">${data.earnings.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">
                    {((data.earnings / analytics.totalEarnings) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Earnings Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Trend (Last 7 Days)</CardTitle>
          <CardDescription>Daily earnings over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end gap-2">
            {analytics.earningsTrend.map((point, index) => {
              const maxValue = Math.max(...analytics.earningsTrend.map(p => p.earnings))
              const height = maxValue > 0 ? (point.earnings / maxValue) * 100 : 0
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                    title={`${point.date}: $${point.earnings.toFixed(2)}`}
                  />
                  <div className="text-xs text-gray-500 rotate-45 origin-bottom-left">
                    {point.date}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators for your streams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Stream Efficiency</span>
                <span className="font-semibold">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uptime</span>
                <span className="font-semibold">99.9%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '99.9%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Withdrawal Rate</span>
                <span className="font-semibold">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Growth Rate</span>
                <span className="font-semibold">+15.3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function generateMockTrendData(streams: Array<{ stream: Stream; earnings: number }>) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const baseEarnings = streams.reduce((sum, s) => sum + s.earnings, 0) / 7
  
  return days.map(day => ({
    date: day,
    earnings: baseEarnings * (0.8 + Math.random() * 0.4),
  }))
}
