'use client'

import { useState } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@inflowa-labs/ui'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function SimulationFeature() {
  const [ratePerSecond, setRatePerSecond] = useState('')
  const [duration, setDuration] = useState('')
  const [projection, setProjection] = useState<any[]>(null)

  const calculateProjection = () => {
    const rate = parseFloat(ratePerSecond)
    const dur = parseInt(duration)

    if (isNaN(rate) || isNaN(dur) || rate <= 0 || dur <= 0) {
      return
    }

    // Generate projection data points
    const dataPoints = []
    const maxPoints = Math.min(100, dur) // Limit to 100 points for performance
    const interval = dur / maxPoints

    for (let i = 0; i <= maxPoints; i++) {
      const time = i * interval
      const earnings = rate * time
      
      dataPoints.push({
        time: time.toFixed(0),
        earnings: earnings,
        label: `${time}s`
      })
    }

    setProjection(dataPoints)
  }

  const formatEarnings = (value: number) => {
    return `$${value.toFixed(2)}`
  }

  const formatRate = (rate: number) => {
    const perMinute = rate * 60
    const perHour = rate * 60 * 60
    const perDay = rate * 24 * 60 * 60

    if (perDay >= 1) {
      return `$${perDay.toFixed(2)}/day`
    } else if (perHour >= 1) {
      return `$${perHour.toFixed(2)}/hour`
    } else if (perMinute >= 1) {
      return `$${perMinute.toFixed(2)}/minute`
    } else {
      return `$${rate.toFixed(6)}/second`
    }
  }

  const totalEarnings = projection ? projection[projection.length - 1]?.earnings || 0 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rate">Rate per Second</Label>
            <Input
              id="rate"
              type="number"
              step="0.000001"
              placeholder="0.00011574"
              value={ratePerSecond}
              onChange={(e) => setRatePerSecond(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter rate in USD per second
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (seconds)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="86400"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter duration in seconds (86400 = 1 day)
            </p>
          </div>
        </div>

        <Button onClick={calculateProjection} className="w-full">
          Calculate Projection
        </Button>

        {/* Results Section */}
        {projection && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Projected Earnings</h3>
              <div className="text-2xl font-bold text-green-600">
                {formatEarnings(totalEarnings)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Over {duration} seconds at {formatRate(parseFloat(ratePerSecond))}
              </div>
            </div>

            {/* Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projection}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                    label={{ value: 'Earnings ($)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatEarnings(value), 'Earnings']}
                    labelFormatter={(label) => `Time: ${label}s`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-sm text-gray-600">Per Minute</div>
                <div className="font-semibold text-blue-600">
                  {formatEarnings(parseFloat(ratePerSecond) * 60)}
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-sm text-gray-600">Per Hour</div>
                <div className="font-semibold text-green-600">
                  {formatEarnings(parseFloat(ratePerSecond) * 3600)}
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="text-sm text-gray-600">Per Day</div>
                <div className="font-semibold text-purple-600">
                  {formatEarnings(parseFloat(ratePerSecond) * 86400)}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
