import { AssessmentType } from './enums'

export interface AssessmentQuestion {
  id: string
  text: string
  dimension: string
}

export const assessmentQuestions: Record<AssessmentType.PHQ9 | AssessmentType.GAD7, AssessmentQuestion[]> = {
  [AssessmentType.PHQ9]: [
    { id: 'phq1', text: '做事时提不起劲或没有兴趣', dimension: '兴趣' },
    { id: 'phq2', text: '感到心情低落、沮丧或绝望', dimension: '情绪' },
    { id: 'phq3', text: '入睡困难、睡不安稳或睡眠过多', dimension: '睡眠' },
    { id: 'phq4', text: '感觉疲倦或没有活力', dimension: '精力' },
    { id: 'phq5', text: '食欲不振或吃太多', dimension: '饮食' },
    { id: 'phq6', text: '觉得自己很糟或让自己/家人失望', dimension: '自我评价' },
    { id: 'phq7', text: '难以集中注意力', dimension: '专注' },
    { id: 'phq8', text: '动作或说话慢到别人可察觉，或坐立不安', dimension: '活动' },
    { id: 'phq9', text: '出现伤害自己的想法', dimension: '风险' },
  ],
  [AssessmentType.GAD7]: [
    { id: 'gad1', text: '感到紧张、焦虑或急切', dimension: '紧张' },
    { id: 'gad2', text: '无法停止或控制担忧', dimension: '控制' },
    { id: 'gad3', text: '对各种事情担忧过多', dimension: '担忧' },
    { id: 'gad4', text: '很难放松下来', dimension: '放松' },
    { id: 'gad5', text: '坐立不安，难以安静坐着', dimension: '活动' },
    { id: 'gad6', text: '容易烦躁或易怒', dimension: '易激惹' },
    { id: 'gad7', text: '感到好像会发生可怕的事', dimension: '预期' },
  ],
}

export const answerOptions = [
  { label: '完全没有', score: 0 },
  { label: '几天', score: 1 },
  { label: '一半以上天数', score: 2 },
  { label: '几乎每天', score: 3 },
]
