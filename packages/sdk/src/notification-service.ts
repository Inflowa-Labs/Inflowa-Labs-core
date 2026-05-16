import { Stream } from './index'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: number
  read: boolean
  streamId?: string
  data?: any
}

export type NotificationType = 
  | 'stream_created'
  | 'stream_paused'
  | 'stream_resumed'
  | 'stream_ended'
  | 'milestone_reached'
  | 'withdrawal_completed'
  | 'error'
  | 'warning'

export interface NotificationPreferences {
  streamCreated: boolean
  streamPaused: boolean
  streamResumed: boolean
  streamEnded: boolean
  milestoneReached: boolean
  withdrawalCompleted: boolean
  errors: boolean
  warnings: boolean
  emailEnabled: boolean
  pushEnabled: boolean
}

export class NotificationService {
  private notifications: Notification[] = []
  private preferences: NotificationPreferences = {
    streamCreated: true,
    streamPaused: true,
    streamResumed: true,
    streamEnded: true,
    milestoneReached: true,
    withdrawalCompleted: true,
    errors: true,
    warnings: true,
    emailEnabled: false,
    pushEnabled: false,
  }

  /**
   * Add a new notification
   */
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: Date.now(),
      read: false,
    }
    
    this.notifications.unshift(newNotification)
    this.triggerNotification(newNotification)
    
    return newNotification
  }

  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return [...this.notifications]
  }

  /**
   * Get unread notifications
   */
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read)
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true)
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId)
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications = []
  }

  /**
   * Get notification preferences
   */
  getPreferences(): NotificationPreferences {
    return { ...this.preferences }
  }

  /**
   * Update notification preferences
   */
  updatePreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences }
  }

  /**
   * Notify when stream is created
   */
  notifyStreamCreated(stream: Stream): Notification {
    if (!this.preferences.streamCreated) {
      return this.createEmptyNotification()
    }

    return this.addNotification({
      type: 'stream_created',
      title: 'New Stream Created',
      message: `Stream ${stream.id.slice(0, 8)}... has been created with rate $${stream.ratePerSecond.toFixed(6)}/s`,
      streamId: stream.id,
      data: { stream },
    })
  }

  /**
   * Notify when stream is paused
   */
  notifyStreamPaused(stream: Stream, reason?: string): Notification {
    if (!this.preferences.streamPaused) {
      return this.createEmptyNotification()
    }

    return this.addNotification({
      type: 'stream_paused',
      title: 'Stream Paused',
      message: `Stream ${stream.id.slice(0, 8)}... has been paused${reason ? `: ${reason}` : ''}`,
      streamId: stream.id,
      data: { stream, reason },
    })
  }

  /**
   * Notify when stream is resumed
   */
  notifyStreamResumed(stream: Stream): Notification {
    if (!this.preferences.streamResumed) {
      return this.createEmptyNotification()
    }

    return this.addNotification({
      type: 'stream_resumed',
      title: 'Stream Resumed',
      message: `Stream ${stream.id.slice(0, 8)}... has been resumed`,
      streamId: stream.id,
      data: { stream },
    })
  }

  /**
   * Notify when stream ends
   */
  notifyStreamEnded(stream: Stream): Notification {
    if (!this.preferences.streamEnded) {
      return this.createEmptyNotification()
    }

    return this.addNotification({
      type: 'stream_ended',
      title: 'Stream Ended',
      message: `Stream ${stream.id.slice(0, 8)}... has ended`,
      streamId: stream.id,
      data: { stream },
    })
  }

  /**
   * Notify when milestone is reached
   */
  notifyMilestoneReached(stream: Stream, milestone: string, amount: number): Notification {
    if (!this.preferences.milestoneReached) {
      return this.createEmptyNotification()
    }

    return this.addNotification({
      type: 'milestone_reached',
      title: 'Milestone Reached!',
      message: `Stream ${stream.id.slice(0, 8)}... has reached ${milestone}: $${amount.toFixed(2)}`,
      streamId: stream.id,
      data: { stream, milestone, amount },
    })
  }

  /**
   * Notify when withdrawal is completed
   */
  notifyWithdrawalCompleted(streamId: string, amount: number): Notification {
    if (!this.preferences.withdrawalCompleted) {
      return this.createEmptyNotification()
    }

    return this.addNotification({
      type: 'withdrawal_completed',
      title: 'Withdrawal Completed',
      message: `Successfully withdrew $${amount.toFixed(2)} from stream ${streamId.slice(0, 8)}...`,
      streamId,
      data: { amount },
    })
  }

  /**
   * Notify error
   */
  notifyError(message: string, streamId?: string): Notification {
    if (!this.preferences.errors) {
      return this.createEmptyNotification()
    }

    return this.addNotification({
      type: 'error',
      title: 'Error',
      message,
      streamId,
      data: { error: message },
    })
  }

  /**
   * Notify warning
   */
  notifyWarning(message: string, streamId?: string): Notification {
    if (!this.preferences.warnings) {
      return this.createEmptyNotification()
    }

    return this.addNotification({
      type: 'warning',
      title: 'Warning',
      message,
      streamId,
      data: { warning: message },
    })
  }

  /**
   * Check for milestones and notify
   */
  checkMilestones(stream: Stream, currentEarnings: number): void {
    const milestones = [100, 500, 1000, 5000, 10000, 50000, 100000]
    
    for (const milestone of milestones) {
      if (currentEarnings >= milestone && currentEarnings < milestone * 1.01) {
        this.notifyMilestoneReached(stream, `$${milestone}`, milestone)
      }
    }
  }

  private triggerNotification(notification: Notification): void {
    // In a real implementation, this would trigger:
    // - Browser push notifications
    // - Email notifications
    // - In-app alerts
    // - WebSocket events
    
    if (this.preferences.pushEnabled) {
      // Trigger push notification
      console.log('Push notification:', notification)
    }
    
    if (this.preferences.emailEnabled) {
      // Send email notification
      console.log('Email notification:', notification)
    }
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private createEmptyNotification(): Notification {
    return {
      id: '',
      type: 'warning',
      title: '',
      message: '',
      timestamp: 0,
      read: true,
    }
  }
}

export const notificationService = new NotificationService()
