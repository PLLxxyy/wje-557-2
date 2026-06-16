import type { OperationLog } from '../types/log'
import { createId } from '../utils/id'
import { cloneForDb, getDatabase, safeDb } from './database'

export async function logOperation(
  action: OperationLog['action'],
  entity: string,
  entityId: string,
  snapshot: unknown,
) {
  const entry: OperationLog = {
    id: createId('log'),
    action,
    entity,
    entityId,
    timestamp: new Date().toISOString(),
    snapshot: cloneForDb(snapshot),
  }
  await safeDb(async () => {
    const db = await getDatabase()
    await db.put('operationLogs', entry)
  }, undefined)
}

export async function listLogs() {
  return safeDb(async () => {
    const db = await getDatabase()
    return (await db.getAllFromIndex('operationLogs', 'by-timestamp')).reverse()
  }, [] as OperationLog[])
}

export async function clearLogs() {
  return safeDb(async () => {
    const db = await getDatabase()
    await db.clear('operationLogs')
  }, undefined)
}
