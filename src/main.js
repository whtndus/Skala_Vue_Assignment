import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/main.css'
import 'element-plus/es/components/skeleton/style/css'

createApp(App).use(createPinia()).use(router).mount('#app')
