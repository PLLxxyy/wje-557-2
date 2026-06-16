import type { Assessment } from '../types/assessment'
import { cloneForDb, getDatabase, safeDb } from './database'
import { logOperation } from './logRepository'

export async function listAssessments() {
  return safeDb(async () => {
    const db = await getDatabase()
    return (await db.getAllFromIndex('assessments', 'by-completedAt')).reverse()
  }, [] as Assessment[])
}

export async function saveAssessment(assessment: Assessment) {
  return safeDb(async () => {
    const db = await getDatabase()
    const plainAssessment = cloneForDb(assessment)
    await db.put('assessments', plainAssessment)
    await logOperation('CREATE', 'Assessment', assessment.id, plainAssessment)
  }, undefined)
}

export async function replaceAssessments(assessments: Assessment[]) {
  return safeDb(async () => {
    const db = await getDatabase()
    const tx = db.transaction('assessments', 'readwrite')
    await tx.store.clear()
    await Promise.all(assessments.map((assessment) => tx.store.put(cloneForDb(assessment))))
    await tx.done
  }, undefined)
}
