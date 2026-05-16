import { Stream } from './index'

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: number
  streamIds: string[]
  status: 'active' | 'completed' | 'failed' | 'paused'
  category: 'savings' | 'investment' | 'expense' | 'milestone'
  createdAt: number
  completedAt?: number
  description?: string
}

export interface GoalProgress {
  goalId: string
  percentage: number
  remainingAmount: number
  estimatedCompletionDate?: number
  onTrack: boolean
  dailyContribution: number
}

export class GoalTrackingService {
  private goals: Goal[] = []

  /**
   * Create a new goal
   */
  createGoal(goal: Omit<Goal, 'id' | 'currentAmount' | 'status' | 'createdAt'>): Goal {
    const newGoal: Goal = {
      ...goal,
      id: this.generateId(),
      currentAmount: 0,
      status: 'active',
      createdAt: Date.now(),
    }
    
    this.goals.push(newGoal)
    return newGoal
  }

  /**
   * Get all goals
   */
  getGoals(): Goal[] {
    return [...this.goals]
  }

  /**
   * Get active goals
   */
  getActiveGoals(): Goal[] {
    return this.goals.filter(goal => goal.status === 'active')
  }

  /**
   * Get goal by ID
   */
  getGoal(goalId: string): Goal | undefined {
    return this.goals.find(goal => goal.id === goalId)
  }

  /**
   * Update goal
   */
  updateGoal(goalId: string, updates: Partial<Goal>): Goal | undefined {
    const goal = this.getGoal(goalId)
    if (!goal) return undefined

    Object.assign(goal, updates)
    return goal
  }

  /**
   * Delete goal
   */
  deleteGoal(goalId: string): boolean {
    const index = this.goals.findIndex(goal => goal.id === goalId)
    if (index === -1) return false
    
    this.goals.splice(index, 1)
    return true
  }

  /**
   * Add contribution to goal
   */
  addContribution(goalId: string, amount: number): Goal | undefined {
    const goal = this.getGoal(goalId)
    if (!goal || goal.status !== 'active') return undefined

    goal.currentAmount += amount

    // Check if goal is completed
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed'
      goal.completedAt = Date.now()
    }

    return goal
  }

  /**
   * Calculate goal progress
   */
  calculateProgress(goalId: string, streams: Stream[]): GoalProgress | undefined {
    const goal = this.getGoal(goalId)
    if (!goal) return undefined

    const percentage = (goal.currentAmount / goal.targetAmount) * 100
    const remainingAmount = goal.targetAmount - goal.currentAmount
    
    // Calculate total rate from associated streams
    const associatedStreams = streams.filter(s => goal.streamIds.indexOf(s.id) !== -1)
    const totalRate = associatedStreams.reduce((sum, s) => sum + s.ratePerSecond, 0)
    
    // Estimate completion date
    let estimatedCompletionDate: number | undefined
    let onTrack = true
    
    if (totalRate > 0 && remainingAmount > 0) {
      const secondsNeeded = remainingAmount / totalRate
      estimatedCompletionDate = Date.now() + (secondsNeeded * 1000)
      
      // Check if on track to meet deadline
      onTrack = estimatedCompletionDate <= goal.deadline
    } else if (remainingAmount > 0) {
      onTrack = false
    }

    // Calculate daily contribution
    const dailyContribution = totalRate * 86400

    return {
      goalId,
      percentage,
      remainingAmount,
      estimatedCompletionDate,
      onTrack,
      dailyContribution,
    }
  }

  /**
   * Get all goals progress
   */
  getAllGoalsProgress(streams: Stream[]): GoalProgress[] {
    return this.goals
      .map(goal => this.calculateProgress(goal.id, streams))
      .filter((progress): progress is GoalProgress => progress !== undefined)
  }

  /**
   * Check for failed goals (past deadline)
   */
  checkFailedGoals(): Goal[] {
    const now = Date.now()
    const failedGoals: Goal[] = []

    for (const goal of this.goals) {
      if (goal.status === 'active' && now > goal.deadline) {
        goal.status = 'failed'
        failedGoals.push(goal)
      }
    }

    return failedGoals
  }

  /**
   * Get goals by category
   */
  getGoalsByCategory(category: Goal['category']): Goal[] {
    return this.goals.filter(goal => goal.category === category)
  }

  /**
   * Get goals summary statistics
   */
  getSummary(): {
    totalGoals: number
    activeGoals: number
    completedGoals: number
    failedGoals: number
    totalTargetAmount: number
    totalCurrentAmount: number
    overallProgress: number
  } {
    const activeGoals = this.goals.filter(g => g.status === 'active').length
    const completedGoals = this.goals.filter(g => g.status === 'completed').length
    const failedGoals = this.goals.filter(g => g.status === 'failed').length
    const totalTargetAmount = this.goals.reduce((sum, g) => sum + g.targetAmount, 0)
    const totalCurrentAmount = this.goals.reduce((sum, g) => sum + g.currentAmount, 0)
    const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0

    return {
      totalGoals: this.goals.length,
      activeGoals,
      completedGoals,
      failedGoals,
      totalTargetAmount,
      totalCurrentAmount,
      overallProgress,
    }
  }

  /**
   * Create a savings goal
   */
  createSavingsGoal(
    name: string,
    targetAmount: number,
    deadline: number,
    streamIds: string[],
    description?: string
  ): Goal {
    return this.createGoal({
      name,
      targetAmount,
      deadline,
      streamIds,
      category: 'savings',
      description,
    })
  }

  /**
   * Create an investment goal
   */
  createInvestmentGoal(
    name: string,
    targetAmount: number,
    deadline: number,
    streamIds: string[],
    description?: string
  ): Goal {
    return this.createGoal({
      name,
      targetAmount,
      deadline,
      streamIds,
      category: 'investment',
      description,
    })
  }

  /**
   * Create a milestone goal
   */
  createMilestoneGoal(
    name: string,
    targetAmount: number,
    deadline: number,
    streamIds: string[],
    description?: string
  ): Goal {
    return this.createGoal({
      name,
      targetAmount,
      deadline,
      streamIds,
      category: 'milestone',
      description,
    })
  }

  /**
   * Pause a goal
   */
  pauseGoal(goalId: string): Goal | undefined {
    return this.updateGoal(goalId, { status: 'paused' })
  }

  /**
   * Resume a goal
   */
  resumeGoal(goalId: string): Goal | undefined {
    return this.updateGoal(goalId, { status: 'active' })
  }

  /**
   * Get upcoming deadlines
   */
  getUpcomingDeadlines(days: number = 7): Array<{ goal: Goal; daysRemaining: number }> {
    const now = Date.now()
    const cutoff = now + (days * 86400000)

    return this.goals
      .filter(goal => goal.status === 'active' && goal.deadline <= cutoff)
      .map(goal => ({
        goal,
        daysRemaining: Math.ceil((goal.deadline - now) / 86400000),
      }))
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
  }

  private generateId(): string {
    return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export const goalTrackingService = new GoalTrackingService()
