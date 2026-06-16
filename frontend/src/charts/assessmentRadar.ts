import type { Assessment } from '../types/assessment'

export function assessmentRadarOption(assessment?: Assessment) {
  const indicators = assessment?.questions.slice(0, 6).map((question) => ({ name: question.dimension, max: 3 })) ?? [
    { name: '暂无测评', max: 3 },
  ]
  const values = assessment?.answers.slice(0, 6) ?? [0]
  return {
    tooltip: {},
    radar: { indicator: indicators, radius: '62%' },
    series: [{ type: 'radar', data: [{ value: values, name: assessment?.type ?? '暂无测评' }], areaStyle: { opacity: 0.18 } }],
  }
}
