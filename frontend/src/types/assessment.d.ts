import type { AssessmentType, SeverityLevel } from '../constants/enums'
import type { AssessmentQuestion } from '../constants/assessment-questions'

export interface Assessment {
  id: string
  type: AssessmentType
  questions: AssessmentQuestion[]
  answers: number[]
  totalScore: number
  severity: SeverityLevel
  completedAt: string
  recommendations: string[]
}
