import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Assessment } from '../types/assessment'
import type { WellnessGoal } from '../types/goal'
import type { OperationLog } from '../types/log'
import type { MeditationSession } from '../types/meditation'
import type { MoodEntry } from '../types/mood'

interface MindWellSchema extends DBSchema {
  moodEntries: {
    key: string
    value: MoodEntry
    indexes: { 'by-date': string }
  }
  meditationSessions: {
    key: string
    value: MeditationSession
    indexes: { 'by-completedAt': string }
  }
  assessments: {
    key: string
    value: Assessment
    indexes: { 'by-completedAt': string }
  }
  wellnessGoals: {
    key: string
    value: WellnessGoal
    indexes: { 'by-status': string }
  }
  operationLogs: {
    key: string
    value: OperationLog
    indexes: { 'by-timestamp': string }
  }
}

let dbPromise: Promise<IDBPDatabase<MindWellSchema>> | null = null

export function getDatabase() {
  if (!dbPromise) {
    dbPromise = openDB<MindWellSchema>('mindwell-private-db', 1, {
      upgrade(db) {
        const moodStore = db.createObjectStore('moodEntries', { keyPath: 'id' })
        moodStore.createIndex('by-date', 'date', { unique: true })

        const meditationStore = db.createObjectStore('meditationSessions', { keyPath: 'id' })
        meditationStore.createIndex('by-completedAt', 'completedAt')

        const assessmentStore = db.createObjectStore('assessments', { keyPath: 'id' })
        assessmentStore.createIndex('by-completedAt', 'completedAt')

        const goalStore = db.createObjectStore('wellnessGoals', { keyPath: 'id' })
        goalStore.createIndex('by-status', 'status')

        const logStore = db.createObjectStore('operationLogs', { keyPath: 'id' })
        logStore.createIndex('by-timestamp', 'timestamp')
      },
    })
  }
  return dbPromise
}

export async function safeDb<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error('[MindWell DB]', error)
    window.dispatchEvent(new CustomEvent('mindwell:toast', { detail: '本地数据操作失败，请稍后重试。' }))
    return fallback
  }
}

export function cloneForDb<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
