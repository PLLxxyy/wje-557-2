<script setup lang="ts">
import { onMounted, ref } from 'vue'
import EmptyState from '../components/common/EmptyState.vue'
import ThemeToggle from '../components/common/ThemeToggle.vue'
import { listLogs } from '../db/logRepository'
import { useAssessmentStore } from '../stores/assessmentStore'
import { useGoalStore } from '../stores/goalStore'
import { useMeditationStore } from '../stores/meditationStore'
import { useMoodStore } from '../stores/moodStore'
import type { OperationLog } from '../types/log'
import { collectExportData, downloadJson } from '../utils/export'
import { validateImportPayload } from '../utils/import'

const logs = ref<OperationLog[]>([])
const confirmText = ref('')

onMounted(async () => {
  logs.value = await listLogs()
})

function exportAll() {
  downloadJson(`mindwell-export-${new Date().toISOString().slice(0, 10)}.json`, collectExportData())
}

async function importFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const payload = validateImportPayload(JSON.parse(await file.text()))
    if (payload.moodEntries) await useMoodStore().replaceAll(payload.moodEntries)
    if (payload.meditationSessions) await useMeditationStore().replaceAll(payload.meditationSessions)
    if (payload.assessments) await useAssessmentStore().replaceAll(payload.assessments)
    if (payload.wellnessGoals) await useGoalStore().replaceAll(payload.wellnessGoals)
    window.dispatchEvent(new CustomEvent('mindwell:toast', { detail: '导入完成。' }))
  } catch (error) {
    window.dispatchEvent(new CustomEvent('mindwell:toast', { detail: error instanceof Error ? error.message : '导入失败。' }))
  }
}

async function clearAll() {
  if (confirmText.value !== '清除所有数据') return
  indexedDB.deleteDatabase('mindwell-private-db')
  localStorage.removeItem('mindwell-route-logs')
  window.dispatchEvent(new CustomEvent('mindwell:toast', { detail: '本地数据已清除，请刷新页面。' }))
}
</script>

<template>
  <section class="page-heading">
    <p class="eyebrow">Settings</p>
    <h1>设置与数据管理</h1>
    <p>所有数据都留在本地浏览器，你可以随时导入、导出或清除。</p>
  </section>

  <section class="workspace-grid">
    <div class="surface settings-card">
      <div class="section-title">
        <h2>主题</h2>
        <ThemeToggle />
      </div>
      <div class="section-title">
        <h2>数据导出</h2>
        <button class="primary-action" type="button" @click="exportAll">导出 JSON</button>
      </div>
      <label>
        导入数据
        <input accept="application/json" type="file" @change="importFile" />
      </label>
      <label>
        清除确认
        <input v-model="confirmText" placeholder="输入：清除所有数据" />
      </label>
      <button type="button" :disabled="confirmText !== '清除所有数据'" @click="clearAll">清除所有数据</button>
    </div>

    <aside class="surface">
      <div class="section-title">
        <h2>操作日志</h2>
        <span>{{ logs.length }} 条</span>
      </div>
      <EmptyState v-if="!logs.length" title="暂无写操作日志" description="创建或更新记录后，这里会展示 IndexedDB 审计记录。" />
      <article v-for="log in logs.slice(0, 12)" v-else :key="log.id" class="history-row">
        <strong>{{ log.action }} {{ log.entity }}</strong>
        <span>{{ log.entityId.slice(0, 8) }}</span>
        <time>{{ log.timestamp.slice(0, 19).replace('T', ' ') }}</time>
      </article>
    </aside>
  </section>
</template>

