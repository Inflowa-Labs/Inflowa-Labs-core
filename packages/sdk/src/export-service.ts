import { Stream, StreamCalculation, StreamTransaction } from './index'

export interface ExportOptions {
  format: 'csv' | 'json'
  includeTransactions?: boolean
  includeMetadata?: boolean
  dateRange?: {
    start: number
    end: number
  }
}

export interface ExportData {
  streams: Array<{
    stream: Stream
    calculation?: StreamCalculation
    transactions?: StreamTransaction[]
  }>
  exportDate: string
  totalStreams: number
  totalEarnings: number
}

export class ExportService {
  /**
   * Export streams data to CSV format
   */
  static exportToCSV(
    streams: Array<{ stream: Stream; earnings: number; metadata?: any }>,
    options: ExportOptions = { format: 'csv' }
  ): string {
    const headers = [
      'Stream ID',
      'Sender',
      'Recipient',
      'Rate Per Second',
      'Start Time',
      'End Time',
      'Paused',
      'Earnings',
      'Category',
      'Asset',
      'Description',
    ]

    const rows = streams.map(data => {
      const stream = data.stream
      const metadata = data.metadata || {}
      
      return [
        stream.id,
        stream.sender,
        stream.recipient,
        stream.ratePerSecond.toFixed(6),
        new Date(stream.startTime).toISOString(),
        stream.endTime ? new Date(stream.endTime).toISOString() : '',
        stream.paused ? 'Yes' : 'No',
        data.earnings.toFixed(2),
        metadata.category || 'other',
        metadata.asset || 'XLM',
        metadata.description || '',
      ].join(',')
    })

    return [headers.join(','), ...rows].join('\n')
  }

  /**
   * Export streams data to JSON format
   */
  static exportToJSON(
    streams: Array<{ stream: Stream; earnings: number; metadata?: any }>,
    options: ExportOptions = { format: 'json' }
  ): string {
    const exportData: ExportData = {
      streams: streams.map(data => ({
        stream: data.stream,
        calculation: {
          streamId: data.stream.id,
          availableAmount: data.earnings,
          totalEarned: data.earnings,
          elapsedTime: (Date.now() - data.stream.startTime) / 1000,
          currentRate: data.stream.ratePerSecond,
          projectedMonthly: data.stream.ratePerSecond * 2592000,
          projectedYearly: data.stream.ratePerSecond * 31536000,
        },
      })),
      exportDate: new Date().toISOString(),
      totalStreams: streams.length,
      totalEarnings: streams.reduce((sum, s) => sum + s.earnings, 0),
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * Export transactions to CSV format
   */
  static exportTransactionsToCSV(transactions: StreamTransaction[]): string {
    const headers = [
      'Transaction ID',
      'Stream ID',
      'Amount',
      'Timestamp',
      'Type',
      'Status',
      'Transaction Hash',
    ]

    const rows = transactions.map(tx => [
      tx.id,
      tx.streamId,
      tx.amount.toFixed(2),
      new Date(tx.timestamp).toISOString(),
      tx.type,
      tx.status,
      tx.txHash || '',
    ])

    return [headers.join(','), ...rows].join('\n')
  }

  /**
   * Export transactions to JSON format
   */
  static exportTransactionsToJSON(transactions: StreamTransaction[]): string {
    return JSON.stringify(
      {
        transactions,
        exportDate: new Date().toISOString(),
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce((sum, tx) => sum + tx.amount, 0),
      },
      null,
      2
    )
  }

  /**
   * Generate a comprehensive report
   */
  static generateReport(
    streams: Array<{ stream: Stream; earnings: number; metadata?: any }>,
    transactions: StreamTransaction[]
  ): string {
    const totalEarnings = streams.reduce((sum, s) => sum + s.earnings, 0)
    const activeStreams = streams.filter(s => !s.stream.paused).length
    const totalTransactions = transactions.length
    const totalWithdrawn = transactions
      .filter(tx => tx.type === 'withdrawal' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0)

    const report = `
INFLOWA LABS - STREAM REPORT
Generated: ${new Date().toISOString()}

SUMMARY
-------
Total Streams: ${streams.length}
Active Streams: ${activeStreams}
Paused Streams: ${streams.length - activeStreams}
Total Earnings: $${totalEarnings.toFixed(2)}
Total Withdrawn: $${totalWithdrawn.toFixed(2)}
Total Transactions: ${totalTransactions}

STREAM DETAILS
--------------
${streams.map((data, index) => `
${index + 1}. ${data.stream.id.slice(0, 8)}...
   Rate: $${data.stream.ratePerSecond.toFixed(6)}/s
   Earnings: $${data.earnings.toFixed(2)}
   Status: ${data.stream.paused ? 'Paused' : 'Active'}
   Category: ${data.metadata?.category || 'other'}
`).join('')}

TRANSACTION SUMMARY
-------------------
Completed Withdrawals: ${transactions.filter(tx => tx.type === 'withdrawal' && tx.status === 'completed').length}
Pending Transactions: ${transactions.filter(tx => tx.status === 'pending').length}
Failed Transactions: ${transactions.filter(tx => tx.status === 'failed').length}
`

    return report
  }

  /**
   * Export data based on format
   */
  static export(
    streams: Array<{ stream: Stream; earnings: number; metadata?: any }>,
    options: ExportOptions = { format: 'json' }
  ): string {
    switch (options.format) {
      case 'csv':
        return this.exportToCSV(streams, options)
      case 'json':
        return this.exportToJSON(streams, options)
      default:
        throw new Error(`Unsupported format: ${options.format}`)
    }
  }

  /**
   * Get filename for export
   */
  static getFilename(prefix: string, format: 'csv' | 'json' | 'txt'): string {
    return `${prefix}-${Date.now()}.${format}`
  }

  /**
   * Get MIME type for format
   */
  static getMimeType(format: 'csv' | 'json' | 'txt'): string {
    const mimeTypes = {
      csv: 'text/csv',
      json: 'application/json',
      txt: 'text/plain',
    }
    return mimeTypes[format]
  }
}
