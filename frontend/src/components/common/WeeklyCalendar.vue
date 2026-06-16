<script setup lang="ts">
import { computed } from 'vue'
import { moodOptions } from '../../constants/emotions'
import type { MoodEntry } from '../../types/mood'
import { toDateKey } from '../../utils/date'

const props = defineProps<{
  entries: MoodEntry[]
  selectedDate?: string
}>()

const emit = defineEmits<{
  select: [date: string]
}>()

const days = computed(() => {
  const today = new Date()
  const day = today.getDay() || 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - day + 1)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    const key = toDateKey(date)
    const entry = props.entries.find((item) => item.date === key)
    const mood = moodOptions.find((option) => option.level === entry?.mood)
    return { key, label: ['一', '二', '三', '四', '五', '六', '日'][index], date: date.getDate(), mood }
  })
})
</script>

<template>
  <div class="weekly-calendar">
    <button
      v-for="day in days"
      :key="day.key"
      class="week-day"
      :class="{ selected: selectedDate === day.key }"
      type="button"
      @click="emit('select', day.key)"
    >
      <small>周{{ day.label }}</small>
      <strong>{{ day.date }}</strong>
      <span :style="{ background: day.mood?.tone ?? 'var(--line)' }">{{ day.mood?.emoji ?? '' }}</span>
    </button>
  </div>
</template>

