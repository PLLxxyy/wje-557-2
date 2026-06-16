import { useAssessmentStore } from '../stores/assessmentStore'
import { useGoalStore } from '../stores/goalStore'
import { useMeditationStore } from '../stores/meditationStore'
import { useMoodStore } from '../stores/moodStore'
import { useSettingsStore } from '../stores/settingsStore'

export function collectExportData() {
  return {
    exportedAt: new Date().toISOString(),
    moodEntries: useMoodStore().entries,
    meditationSessions: useMeditationStore().sessions,
    assessments: useAssessmentStore().assessments,
    wellnessGoals: useGoalStore().goals,
    settings: useSettingsStore().exportData(),
  }
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
