<template>
  <div class="home">
    <Slider />

    <div class="movie-list">
      <h1>{{ language === 'en' ? 'Popular Movies' : 'Popüler Filmler' }}</h1>
      <div class="movie-grid">
        <RouterLink
          v-for="movie in movies"
          :key="movie.id"
          :to="`/movie/${movie.id}`"
          class="movie-card"
        >
          <img :src="movie.image_url" alt="Poster" />
          <h3>{{ movie.title }}</h3>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Slider from '@/components/Slider.vue'

const movies = ref([])
const language = ref('tr')

onMounted(() => {
  const storedLang = localStorage.getItem('home_lang')
  language.value = storedLang || (navigator.language.startsWith('en') ? 'en' : 'tr')
})

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3001/api/movies/popular')
    movies.value = res.data
  } catch (err) {
    console.error('Popüler filmler alınamadı:', err)
  }
})
</script>

<style scoped>
.home {
  padding: 1rem;
}

.movie-list {
  margin-top: 3rem;
}

.movie-list h1 {
  color: white;
  margin-bottom: 1rem;
}

.movie-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.movie-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  text-decoration: none;
  color: white;
  transition: transform 0.2s ease;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
}

.movie-card h3 {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 1rem;
}
</style>
