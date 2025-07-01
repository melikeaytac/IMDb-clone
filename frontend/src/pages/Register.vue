<template>
  <div class="form-wrapper">
    <h2>Kayıt Ol</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="name" type="text" placeholder="Ad" required />
      <input v-model="email" type="email" placeholder="E-posta" required />
      <input v-model="password" type="password" placeholder="Şifre" required />
      <input v-model="country" type="text" placeholder="Ülke" required />
      <input v-model="city" type="text" placeholder="Şehir" required />
      <input type="file" accept="image/*" @change="handleFileChange" />
      <button type="submit">Kayıt Ol</button>
      <p v-if="message">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const country = ref('')
const city = ref('')
const message = ref('')
const photoBase64 = ref('')
const router = useRouter()

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      photoBase64.value = reader.result // base64 string
    }
    reader.readAsDataURL(file)
  }
}

const handleRegister = async () => {
  try {
    await axios.post('${import.meta.env.BACKEND_URL}/api/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      country: country.value,
      city: city.value,
      photo_url: photoBase64.value // base64 gönderiliyor
    })

    message.value = 'Kayıt başarılı, yönlendiriliyorsunuz...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    message.value = err.response?.data?.error || 'Kayıt başarısız'
  }
}
</script>
