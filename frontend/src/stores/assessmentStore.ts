import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { assessmentQuestions } from '../constants/assessment-questions'
import { AssessmentType, SeverityLevel } from '../constants/enums'
import { listAssessments, replaceAssessments, saveAssessment } from '../db/assessmentRepository'
import type { Assessment } from '../types/assessment'
import { createId } from '../utils/id'

function severityFor(type: AssessmentType, score: number) {
  if (type === AssessmentType.PHQ9) {
    if (score >= 20) return SeverityLevel.SEVERE
    if (score >= 10) return SeverityLevel.MODERATE
    if (score >= 5) return SeverityLevel.MILD
    return SeverityLevel.NORMAL
  }
  if (score >= 15) return SeverityLevel.SEVERE
  if (score >= 10) return SeverityLevel.MODERATE
  if (score >= 5) return SeverityLevel.MILD
  return SeverityLevel.NORMAL
}

function recommendationsFor(severity: SeverityLevel) {
  if (severity === SeverityLevel.NORMAL) return ['保持规律作息', '继续记录情绪变化', '每周安排一次轻量运动']
  if (severity === SeverityLevel.MILD) return ['减少连续高压时段', '尝试 5 分钟呼吸练习', '和可信任的人聊聊近况']
  if (severity === SeverityLevel.MODERATE) return ['考虑预约专业咨询', '优先稳定睡眠和饮食', '记录触发因素并减少暴露']
  return ['尽快联系专业心理健康服务', '告知身边可信任的人', '避免独处处理强烈痛苦感受']
}

export const useAssessmentStore = defineStore('assessment', () => {
  const assessments = ref<Assessment[]>([])
  const latest = computed(() => assessments.value[0])

  async function load() {
    assessments.value = await listAssessments()
  }

  async function submit(type: AssessmentType.PHQ9 | AssessmentType.GAD7, answers: number[]) {
    const totalScore = answers.reduce((sum, item) => sum + item, 0)
    const severity = severityFor(type, totalScore)
    const assessment: Assessment = {
      id: createId('assessment'),
      type,
      questions: assessmentQuestions[type],
      answers,
      totalScore,
      severity,
      completedAt: new Date().toISOString(),
      recommendations: recommendationsFor(severity),
    }
    await saveAssessment(assessment)
    await load()
  }

  async function replaceAll(data: Assessment[]) {
    await replaceAssessments(data)
    await load()
  }

  return { assessments, latest, load, submit, replaceAll }
})
