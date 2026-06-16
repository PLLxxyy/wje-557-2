import type { WellnessGoal } from '../types/goal'
import { cloneForDb, getDatabase, safeDb } from './database'
import { logOperation } from './logRepository'

export async function listGoals() {
  return safeDb(async () => {
    const db = await getDatabase()
    return await db.getAll('wellnessGoals')
  }, [] as WellnessGoal[])
}

export async function saveGoal(goal: WellnessGoal) {
  return safeDb(async () => {
    const db = await getDatabase()
    const existing = await db.get('wellnessGoals', goal.id)
    const plainGoal = cloneForDb(goal)
    await db.put('wellnessGoals', plainGoal)
    await logOperation(existing ? 'UPDATE' : 'CREATE', 'WellnessGoal', goal.id, plainGoal)
  }, undefined)
}

export async function deleteGoal(id: string) {
  return safeDb(async () => {
    const db = await getDatabase()
    const goal = await db.get('wellnessGoals', id)
    await db.delete('wellnessGoals', id)
    await logOperation('DELETE', 'WellnessGoal', id, goal)
  }, undefined)
}

export async function replaceGoals(goals: WellnessGoal[]) {
  return safeDb(async () => {
    const db = await getDatabase()
    const tx = db.transaction('wellnessGoals', 'readwrite')
    await tx.store.clear()
    await Promise.all(goals.map((goal) => tx.store.put(cloneForDb(goal))))
    await tx.done
  }, undefined)
}
