'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { Asset } from '@inflowa-labs/types'

interface AssetDistributionChartProps {
  assets: Asset[]
  title?: string
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function AssetDistributionChart({ assets, title = 'Asset Distribution' }: AssetDistributionChartProps) {
  const chartData = assets.map(asset => ({
    name: asset.name,
    value: asset.value,
    percentage: (asset.value / assets.reduce((sum, a) => sum + a.value, 0)) * 100
  }))

  return (
    <div className="w-full h-80">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
