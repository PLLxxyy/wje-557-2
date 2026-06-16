import type { MoodEntry } from '../types/mood'
import { toDateKey } from '../utils/date'

export function moodHeatmapOption(entries: MoodEntry[]) {
  const year = new Date().getFullYear().toString()
  const today = toDateKey()
  const yearStart = new Date(Number(year), 0, 1)
  const todayDate = new Date(today)
  const moodMap = new Map(entries.map((e) => [e.date, e.mood]))
  const allDays: [string, number][] = []
  for (const d = new Date(yearStart); d <= todayDate; d.setDate(d.getDate() + 1)) {
    const key = toDateKey(d)
    allDays.push([key, moodMap.get(key) ?? 0])
  }
  return {
    tooltip: {
      formatter(params: { value?: [string, number]; data?: [string, number] }) {
        const val = params.value ?? params.data
        if (!val) return ''
        const [date, mood] = val
        return mood === 0 ? `${date}<br/>未记录` : `${date}<br/>心情：${mood}`
      },
    },
    calendar: {
      top: 18,
      left: 20,
      right: 20,
      cellSize: ['auto', 24],
      range: year,
      itemStyle: { borderWidth: 2, borderColor: 'rgba(255,255,255,.8)' },
    },
    visualMap: {
      min: 0,
      max: 5,
      show: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      itemWidth: 12,
      itemHeight: 80,
      text: ['很好', '未记录'],
      inRange: { color: ['#d9d0c7', '#d66b5f', '#e5ad69', '#f3d98b', '#9fc985', '#5aa897'] },
    },
    series: [{ type: 'heatmap', coordinateSystem: 'calendar', data: allDays }],
  }
}
