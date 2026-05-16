import { Stream } from './index'

export interface AuditLogEntry {
  id: string
  timestamp: number
  action: AuditAction
  entityType: 'stream' | 'transaction' | 'user' | 'system'
  entityId: string
  userId?: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export type AuditAction =
  | 'stream_created'
  | 'stream_updated'
  | 'stream_paused'
  | 'stream_resumed'
  | 'stream_deleted'
  | 'stream_ended'
  | 'transaction_created'
  | 'transaction_completed'
  | 'transaction_failed'
  | 'withdrawal_initiated'
  | 'withdrawal_completed'
  | 'withdrawal_failed'
  | 'user_login'
  | 'user_logout'
  | 'settings_updated'
  | 'api_key_created'
  | 'api_key_revoked'

export interface AuditLogFilter {
  action?: AuditAction
  entityType?: AuditLogEntry['entityType']
  entityId?: string
  userId?: string
  startDate?: number
  endDate?: number
  limit?: number
  offset?: number
}

export class AuditLogService {
  private logs: AuditLogEntry[] = []

  /**
   * Add an audit log entry
   */
  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const logEntry: AuditLogEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: Date.now(),
    }
    
    this.logs.unshift(logEntry)
    return logEntry
  }

  /**
   * Get all audit logs with optional filtering
   */
  getLogs(filter?: AuditLogFilter): AuditLogEntry[] {
    let filteredLogs = [...this.logs]

    if (filter) {
      if (filter.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filter.action)
      }
      if (filter.entityType) {
        filteredLogs = filteredLogs.filter(log => log.entityType === filter.entityType)
      }
      if (filter.entityId) {
        filteredLogs = filteredLogs.filter(log => log.entityId === filter.entityId)
      }
      if (filter.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filter.userId)
      }
      if (filter.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.startDate!)
      }
      if (filter.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filter.endDate!)
      }
    }

    if (filter?.limit) {
      const start = filter.offset || 0
      filteredLogs = filteredLogs.slice(start, start + filter.limit)
    }

    return filteredLogs
  }

  /**
   * Get audit logs for a specific stream
   */
  getStreamLogs(streamId: string): AuditLogEntry[] {
    return this.getLogs({
      entityType: 'stream',
      entityId: streamId,
    })
  }

  /**
   * Get audit logs for a specific user
   */
  getUserLogs(userId: string): AuditLogEntry[] {
    return this.getLogs({ userId })
  }

  /**
   * Get recent audit logs
   */
  getRecentLogs(limit: number = 50): AuditLogEntry[] {
    return this.getLogs({ limit })
  }

  /**
   * Get audit log statistics
   */
  getStatistics(): {
    totalLogs: number
    logsByAction: Record<AuditAction, number>
    logsByEntityType: Record<string, number>
    logsLast24Hours: number
    logsLast7Days: number
  } {
    const now = Date.now()
    const last24Hours = now - 86400000
    const last7Days = now - 604800000

    const logsByAction = this.logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1
      return acc
    }, {} as Record<AuditAction, number>)

    const logsByEntityType = this.logs.reduce((acc, log) => {
      acc[log.entityType] = (acc[log.entityType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalLogs: this.logs.length,
      logsByAction,
      logsByEntityType,
      logsLast24Hours: this.logs.filter(log => log.timestamp >= last24Hours).length,
      logsLast7Days: this.logs.filter(log => log.timestamp >= last7Days).length,
    }
  }

  /**
   * Clear old audit logs (for maintenance)
   */
  clearOldLogs(olderThanDays: number = 90): number {
    const cutoff = Date.now() - (olderThanDays * 86400000)
    const beforeCount = this.logs.length
    this.logs = this.logs.filter(log => log.timestamp >= cutoff)
    return beforeCount - this.logs.length
  }

  /**
   * Export audit logs to JSON
   */
  exportLogs(filter?: AuditLogFilter): string {
    const logs = this.getLogs(filter)
    return JSON.stringify(
      {
        logs,
        exportDate: new Date().toISOString(),
        totalLogs: logs.length,
      },
      null,
      2
    )
  }

  /**
   * Log stream creation
   */
  logStreamCreated(stream: Stream, userId?: string): AuditLogEntry {
    return this.log({
      action: 'stream_created',
      entityType: 'stream',
      entityId: stream.id,
      userId,
      details: {
        sender: stream.sender,
        recipient: stream.recipient,
        ratePerSecond: stream.ratePerSecond,
        startTime: stream.startTime,
        endTime: stream.endTime,
      },
    })
  }

  /**
   * Log stream update
   */
  logStreamUpdated(stream: Stream, changes: Record<string, any>, userId?: string): AuditLogEntry {
    return this.log({
      action: 'stream_updated',
      entityType: 'stream',
      entityId: stream.id,
      userId,
      details: {
        changes,
        previousState: changes.previous,
        newState: changes.current,
      },
    })
  }

  /**
   * Log stream pause
   */
  logStreamPaused(stream: Stream, reason?: string, userId?: string): AuditLogEntry {
    return this.log({
      action: 'stream_paused',
      entityType: 'stream',
      entityId: stream.id,
      userId,
      details: {
        reason,
        pausedAt: Date.now(),
      },
    })
  }

  /**
   * Log stream resume
   */
  logStreamResumed(stream: Stream, userId?: string): AuditLogEntry {
    return this.log({
      action: 'stream_resumed',
      entityType: 'stream',
      entityId: stream.id,
      userId,
      details: {
        resumedAt: Date.now(),
      },
    })
  }

  /**
   * Log stream deletion
   */
  logStreamDeleted(streamId: string, userId?: string): AuditLogEntry {
    return this.log({
      action: 'stream_deleted',
      entityType: 'stream',
      entityId: streamId,
      userId,
      details: {
        deletedAt: Date.now(),
      },
    })
  }

  /**
   * Log withdrawal initiated
   */
  logWithdrawalInitiated(streamId: string, amount: number, userId?: string): AuditLogEntry {
    return this.log({
      action: 'withdrawal_initiated',
      entityType: 'transaction',
      entityId: streamId,
      userId,
      details: {
        amount,
        initiatedAt: Date.now(),
      },
    })
  }

  /**
   * Log withdrawal completed
   */
  logWithdrawalCompleted(streamId: string, amount: number, txHash?: string, userId?: string): AuditLogEntry {
    return this.log({
      action: 'withdrawal_completed',
      entityType: 'transaction',
      entityId: streamId,
      userId,
      details: {
        amount,
        txHash,
        completedAt: Date.now(),
      },
    })
  }

  /**
   * Log withdrawal failed
   */
  logWithdrawalFailed(streamId: string, amount: number, reason: string, userId?: string): AuditLogEntry {
    return this.log({
      action: 'withdrawal_failed',
      entityType: 'transaction',
      entityId: streamId,
      userId,
      details: {
        amount,
        reason,
        failedAt: Date.now(),
      },
    })
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export const auditLogService = new AuditLogService()
