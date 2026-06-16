import type { MeditationSession } from '../types/meditation'
import { cloneForDb, getDatabase, safeDb } from './database'
import { logOperation } from './logRepository'

export async function listMeditationSessions() {
  return safeDb(async () => {
    const db = await getDatabase()
    return (await db.getAllFromIndex('meditationSessions', 'by-completedAt')).reverse()
  }, [] as MeditationSession[])
}

export async function saveMeditationSession(session: MeditationSession) {
  return safeDb(async () => {
    const db = await getDatabase()
    const plainSession = cloneForDb(session)
    await db.put('meditationSessions', plainSession)
    await logOperation('CREATE', 'MeditationSession', session.id, plainSession)
  }, undefined)
}

export async function replaceMeditationSessions(sessions: MeditationSession[]) {
  return safeDb(async () => {
    const db = await getDatabase()
    const tx = db.transaction('meditationSessions', 'readwrite')
    await tx.store.clear()
    await Promise.all(sessions.map((session) => tx.store.put(cloneForDb(session))))
    await tx.done
  }, undefined)
}
