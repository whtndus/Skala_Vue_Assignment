<script setup>
/**
 * WeatherHomeView.vue — / 경로의 날씨 대시보드 화면
 *
 * 1. 원본 날씨 데이터와 선택 상태, 대시보드 통계 관리
 * 2. 검색 로직은 useWeatherSearch Composable로 재사용
 * 3. BaseDashboardCard와 WeatherCard의 Named/Scoped Slot 커스터마이징
 */
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { ElBacktop, ElMessage, ElSkeleton } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherSearch } from '@/composables/useWeatherSearch'
import { useTemperature } from '@/composables/useTemperature'
import { fetchForecastByCoordinates, getWeatherErrorMessage } from '@/services/openWeatherApi'
import { useWeatherStore } from '@/stores/weatherStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import clearCityImage from '@/assets/weather-atlas/clear-city.jpg'
import rainCityImage from '@/assets/weather-atlas/rain-city.jpg'
import cloudCityImage from '@/assets/weather-atlas/cloud-city.jpg'
import snowCityImage from '@/assets/weather-atlas/snow-city.jpg'

const router = useRouter()
const route = useRoute()
const { formatTemperature } = useTemperature()
const weatherStore = useWeatherStore()
const favoritesStore = useFavoritesStore()
const { weatherList, isSearching, searchError, lastUpdatedCity, liveCityCount } = storeToRefs(weatherStore)
const { favoriteCities, favoriteCount } = storeToRefs(favoritesStore)
const { isFavorite, toggleFavorite } = favoritesStore

// 2. 상태바 제어 반응형 데이터
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const activeCityId = ref(weatherList.value[0]?.id || '')

// 3. 검색 상태와 파생 데이터는 Composable에서 관리
const { searchQuery, debouncedSearchQuery, filteredWeatherList } = useWeatherSearch(weatherList)

const statusOptions = ['전체', '맑음', '비', '구름', '눈']
const sortOptions = ['default', 'temp-desc', 'temp-asc', 'name']

// URL의 검색·필터·정렬 값을 화면 상태와 동기화
const getQueryText = (query) => (typeof query === 'string' ? query : '')
const getStatus = (query) => (statusOptions.includes(query) ? query : '전체')
const getSort = (query) => (sortOptions.includes(query) ? query : 'default')

searchQuery.value = getQueryText(route.query.q)
const selectedStatus = ref(getStatus(route.query.status))
const selectedSort = ref(getSort(route.query.sort))

watch([debouncedSearchQuery, selectedStatus, selectedSort], ([newQuery, newStatus, newSort]) => {
  const nextQuery = { ...route.query }
  const normalizedQuery = newQuery.trim()

  if (normalizedQuery) nextQuery.q = normalizedQuery
  else delete nextQuery.q

  if (newStatus !== '전체') nextQuery.status = newStatus
  else delete nextQuery.status

  if (newSort !== 'default') nextQuery.sort = newSort
  else delete nextQuery.sort

  const hasSameQuery = getQueryText(route.query.q) === (nextQuery.q || '') && getQueryText(route.query.status) === (nextQuery.status || '') && getQueryText(route.query.sort) === (nextQuery.sort || '')

  if (!hasSameQuery) router.replace({ name: 'weather-home', query: nextQuery })
})

watch(
  () => [route.query.q, route.query.status, route.query.sort],
  ([newQuery, newStatus, newSort]) => {
    const queryText = getQueryText(newQuery)
    if (queryText !== searchQuery.value) searchQuery.value = queryText

    const status = getStatus(newStatus)
    if (status !== selectedStatus.value) selectedStatus.value = status

    const sort = getSort(newSort)
    if (sort !== selectedSort.value) selectedSort.value = sort
  },
)

const displayedWeatherList = computed(() => {
  const statusFiltered = selectedStatus.value === '전체' ? filteredWeatherList.value : filteredWeatherList.value.filter((city) => city.status === selectedStatus.value)

  const sortedList = [...statusFiltered]

  if (selectedSort.value === 'temp-desc') return sortedList.sort((a, b) => b.temp - a.temp)
  if (selectedSort.value === 'temp-asc') return sortedList.sort((a, b) => a.temp - b.temp)
  if (selectedSort.value === 'name') return sortedList.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  return sortedList
})

const resultCount = computed(() => displayedWeatherList.value.length)
const matchedCities = computed(() => displayedWeatherList.value.map((city) => city.name))

const atlasImages = {
  맑음: clearCityImage,
  비: rainCityImage,
  구름: cloudCityImage,
  눈: snowCityImage,
}

const atlasHeadlines = {
  맑음: 'CLEAR ABOVE THE CITY',
  비: 'RAIN AFTER MIDNIGHT',
  구름: 'CLOUDS OVER THE WATER',
  눈: 'WHITE AIR, HIGH GROUND',
}

const atlasThemeClasses = {
  맑음: 'atlas-clear',
  비: 'atlas-rain',
  구름: 'atlas-clouds',
  눈: 'atlas-snow',
}

const activeCity = computed(() => weatherStore.findWeatherById(activeCityId.value) || displayedWeatherList.value[0] || weatherList.value[0])
const activeAtlasImage = computed(() => atlasImages[activeCity.value?.status] || cloudCityImage)
const activeAtlasHeadline = computed(() => atlasHeadlines[activeCity.value?.status] || 'WEATHER ACROSS THE CITY')
const activeAtlasTheme = computed(() => atlasThemeClasses[activeCity.value?.status] || 'atlas-clouds')
const activeCityNameLength = computed(() => Array.from(activeCity.value?.name || '').length)

