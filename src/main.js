import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.devtools = (process.env.NODE_ENV === 'development')

app.use(router)
app.mount('#app')
