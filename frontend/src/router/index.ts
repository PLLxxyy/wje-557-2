import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home, meta: { title: '今日心情' } },
    { path: '/journal', name: 'journal', component: () => import('../pages/Journal.vue'), meta: { title: '情绪日记' } },
    { path: '/meditation', name: 'meditation', component: () => import('../pages/Meditation.vue'), meta: { title: '冥想练习' } },
    { path: '/assessment', name: 'assessment', component: () => import('../pages/Assessment.vue'), meta: { title: '心理测评' } },
    { path: '/insights', name: 'insights', component: () => import('../pages/Insights.vue'), meta: { title: '数据洞察' } },
    { path: '/settings', name: 'settings', component: () => import('../pages/Settings.vue'), meta: { title: '设置' } },
  ],
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title ?? 'MindWell')} · MindWell`
  const logs = JSON.parse(localStorage.getItem('mindwell-route-logs') || '[]') as unknown[]
  logs.unshift({ path: to.path, title: to.meta.title, timestamp: new Date().toISOString() })
  localStorage.setItem('mindwell-route-logs', JSON.stringify(logs.slice(0, 50)))
})
