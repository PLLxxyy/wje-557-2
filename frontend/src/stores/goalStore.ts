import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { GoalCategory } from '../constants/enums'
import { deleteGoal, listGoals, replaceGoals, saveGoal } from '../db/goalRepository'
import type { WellnessGoal } from '../types/goal'
import { toDateKey } from '../utils/date'
import { createId } from '../utils/id'

export const useGoalStore = defineStore('goal', () => {
  const goals = ref<WellnessGoal[]>([])
  const activeGoals = computed(() => goals.value.filter((goal) => goal.status === 'active'))

  async function load() {
    goals.value = await listGoals()
    if (!goals.value.length) {
      await seedGoals()
    }
  }

  async function seedGoals() {
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 14)
    const defaults: WellnessGoal[] = [
      { id: createId('goal'), category: GoalCategory.SLEEP, title: '平均睡眠 7.5 小时', target: 7.5, current: 6.8, unit: '小时', deadline: toDateKey(deadline), status: 'active', createdAt: new Date().toISOString() },
      { id: createId('goal'), category: GoalCategory.MEDITATION, title: '本周冥想 60 分钟', target: 60, current: 20, unit: '分钟', deadline: toDateKey(deadline), status: 'active', createdAt: new Date().toISOString() },
    ]
    await replaceGoals(defaults)
    goals.value = defaults
  }

  async function save(input: Omit<WellnessGoal, 'id' | 'createdAt' | 'status'> & { id?: string; status?: WellnessGoal['status'] }) {
    const goal: WellnessGoal = {
      id: input.id ?? createId('goal'),
      category: input.category,
      title: input.title,
      target: input.target,
      current: input.current,
      unit: input.unit,
      deadline: input.deadline,
      status: input.status ?? (input.current >= input.target ? 'completed' : 'active'),
      createdAt: new Date().toISOString(),
    }
    await saveGoal(goal)
    await load()
  }

  async function remove(id: string) {
    await deleteGoal(id)
    await load()
  }

  async function replaceAll(data: WellnessGoal[]) {
    await replaceGoals(data)
    await load()
  }

  return { goals, activeGoals, load, save, remove, replaceAll }
})
