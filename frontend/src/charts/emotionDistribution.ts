import { emotionOptions } from '../constants/emotions'
import type { MoodEntry } from '../types/mood'

export function emotionDistributionOption(entries: MoodEntry[]) {
  const counts = emotionOptions.map((option) => ({
    name: option.value,
    value: entries.reduce((count, entry) => count + (entry.emotions.includes(option.value) ? 1 : 0), 0),
  }))
  return {
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: ['42%', '70%'], avoidLabelOverlap: true, data: counts.filter((item) => item.value > 0) }],
  }
}
