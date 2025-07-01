<template>
  <header class="navbar">
    <div class="nav-container">
      <RouterLink to="/" class="logo">IMDb</RouterLink>

      <button class="hamburger" @click="toggleMenu">☰</button>

      <nav :class="{ open: isMenuOpen }">
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text"
          :placeholder="language === 'en' ? 'Search movie...' : 'Film ara...'"
          class="search-bar"
        />

        <div v-if="isHomePage" class="language-switcher">
          <select v-model="language" @change="handleLanguageChange">
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>

        <a @click.prevent="handleWatchlistClick" class="watchlist-link">Watchlist</a>

        <template v-if="!user.isLoggedIn">
          <RouterLink to="/login" @click="closeMenu">{{ language === 'en' ? 'Login' : 'Giriş' }}</RouterLink>
          <RouterLink to="/register" @click="closeMenu">{{ language === 'en' ? 'Register' : 'Kayıt' }}</RouterLink>
        </template>

        <template v-else>
          <RouterLink to="/profile" class="username" @click="closeMenu">
            {{ language === 'en' ? 'Welcome' : 'Hoşgeldin' }}, {{ user.name.toLowerCase() }}
          </RouterLink>
          <button class="logout" @click="logout">{{ language === 'en' ? 'Logout' : 'Çıkış' }}</button>
        </template>
      </nav>
    </div>
  </header>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { user } from '../stores/user.js'

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const language = ref('tr')

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
const closeMenu = () => {
  isMenuOpen.value = false
}

onMounted(() => {
  const savedLang = localStorage.getItem('home_lang')
  language.value = savedLang || (navigator.language.startsWith('en') ? 'en' : 'tr')
})

const isHomePage = computed(() => route.path === '/')

const handleSearch = () => {
  const trimmed = searchQuery.value.trim()
  if (trimmed) {
    router.push({ path: '/search', query: { q: trimmed } })
    closeMenu()
  }
}

const handleWatchlistClick = () => {
  if (user.isLoggedIn) {
    router.push('/watchlist')
  } else {
    router.push('/login')
  }
  closeMenu()
}

const logout = () => {
  localStorage.clear()
  user.name = ''
  user.email = ''
  user.isLoggedIn = false
  router.push('/login')
  closeMenu()
}

const handleLanguageChange = () => {
  localStorage.setItem('home_lang', language.value)
  location.reload()
}
</script>


<style scoped>
.navbar {
  background-color: #111;
  padding: 1rem;
  color: white;
}

.nav-container {
  display: flex;
  flex-direction: column;
}

.nav-left {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #f5c518;
  text-decoration: none;
  
}

.hamburger {
  display: none;
  font-size: 1.8rem;
  color: #f5c518;
  background: none;
  border: none;
  cursor: pointer;
}

nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.search-bar {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
  background-color: #222;
  color: white;
}

.language-switcher select {
  background-color: #222;
  color: #fff;
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #555;
  font-weight: bold;
}

.watchlist-link {
  cursor: pointer;
  color: white;
  text-decoration: underline;
}

.logout {
  background: none;
  border: none;
  color: #f55;
  font-weight: bold;
  cursor: pointer;
}

.username {
  color: #f5c518;
}

@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  nav {
    display: none;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 1rem;
    gap: 0.8rem;
  }

  nav.open {
    display: flex;
  }

  .search-bar,
  .language-switcher select {
    width: 100%;
  }

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #f5c518;
  text-decoration: none;
  margin: 0 auto; /* Ortalamak için */
  display: block;
  text-align: center;
}

}


</style>
