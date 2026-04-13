'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@inflowa-labs/ui'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AnalyticsSectionProps {
  totalEarnings: number
  activeStreamsCount: number
  streams: Array<{
    stream: any
    earnings: number
  }>
}

export function AnalyticsSection({ totalEarnings, activeStreamsCount, streams }: AnalyticsSectionProps) {
  // Generate historical earnings data for the chart
  const generateHistoricalData = () => {
    const now = new Date()
    const data = []
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const baseEarnings = totalEarnings * 0.7 // Start with 70% of current earnings
      const growth = (30 - i) / 30 * 0.3 // Growth over time
      const randomVariation = Math.random() * 0.1 - 0.05 // Random variation
      
      const earnings = baseEarnings * (1 + growth + randomVariation)
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        earnings: Math.max(0, earnings),
        timestamp: date.toISOString()
      })
    }
    
    return data
  }

  const chartData = generateHistoricalData()

  const formatEarnings = (value: number) => {
    return `$${value.toFixed(2)}`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Earned */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Earned</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {formatEarnings(totalEarnings)}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Across all streams
          </p>
        </CardContent>
      </Card>

      {/* Active Streams */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Streams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            {activeStreamsCount}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Currently earning
          </p>
        </CardContent>
      </Card>

      {/* Earnings Chart */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Earnings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatEarnings(value), 'Earnings']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
