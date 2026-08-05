import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchWeatherByCity, getWeatherErrorMessage, isWeatherApiConfigured } from '@/services/openWeatherApi'

const normalizeName = (name) =>
  String(name || '')
    .trim()
    .toLocaleLowerCase()

export const useWeatherStore = defineStore('weather', () => {
  const weatherList = ref([])
  const isSearching = ref(false)
  const isInitializing = ref(false)
  const isInitialized = ref(false)
  const searchError = ref('')
  const initializationError = ref('')
  const lastUpdatedCity = ref(null)
  let initializationPromise = null

  const cityCount = computed(() => weatherList.value.length)
  const findWeatherById = (cityId) => weatherList.value.find((city) => city.id === cityId)

  const upsertWeather = (weather) => {
    const comparableNames = [weather.name, weather.officialName].map(normalizeName).filter(Boolean)
    const existingIndex = weatherList.value.findIndex(
      (city) => city.openWeatherId === weather.openWeatherId || comparableNames.includes(normalizeName(city.name)) || comparableNames.includes(normalizeName(city.officialName)),
    )

    if (existingIndex >= 0) {
      weatherList.value[existingIndex] = weather
      return weatherList.value[existingIndex]
    }

    weatherList.value.push(weather)
    return weather
  }

  const searchCityWeather = async (cityName) => {
    const normalizedCityName = String(cityName || '').trim()

    if (!normalizedCityName) {
      searchError.value = '검색할 도시 이름을 입력해 주세요.'
      return null
    }

    isSearching.value = true
    searchError.value = ''

    try {
      const liveWeather = await fetchWeatherByCity(normalizedCityName)
      lastUpdatedCity.value = upsertWeather(liveWeather)
      return lastUpdatedCity.value
    } catch (error) {
      searchError.value = getWeatherErrorMessage(error)
      return null
    } finally {
      isSearching.value = false
    }
  }

  const initializeWeather = (savedFavorites = []) => {
    if (initializationPromise) return initializationPromise
    if (isInitialized.value) return Promise.resolve(weatherList.value)

    initializationPromise = (async () => {
      isInitializing.value = true
      initializationError.value = ''

      try {
        if (!isWeatherApiConfigured()) {
          initializationError.value = 'OpenWeather API 키가 없습니다. .env 파일의 VITE_WEATHER_API_KEY 환경변수를 확인해 주세요.'
          return weatherList.value
        }

        const favoriteNames = savedFavorites.map((favorite) => (typeof favorite === 'string' ? favorite : favorite?.name)).filter(Boolean)
        const cityNames = [...new Set(['서울', ...favoriteNames].map((name) => String(name).trim()).filter(Boolean))].slice(0, 6)
        const failedMessages = []

        for (const cityName of cityNames) {
          try {
            upsertWeather(await fetchWeatherByCity(cityName))
          } catch (error) {
            failedMessages.push(getWeatherErrorMessage(error))
          }
        }

        if (!weatherList.value.length) initializationError.value = failedMessages[0] || '실시간 날씨를 불러오지 못했습니다.'
        return weatherList.value
      } finally {
        isInitialized.value = true
        isInitializing.value = false
      }
    })().finally(() => {
      initializationPromise = null
    })

    return initializationPromise
  }

  const clearSearchError = () => {
    searchError.value = ''
  }

  return {
    weatherList,
    isSearching,
    isInitializing,
    isInitialized,
    searchError,
    initializationError,
    lastUpdatedCity,
    cityCount,
    findWeatherById,
    searchCityWeather,
    initializeWeather,
    clearSearchError,
  }
})
