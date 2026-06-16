import type { MoodEntry } from '../types/mood'
import { cloneForDb, getDatabase, safeDb } from './database'
import { logOperation } from './logRepository'

export async function listMoodEntries() {
  return safeDb(async () => {
    const db = await getDatabase()
    return (await db.getAllFromIndex('moodEntries', 'by-date')).reverse()
  }, [] as MoodEntry[])
}

export async function getMoodByDate(date: string) {
  return safeDb(async () => {
    const db = await getDatabase()
    return db.getFromIndex('moodEntries', 'by-date', date)
  }, undefined as MoodEntry | undefined)
}

export async function saveMoodEntry(entry: MoodEntry) {
  return safeDb(async () => {
    const db = await getDatabase()
    const existing = await db.getFromIndex('moodEntries', 'by-date', entry.date)
    const plainEntry = cloneForDb(existing ? { ...entry, id: existing.id, createdAt: existing.createdAt } : entry)
    await db.put('moodEntries', plainEntry)
    await logOperation(existing ? 'UPDATE' : 'CREATE', 'MoodEntry', existing?.id ?? entry.id, plainEntry)
  }, undefined)
}

export async function deleteMoodEntry(id: string) {
  return safeDb(async () => {
    const db = await getDatabase()
    const entry = await db.get('moodEntries', id)
    await db.delete('moodEntries', id)
    await logOperation('DELETE', 'MoodEntry', id, entry)
  }, undefined)
}

export async function replaceMoodEntries(entries: MoodEntry[]) {
  return safeDb(async () => {
    const db = await getDatabase()
    const tx = db.transaction('moodEntries', 'readwrite')
    await tx.store.clear()
    await Promise.all(entries.map((entry) => tx.store.put(cloneForDb(entry))))
    await tx.done
  }, undefined)
}
