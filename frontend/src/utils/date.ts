export function toDateKey(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

export function formatDate(date: string | Date) {
  const value = typeof date === 'string' ? new Date(date) : date
  return value.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

export function daysAgo(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (count - 1 - index))
    return toDateKey(date)
  })
}
