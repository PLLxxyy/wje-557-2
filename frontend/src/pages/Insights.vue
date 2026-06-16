<script setup lang="ts">
import { computed, onMounted } from 'vue'
import EChartPanel from '../components/common/EChartPanel.vue'
import ProgressRing from '../components/common/ProgressRing.vue'
import { emotionDistributionOption } from '../charts/emotionDistribution'
import { moodTrendOption } from '../charts/moodTrend'
import { sleepMoodCorrelationOption } from '../charts/correlation'
import { assessmentRadarOption } from '../charts/assessmentRadar'
import { moodHeatmapOption } from '../charts/moodHeatmap'
import { useAssessment } from '../hooks/useAssessment'
import { useMeditation } from '../hooks/useMeditation'
import { useMood } from '../hooks/useMood'

const { entries, monthlyAverage, loadMood, currentStreak, longestStreak, monthlyRecordRate } = useMood()
const { totalMinutes, loadMeditations } = useMeditation()
const { latest, loadAssessments } = useAssessment()

onMounted(() => Promise.all([loadMood(), loadMeditations(), loadAssessments()]))

const sleepAverage = computed(() => {
  if (!entries.value.length) return 0
  return Number((entries.value.reduce((sum, entry) => sum + entry.sleepHours, 0) / entries.value.length).toFixed(1))
})
</script>

<template>
  <section class="page-heading">
    <p class="eyebrow">Insights</p>
    <h1>数据洞察</h1>
    <p>把情绪、睡眠、冥想和测评放在一起观察。</p>
  </section>

  <section class="metric-grid">
    <div class="surface metric-card"><strong>{{ monthlyAverage }}</strong><span>平均心情</span></div>
    <div class="surface metric-card"><strong>{{ sleepAverage }}h</strong><span>平均睡眠</span></div>
    <div class="surface metric-card"><strong>{{ monthlyRecordRate }}%</strong><span>本月记录率</span></div>
    <div class="surface metric-card"><strong>{{ longestStreak }}天</strong><span>最长连续</span></div>
    <div class="surface metric-card"><strong>{{ totalMinutes }}</strong><span>冥想分钟</span></div>
    <div class="surface metric-card"><strong>{{ latest?.severity ?? '暂无' }}</strong><span>最新测评</span></div>
  </section>

  <section class="chart-grid">
    <EChartPanel title="年度心情热力图" :option="moodHeatmapOption(entries)" />
    <EChartPanel title="情绪与睡眠相关性" :option="sleepMoodCorrelationOption(entries)" />
    <EChartPanel title="心情趋势" :option="moodTrendOption(entries)" />
    <EChartPanel title="触发情绪分布" :option="emotionDistributionOption(entries)" />
    <EChartPanel title="测评维度" :option="assessmentRadarOption(latest)" />
  </section>

  <section class="surface insight-summary">
    <ProgressRing :value="monthlyAverage" :max="5" label="心情均值" />
    <p>
      当前记录显示，睡眠均值为 {{ sleepAverage }} 小时。若散点图集中在低睡眠与低心情区域，可以优先把目标拆成更小的睡眠修复动作。
    </p>
  </section>
</template>

