'use client'

import { useStreams } from '@/hooks/use-streams'
import { StreamCard } from './stream-card'
import { StreamsTable } from './streams-table'
import { AnalyticsSection } from './analytics-section'
import { SimulationFeature } from './simulation-feature'
import { RealTimeIndicator } from './real-time-indicator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@inflowa-labs/ui'

export function Dashboard() {
  const { streams, activeStreams, totalEarnings, isLoading } = useStreams()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading streams...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your live earnings from all income sources</p>
      </div>

      {/* Real-time Indicator */}
      <RealTimeIndicator />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Earnings Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Total Earnings</CardTitle>
            <CardDescription className="text-blue-100 text-sm">
              Sum of all streams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${totalEarnings.toFixed(2)}
            </div>
            <div className="mt-2 text-sm text-blue-100 opacity-90">
              {activeStreams.length} active · {streams.length - activeStreams.length} paused
            </div>
          </CardContent>
        </Card>

        {/* Active Streams Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Active Streams</CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Currently earning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {activeStreams.length}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {streams.length} total streams
            </div>
          </CardContent>
        </Card>

        {/* Rate Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Earning Rate</CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Per second
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${activeStreams.reduce((sum: number, s: any) => sum + s.stream.ratePerSecond, 0).toFixed(6)}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              ~${(activeStreams.reduce((sum: number, s: any) => sum + s.stream.ratePerSecond, 0) * 3600).toFixed(2)}/hour
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <AnalyticsSection 
        totalEarnings={totalEarnings}
        activeStreamsCount={activeStreams.length}
        streams={streams}
      />

      {/* Streams Table */}
      <StreamsTable streams={streams} />

      {/* Stream Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Your Streams ({streams.length})
        </h2>
        
        {streams.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="text-center py-12">
              <div className="text-gray-500">
                <p className="text-lg font-medium mb-2">No streams yet</p>
                <p>Create your first income stream to start earning!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((streamData) => (
              <StreamCard
                key={streamData.stream.id}
                stream={streamData.stream}
                earnings={streamData.earnings}
                availableForWithdrawal={streamData.availableForWithdrawal}
                metadata={streamData.metadata}
              />
            ))}
          </div>
        )}
      </div>

      {/* Simulation Feature */}
      <SimulationFeature />
    </div>
  )
}
