import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'skala-weather-favorites'
const LIVE_CITY_ID_PATTERN = /^owm_\d+$/
const normalizeName = (name) =>
  String(name || '')
    .trim()
    .toLocaleLowerCase()

const toFavoriteRecord = (city) => {
  const name = String(city?.name || city?.officialName || '').trim()
  if (!name) return null

  return {
    id: LIVE_CITY_ID_PATTERN.test(String(city?.id || '')) ? city.id : '',
    name,
    officialName: String(city?.officialName || '').trim(),
    country: String(city?.country || '').trim(),
  }
}

const loadFavorites = () => {
  try {
    const savedFavorites = localStorage.getItem(STORAGE_KEY)
    const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : []
    if (!Array.isArray(parsedFavorites)) return []

    const uniqueNames = new Set()
    return parsedFavorites.reduce((favorites, favorite) => {
      const normalized = toFavoriteRecord(favorite)
      const comparableName = normalizeName(normalized?.name)
      if (!normalized || !comparableName || uniqueNames.has(comparableName)) return favorites

      uniqueNames.add(comparableName)
      favorites.push(normalized)
      return favorites
    }, [])
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteCities = ref(loadFavorites())
  const favoriteCount = computed(() => favoriteCities.value.length)

  const isFavorite = (cityId) => favoriteCities.value.some((city) => city.id && city.id === cityId)

  const toggleFavorite = (city) => {
    const comparableName = normalizeName(city?.name || city?.officialName)
    const favoriteIndex = favoriteCities.value.findIndex((favorite) => (favorite.id && favorite.id === city.id) || normalizeName(favorite.name) === comparableName)

    if (favoriteIndex >= 0) {
      favoriteCities.value.splice(favoriteIndex, 1)
      return false
    }

    const favorite = toFavoriteRecord(city)
    if (!favorite) return false
    favoriteCities.value.push(favorite)
    return true
  }

  const reconcileFavorites = (liveCities) => {
    favoriteCities.value = favoriteCities.value.reduce((resolvedFavorites, favorite) => {
      const liveCity = liveCities.find((city) => (favorite.id && favorite.id === city.id) || [city.name, city.officialName].map(normalizeName).includes(normalizeName(favorite.name)))
      const resolvedFavorite = toFavoriteRecord(liveCity)

      if (resolvedFavorite && !resolvedFavorites.some((city) => city.id === resolvedFavorite.id)) resolvedFavorites.push(resolvedFavorite)
      return resolvedFavorites
    }, [])
  }

  watch(
    favoriteCities,
    (cities) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cities))
      } catch {
        // 저장 공간 또는 브라우저 정책 문제는 앱 렌더링을 중단시키지 않습니다.
      }
    },
    { deep: true },
  )

  return {
    favoriteCities,
    favoriteCount,
    isFavorite,
    toggleFavorite,
    reconcileFavorites,
  }
})
