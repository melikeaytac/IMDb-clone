<template>
  <div class="slider-wrapper" v-if="movies.length && movies[currentIndex]">
    <div class="main-slider">

      <button class="arrow left" @click="prevMovie">‹</button>

      <div class="video-container">
        <iframe
          :src="getYoutubeEmbedUrl(movies[currentIndex].trailer_url)"
          frameborder="0"
          allowfullscreen
          class="trailer-video"
        ></iframe>

        <RouterLink :to="`/movie/${movies[currentIndex].id}`" class="video-overlay">
          <img
            v-if="movies[currentIndex].image_url"
            :src="movies[currentIndex].image_url"
            alt="poster"
            class="poster-overlay"
          />
          <div class="overlay">
            <h2>{{ movies[currentIndex].title }}</h2>
            <p>IMDb: {{ movies[currentIndex].imdb_score }}</p>
          </div>
        </RouterLink>
      </div>

      <button class="arrow right" @click="nextMovie">›</button>
    </div>

    <div class="up-next">
      <h3>Up Next</h3>
      <RouterLink
        v-for="(movie, index) in upcomingMovies.slice(0, 2)"
        :key="index"
        :to="`/movie/${movie.id}`"
        class="up-next-item"
      >
        <img :src="movie.image_url" alt="poster" />
        <p>{{ movie.title }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const movies = ref([])
const currentIndex = ref(0)
const interval = ref(null)

const fetchMovies = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movies/slider`)
    movies.value = res.data
  } catch (err) {
    console.error('Slider veri çekme hatası:', err)
  }
}

const getYoutubeEmbedUrl = (url) => {
  if (!url) return ''
  const videoId = url.includes('embed/')
    ? url.split('embed/')[1]
    : url.split('v=')[1]?.split('&')[0]
  return `https://www.youtube.com/embed/${videoId}?controls=1`
}

const upcomingMovies = computed(() => {
  if (!movies.value.length) return []
  return movies.value.slice(currentIndex.value + 1).concat(
    movies.value.slice(0, currentIndex.value)
  )
})

const nextMovie = () => {
  currentIndex.value = (currentIndex.value + 1) % movies.value.length
}

const prevMovie = () => {
  currentIndex.value =
    (currentIndex.value - 1 + movies.value.length) % movies.value.length
}

onMounted(async () => {
  await fetchMovies()
  interval.value = setInterval(() => {
    nextMovie()
  }, 12000)
})
</script>

<style scoped>
.slider-wrapper {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  background: #111;
  padding: 1rem;
  border-radius: 8px;
  position: relative;
}

.main-slider {
  flex: 3;
  position: relative;
}

.video-container {
  position: relative;
}

.trailer-video {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  z-index: 1;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: white;
}

.poster-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 100px;
  height: auto;
  border-radius: 6px;
  z-index: 4;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
}

.overlay {
  position: absolute;
  bottom: 20px;
  left: 140px;
  background: rgba(0, 0, 0, 0.6);
  padding: 1rem;
  border-radius: 6px;
  z-index: 4;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 2rem;
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
  z-index: 5;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.arrow:hover {
  background: rgba(255, 255, 255, 0.4);
}

.arrow.left {
  left: 10px;
}

.arrow.right {
  right: 10px;
}

.up-next {
  flex: 1;
  color: white;
}

.up-next-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  text-align: center;
  text-decoration: none;
  color: white;
  transition: transform 0.2s ease;
}

.up-next-item:hover {
  transform: scale(1.05);
}

.up-next-item img {
  width: 100px;
  height: auto;
  border-radius: 6px;
  object-fit: cover;
}
</style>
