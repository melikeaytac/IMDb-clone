import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Profile from '../pages/Profile.vue'
import MovieDetail from '../pages/MovieDetail.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
    { path: '/movie/:id', component: MovieDetail },
{
  path: '/search',
  name: 'Search',
  component: () => import('@/pages/SearchResults.vue')
},

  { path: '/profile', component: Profile },

  {
  path: '/',
  name: 'Home',
  component: () => import('@/views/HomeView.vue')
},
{
  path: '/watchlist',
  component: () => import('@/pages/Watchlist.vue')
}

]

export default createRouter({
  history: createWebHistory(),
  routes
})
