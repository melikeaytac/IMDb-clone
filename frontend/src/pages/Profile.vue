<template>
  <div class="profile-card">
    <img v-if="photo_url" :src="photo_url" alt="Profil Fotoğrafı" class="profile-pic" />
    <h1>Merhaba, <span>{{ name }}</span></h1>
    <p><strong>E-posta:</strong> {{ email }}</p>
    <p><strong>Ülke:</strong> {{ country }}</p>
    <p><strong>Şehir:</strong> {{ city }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { default as jwt_decode } from 'jwt-decode'
import axios from 'axios'

const router = useRouter()
const name = ref('')
const email = ref('')
const country = ref('')
const city = ref('')
const photo_url = ref('')

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const decoded = jwt_decode(token)
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${decoded.id}`)

    name.value = res.data.name
    email.value = res.data.email
    country.value = res.data.country
    city.value = res.data.city
    photo_url.value = res.data.photo_url
  } catch (err) {
    console.error('Profil verileri yüklenemedi:', err)
  }
})
</script>

<style scoped>
.profile-card {
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #1c1c1c;
  color: #fff;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
}

.profile-pic {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid #f5c518;
}

h1 {
  margin-bottom: 1rem;
  font-size: 2rem;
  color: #f5c518;
}

p {
  margin: 0.5rem 0;
  font-size: 1rem;
}
</style>
