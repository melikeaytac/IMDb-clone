<template>
  <div class="login">
    <h2>🎬 IMDb Giriş</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="📧 E-posta" required />
      <input v-model="password" type="password" placeholder="🔒 Şifre" required />
      <button type="submit">Giriş Yap</button>
    </form>

    <button @click="googleLogin" class="google-button">
      <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" width="20" style="vertical-align: middle; margin-right: 8px;" />
      Google ile Giriş Yap
    </button>

    <p v-if="message" class="message">{{ message }}</p>

    <div class="register-prompt">
      <span>Hesabın yok mu?</span>
      <RouterLink to="/register" class="register-link">Kayıt Ol</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { user } from '@/stores/user.js'

const email = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()
const route = useRoute()

const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:3001/api/auth/login', {
      email: email.value,
      password: password.value
    })

    const token = res.data.token
    const decoded = jwt_decode(token)

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(decoded))
    user.name = decoded.name
    user.isLoggedIn = true

    message.value = '🎉 Giriş başarılı, yönlendiriliyorsunuz...'
    setTimeout(() => router.push('/'), 1500)
  } catch (err) {
    message.value = err.response?.data?.error || '❌ Giriş başarısız'
  }
}

const googleLogin = () => {
  window.location.href = 'http://localhost:3001/api/auth/google'
}

onMounted(() => {
  const token = route.query.token
  if (token) {
    try {
      const decoded = jwt_decode(token)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(decoded))
      user.name = decoded.name
      user.isLoggedIn = true
      router.push('/')
    } catch (err) {
      console.error('Token çözümlemede hata:', err)
    }
  }
})
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background-color: #121212;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  color: #fff;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #f5c518;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.6rem;
  border: 1px solid #444;
  border-radius: 4px;
  background: #1e1e1e;
  color: #fff;
}

input::placeholder {
  color: #aaa;
}

button {
  padding: 0.6rem 1rem;
  margin-top: 0.5rem;
  width: 100%;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type='submit'] {
  background-color: #f5c518;
  color: #000;
}

button[type='submit']:hover {
  background-color: #ffe066;
}

.google-button {
  background-color: #4285f4;
  color: white;
  margin-top: 1rem;
}

.google-button:hover {
  background-color: #357ae8;
}

.message {
  margin-top: 1rem;
  color: #f5c518;
  text-align: center;
}

.register-prompt {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
  color: #ccc;
}

.register-link {
  color: #f5c518;
  margin-left: 0.4rem;
  text-decoration: underline;
  cursor: pointer;
}
</style>
