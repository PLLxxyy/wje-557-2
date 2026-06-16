import { storeToRefs } from 'pinia'
import { useMeditationStore } from '../stores/meditationStore'

export function useMeditation() {
  const store = useMeditationStore()
  return {
    ...storeToRefs(store),
    loadMeditations: store.load,
    completeMeditation: store.complete,
  }
}
