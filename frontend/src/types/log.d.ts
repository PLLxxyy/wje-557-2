export interface OperationLog {
  id: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  entity: string
  entityId: string
  timestamp: string
  snapshot: unknown
}
