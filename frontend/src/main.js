import './assets/main.css'
import { user } from './stores/user.js'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app.use(router)

app.mount('#app')
const savedUser = localStorage.getItem('user')
if (savedUser) {
  const parsed = JSON.parse(savedUser)
  user.name = parsed.name
  user.isLoggedIn = true
}
