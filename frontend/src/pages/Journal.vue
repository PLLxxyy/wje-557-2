<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import EChartPanel from '../components/common/EChartPanel.vue'
import EmptyState from '../components/common/EmptyState.vue'
import MoodEmoji from '../components/common/MoodEmoji.vue'
import { emotionDistributionOption } from '../charts/emotionDistribution'
import { moodHeatmapOption } from '../charts/moodHeatmap'
import { moodTrendOption } from '../charts/moodTrend'
import { EmotionTag, MoodLevel } from '../constants/enums'
import { useMood } from '../hooks/useMood'

const { entries, loadMood } = useMood()
const selectedMood = ref<MoodLevel | 'all'>('all')
const selectedEmotion = ref<EmotionTag | 'all'>('all')

onMounted(loadMood)

const filteredEntries = computed(() =>
  entries.value.filter((entry) => {
    const moodMatch = selectedMood.value === 'all' || entry.mood === selectedMood.value
    const emotionMatch = selectedEmotion.value === 'all' || entry.emotions.includes(selectedEmotion.value)
    return moodMatch && emotionMatch
  }),
)
</script>

<template>
  <section class="page-heading">
    <p class="eyebrow">Journal</p>
    <h1>情绪日记</h1>
    <p>按日期回顾情绪、睡眠、触发因素和活动记录。</p>
  </section>

  <section class="chart-grid">
    <EChartPanel title="年度心情热力" :option="moodHeatmapOption(entries)" />
    <EChartPanel title="月度心情趋势" :option="moodTrendOption(filteredEntries)" />
    <EChartPanel title="情绪标签分布" :option="emotionDistributionOption(filteredEntries)" />
  </section>

  <section class="surface">
    <div class="filter-row">
      <select v-model="selectedMood">
        <option value="all">全部心情</option>
        <option :value="MoodLevel.VERY_BAD">很差</option>
        <option :value="MoodLevel.BAD">较差</option>
        <option :value="MoodLevel.NEUTRAL">一般</option>
        <option :value="MoodLevel.GOOD">较好</option>
        <option :value="MoodLevel.VERY_GOOD">很好</option>
      </select>
      <select v-model="selectedEmotion">
        <option value="all">全部情绪</option>
        <option v-for="tag in Object.values(EmotionTag)" :key="tag" :value="tag">{{ tag }}</option>
      </select>
    </div>

    <EmptyState v-if="!filteredEntries.length" title="还没有符合条件的记录" description="回到今日页记录一次心情后，这里会出现完整回顾。" />
    <article v-for="entry in filteredEntries" v-else :key="entry.id" class="journal-entry">
      <div>
        <time>{{ entry.date }}</time>
        <MoodEmoji :model-value="entry.mood" compact />
      </div>
      <p>{{ entry.note || '没有写正文，只有当日心情标签。' }}</p>
      <small>情绪：{{ entry.emotions.join('、') }} · 睡眠 {{ entry.sleepHours }}h · 活动：{{ entry.activities.join('、') || '未记录' }}</small>
    </article>
  </section>
</template>

