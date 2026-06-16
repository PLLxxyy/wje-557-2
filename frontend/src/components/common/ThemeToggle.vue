<script setup lang="ts">
import { ThemeType } from '../../constants/enums'
import { useTheme } from '../../hooks/useTheme'

const { theme, setTheme } = useTheme()
</script>

<template>
  <div class="theme-toggle" aria-label="主题切换">
    <button
      v-for="item in [
        { value: ThemeType.WARM, label: '暖' },
        { value: ThemeType.COOL, label: '蓝' },
        { value: ThemeType.DARK, label: '夜' },
      ]"
      :key="item.value"
      type="button"
      :class="{ active: theme === item.value }"
      @click="setTheme(item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

