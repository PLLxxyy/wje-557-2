import type { MeditationSession } from '../types/meditation'

export function meditationStatsOption(sessions: MeditationSession[]) {
  const latest = [...sessions].slice(0, 7).reverse()
  return {
    grid: { left: 30, right: 16, top: 24, bottom: 28 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: latest.map((session) => session.completedAt.slice(5, 10)) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: latest.map((session) => session.actualDuration), barWidth: 18, itemStyle: { borderRadius: [6, 6, 0, 0] } }],
  }
}
