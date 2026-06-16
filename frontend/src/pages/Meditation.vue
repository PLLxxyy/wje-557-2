<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import EChartPanel from '../components/common/EChartPanel.vue'
import ProgressRing from '../components/common/ProgressRing.vue'
import { meditationStatsOption } from '../charts/meditationStats'
import { MeditationType } from '../constants/enums'
import { useMeditation } from '../hooks/useMeditation'

const { sessions, totalMinutes, completedCount, loadMeditations, completeMeditation } = useMeditation()
const selectedType = ref(MeditationType.BREATH)
const duration = ref(5)
const remaining = ref(0)
const running = ref(false)
let timer: number | undefined

const progress = computed(() => {
  const total = duration.value * 60
  return total ? ((total - remaining.value) / total) * 100 : 0
})

onMounted(loadMeditations)
onUnmounted(() => window.clearInterval(timer))

function start() {
  running.value = true
  remaining.value = duration.value * 60
  timer = window.setInterval(async () => {
    remaining.value -= 1
    if (remaining.value <= 0) {
      await finish(false)
    }
  }, 1000)
}

async function finish(interrupted: boolean) {
  window.clearInterval(timer)
  running.value = false
  const actualDuration = Math.max(1, Math.round((duration.value * 60 - remaining.value) / 60))
  await completeMeditation({
    type: selectedType.value,
    duration: duration.value,
    actualDuration,
    rating: interrupted ? 3 : 5,
    notes: interrupted ? '提前结束，仍然保留了练习记录。' : '完成一次稳定练习。',
    interrupted,
  })
  remaining.value = 0
}
</script>

<template>
  <section class="page-heading">
    <p class="eyebrow">Meditation</p>
    <h1>冥想练习</h1>
    <p>选择练习类型和时长，进入一个低刺激的计时空间。</p>
  </section>

  <section class="workspace-grid">
    <div class="surface meditation-stage">
      <div class="type-grid">
        <button v-for="type in Object.values(MeditationType)" :key="type" :class="{ active: selectedType === type }" type="button" @click="selectedType = type">
          <strong>{{ type }}</strong>
          <small>{{ type === MeditationType.BREATH ? '稳定节律' : type === MeditationType.BODY_SCAN ? '扫描身体' : type === MeditationType.MINDFULNESS ? '观察当下' : '温柔祝福' }}</small>
        </button>
      </div>

      <label>
        计划时长
        <input v-model.number="duration" min="1" max="60" type="range" />
        <span>{{ duration }} 分钟</span>
      </label>

      <div class="breathing-orb" :class="{ running }">
        <ProgressRing :value="progress" :max="100" :size="180" :label="running ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}` : '准备'" :sublabel="selectedType" />
      </div>

      <div class="action-row">
        <button class="primary-action" type="button" :disabled="running" @click="start">开始</button>
        <button type="button" :disabled="!running" @click="finish(true)">提前结束</button>
      </div>
    </div>

    <aside class="surface">
      <div class="metric-stack">
        <div><strong>{{ completedCount }}</strong><span>累计次数</span></div>
        <div><strong>{{ totalMinutes }}</strong><span>总分钟</span></div>
      </div>
      <EChartPanel title="本周练习时长" :option="meditationStatsOption(sessions)" />
    </aside>
  </section>
</template>