const forecastReadings = ref([])
const isForecastLoading = ref(false)
const forecastError = ref('')
const forecastCache = new Map()
let forecastRequestId = 0
let forecastDebounceTimer

const loadActiveForecast = async () => {
  const coordinates = activeCity.value?.coordinates
  const currentRequestId = ++forecastRequestId

  forecastReadings.value = []
  forecastError.value = ''
  isForecastLoading.value = false

  if (!coordinates) {
    forecastError.value = '이 도시의 좌표 정보가 없어 시간대별 예보를 표시할 수 없습니다.'
    return
  }

  const cacheKey = `${coordinates.lat},${coordinates.lon}`
  const cachedForecast = forecastCache.get(cacheKey)

  if (cachedForecast) {
    forecastReadings.value = cachedForecast
    return
  }

  isForecastLoading.value = true

  try {
    const forecast = await fetchForecastByCoordinates(coordinates)
    if (currentRequestId !== forecastRequestId) return

    forecastCache.set(cacheKey, forecast)
    forecastReadings.value = forecast
  } catch (error) {
    if (currentRequestId !== forecastRequestId) return
    forecastError.value = getWeatherErrorMessage(error)
  } finally {
    if (currentRequestId === forecastRequestId) isForecastLoading.value = false
  }
}

watch(
  () => activeCity.value?.id,
  () => {
    clearTimeout(forecastDebounceTimer)
    forecastDebounceTimer = setTimeout(loadActiveForecast, 240)
  },
  { immediate: true },
)

onBeforeUnmount(() => clearTimeout(forecastDebounceTimer))

const timelineReadings = computed(() => {
  if (!forecastReadings.value.length) return []

  const temperatures = forecastReadings.value.map((reading) => reading.temperature)
  const minTemperature = Math.min(...temperatures)
  const maxTemperature = Math.max(...temperatures)
  const rawTemperatureRange = maxTemperature - minTemperature
  const temperatureRange = Math.max(rawTemperatureRange, 2)
  const visualMinTemperature = minTemperature - (temperatureRange - rawTemperatureRange) / 2

  return forecastReadings.value.map((reading, index, readings) => ({
    ...reading,
    x: readings.length === 1 ? 50 : 3 + index * (94 / (readings.length - 1)),
    y: 46 - ((reading.temperature - visualMinTemperature) / temperatureRange) * 32,
  }))
})

