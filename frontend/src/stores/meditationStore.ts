import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { MeditationType } from '../constants/enums'
import { listMeditationSessions, replaceMeditationSessions, saveMeditationSession } from '../db/meditationRepository'
import type { MeditationSession } from '../types/meditation'
import { createId } from '../utils/id'

export const useMeditationStore = defineStore('meditation', () => {
  const sessions = ref<MeditationSession[]>([])

  const totalMinutes = computed(() => sessions.value.reduce((sum, session) => sum + session.actualDuration, 0))
  const completedCount = computed(() => sessions.value.filter((session) => !session.interrupted).length)
  const typeDistribution = computed(() => {
    return Object.values(MeditationType).map((type) => ({
      type,
      count: sessions.value.filter((session) => session.type === type).length,
    }))
  })

  async function load() {
    sessions.value = await listMeditationSessions()
  }

  async function complete(input: {
    type: MeditationType
    duration: number
    actualDuration: number
    rating: 1 | 2 | 3 | 4 | 5
    notes: string
    interrupted: boolean
  }) {
    const session: MeditationSession = {
      id: createId('meditation'),
      completedAt: new Date().toISOString(),
      ...input,
    }
    await saveMeditationSession(session)
    await load()
  }

  async function replaceAll(data: MeditationSession[]) {
    await replaceMeditationSessions(data)
    await load()
  }

  return { sessions, totalMinutes, completedCount, typeDistribution, load, complete, replaceAll }
})
