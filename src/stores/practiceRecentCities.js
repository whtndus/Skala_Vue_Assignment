import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const usePracticeRecentCitiesStore = defineStore('practiceRecentCities', () => {
  const cities = ref(['서울'])
  const count = computed(() => cities.value.length)

  const addCity = (city) => {
    cities.value = [city, ...cities.value.filter((item) => item !== city)].slice(0, 4)
  }

  const removeCity = (city) => {
    cities.value = cities.value.filter((item) => item !== city)
  }

  const reset = () => {
    cities.value = ['서울']
  }

  return { cities, count, addCity, removeCity, reset }
})
