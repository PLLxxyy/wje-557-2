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

  return { entries, loading, latestEntry, monthlyAverage, load, upsert, remove, replaceAll, today }
})
