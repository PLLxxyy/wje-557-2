import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settingsStore'

export function useTheme() {
  const store = useSettingsStore()
  return {
    ...storeToRefs(store),
    setTheme: store.setTheme,
  }
}
