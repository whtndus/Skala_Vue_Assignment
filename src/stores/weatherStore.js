import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { weatherData } from '@/data/weatherData'
import { fetchWeatherByCity, getWeatherErrorMessage } from '@/services/openWeatherApi'

export const useWeatherStore = defineStore('weather', () => {
  const weatherList = ref(weatherData.map((city) => ({ ...city, source: 'mock' })))
  const isSearching = ref(false)
  const searchError = ref('')
  const lastUpdatedCity = ref(null)

  const liveCityCount = computed(() => weatherList.value.filter((city) => city.source === 'live').length)

  const findWeatherById = (cityId) => weatherList.value.find((city) => city.id === cityId)

  const searchCityWeather = async (cityName) => {
    const normalizedCityName = cityName.trim()

    if (!normalizedCityName) {
      searchError.value = '검색할 도시 이름을 입력해 주세요.'
      return null
    }

    isSearching.value = true
    searchError.value = ''

    try {
      const liveWeather = await fetchWeatherByCity(normalizedCityName)
      const comparableNames = [normalizedCityName, liveWeather.name, liveWeather.officialName].map((name) => name.toLocaleLowerCase())
      const existingIndex = weatherList.value.findIndex((city) => city.openWeatherId === liveWeather.openWeatherId || comparableNames.includes(city.name.toLocaleLowerCase()))

      if (existingIndex >= 0) {
        const existingCity = weatherList.value[existingIndex]
        weatherList.value[existingIndex] = {
          ...liveWeather,
          id: existingCity.id,
          name: existingCity.name,
        }
        lastUpdatedCity.value = weatherList.value[existingIndex]
      } else {
        weatherList.value.unshift(liveWeather)
        lastUpdatedCity.value = liveWeather
      }

      return lastUpdatedCity.value
    } catch (error) {
      searchError.value = getWeatherErrorMessage(error)
      return null
    } finally {
      isSearching.value = false
    }
  }

  const clearSearchError = () => {
    searchError.value = ''
  }

  return {
    weatherList,
    isSearching,
    searchError,
    lastUpdatedCity,
    liveCityCount,
    findWeatherById,
    searchCityWeather,
    clearSearchError,
  }
})