const timelinePath = computed(() =>
  timelineReadings.value.reduce((path, reading, index, readings) => {
    if (index === 0) return `M ${reading.x} ${reading.y}`

    const previous = readings[index - 1]
    const controlX = (previous.x + reading.x) / 2
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${reading.y}, ${reading.x} ${reading.y}`
  }, ''),
)

const timelineAreaPath = computed(() => {
  if (!timelineReadings.value.length) return ''
  const first = timelineReadings.value[0]
  const last = timelineReadings.value.at(-1)
  return `${timelinePath.value} L ${last.x} 52 L ${first.x} 52 Z`
})

const getStatusCount = (status) => {
  if (status === '전체') return filteredWeatherList.value.length
  return filteredWeatherList.value.filter((city) => city.status === status).length
}

const previewCity = (city) => {
  if (!city) return
  activeCityId.value = city.id
}

const moveActiveCity = (direction) => {
  const cities = displayedWeatherList.value.length ? displayedWeatherList.value : weatherList.value
  const currentIndex = cities.findIndex((city) => city.id === activeCity.value?.id)
  const nextIndex = (currentIndex + direction + cities.length) % cities.length
  previewCity(cities[nextIndex])
}

// 4. computed — 대시보드 통계 연산
const avgTemp = computed(() => {
  if (weatherList.value.length === 0) return 0
  const total = weatherList.value.reduce((sum, c) => sum + c.temp, 0)
  return (total / weatherList.value.length).toFixed(1)
})

const hottestCity = computed(() => {
  if (weatherList.value.length === 0) return { name: '-', temp: 0 }
  return [...weatherList.value].sort((a, b) => b.temp - a.temp)[0]
})

const showAtlasMessage = (message, type = 'success') => {
  ElMessage({
    message,
    type,
    duration: 2400,
    customClass: 'atlas-message',
  })
}

const handleCitySearch = async (cityName) => {
  selectedStatus.value = '전체'
  const city = await weatherStore.searchCityWeather(cityName)

  if (!city) {
    showAtlasMessage(searchError.value || '날씨 정보를 불러오지 못했습니다.', 'error')
    return
  }

  searchQuery.value = city.name
  activeCityId.value = city.id
  selectedCityInfo.value = `${city.name}의 실시간 날씨를 불러왔습니다.`
  showAtlasMessage(`${city.name}의 실시간 관측을 반영했습니다.`)
}

const handleToggleFavorite = (city) => {
  const wasAdded = toggleFavorite(city)
  selectedCityInfo.value = wasAdded ? `${city.name}을(를) 즐겨찾기에 추가했습니다.` : `${city.name}을(를) 즐겨찾기에서 해제했습니다.`
  showAtlasMessage(wasAdded ? `${city.name}을 즐겨찾기에 추가했습니다.` : `${city.name}을 즐겨찾기에서 해제했습니다.`, wasAdded ? 'success' : 'info')
}

const handleFavoriteSelection = async (city) => {
  selectedStatus.value = '전체'

  if (weatherStore.findWeatherById(city.id)) {
    searchQuery.value = city.name
    activeCityId.value = city.id
    selectedCityInfo.value = `${city.name} 즐겨찾기를 선택했습니다.`
    return
  }

  await handleCitySearch(city.name)
}

// 5. watch — 상태바 문구 업데이트 감시
watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

// 6. 상세 페이지로 이동
const showDetail = (cityId) => {
  const selectedCity = weatherStore.findWeatherById(cityId)

  router.push({
    name: 'weather-detail',
    params: { cityId },
    query: {
      ...route.query,
      ...(selectedCity?.source === 'live' ? { city: selectedCity.name } : {}),
    },
  })
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section v-if="activeCity" class="atlas-hero" :class="activeAtlasTheme" aria-labelledby="atlas-city-name">
      <Transition name="atlas-backdrop" mode="out-in">
        <div :key="activeAtlasImage" class="atlas-backdrop" :style="{ backgroundImage: `url(${activeAtlasImage})` }"></div>
      </Transition>
      <div class="atlas-shade" aria-hidden="true"></div>
      <div class="atlas-grain" aria-hidden="true"></div>

      <div class="atlas-frame">
        <div class="atlas-index">
          <span>VOL. 01</span>
          <span>{{ activeCity.observedAt }} LOCAL</span>
          <span>{{ activeCity.country || 'KR' }} / {{ activeCity.source === 'live' ? 'LIVE' : 'ATLAS' }}</span>
        </div>

        <Transition name="atlas-copy" mode="out-in">
          <div :key="activeCity.id" class="atlas-copy">
            <p class="atlas-kicker">{{ activeAtlasHeadline }}</p>
            <div class="atlas-title-line" :class="{ 'is-medium': activeCityNameLength > 6, 'is-long': activeCityNameLength > 11 }">
              <h1 id="atlas-city-name">{{ activeCity.name }}</h1>
              <p class="atlas-condition">
                {{ activeCity.status }}<template v-if="activeCity.description"> / {{ activeCity.description }}</template>
              </p>
            </div>
          </div>
        </Transition>

        <Transition name="atlas-temperature" mode="out-in">
          <strong :key="`${activeCity.id}-${activeCity.temp}`" class="atlas-temperature">{{ formatTemperature(activeCity.temp) }}</strong>
        </Transition>

        <dl class="atlas-metrics">
          <div>
            <dt>FEELS</dt>
            <dd>{{ formatTemperature(activeCity.feelsLike) }}</dd>
          </div>
          <div>
            <dt>HUMIDITY</dt>
            <dd>{{ activeCity.humidity }}%</dd>
          </div>
          <div>
            <dt>WIND</dt>
            <dd>{{ activeCity.windSpeed }} m/s</dd>
          </div>
        </dl>

        <div class="atlas-navigation" aria-label="도시 슬라이드 이동">
          <button type="button" aria-label="이전 도시" @click="moveActiveCity(-1)">←</button>
          <span>{{ String(weatherList.findIndex((city) => city.id === activeCity.id) + 1).padStart(2, '0') }} / {{ String(weatherList.length).padStart(2, '0') }}</span>
          <button type="button" aria-label="다음 도시" @click="moveActiveCity(1)">→</button>
        </div>

        <nav class="atlas-city-rail" aria-label="도시 빠른 이동">
          <button
            v-for="city in displayedWeatherList.slice(0, 6)"
            :key="city.id"
            type="button"
            :class="{ active: city.id === activeCity.id }"
            @mouseenter="previewCity(city)"
            @focus="previewCity(city)"
            @click="previewCity(city)"
          >
            {{ city.name }}
          </button>
        </nav>
      </div>
    </section>

    <section v-if="activeCity" class="atlas-timeline" aria-labelledby="timeline-title">
      <header>
        <div>
          <p>LIVE FORECAST / 3-HOUR INTERVALS</p>
          <h2 id="timeline-title">Next 18 hours</h2>
        </div>
        <span>{{ activeCity.name }} · OPENWEATHER FORECAST</span>
      </header>

      <div v-if="timelineReadings.length" class="timeline-chart">
        <svg viewBox="0 0 100 56" preserveAspectRatio="none" role="img" :aria-label="`${activeCity.name}의 실제 향후 18시간 기온 예보`">
          <defs>
            <linearGradient id="timeline-area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#9db4b3" stop-opacity="0.28" />
              <stop offset="100%" stop-color="#9db4b3" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path class="timeline-guide" d="M 0 14 L 100 14 M 0 30 L 100 30 M 0 46 L 100 46" />
          <path class="timeline-area" :d="timelineAreaPath" />
          <path class="timeline-line" :d="timelinePath" />
          <circle v-for="reading in timelineReadings" :key="reading.timestamp" :cx="reading.x" :cy="reading.y" r="0.75" />
        </svg>
        <div class="timeline-labels">
          <span v-for="reading in timelineReadings" :key="reading.timestamp">
            <small>{{ reading.label }}</small>
            <strong>{{ formatTemperature(reading.temperature) }}</strong>
            <em v-if="reading.precipitationProbability">RAIN {{ reading.precipitationProbability }}%</em>
          </span>
        </div>
      </div>

      <p v-else-if="isForecastLoading" class="timeline-state" role="status">시간대별 예보를 동기화하고 있습니다.</p>
      <p v-else class="timeline-state timeline-error" role="status">{{ forecastError || '시간대별 예보가 아직 제공되지 않았습니다.' }}</p>
    </section>

    <div class="atlas-content">
    <!-- 1) 도시 검색 영역 (BaseDashboardCard 슬롯 주입) -->
    <BaseDashboardCard>
      <template #header>
        <div class="search-section-heading">
          <h3 class="dashboard-card-title">도시 검색</h3>
          <UnitToggler />
        </div>
      </template>

      <SearchBar
        :current-query="searchQuery"
        :matched-cities="matchedCities"
        :is-loading="isSearching"
        :error-message="searchError"
        @update-query="(val) => (searchQuery = val)"
        @search-city="handleCitySearch"
      />
    </BaseDashboardCard>

    <p v-if="lastUpdatedCity" class="live-update" role="status">
      <span aria-hidden="true">LIVE</span>
      {{ lastUpdatedCity.name }} 실시간 관측 반영 · 현재 API 연동 도시 {{ liveCityCount }}개
    </p>

    <!-- 2) 선택 도시 상태바 -->
    <div class="status-bar">
      <span class="status-icon" aria-hidden="true">●</span>
      <span class="visually-hidden">{{ selectedCityInfo === '카드를 클릭하거나 검색해 보세요.' ? '안내' : '선택 위치' }}</span>
      <span>{{ selectedCityInfo }}</span>
    </div>

    <section v-if="favoriteCities.length" class="favorites-bar" aria-labelledby="favorites-title">
      <div class="favorites-heading">
        <span aria-hidden="true">★</span>
        <strong id="favorites-title">즐겨찾기 도시</strong>
        <small>{{ favoriteCount }}개</small>
      </div>
      <div class="favorite-chips">
        <button v-for="city in favoriteCities" :key="city.id" type="button" @click="handleFavoriteSelection(city)">
          {{ city.name }}
        </button>
      </div>
    </section>

    <!-- 3) 통계 요약 섹션 -->
    <section class="stats-section">
      <div class="stat-card">
        <span class="stat-label">검색 결과</span>
        <span class="stat-value">{{ resultCount }}<small>개 도시</small></span>
      </div>
      <div class="stat-card">
        <span class="stat-label">전체 평균 기온</span>
        <span class="stat-value">{{ formatTemperature(avgTemp) }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">가장 더운 도시</span>
        <span class="stat-value">
          {{ hottestCity.name }}<small> {{ formatTemperature(hottestCity.temp) }}</small>
        </span>
      </div>
    </section>

    <!-- 4) 지역별 날씨 현황 영역 (BaseDashboardCard 슬롯 주입) -->
    <BaseDashboardCard class="city-index-section">
      <template #header>
        <h3 class="dashboard-card-title">지역별 날씨 현황</h3>
      </template>

      <div class="city-index-layout">
        <aside class="city-index-preview" aria-label="선택 도시 비주얼 미리보기">
          <Transition name="atlas-backdrop" mode="out-in">
            <div :key="activeAtlasImage" class="city-index-image" :style="{ backgroundImage: `url(${activeAtlasImage})` }"></div>
          </Transition>
          <div class="city-index-shade" aria-hidden="true"></div>
          <div class="city-index-caption">
            <span>{{ activeAtlasHeadline }}</span>
            <strong>{{ activeCity.name }}</strong>
            <small>{{ formatTemperature(activeCity.temp) }} / {{ activeCity.status }}</small>
          </div>
        </aside>

        <div class="city-index-data">
      <div class="list-controls">
        <fieldset class="status-filter">
          <legend>날씨 상태</legend>
          <button v-for="status in statusOptions" :key="status" type="button" :class="{ active: selectedStatus === status }" :aria-pressed="selectedStatus === status" @click="selectedStatus = status">
            {{ status }} <small>{{ getStatusCount(status) }}</small>
          </button>
        </fieldset>

        <label class="sort-control">
          <span>정렬 기준</span>
          <select v-model="selectedSort">
            <option value="default">기본 순서</option>
            <option value="temp-desc">기온 높은 순</option>
            <option value="temp-asc">기온 낮은 순</option>
            <option value="name">도시 이름순</option>
          </select>
        </label>
      </div>

      <div v-if="isSearching" class="weather-skeleton-grid" aria-label="날씨 조회 중">
        <el-skeleton v-for="index in 3" :key="index" class="weather-skeleton" :rows="4" animated />
      </div>

      <div v-else class="weather-grid">
        <WeatherCard
          v-for="item in displayedWeatherList"
          :key="item.id"
          :city-item="item"
          :is-favorite="isFavorite(item.id)"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="showDetail"
          @toggle-favorite="handleToggleFavorite"
          @preview-city="previewCity"
        >
          <template #actions="{ city, requestDetail }">
            <button class="custom-detail-btn" type="button" @click.stop="requestDetail">{{ city.name }} 상세보기</button>
          </template>
        </WeatherCard>
      </div>

      <!-- 검색 결과 없을 시 안내 -->
      <p v-if="!isSearching && displayedWeatherList.length === 0" class="no-result">검색 결과와 일치하는 도시가 없습니다.</p>
        </div>
      </div>

      <template #footer>
        <p class="dashboard-card-summary">현재 {{ resultCount }}개 도시를 표시하고 있습니다.</p>
      </template>
    </BaseDashboardCard>
    </div>

    <ElBacktop :right="24" :bottom="24" class="atlas-backtop" aria-label="페이지 맨 위로 이동">
      <span aria-hidden="true">UP</span>
    </ElBacktop>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.dashboard-card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-heading, #2c3e50);
}

.live-update {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: -0.25rem 0 1.25rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid #b7ebd2;
  border-radius: 0;
  background: #effcf5;
  color: #227a50;
  font-size: 0.82rem;
  font-weight: 600;
}

/* Status Bar */
.status-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1.25rem;
  border-radius: 0;
  font-size: 0.95rem;
  font-weight: 500;
  background: transparent;
  color: #1a6fa8;
  border: 1px solid #b8dff5;
}

.favorites-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  padding: 0.8rem 1rem;
  border: 1px solid #f4d98b;
  border-radius: 0;
  background: #fffaf0;
}

.favorites-heading {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #8a6414;
}

.favorites-heading strong {
  font-weight: 700;
}

.favorites-heading small {
  color: #a37c26;
}

.favorite-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.favorite-chips button {
  padding: 0.35rem 0.65rem;
  border: 1px solid #e8c967;
  border-radius: 0;
  color: #795811;
  background: #fff;
  font-size: 0.78rem;
  font-weight: 700;
}

.favorite-chips button:hover {
  border-color: #c79b28;
  background: #fff3cd;
}

.weather-skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.weather-skeleton {
  min-height: 190px;
  padding: 1.25rem;
  border: 1px solid var(--color-border, #e9ecef);
  border-radius: 0;
  background: var(--color-background, #fff);
}

.status-icon {
  font-size: 1.1rem;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1rem 0.75rem;
  background: var(--color-background-soft, #f8f9fa);
  border: 1px solid var(--color-border, #e9ecef);
  border-radius: 0;
  text-align: center;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: none;
}

.stat-label {
  font-size: 0.78rem;
  color: #888;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #4a90d9;
  line-height: 1.2;
}

.stat-value small {
  font-size: 0.75rem;
  font-weight: 500;
  color: #888;
  margin-left: 2px;
}

/* Weather Grid */
.list-controls {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.status-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  border: 0;
}

.status-filter legend,
.sort-control span {
  margin-bottom: 0.45rem;
  color: #777;
  font-size: 0.78rem;
  font-weight: 600;
}

.status-filter button {
  padding: 0.4rem 0.7rem;
  border: 1px solid var(--color-border, #dee2e6);
  border-radius: 20px;
  background: var(--color-background, #fff);
  color: var(--color-text, #2c3e50);
  font-size: 0.82rem;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.status-filter button:hover,
.status-filter button.active {
  border-color: #4a90d9;
  background: #4a90d9;
  color: #fff;
}

.status-filter small {
  margin-left: 0.15rem;
  opacity: 0.8;
}

.sort-control {
  display: flex;
  flex: 0 0 155px;
  flex-direction: column;
}

.sort-control select {
  width: 100%;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--color-border, #dee2e6);
  border-radius: 0;
  background: var(--color-background, #fff);
  color: var(--color-text, #2c3e50);
  font: inherit;
  font-size: 0.85rem;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.25rem;
}

.no-result {
  text-align: center;
  color: #e74c3c;
  padding: 2rem 0;
  font-weight: 500;
}

.dashboard-card-summary {
  margin: 0;
  color: #777;
  font-size: 0.85rem;
  text-align: right;
}

.custom-detail-btn {
  padding: 0.5rem 1.1rem;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 0;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.25s,
    transform 0.2s,
    border-color 0.25s;
  backdrop-filter: none;
}

.custom-detail-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.03);
}

.custom-detail-btn:active {
  transform: scale(0.97);
}

@media (max-width: 650px) {
  .list-controls {
    align-items: stretch;
    flex-direction: column;
  }

  .sort-control {
    flex-basis: auto;
    width: 100%;
  }
}

/* Cinematic weather atlas */
.dashboard-wrapper {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
  background: #e9e7e1;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.atlas-hero {
  --atlas-ink: #f5f1e8;
  position: relative;
  min-height: 720px;
  height: 100svh;
  overflow: hidden;
  color: var(--atlas-ink);
  background: #242725;
  isolation: isolate;
}

.atlas-backdrop,
.atlas-shade,
.atlas-grain {
  position: absolute;
  inset: 0;
}

.atlas-backdrop {
  z-index: -3;
  background-position: center;
  background-size: cover;
  transform: scale(1.025);
  animation: atlas-drift 12s ease-out both;
}

.atlas-shade {
  z-index: -2;
  background: rgba(14, 17, 16, 0.38);
}

.atlas-rain .atlas-shade {
  background: rgba(7, 13, 16, 0.28);
}

.atlas-snow .atlas-shade {
  background: rgba(30, 34, 35, 0.2);
}

.atlas-grain {
  z-index: -1;
  opacity: 0.14;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.44'/%3E%3C/svg%3E");
  mix-blend-mode: soft-light;
  pointer-events: none;
}

.atlas-frame {
  position: relative;
  width: min(100% - 6vw, 1480px);
  height: 100%;
  margin: 0 auto;
  padding-top: clamp(7.5rem, 14vh, 9rem);
}

.atlas-index {
  display: flex;
  justify-content: space-between;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.38);
  font-size: clamp(0.75rem, 0.75vw, 0.8rem);
  font-weight: 750;
  letter-spacing: 0.14em;
}

.atlas-copy {
  position: absolute;
  top: 25%;
  left: 0;
  width: min(92vw, 1320px);
}

.atlas-kicker {
  margin: 0 0 1rem;
  font-size: clamp(0.76rem, 1vw, 0.88rem);
  font-weight: 750;
  letter-spacing: 0.18em;
}

.atlas-copy h1 {
  flex: 0 1 auto;
  margin: 0;
  overflow: visible;
  color: inherit;
  font-size: clamp(4.4rem, 10vw, 9rem);
  font-weight: 650;
  letter-spacing: -0.075em;
  line-height: 0.88;
  white-space: nowrap;
}

.atlas-title-line {
  display: flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  gap: clamp(0.75rem, 1.8vw, 2rem);
  width: fit-content;
  max-width: 100%;
}

.atlas-title-line.is-medium h1 {
  font-size: clamp(4rem, 8vw, 7.4rem);
}

.atlas-title-line.is-long h1 {
  font-size: clamp(3.2rem, 6.2vw, 5.8rem);
}

.atlas-condition {
  flex: 0 0 clamp(7rem, 15vw, 14rem);
  max-width: clamp(7rem, 15vw, 14rem);
  margin: 0 0 0.72em;
  font-size: clamp(0.75rem, 2vw, 0.84rem);
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1.45;
  text-transform: uppercase;
}

.atlas-temperature {
  position: absolute;
  bottom: clamp(1.5rem, 4svh, 3rem);
  left: 0;
  max-width: 100%;
  color: inherit;
  font-size: clamp(7rem, min(17vw, 26svh), 17rem);
  font-weight: 300;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.09em;
  line-height: 0.92;
  white-space: nowrap;
}

.atlas-metrics {
  position: absolute;
  right: 0;
  bottom: 19%;
  display: grid;
  width: min(34vw, 430px);
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.45);
}

.atlas-metrics div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0.72rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.28);
}

.atlas-metrics dt {
  font-size: clamp(0.75rem, 0.7vw, 0.8rem);
  font-weight: 700;
  letter-spacing: 0.15em;
}

.atlas-metrics dd {
  margin: 0;
  font-size: clamp(1rem, 1.6vw, 1.4rem);
  font-weight: 550;
}

.atlas-navigation {
  position: absolute;
  right: 0;
  bottom: 6%;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.atlas-navigation button,
.atlas-city-rail button {
  border: 0;
  color: inherit;
  background: transparent;
  cursor: pointer;
}

.atlas-navigation button {
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 50%;
}

.atlas-navigation span {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.atlas-city-rail {
  position: absolute;
  right: 0;
  bottom: clamp(5.75rem, 12svh, 8rem);
  display: flex;
  gap: 0.9rem;
  max-width: 46vw;
  overflow-x: auto;
}

.atlas-city-rail button {
  padding: 0.3rem 0;
  border-bottom: 1px solid transparent;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  opacity: 0.55;
  white-space: nowrap;
}

.atlas-city-rail button:hover,
.atlas-city-rail button.active {
  border-bottom-color: currentColor;
  opacity: 1;
}

.atlas-backdrop-enter-active,
.atlas-backdrop-leave-active {
  transition:
    opacity 900ms ease,
    transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
}

.atlas-backdrop-enter-from,
.atlas-backdrop-leave-to {
  opacity: 0;
  transform: scale(1.07);
}

.atlas-copy-enter-active,
.atlas-copy-leave-active {
  transition:
    opacity 700ms ease,
    clip-path 700ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
}

.atlas-copy-enter-from,
.atlas-copy-leave-to {
  opacity: 0;
  clip-path: inset(0 0 100% 0);
  transform: translateY(28px);
}

.atlas-temperature-enter-active,
.atlas-temperature-leave-active {
  transition:
    opacity 650ms ease,
    transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

.atlas-temperature-enter-from,
.atlas-temperature-leave-to {
  opacity: 0;
  transform: translateX(-4vw);
}

.atlas-timeline {
  display: grid;
  grid-template-columns: minmax(190px, 0.28fr) minmax(0, 1fr);
  align-items: end;
  gap: clamp(2rem, 5vw, 5rem);
  min-height: 250px;
  padding: clamp(1.75rem, 3vw, 2.75rem) max(3vw, calc((100vw - 1280px) / 2));
  color: #eae7df;
  background: #1d211f;
}

.atlas-timeline header {
  align-self: center;
}

.atlas-timeline header p,
.atlas-timeline header > span {
  color: #8d9691;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.atlas-timeline header > span {
  display: block;
  margin-top: 1.2rem;
}

.atlas-timeline h2 {
  margin: 0.4rem 0 0;
  color: inherit;
  font-size: clamp(1.7rem, 3vw, 3rem);
  font-weight: 500;
  letter-spacing: -0.05em;
  line-height: 0.95;
}

.timeline-chart {
  position: relative;
  min-width: 0;
}

.timeline-chart svg {
  width: 100%;
  height: 128px;
  overflow: visible;
}

.timeline-guide,
.timeline-area,
.timeline-line {
  vector-effect: non-scaling-stroke;
}

.timeline-guide {
  fill: none;
  stroke: rgba(234, 231, 223, 0.18);
  stroke-width: 0.75;
  stroke-dasharray: 2 4;
}

.timeline-area {
  fill: url(#timeline-area-gradient);
  stroke: none;
}

.timeline-line {
  fill: none;
  stroke: #9db4b3;
  stroke-width: 1.5;
}

.timeline-chart circle {
  fill: #1d211f;
  stroke: #c6d3d0;
  stroke-width: 0.35;
  vector-effect: non-scaling-stroke;
}

.timeline-labels {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  margin-top: 0.35rem;
  border-top: 1px solid rgba(234, 231, 223, 0.2);
}

.timeline-labels span {
  display: grid;
  gap: 0.18rem;
  min-width: 0;
  padding: 0.65rem 0.35rem 0 0;
}

.timeline-labels strong {
  font-size: 1rem;
  font-weight: 550;
}

.timeline-labels small {
  color: #858d89;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.timeline-labels em {
  overflow: hidden;
  color: #9db4b3;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timeline-state {
  align-self: center;
  min-height: 128px;
  margin: 0;
  padding: 2rem 0;
  border-top: 1px solid rgba(234, 231, 223, 0.2);
  color: #9db4b3;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
}

.timeline-error {
  color: #bca69e;
}

.atlas-content {
  width: min(100% - 3rem, 1280px);
  margin: 0 auto;
  padding: clamp(4rem, 8vw, 8rem) 0;
}

.atlas-content :deep(.base-dashboard-card) {
  margin-bottom: clamp(4rem, 8vw, 7rem);
  padding: 0;
  border: 0;
  border-top: 1px solid #252825;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.atlas-content :deep(.base-dashboard-card__header) {
  margin: 0;
  padding: 1rem 0 2rem;
  border-bottom: 0;
}

.dashboard-card-title {
  margin: 0;
  color: #202320;
  font-size: clamp(1.5rem, 3vw, 2.7rem);
  font-weight: 550;
  letter-spacing: -0.045em;
}

.search-section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
}

.search-section-heading :deep(.unit-label) {
  color: #656a66;
  font-size: 0.75rem;
}

.search-section-heading :deep(.unit-button) {
  border-color: #8d918c;
  color: #7b817d;
  background: transparent;
}

.search-section-heading :deep(.unit-button:hover) {
  border-color: #536d7a;
}

.search-section-heading :deep(.unit-button .active) {
  color: #405d6b;
}

.live-update,
.status-bar,
.favorites-bar {
  border-radius: 0;
  box-shadow: none;
}

.status-bar {
  margin-bottom: 2rem;
  border: 0;
  border-top: 1px solid #aba9a3;
  border-bottom: 1px solid #aba9a3;
  color: #343a38;
  background: transparent;
}

.stats-section {
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  margin-bottom: 5rem;
  border-top: 1px solid #252825;
  border-bottom: 1px solid #a5a39d;
}

.stat-card {
  align-items: flex-start;
  min-height: 150px;
  padding: 1.4rem 0;
  border: 0;
  border-right: 1px solid #b7b4ad;
  border-radius: 0;
  background: transparent;
  text-align: left;
  box-shadow: none;
}

.stat-card + .stat-card {
  padding-left: 1.4rem;
}

.stat-card:last-child {
  border-right: 0;
}

.stat-card:hover {
  transform: none;
  box-shadow: none;
}

.stat-value {
  color: #222723;
  font-size: clamp(1.7rem, 4vw, 3rem);
  font-weight: 450;
  letter-spacing: -0.05em;
}

.list-controls {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #aaa8a2;
}

.status-filter button {
  border: 0;
  border-bottom: 1px solid transparent;
  border-radius: 0;
  color: #555b57;
  background: transparent;
}

.status-filter button:hover,
.status-filter button.active {
  border-bottom-color: currentColor;
  color: #1f2421;
  background: transparent;
}

.sort-control select {
  border: 0;
  border-bottom: 1px solid #81817c;
  border-radius: 0;
  background: transparent;
}

.weather-grid {
  display: block;
  border-top: 1px solid #242724;
  counter-reset: city-row;
}

.city-index-layout {
  display: grid;
  grid-template-columns: minmax(300px, 0.78fr) minmax(520px, 1.22fr);
  align-items: start;
  gap: clamp(2rem, 5vw, 5rem);
}

.city-index-preview {
  position: sticky;
  top: 1rem;
  height: min(72svh, 760px);
  overflow: hidden;
  color: #f2efe7;
  background: #252a27;
  isolation: isolate;
}

.city-index-image,
.city-index-shade {
  position: absolute;
  inset: 0;
}

.city-index-image {
  z-index: -2;
  background-position: center;
  background-size: cover;
}

.city-index-shade {
  z-index: -1;
  background: rgba(13, 17, 16, 0.36);
}

.city-index-caption {
  position: absolute;
  right: 1.4rem;
  bottom: 1.4rem;
  left: 1.4rem;
  display: grid;
}

.city-index-caption span {
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.city-index-caption strong {
  font-size: clamp(3rem, 6vw, 6rem);
  font-weight: 600;
  letter-spacing: -0.07em;
  line-height: 0.9;
}

.city-index-caption small {
  margin-top: 0.9rem;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.city-index-data {
  min-width: 0;
}

.weather-skeleton-grid {
  display: block;
}

.weather-skeleton {
  min-height: 110px;
  border: 0;
  border-bottom: 1px solid #aaa8a2;
  border-radius: 0;
  background: transparent;
}

.custom-detail-btn {
  padding: 0.25rem 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  border-radius: 0;
  color: inherit;
  background: transparent;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  backdrop-filter: none;
}

.custom-detail-btn:hover {
  color: inherit;
  background: transparent;
  transform: none;
}

@keyframes atlas-drift {
  from {
    transform: scale(1.06) translateX(0.6%);
  }
  to {
    transform: scale(1.025) translateX(0);
  }
}

@media (max-width: 1024px) {
  .city-index-layout {
    display: block;
  }

  .city-index-preview {
    position: relative;
    top: auto;
    height: 58svh;
    min-height: 440px;
    margin-bottom: 2rem;
  }
}

@media (min-width: 761px) and (max-height: 760px) {
  .atlas-frame {
    padding-top: 7rem;
  }

  .atlas-copy {
    top: 23%;
  }

  .atlas-copy h1 {
    font-size: clamp(4rem, 9vw, 7.5rem);
  }

  .atlas-temperature {
    bottom: 1.25rem;
    font-size: clamp(6.5rem, min(16vw, 24svh), 12rem);
  }

  .atlas-metrics {
    bottom: 18%;
  }

  .atlas-city-rail {
    bottom: 5.25rem;
  }
}

@media (max-width: 760px) {
  .atlas-hero {
    min-height: 680px;
  }

  .atlas-frame {
    width: calc(100% - 2rem);
    padding-top: 8.8rem;
  }

  .atlas-index span:nth-child(2) {
    display: none;
  }

  .atlas-copy {
    top: 23%;
    width: 100%;
  }

  .atlas-copy h1 {
    font-size: clamp(3.15rem, 15vw, 4.8rem);
    line-height: 0.92;
  }

  .atlas-title-line {
    align-items: baseline;
    column-gap: 0.85rem;
  }

  .atlas-title-line.is-medium h1 {
    font-size: clamp(2.85rem, 12vw, 4rem);
  }

  .atlas-title-line.is-long h1 {
    font-size: clamp(2.35rem, 9vw, 3.2rem);
  }

  .atlas-condition {
    flex-basis: clamp(6.5rem, 28vw, 9rem);
    max-width: clamp(6.5rem, 28vw, 9rem);
    margin-bottom: 0.45em;
  }

  .atlas-temperature {
    bottom: clamp(4.25rem, 8svh, 5.5rem);
    font-size: clamp(6.5rem, min(32vw, 22svh), 9rem);
    line-height: 0.92;
  }

  .atlas-metrics {
    right: 0;
    top: 45%;
    bottom: auto;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
  }

  .atlas-metrics div {
    display: grid;
    gap: 0.35rem;
    padding: 0.7rem 0;
  }

  .atlas-metrics div + div {
    padding-left: 0.8rem;
    border-left: 1px solid rgba(255, 255, 255, 0.28);
  }

  .atlas-city-rail {
    right: auto;
    bottom: clamp(10.5rem, 27svh, 13rem);
    left: 0;
    max-width: 100%;
  }

  .atlas-navigation {
    right: 0;
    bottom: 1rem;
  }

  .atlas-timeline {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    min-height: 0;
    padding-inline: 1rem;
  }

  .atlas-timeline header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
  }

  .atlas-timeline header > span {
    max-width: 42%;
    margin-top: 0;
    text-align: right;
  }

  .timeline-chart svg {
    height: 104px;
  }

  .timeline-labels span:nth-child(even) {
    opacity: 0.45;
  }

  .atlas-content {
    width: calc(100% - 2rem);
  }

  .search-section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 1rem;
  }

  .city-index-preview {
    min-height: 420px;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .stat-card,
  .stat-card + .stat-card {
    min-height: auto;
    padding: 1rem 0;
    border-right: 0;
    border-bottom: 1px solid #aaa8a2;
  }

  .stat-card:last-child {
    border-bottom: 0;
  }
}

@media (max-width: 420px) {
  .atlas-index span:last-child {
    display: none;
  }

  .atlas-copy {
    top: 22%;
  }

  .atlas-kicker {
    margin-bottom: 0.7rem;
    font-size: 0.75rem;
  }

  .atlas-condition {
    margin-bottom: 0.35em;
    font-size: 0.75rem;
  }

  .atlas-metrics {
    top: 43%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .atlas-backdrop,
  .atlas-copy,
  .atlas-temperature {
    animation: none;
    transition: none;
  }
}

.atlas-backtop {
  width: 48px;
  height: 48px;
  border: 1px solid rgba(30, 33, 31, 0.42);
  border-radius: 0;
  background: #ebe8e0;
  color: #1e211f;
  box-shadow: none;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.atlas-backtop:hover {
  background: #536d7a;
  color: #fff;
  box-shadow: none;
}
</style>

<style>
.el-message.atlas-message {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(30, 33, 31, 0.28);
  border-radius: 0;
  background: #ebe8e0;
  box-shadow: none;
}

.el-message.atlas-message .el-message__content {
  color: #1e211f;
  font-size: 0.78rem;
  font-weight: 650;
  letter-spacing: 0.015em;
}

.el-message.atlas-message.el-message--success .el-message__icon {
  color: #536d7a;
}

.el-message.atlas-message.el-message--error {
  border-color: rgba(133, 60, 48, 0.46);
}
</style>
