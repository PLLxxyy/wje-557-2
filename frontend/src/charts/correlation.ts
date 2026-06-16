import type { MoodEntry } from '../types/mood'

export function sleepMoodCorrelationOption(entries: MoodEntry[]) {
  return {
    grid: { left: 34, right: 16, top: 24, bottom: 32 },
    tooltip: { formatter: (params: { data: [number, number, string] }) => `${params.data[2]}<br/>睡眠 ${params.data[0]}h / 心情 ${params.data[1]}` },
    xAxis: { name: '睡眠', min: 0, max: 12 },
    yAxis: { name: '心情', min: 1, max: 5 },
    series: [{ type: 'scatter', symbolSize: 14, data: entries.map((entry) => [entry.sleepHours, entry.mood, entry.date]) }],
  }
}
