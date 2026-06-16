import { storeToRefs } from 'pinia'
import { useMoodStore } from '../stores/moodStore'

export function useMood() {
  const store = useMoodStore()
  return {
    ...storeToRefs(store),
    loadMood: store.load,
    saveMood: store.upsert,
    removeMood: store.remove,
    todayMood: store.today,
  }
}
