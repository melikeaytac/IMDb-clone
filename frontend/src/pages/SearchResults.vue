<template>
  <div class="search-results-page">
    <h2>Arama Sonuçları</h2>
    <p v-if="loading">Yükleniyor...</p>
    <p v-if="!loading && results.length === 0">Sonuç bulunamadı</p>

    <ul v-if="results.length > 0">
      <li v-for="movie in results" :key="movie.id">
        <RouterLink :to="`/movie/${movie.id}`">{{ movie.title }}</RouterLink>
        <p class="summary">{{ movie.summary }}</p>
        <span class="match-info">
          <span v-if="movie.match_type === 'title'">🎬 Başlıkta eşleşti</span>
          <span v-else-if="movie.match_type === 'summary'">📄 Özette eşleşti</span>
          <span v-else-if="movie.match_type === 'actor'">🧑‍🎤 Oyuncuda eşleşti</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const results = ref([])
const loading = ref(true)

onMounted(async () => {
  const searchText = route.query.q
  const searchType = route.query.type || 'all'

  try {
    const res = await axios.get('${import.meta.env.BACKEND_URL}/api/movies/search', {
      params: {
        q: searchText,
        type: searchType
      }
    })
    results.value = res.data
  } catch (err) {
    console.error('Arama sonucu alınamadı:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.search-results-page {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  color: #fff;
}

.search-results-page ul {
  list-style: none;
  padding: 0;
}

.search-results-page li {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #444;
}

.search-results-page a {
  font-weight: bold;
  font-size: 1.2rem;
  color: #f5c518;
  text-decoration: none;
}

.summary {
  margin: 0.5rem 0;
  color: #ccc;
}

.match-info {
  font-size: 0.9rem;
  color: #aaa;
}
</style>
