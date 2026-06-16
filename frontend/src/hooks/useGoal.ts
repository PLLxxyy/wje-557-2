import { storeToRefs } from 'pinia'
import { useGoalStore } from '../stores/goalStore'

export function useGoal() {
  const store = useGoalStore()
  return {
    ...storeToRefs(store),
    loadGoals: store.load,
    saveGoal: store.save,
    removeGoal: store.remove,
  }
}
