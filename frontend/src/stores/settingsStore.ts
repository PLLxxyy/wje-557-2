import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { ThemeType } from '../constants/enums'

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<ThemeType>((localStorage.getItem('mindwell-theme') as ThemeType) || ThemeType.WARM)

  watch(
    theme,
    (value) => {
      document.documentElement.dataset.theme = value
      localStorage.setItem('mindwell-theme', value)
    },
    { immediate: true },
  )

  function setTheme(value: ThemeType) {
    theme.value = value
  }

  function exportData() {
    return { theme: theme.value }
  }

  function importData(data: { theme?: ThemeType }) {
    if (data.theme && Object.values(ThemeType).includes(data.theme)) {
      setTheme(data.theme)
    }
  }

  return { theme, setTheme, exportData, importData }
})
