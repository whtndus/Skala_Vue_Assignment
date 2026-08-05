import { createRouter, createWebHistory } from 'vue-router'

const NotFoundView = () => import('@/views/NotFoundView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'weather-home',
      component: () => import('@/views/WeatherHomeView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('@/views/WeatherDetailView.vue'),
    },
    {
      path: '/about',
      name: 'weather-about',
      component: () => import('@/views/WeatherAboutView.vue'),
    },
    {
      path: '/practice',
      name: 'vue-practice',
      component: () => import('@/views/PracticeView.vue'),
    },
    {
      path: '/404',
      name: 'not-found',
      component: NotFoundView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'path-not-found',
      component: NotFoundView,
    },
  ],
})

router.beforeEach((to) => {
  if (to.name !== 'weather-detail') return true

  const cityId = String(to.params.cityId || '')
  const isLiveCity = /^owm_\d+$/.test(cityId) && typeof to.query.city === 'string' && Boolean(to.query.city.trim())

  if (isLiveCity) return true

  return {
    name: 'not-found',
    query: { from: to.fullPath },
    replace: true,
  }
})

export default router
