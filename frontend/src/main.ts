import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.config.errorHandler = (error) => {
  console.error('[MindWell App]', error)
  window.dispatchEvent(new CustomEvent('mindwell:toast', { detail: '页面遇到异常，但你的本地数据仍在浏览器中。' }))
}

app.use(createPinia())
app.use(router)
app.mount('#app')
