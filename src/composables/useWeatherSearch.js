import { computed, onScopeDispose, ref, watch } from 'vue'

/**
 * 도시 목록의 검색 상태와 파생 데이터를 관리하는 Composable
 * @param {import('vue').Ref<Array<{ id: string, name: string, temp: number, status: string }>>} weatherList
 */
export function useWeatherSearch(weatherList) {
  const searchQuery = ref('')
  const debouncedSearchQuery = ref('')
  let debounceTimer

  watch(
    searchQuery,
    (newQuery) => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        debouncedSearchQuery.value = newQuery
      }, 300)
    },
    { immediate: true },
  )

  onScopeDispose(() => clearTimeout(debounceTimer))

  const filteredWeatherList = computed(() => {
    const query = debouncedSearchQuery.value.trim()
    if (!query) return weatherList.value
    return weatherList.value.filter((city) => city.name.includes(query))
  })

  const matchedCities = computed(() => {
    if (!debouncedSearchQuery.value.trim()) return []
    return filteredWeatherList.value.map((city) => city.name)
  })

  const resultCount = computed(() => filteredWeatherList.value.length)

  watch(
    debouncedSearchQuery,
    (newQuery) => {
      console.log(`[watch immediate] 현재 검색어 '${newQuery}'에 매칭되는 도시 ${filteredWeatherList.value.length}개를 필터링합니다.`)
    },
    { immediate: true },
  )

  return {
    searchQuery,
    debouncedSearchQuery,
    filteredWeatherList,
    matchedCities,
    resultCount,
  }
}
