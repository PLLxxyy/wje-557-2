import type { Assessment } from '../types/assessment'
import type { WellnessGoal } from '../types/goal'
import type { MeditationSession } from '../types/meditation'
import type { MoodEntry } from '../types/mood'

export interface MindWellImportPayload {
  moodEntries?: MoodEntry[]
  meditationSessions?: MeditationSession[]
  assessments?: Assessment[]
  wellnessGoals?: WellnessGoal[]
  settings?: Record<string, unknown>
}

export function validateImportPayload(input: unknown): MindWellImportPayload {
  if (!input || typeof input !== 'object') {
    throw new Error('导入文件不是有效对象')
  }
  const payload = input as MindWellImportPayload
  for (const key of ['moodEntries', 'meditationSessions', 'assessments', 'wellnessGoals'] as const) {
    if (payload[key] && !Array.isArray(payload[key])) {
      throw new Error(`${key} 必须是数组`)
    }
  }
  return payload
}
