<script setup lang="ts">
import { moodOptions } from '../../constants/emotions'
import type { MoodLevel } from '../../constants/enums'

defineProps<{
  modelValue?: MoodLevel
  compact?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: MoodLevel]
}>()
</script>

<template>
  <div class="mood-emoji" :class="{ compact }" role="radiogroup" aria-label="选择心情等级">
    <button
      v-for="option in moodOptions"
      :key="option.level"
      class="mood-button"
      :class="{ active: modelValue === option.level }"
      :style="{ '--tone': option.tone }"
      type="button"
      role="radio"
      :aria-checked="modelValue === option.level"
      @click="emit('update:modelValue', option.level)"
    >
      <span>{{ option.emoji }}</span>
      <small>{{ option.label }}</small>
    </button>
  </div>
</template>

