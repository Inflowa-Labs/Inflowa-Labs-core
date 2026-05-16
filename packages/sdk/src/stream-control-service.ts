import { Stream } from './index'

export interface PauseReason {
  id: string
  streamId: string
  reason: string
  category: PauseCategory
  pausedAt: number
  pausedBy?: string
  notes?: string
  estimatedResumeTime?: number
}

export type PauseCategory =
  | 'maintenance'
  | 'funding_issue'
  | 'strategic'
  | 'error'
  | 'user_request'
  | 'compliance'
  | 'other'

export interface ResumeReason {
  id: string
  streamId: string
  reason: string
  resumedAt: number
  resumedBy?: string
  notes?: string
}

export interface StreamControlHistory {
  streamId: string
  pauses: PauseReason[]
  resumes: ResumeReason[]
  totalPausedTime: number
  pauseCount: number
  resumeCount: number
  lastPausedAt?: number
  lastResumedAt?: number
}

export class StreamControlService {
  private pauseReasons: PauseReason[] = []
  private resumeReasons: ResumeReason[] = []

  /**
   * Pause a stream with reason tracking
   */
  pauseStream(
    stream: Stream,
    reason: string,
    category: PauseCategory,
    pausedBy?: string,
    notes?: string,
    estimatedResumeTime?: number
  ): PauseReason {
    const pauseReason: PauseReason = {
      id: this.generateId(),
      streamId: stream.id,
      reason,
      category,
      pausedAt: Date.now(),
      pausedBy,
      notes,
      estimatedResumeTime,
    }

    this.pauseReasons.push(pauseReason)
    return pauseReason
  }

  /**
   * Resume a stream with reason tracking
   */
  resumeStream(
    stream: Stream,
    reason: string,
    resumedBy?: string,
    notes?: string
  ): ResumeReason {
    const resumeReason: ResumeReason = {
      id: this.generateId(),
      streamId: stream.id,
      reason,
      resumedAt: Date.now(),
      resumedBy,
      notes,
    }

    this.resumeReasons.push(resumeReason)
    return resumeReason
  }

  /**
   * Get pause reasons for a stream
   */
  getPauseReasons(streamId: string): PauseReason[] {
    return this.pauseReasons.filter(p => p.streamId === streamId)
  }

  /**
   * Get resume reasons for a stream
   */
  getResumeReasons(streamId: string): ResumeReason[] {
    return this.resumeReasons.filter(r => r.streamId === streamId)
  }

  /**
   * Get complete control history for a stream
   */
  getStreamControlHistory(streamId: string): StreamControlHistory {
    const pauses = this.getPauseReasons(streamId)
    const resumes = this.getResumeReasons(streamId)

    // Calculate total paused time
    let totalPausedTime = 0
    for (const pause of pauses) {
      const nextResume = resumes.find(
        r => r.resumedAt > pause.pausedAt && 
             (!resumes.find(r2 => r2.resumedAt > r.resumedAt && r2.resumedAt < r.resumedAt))
      )
      if (nextResume) {
        totalPausedTime += nextResume.resumedAt - pause.pausedAt
      } else {
        // Still paused
        totalPausedTime += Date.now() - pause.pausedAt
      }
    }

    return {
      streamId,
      pauses,
      resumes,
      totalPausedTime,
      pauseCount: pauses.length,
      resumeCount: resumes.length,
      lastPausedAt: pauses.length > 0 ? pauses[pauses.length - 1].pausedAt : undefined,
      lastResumedAt: resumes.length > 0 ? resumes[resumes.length - 1].resumedAt : undefined,
    }
  }

  /**
   * Get all pause reasons by category
   */
  getPausesByCategory(category: PauseCategory): PauseReason[] {
    return this.pauseReasons.filter(p => p.category === category)
  }

