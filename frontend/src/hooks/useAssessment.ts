import { storeToRefs } from 'pinia'
import { useAssessmentStore } from '../stores/assessmentStore'

export function useAssessment() {
  const store = useAssessmentStore()
  return {
    ...storeToRefs(store),
    loadAssessments: store.load,
    submitAssessment: store.submit,
  }
}
