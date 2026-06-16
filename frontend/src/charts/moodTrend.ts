import type { MoodEntry } from '../types/mood'

export function moodTrendOption(entries: MoodEntry[]) {
  const chronological = [...entries].reverse()
  return {
    grid: { left: 30, right: 16, top: 24, bottom: 28 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: chronological.map((entry) => entry.date.slice(5)), boundaryGap: false },
    yAxis: { min: 1, max: 5, interval: 1 },
    series: [
      {
        name: '心情',
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.18 },
        data: chronological.map((entry) => entry.mood),
      },
    ],
  }
}
