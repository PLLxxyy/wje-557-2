import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { EmotionTag, MoodLevel } from '../constants/enums'
import type { MoodEntry } from '../types/mood'
import { createId } from '../utils/id'
import { toDateKey } from '../utils/date'
import { deleteMoodEntry, getMoodByDate, listMoodEntries, replaceMoodEntries, saveMoodEntry } from '../db/moodRepository'

export const useMoodStore = defineStore('mood', () => {
  const entries = ref<MoodEntry[]>([])
  const loading = ref(false)

  const latestEntry = computed(() => entries.value[0])
  const monthlyAverage = computed(() => {
    if (!entries.value.length) return 0
    return Number((entries.value.reduce((sum, item) => sum + item.mood, 0) / entries.value.length).toFixed(1))
  })

  async function load() {
    loading.value = true
    entries.value = await listMoodEntries()
    loading.value = false
  }

  async function upsert(input: Partial<MoodEntry> & { date: string; mood: MoodLevel }) {
    const now = new Date().toISOString()
    const existing = await getMoodByDate(input.date)
    const entry: MoodEntry = {
      id: existing?.id ?? createId('mood'),
      date: input.date,
      mood: input.mood,
      emotions: input.emotions ?? existing?.emotions ?? [EmotionTag.CALM],
      triggers: input.triggers ?? existing?.triggers ?? [],
      note: input.note ?? existing?.note ?? '',
      activities: input.activities ?? existing?.activities ?? [],
      sleepHours: input.sleepHours ?? existing?.sleepHours ?? 7,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    }
    await saveMoodEntry(entry)
    await load()
  }

  async function remove(id: string) {
    await deleteMoodEntry(id)
    await load()
  }

  async function replaceAll(data: MoodEntry[]) {
    await replaceMoodEntries(data)
    await load()
  }

  function today() {
    return entries.value.find((entry) => entry.date === toDateKey())
  }

  const dateSet = computed(() => new Set(entries.value.map((e) => e.date)))

  const currentStreak = computed(() => {
    const dates = dateSet.value
    if (!dates.size) return 0
    const today = toDateKey()
    if (!dates.has(today)) return 0
    let streak = 0
    const cursor = new Date()
    while (dates.has(toDateKey(cursor))) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    }
    return streak
  })

  const longestStreak = computed(() => {
    if (!entries.value.length) return 0
    const sorted = [...new Set(entries.value.map((e) => e.date))].sort()
    let max = 1
    let run = 1
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1])
      const curr = new Date(sorted[i])
      const diff = Math.round((curr.getTime() - prev.getTime()) / 86_400_000)
      run = diff === 1 ? run + 1 : 1
      if (run > max) max = run
    }
    return max
  })

  const monthlyRecordRate = computed(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysPassed = Math.min(now.getDate(), daysInMonth)
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`
    const recorded = entries.value.filter((e) => e.date.startsWith(prefix)).length
    return Math.round((recorded / daysPassed) * 100)
  })

  return { entries, loading, latestEntry, monthlyAverage, currentStreak, longestStreak, monthlyRecordRate, load, upsert, remove, replaceAll, today }
})
