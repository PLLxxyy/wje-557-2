<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number
    max?: number
    label?: string
    sublabel?: string
    size?: number
  }>(),
  { max: 100, size: 92 },
)

const radius = 42
const circumference = 2 * Math.PI * radius
</script>

<template>
  <div class="progress-ring" :style="{ width: `${props.size}px` }">
    <svg :width="props.size" :height="props.size" viewBox="0 0 100 100" aria-hidden="true">
      <circle class="ring-track" cx="50" cy="50" :r="radius" />
      <circle
        class="ring-fill"
        cx="50"
        cy="50"
        :r="radius"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference * (1 - Math.min(props.value / props.max, 1))"
      />
    </svg>
    <strong>{{ Math.round(Math.min(props.value / props.max, 1) * 100) }}%</strong>
    <span v-if="label">{{ label }}</span>
    <small v-if="sublabel">{{ sublabel }}</small>
  </div>
</template>

