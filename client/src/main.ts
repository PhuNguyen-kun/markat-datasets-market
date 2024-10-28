import './assets/css/reset.css'
import './assets/css/base.css'
import './assets/css/main.css'
import './assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
