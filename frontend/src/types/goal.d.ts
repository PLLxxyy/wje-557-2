import type { GoalCategory } from '../constants/enums'

export interface WellnessGoal {
  id: string
  category: GoalCategory
  title: string
  target: number
  current: number
  unit: string
  deadline: string
  status: 'active' | 'completed' | 'expired'
  createdAt: string
}
