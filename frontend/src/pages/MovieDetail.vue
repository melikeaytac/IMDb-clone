<template>
  <div v-if="movie" class="movie-detail">
    <h1 class="header">
      {{ movie.title }}
      <button class="watchlist-button" @click="handleWatchlist">+ Watchlist</button>
    </h1>

    <div class="media-container">
      <img :src="movie.image_url" :alt="movie.title" class="poster" />
      <div class="trailer">
        <iframe
          v-if="embeddedTrailerUrl"
          :src="embeddedTrailerUrl"
          width="560"
          height="315"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <p>{{ movie.summary }}</p>
    <p><strong>⭐ IMDb Puanı:</strong> {{ movie.imdb_score }}</p>
    <p v-if="message" class="feedback">{{ message }}</p>

    <div class="actors-section">
      <h2>🎭 Oyuncular</h2>
      <ul class="actors-list">
        <li v-for="actor in actors" :key="actor.id">{{ actor.name }}</li>
      </ul>
    </div>

    <div class="review-section">
      <h2>Yorumlar</h2>
      <div v-if="reviews.length === 0">Henüz yorum yok.</div>
      <div v-for="review in reviews" :key="review.id" class="review">
        <p><strong>{{ review.name }} ({{ review.country }})</strong> - ⭐ {{ review.rating }}</p>
        <p>{{ review.comment }}</p>
      </div>

      <div v-if="isAuthenticated" class="add-review">
        <h3>Yorum Ekle</h3>
        <label>
          Puan (1-10):
          <input v-model.number="rating" type="number" min="1" max="10" />
        </label>
        <label>
          Yorum:
          <textarea v-model="comment" placeholder="Yorum yaz..."></textarea>
        </label>
        <button @click="submitReview">Gönder</button>
      </div>
    </div>

    <div class="chart-section">
      <h2>Ülkelere Göre IMDb Puanı</h2>
      <canvas id="ratingChart"></canvas>
    </div>
  </div>

  <div v-else>
    <p>Yükleniyor...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Chart from 'chart.js/auto'

const route = useRoute()
const router = useRouter()

const movie = ref(null)
const actors = ref([])
const reviews = ref([])
const rating = ref(10)
const comment = ref('')
const message = ref('')
const isAuthenticated = !!localStorage.getItem('token')

const getToken = () => localStorage.getItem('token')

const embeddedTrailerUrl = computed(() => {
  if (!movie.value?.trailer_url) return ''
  let url = movie.value.trailer_url.trim()

  if (url.includes('watch?v=')) {
    url = url.replace('watch?v=', 'embed/')
  } else if (url.includes('youtu.be/')) {
    const id = url.split('/').pop()
    url = `https://www.youtube.com/embed/${id}`
  }

  if (!url.startsWith('https://')) {
    url = url.replace('http://', 'https://')
  }

  return url
})

const fetchMovie = async () => {
  try {
    const res = await axios.get(`${import.meta.env.BACKEND_URL}/api/movies/${route.params.id}`)
    movie.value = res.data
  } catch (err) {
    console.error('Film çekilemedi:', err)
  }
}

const fetchActors = async () => {
  try {
    const res = await axios.get(`${import.meta.env.BACKEND_URL}/api/movies/${route.params.id}/actors`)
    actors.value = res.data
  } catch (err) {
    console.error('Oyuncular çekilemedi:', err)
  }
}

const fetchReviews = async () => {
  const movieId = movie.value?.id
  if (!movieId) return

  try {
    const res = await axios.get(`${import.meta.env.BACKEND_URL}/api/reviews/${movieId}`)
    reviews.value = res.data
    drawChart()
  } catch (err) {
    console.error('Yorumlar çekilemedi:', err)
  }
}

const drawChart = () => {
  if (!reviews.value.length) return

  const countryStats = {}
  reviews.value.forEach(r => {
    if (!countryStats[r.country]) {
      countryStats[r.country] = { total: 0, count: 0 }
    }
    countryStats[r.country].total += parseFloat(r.rating)
    countryStats[r.country].count += 1
  })

  const labels = Object.keys(countryStats)
  const data = labels.map(country => {
    const stat = countryStats[country]
    return (stat.total / stat.count).toFixed(1)
  })

  const ctx = document.getElementById('ratingChart')
  if (ctx && ctx.getContext) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Ortalama IMDb Puanı',
          data
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, max: 10 }
        }
      }
    })
  }
}

const handleWatchlist = async () => {
  const token = getToken()
  if (!token) return router.push('/login')

  try {
    await axios.post(
      `${import.meta.env.BACKEND_URL}/api/watchlist`,
      { movie_id: movie.value.id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    message.value = '🎉 Film watchlistine eklendi!'
  } catch (err) {
    message.value = err.response?.data?.error || 'Hata oluştu.'
  }
}

const submitReview = async () => {
  const token = getToken()
  if (!token) return router.push('/login')

  try {
    await axios.post(`${import.meta.env.BACKEND_URL}/api/reviews`, {
      movie_id: movie.value.id,
      rating: rating.value,
      comment: comment.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    message.value = 'Yorum başarıyla eklendi!'
    rating.value = 10
    comment.value = ''
    await fetchReviews()
  } catch (err) {
    message.value = err.response?.data?.error || 'Yorum eklenemedi.'
  }
}

onMounted(async () => {
  await fetchMovie()
  await fetchReviews()
  await fetchActors()
})
</script>

<style scoped>
.movie-detail {
  color: #fff;
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #f5c518;
  flex-wrap: wrap;
}

.watchlist-button {
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: #f5c518;
  color: #000;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.watchlist-button:hover {
  background-color: #d4ac0d;
  transform: scale(1.05);
}

.media-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
  margin-top: 1rem;
}

.poster {
  width: 300px;
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.trailer iframe {
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-top: 1rem;
}

.feedback {
  margin-top: 0.8rem;
  color: #28a745;
  font-weight: 500;
}

.actors-section {
  margin-top: 3rem;
  background: #1f1f1f;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(245, 197, 24, 0.05);
}

.actors-section h2 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: #f5c518;
}

.actors-list {
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.actors-list li {
  background: #333;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  color: #fff;
}

.review-section {
  margin-top: 3rem;
  background: #1b1b1b;
  padding: 2rem;
  border-radius: 12px;
}

.review {
  margin-bottom: 1.2rem;
  border-bottom: 1px solid #333;
  padding-bottom: 1rem;
}

.review p {
  margin: 0.3rem 0;
}

.add-review {
  margin-top: 2rem;
}

.add-review textarea,
.add-review input {
  width: 100%;
  margin: 0.5rem 0 1rem;
  padding: 0.7rem;
  border: none;
  border-radius: 6px;
  background: #333;
  color: #fff;
  font-size: 1rem;
}

.add-review button {
  background-color: #f5c518;
  color: #000;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-review button:hover {
  background-color: #d4ac0d;
  transform: scale(1.03);
}

.chart-section {
  margin-top: 3rem;
  padding: 2rem;
  background: #111;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(245, 197, 24, 0.1);
}

.chart-section h2 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: #f5c518;
}
</style>
