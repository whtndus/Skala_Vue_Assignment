import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'skala-weather-favorites'

const loadFavorites = () => {
  try {
    const savedFavorites = localStorage.getItem(STORAGE_KEY)
    const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : []
    return Array.isArray(parsedFavorites) ? parsedFavorites : []
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteCities = ref(loadFavorites())
  const favoriteCount = computed(() => favoriteCities.value.length)

  const isFavorite = (cityId) => favoriteCities.value.some((city) => city.id === cityId)

  const toggleFavorite = (city) => {
    const favoriteIndex = favoriteCities.value.findIndex((favorite) => favorite.id === city.id)

    if (favoriteIndex >= 0) {
      favoriteCities.value.splice(favoriteIndex, 1)
      return false
    }

    favoriteCities.value.push({ ...city })
    return true
  }

  watch(
    favoriteCities,
    (cities) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cities))
    },
    { deep: true },
  )

  return {
    favoriteCities,
    favoriteCount,
    isFavorite,
    toggleFavorite,
  }
})
