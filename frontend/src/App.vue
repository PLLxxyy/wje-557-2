<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">MW</span>
        <span>
          <strong>MindWell</strong>
          <small>本地隐私情绪管理</small>
        </span>
      </RouterLink>
      <ThemeToggle />
    </header>

    <main class="content-shell">
      <RouterView />
    </main>

    <nav class="bottom-nav" aria-label="主导航">
      <RouterLink to="/">今日</RouterLink>
      <RouterLink to="/journal">日记</RouterLink>
      <RouterLink to="/meditation">冥想</RouterLink>
      <RouterLink to="/assessment">测评</RouterLink>
      <RouterLink to="/insights">洞察</RouterLink>
      <RouterLink to="/settings">设置</RouterLink>
    </nav>
  </div>
  <div id="toast-root" class="toast-root" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ThemeToggle from './components/common/ThemeToggle.vue'

onMounted(() => {
  window.addEventListener('mindwell:toast', ((event: CustomEvent<string>) => {
    const root = document.querySelector('#toast-root')
    if (!root) return
    const item = document.createElement('div')
    item.className = 'toast-item'
    item.textContent = event.detail
    root.appendChild(item)
    window.setTimeout(() => item.remove(), 2600)
  }) as EventListener)
})
</script>