  /**
   * Get pause statistics
   */
  getPauseStatistics(): {
    totalPauses: number
    totalResumes: number
    byCategory: Record<PauseCategory, number>
    averagePauseDuration: number
    currentlyPaused: number
  } {
    const byCategory = this.pauseReasons.reduce((acc, pause) => {
      acc[pause.category] = (acc[pause.category] || 0) + 1
      return acc
    }, {} as Record<PauseCategory, number>)

    // Calculate average pause duration
    let totalPauseDuration = 0
    let completedPauses = 0

    for (const pause of this.pauseReasons) {
      const nextResume = this.resumeReasons.find(
        r => r.streamId === pause.streamId && r.resumedAt > pause.pausedAt
      )
      if (nextResume) {
        totalPauseDuration += nextResume.resumedAt - pause.pausedAt
        completedPauses++
      }
    }

    const averagePauseDuration = completedPauses > 0 ? totalPauseDuration / completedPauses : 0

    // Count currently paused streams (unique stream IDs with no matching resume)
    const pausedStreamIds = new Set(
      this.pauseReasons
        .filter(pause => {
          const hasResume = this.resumeReasons.some(
            r => r.streamId === pause.streamId && r.resumedAt > pause.pausedAt
          )
          return !hasResume
        })
        .map(p => p.streamId)
    )

    return {
      totalPauses: this.pauseReasons.length,
      totalResumes: this.resumeReasons.length,
      byCategory,
      averagePauseDuration,
      currentlyPaused: pausedStreamIds.size,
    }
  }

  /**
   * Get streams that have been paused for a long time
   */
  getLongPausedStreams(thresholdHours: number = 24): Array<{
    streamId: string
    pausedAt: number
    pausedDuration: number
    reason: string
  }> {
    const threshold = thresholdHours * 3600000
    const now = Date.now()

    return this.pauseReasons
      .filter(pause => {
        const hasResume = this.resumeReasons.some(
          r => r.streamId === pause.streamId && r.resumedAt > pause.pausedAt
        )
        return !hasResume && (now - pause.pausedAt) > threshold
      })
      .map(pause => ({
        streamId: pause.streamId,
        pausedAt: pause.pausedAt,
        pausedDuration: now - pause.pausedAt,
        reason: pause.reason,
      }))
  }

  /**
   * Get common pause reasons
   */
  getCommonPauseReasons(limit: number = 5): Array<{ reason: string; count: number }> {
    const reasonCounts = this.pauseReasons.reduce((acc, pause) => {
      acc[pause.reason] = (acc[pause.reason] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(reasonCounts)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  /**
   * Delete pause reason
   */
  deletePauseReason(pauseId: string): boolean {
    const index = this.pauseReasons.findIndex(p => p.id === pauseId)
    if (index === -1) return false

    this.pauseReasons.splice(index, 1)
    return true
  }

  /**
   * Delete resume reason
   */
  deleteResumeReason(resumeId: string): boolean {
    const index = this.resumeReasons.findIndex(r => r.id === resumeId)
    if (index === -1) return false

    this.resumeReasons.splice(index, 1)
    return true
  }

  /**
   * Clear history for a stream
   */
  clearStreamHistory(streamId: string): void {
    this.pauseReasons = this.pauseReasons.filter(p => p.streamId !== streamId)
    this.resumeReasons = this.resumeReasons.filter(r => r.streamId !== streamId)
  }

  /**
   * Export control history for a stream
   */
  exportStreamHistory(streamId: string): string {
    const history = this.getStreamControlHistory(streamId)
    return JSON.stringify(history, null, 2)
  }

  /**
   * Get pause recommendations based on patterns
   */
  getPauseRecommendations(): Array<{
    type: 'warning' | 'info' | 'suggestion'
    message: string
  }> {
    const recommendations: Array<{ type: 'warning' | 'info' | 'suggestion'; message: string }> = []
    const stats = this.getPauseStatistics()

    if (stats.currentlyPaused > 5) {
      recommendations.push({
        type: 'warning',
        message: `${stats.currentlyPaused} streams are currently paused. Consider reviewing and resuming if appropriate.`,
      })
    }

    if (stats.averagePauseDuration > 86400000) {
      recommendations.push({
        type: 'info',
        message: `Average pause duration is ${Math.round(stats.averagePauseDuration / 3600000)} hours. Review pause patterns for optimization.`,
      })
    }

    const maintenancePauses = stats.byCategory.maintenance || 0
    if (maintenancePauses > 3) {
      recommendations.push({
        type: 'suggestion',
        message: `Multiple maintenance pauses detected. Consider scheduling maintenance windows to minimize disruption.`,
      })
    }

    return recommendations
  }

  private generateId(): string {
    return `control_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export const streamControlService = new StreamControlService()
