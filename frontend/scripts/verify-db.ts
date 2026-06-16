import 'fake-indexeddb/auto'
import { EmotionTag, MoodLevel } from '../src/constants/enums'
import { getMoodByDate, listMoodEntries, saveMoodEntry } from '../src/db/moodRepository'

if (!globalThis.window) {
  Object.defineProperty(globalThis, 'window', {
    value: {
      dispatchEvent() {
        return true
      },
    },
  })
}

const entry = {
  id: 'verify-mood-1',
  date: '2026-06-16',
  mood: MoodLevel.VERY_GOOD,
  emotions: [EmotionTag.HAPPY, EmotionTag.CALM],
  triggers: ['自动化验证'],
  note: 'IndexedDB repository verification',
  activities: ['散步'],
  sleepHours: 7.5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

await saveMoodEntry(entry)
const byDate = await getMoodByDate(entry.date)
const list = await listMoodEntries()

if (!byDate || byDate.note !== entry.note || list.length !== 1) {
  throw new Error('MoodEntry repository verification failed')
}

console.log(JSON.stringify({ ok: true, saved: byDate.date, count: list.length }))
