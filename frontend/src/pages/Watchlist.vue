<template>
  <div class="watchlist">
  
    <h1>📺 Watchlist’in</h1>
    <div v-if="movies.length">
      <div v-for="movie in movies" :key="movie.id" class="movie-card">
        <RouterLink :to="`/movie/${movie.id}`">
          <img :src="movie.image_url" alt="poster" />
          <p>{{ movie.title }}</p>
        </RouterLink>
      </div>
    </div>
    <p v-else>Watchlist’in boş 💤</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const movies = ref([])
const router = useRouter()
const token = localStorage.getItem('token')

onMounted(async () => {
  if (!token) return router.push('/login')

  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/watchlist`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    movies.value = res.data
  } catch (err) {
    console.error('Watchlist alınamadı:', err)
  }
})
</script>

<style scoped>
.watchlist {
  padding: 2rem;
}
.movie-card {
  display: inline-block;
  margin: 1rem;
  width: 150px;
  text-align: center;
}
.movie-card img {
  width: 100%;
  border-radius: 8px;
}
</style>
