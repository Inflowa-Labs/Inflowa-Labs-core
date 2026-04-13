'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Transaction } from '@inflowa-labs/types'

interface TransactionChartProps {
  transactions: Transaction[]
  title?: string
}

export function TransactionChart({ transactions, title = 'Transaction Volume' }: TransactionChartProps) {
  const chartData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString()
    const existing = acc.find(item => item.date === date)
    
    if (existing) {
      existing.amount += transaction.amount
      existing.count += 1
    } else {
      acc.push({
        date,
        amount: transaction.amount,
        count: 1
      })
    }
    
    return acc
  }, [] as { date: string; amount: number; count: number }[])

  return (
    <div className="w-full h-80">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value: number, name: string) => [
              name === 'amount' ? `$${value.toLocaleString()}` : value,
              name === 'amount' ? 'Total Amount' : 'Transaction Count'
            ]}
          />
          <Bar dataKey="amount" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
