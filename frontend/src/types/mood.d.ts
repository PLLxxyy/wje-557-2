import type { EmotionTag, MoodLevel } from '../constants/enums'

export interface MoodEntry {
  id: string
  date: string
  mood: MoodLevel
  emotions: EmotionTag[]
  triggers: string[]
  note: string
  activities: string[]
  sleepHours: number
  createdAt: string
  updatedAt: string
}
