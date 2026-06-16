import type { MeditationType } from '../constants/enums'

export interface MeditationSession {
  id: string
  type: MeditationType
  duration: number
  actualDuration: number
  completedAt: string
  rating: 1 | 2 | 3 | 4 | 5
  notes: string
  interrupted: boolean
}
