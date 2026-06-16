import type { MoodEntry } from '../types/mood'

export function moodHeatmapOption(entries: MoodEntry[]) {
  return {
    tooltip: {},
    calendar: {
      top: 18,
      left: 20,
      right: 20,
      cellSize: ['auto', 24],
      range: new Date().getFullYear().toString(),
      itemStyle: { borderWidth: 2, borderColor: 'rgba(255,255,255,.8)' },
    },
    visualMap: { min: 1, max: 5, show: false, inRange: { color: ['#d66b5f', '#e5ad69', '#f3d98b', '#9fc985', '#5aa897'] } },
    series: [{ type: 'heatmap', coordinateSystem: 'calendar', data: entries.map((entry) => [entry.date, entry.mood]) }],
  }
}
