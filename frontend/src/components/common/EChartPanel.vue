<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, GaugeChart, HeatmapChart, LineChart, PieChart, RadarChart, ScatterChart } from 'echarts/charts'
import { CalendarComponent, GridComponent, LegendComponent, RadarComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  CalendarComponent,
  CanvasRenderer,
  GaugeChart,
  GridComponent,
  HeatmapChart,
  LegendComponent,
  LineChart,
  PieChart,
  RadarChart,
  RadarComponent,
  ScatterChart,
  TooltipComponent,
  VisualMapComponent,
])

const props = defineProps<{
  title?: string
  option: Record<string, unknown>
}>()

const chartEl = ref<HTMLDivElement>()
let chart: echarts.ECharts | undefined

function render() {
  if (!chartEl.value) return
  try {
    chart ??= echarts.init(chartEl.value)
    chart.setOption(props.option, true)
  } catch (error) {
    console.error('[MindWell Chart]', error)
    window.dispatchEvent(new CustomEvent('mindwell:toast', { detail: '图表渲染失败，已保留其他内容。' }))
  }
}

function resize() {
  chart?.resize()
}

watch(() => props.option, render, { deep: true })
onMounted(() => {
  render()
  window.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
})
</script>

<template>
  <section class="chart-panel">
    <h2 v-if="title">{{ title }}</h2>
    <div ref="chartEl" class="chart-canvas" />
  </section>
</template>

