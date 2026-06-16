<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MoodEmoji from '../components/common/MoodEmoji.vue'
import ProgressRing from '../components/common/ProgressRing.vue'
import WeeklyCalendar from '../components/common/WeeklyCalendar.vue'
import { emotionOptions, encouragements } from '../constants/emotions'
import { EmotionTag, MoodLevel } from '../constants/enums'
import { useGoal } from '../hooks/useGoal'
import { useMood } from '../hooks/useMood'
import { toDateKey } from '../utils/date'

const { entries, loadMood, saveMood, todayMood } = useMood()
const { activeGoals, loadGoals } = useGoal()

const selectedDate = ref(toDateKey())
const selectedMood = ref<MoodLevel>(MoodLevel.GOOD)
const selectedEmotions = ref<EmotionTag[]>([EmotionTag.CALM])
const triggers = ref('')
const activities = ref('')
const sleepHours = ref(7)
const note = ref('')

const greeting = encouragements[new Date().getDate() % encouragements.length]
const todayLabel = computed(() => new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }))

onMounted(async () => {
  await Promise.all([loadMood(), loadGoals()])
  hydrateForm()
})

function hydrateForm() {
  const entry = selectedDate.value === toDateKey() ? todayMood() : entries.value.find((item) => item.date === selectedDate.value)
  if (!entry) return
  selectedMood.value = entry.mood
  selectedEmotions.value = entry.emotions
  triggers.value = entry.triggers.join('、')
  activities.value = entry.activities.join('、')
  sleepHours.value = entry.sleepHours
  note.value = entry.note
}

async function submit() {
  await saveMood({
    date: selectedDate.value,
    mood: selectedMood.value,
    emotions: selectedEmotions.value,
    triggers: triggers.value.split(/[、,，]/).map((item) => item.trim()).filter(Boolean),
    activities: activities.value.split(/[、,，]/).map((item) => item.trim()).filter(Boolean),
    sleepHours: Number(sleepHours.value),
    note: note.value,
  })
  window.dispatchEvent(new CustomEvent('mindwell:toast', { detail: '今日心情已安全保存在本地。' }))
}

function toggleEmotion(tag: EmotionTag) {
  selectedEmotions.value = selectedEmotions.value.includes(tag)
    ? selectedEmotions.value.filter((item) => item !== tag)
    : [...selectedEmotions.value, tag]
}
</script>

<template>
  <section class="hero-panel">
    <div>
      <p class="eyebrow">{{ todayLabel }}</p>
      <h1>今天的心情，先在这里轻轻放下。</h1>
      <p>{{ greeting }}</p>
    </div>
    <WeeklyCalendar :entries="entries" :selected-date="selectedDate" @select="(date) => { selectedDate = date; hydrateForm() }" />
  </section>

  <section class="workspace-grid">
    <form class="surface mood-form" @submit.prevent="submit">
      <div class="section-title">
        <h2>快速记录</h2>
        <span>{{ selectedDate }}</span>
      </div>
      <MoodEmoji v-model="selectedMood" />

      <label class="field-label">情绪标签</label>
      <div class="tag-cloud">
        <button
          v-for="emotion in emotionOptions"
          :key="emotion.value"
          type="button"
          :class="{ active: selectedEmotions.includes(emotion.value) }"
          @click="toggleEmotion(emotion.value)"
        >
          {{ emotion.value }}
        </button>
      </div>

      <div class="form-row">
        <label>
          触发因素
          <input v-model="triggers" placeholder="工作、社交、天气" />
        </label>
        <label>
          当日活动
          <input v-model="activities" placeholder="散步、阅读、训练" />
        </label>
      </div>
      <label>
        睡眠时长
        <input v-model.number="sleepHours" min="0" max="16" step="0.5" type="number" />
      </label>
      <label>
        日记
        <textarea v-model="note" rows="5" placeholder="写下一个具体场景、身体感受或需要被照顾的念头。" />
      </label>
      <button class="primary-action" type="submit">保存记录</button>
    </form>

    <aside class="surface goal-panel">
      <div class="section-title">
        <h2>活跃目标</h2>
        <RouterLink to="/settings">管理</RouterLink>
      </div>
      <div v-for="goal in activeGoals" :key="goal.id" class="goal-item">
        <ProgressRing :value="goal.current" :max="goal.target" :label="goal.unit" :sublabel="goal.category" />
        <div>
          <strong>{{ goal.title }}</strong>
          <p>{{ goal.current }} / {{ goal.target }} {{ goal.unit }} · {{ goal.deadline }} 前</p>
        </div>
      </div>
    </aside>
  </section>
</template>

