<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElBacktop, ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherSearch } from '@/composables/useWeatherSearch'
import { useTemperature } from '@/composables/useTemperature'
import { fetchForecastByCoordinates, getWeatherErrorMessage } from '@/services/openWeatherApi'
import { useWeatherStore } from '@/stores/weatherStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import SearchBar from '@/components/exercise/SearchBar.vue'
import UnitToggler from '@/components/exercise/UnitToggler.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import clearCityImage from '@/assets/weather-atlas/clear-city.jpg'
import rainCityImage from '@/assets/weather-atlas/rain-city.jpg'
import cloudCityImage from '@/assets/weather-atlas/cloud-city.jpg'
import snowCityImage from '@/assets/weather-atlas/snow-city.jpg'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()
const favoritesStore = useFavoritesStore()
const { formatTemperature } = useTemperature()
const { weatherList, isSearching, isInitializing, searchError, initializationError, lastUpdatedCity } = storeToRefs(weatherStore)
const { favoriteCities } = storeToRefs(favoritesStore)
const { isFavorite, toggleFavorite, reconcileFavorites } = favoritesStore

const activeCityId = ref('')
const { searchQuery, debouncedSearchQuery, filteredWeatherList } = useWeatherSearch(weatherList)
const statusOptions = ['전체', '맑음', '비', '구름', '눈']
const sortOptions = ['default', 'temp-desc', 'temp-asc', 'name']
const getQueryText = (value) => (typeof value === 'string' ? value : '')
const getStatus = (value) => (statusOptions.includes(value) ? value : '전체')
const getSort = (value) => (sortOptions.includes(value) ? value : 'default')
const getFavoritesOnly = (value) => value === '1'

searchQuery.value = getQueryText(route.query.q)
const selectedStatus = ref(getStatus(route.query.status))
const selectedSort = ref(getSort(route.query.sort))
const favoritesOnly = ref(getFavoritesOnly(route.query.favorite))

watch([debouncedSearchQuery, selectedStatus, selectedSort, favoritesOnly], ([query, status, sort, onlyFavorites]) => {
  const nextQuery = { ...route.query }
  if (query.trim()) nextQuery.q = query.trim()
  else delete nextQuery.q
  if (status !== '전체') nextQuery.status = status
  else delete nextQuery.status
  if (sort !== 'default') nextQuery.sort = sort
  else delete nextQuery.sort
  if (onlyFavorites) nextQuery.favorite = '1'
  else delete nextQuery.favorite

  if (JSON.stringify(nextQuery) !== JSON.stringify(route.query)) router.replace({ name: 'weather-home', query: nextQuery })
})

watch(
  () => [route.query.q, route.query.status, route.query.sort, route.query.favorite],
  ([query, status, sort, favorite]) => {
    const nextQuery = getQueryText(query)
    if (nextQuery !== searchQuery.value) searchQuery.value = nextQuery
    selectedStatus.value = getStatus(status)
    selectedSort.value = getSort(sort)
    favoritesOnly.value = getFavoritesOnly(favorite)
  },
)

const scopedWeatherList = computed(() => (favoritesOnly.value ? filteredWeatherList.value.filter((city) => isFavorite(city.id)) : filteredWeatherList.value))
const favoriteCityCount = computed(() => weatherList.value.filter((city) => isFavorite(city.id)).length)
const displayedWeatherList = computed(() => {
  const filtered = selectedStatus.value === '전체' ? scopedWeatherList.value : scopedWeatherList.value.filter((city) => city.status === selectedStatus.value)
  const sorted = [...filtered]
  if (selectedSort.value === 'temp-desc') return sorted.sort((a, b) => b.temp - a.temp)
  if (selectedSort.value === 'temp-asc') return sorted.sort((a, b) => a.temp - b.temp)
  if (selectedSort.value === 'name') return sorted.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  return sorted
})

const activeCity = computed(() => weatherStore.findWeatherById(activeCityId.value) || displayedWeatherList.value[0] || weatherList.value[0] || null)
const atlasImages = { 맑음: clearCityImage, 비: rainCityImage, 구름: cloudCityImage, 눈: snowCityImage }
const atlasHeadlines = { 맑음: 'CLEAR ABOVE THE CITY', 비: 'RAIN AFTER MIDNIGHT', 구름: 'CLOUDS OVER THE WATER', 눈: 'WHITE AIR, HIGH GROUND' }
const atlasThemeClasses = { 맑음: 'atlas-clear', 비: 'atlas-rain', 구름: 'atlas-clouds', 눈: 'atlas-snow' }
const activeAtlasImage = computed(() => atlasImages[activeCity.value?.status] || cloudCityImage)
const activeAtlasHeadline = computed(() => atlasHeadlines[activeCity.value?.status] || 'WEATHER ACROSS THE CITY')
const activeAtlasTheme = computed(() => atlasThemeClasses[activeCity.value?.status] || 'atlas-clouds')
const activeCityNameLength = computed(() => Array.from(activeCity.value?.name || '').length)

const validTemperatures = computed(() => weatherList.value.filter((city) => Number.isFinite(Number(city.temp))))
const averageTemperature = computed(() => {
  if (!validTemperatures.value.length) return null
  return validTemperatures.value.reduce((total, city) => total + Number(city.temp), 0) / validTemperatures.value.length
})
const warmestCity = computed(() => [...validTemperatures.value].sort((a, b) => b.temp - a.temp)[0] || null)
const commandStatus = computed(() => {
  if (isInitializing.value) return '기본 도시와 저장된 도시의 실시간 관측을 불러오는 중입니다.'
  if (lastUpdatedCity.value) return `${lastUpdatedCity.value.name} 실시간 관측을 반영했습니다.`
  return ''
})
const commandError = computed(() => searchError.value || initializationError.value)

const forecastReadings = ref([])
const isForecastLoading = ref(false)
const forecastError = ref('')
const forecastCache = new Map()
let forecastRequestId = 0
let forecastTimer

const loadActiveForecast = async () => {
  const coordinates = activeCity.value?.coordinates
  const requestId = ++forecastRequestId
  forecastReadings.value = []
  forecastError.value = ''
  if (!coordinates) return
  const cacheKey = `${coordinates.lat},${coordinates.lon}`
  if (forecastCache.has(cacheKey)) {
    forecastReadings.value = forecastCache.get(cacheKey)
    return
  }
  isForecastLoading.value = true
  try {
    const readings = (await fetchForecastByCoordinates(coordinates)).slice(0, 6)
    if (requestId !== forecastRequestId) return
    forecastCache.set(cacheKey, readings)
    forecastReadings.value = readings
  } catch (error) {
    if (requestId === forecastRequestId) forecastError.value = getWeatherErrorMessage(error)
  } finally {
    if (requestId === forecastRequestId) isForecastLoading.value = false
  }
}

watch(
  () => activeCity.value?.id,
  () => {
    clearTimeout(forecastTimer)
    forecastTimer = setTimeout(loadActiveForecast, 220)
  },
  { immediate: true },
)

watch(
  weatherList,
  (cities) => {
    if (!cities.some((city) => city.id === activeCityId.value)) activeCityId.value = cities[0]?.id || ''
  },
  { deep: true },
)

const previewCity = (city) => {
  if (city) activeCityId.value = city.id
}
const moveActiveCity = (direction) => {
  const cities = displayedWeatherList.value.length ? displayedWeatherList.value : weatherList.value
  if (!cities.length) return
  const currentIndex = Math.max(
    cities.findIndex((city) => city.id === activeCity.value?.id),
    0,
  )
  previewCity(cities[(currentIndex + direction + cities.length) % cities.length])
}
const getStatusCount = (status) => (status === '전체' ? scopedWeatherList.value.length : scopedWeatherList.value.filter((city) => city.status === status).length)
const showMessage = (message, type = 'success') => ElMessage({ message, type, duration: 2200, customClass: 'atlas-message' })

const handleCitySearch = async (cityName) => {
  selectedStatus.value = '전체'
  const city = await weatherStore.searchCityWeather(cityName)
  if (!city) {
    showMessage(searchError.value || '날씨 정보를 불러오지 못했습니다.', 'error')
    return
  }
  searchQuery.value = city.name
  activeCityId.value = city.id
  showMessage(`${city.name}의 실시간 관측을 반영했습니다.`)
}
const updateSearchQuery = (value) => {
  searchQuery.value = value
}
const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = '전체'
  favoritesOnly.value = false
}
const handleToggleFavorite = (city) => {
  const added = toggleFavorite(city)
  showMessage(added ? `${city.name}을 즐겨찾기에 추가했습니다.` : `${city.name}을 즐겨찾기에서 해제했습니다.`, added ? 'success' : 'info')
}
const showDetail = (cityId) => {
  const city = weatherStore.findWeatherById(cityId)
  if (!city) return
  router.push({ name: 'weather-detail', params: { cityId }, query: { ...route.query, city: city.officialName || city.name } })
}

onMounted(async () => {
  await weatherStore.initializeWeather(favoriteCities.value)
  reconcileFavorites(weatherList.value)
  activeCityId.value = weatherList.value[0]?.id || ''
})
onBeforeUnmount(() => clearTimeout(forecastTimer))
</script>

<template>
  <main class="dashboard-wrapper">
    <section class="atlas-hero" :class="activeAtlasTheme" aria-labelledby="atlas-city-name">
      <Transition name="atlas-fade" mode="out-in">
        <div :key="activeAtlasImage" class="atlas-backdrop" :style="{ backgroundImage: `url(${activeAtlasImage})` }"></div>
      </Transition>
      <div class="atlas-shade" aria-hidden="true"></div>
      <div class="atlas-grain" aria-hidden="true"></div>

      <div class="atlas-frame">
        <div class="atlas-index" aria-label="관측 메타데이터">
          <span>VOL. 01</span>
          <span>{{ activeCity?.observedAt || 'LIVE WEATHER' }}</span>
          <span>{{ activeCity?.country || 'OPENWEATHER' }} / LIVE</span>
        </div>

        <template v-if="activeCity">
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

          <strong class="atlas-temperature">{{ formatTemperature(activeCity.temp) }}</strong>
          <dl class="atlas-metrics">
            <div>
              <dt>체감 온도</dt>
              <dd>{{ formatTemperature(activeCity.feelsLike) }}</dd>
            </div>
            <div>
              <dt>습도</dt>
              <dd>{{ activeCity.humidity ?? '정보 없음' }}<template v-if="activeCity.humidity != null">%</template></dd>
            </div>
            <div>
              <dt>풍속</dt>
              <dd>{{ activeCity.windSpeed ?? '정보 없음' }}<template v-if="activeCity.windSpeed != null"> m/s</template></dd>
            </div>
          </dl>

          <div class="atlas-navigation" aria-label="도시 이동">
            <button type="button" aria-label="이전 도시" @click="moveActiveCity(-1)">←</button>
            <span>{{ String(weatherList.findIndex((city) => city.id === activeCity.id) + 1).padStart(2, '0') }} / {{ String(weatherList.length).padStart(2, '0') }}</span>
            <button type="button" aria-label="다음 도시" @click="moveActiveCity(1)">→</button>
          </div>

          <nav class="atlas-city-rail" aria-label="도시 빠른 이동">
            <button
              v-for="city in weatherList.slice(0, 6)"
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
        </template>

        <div v-else class="atlas-empty-copy">
          <p class="atlas-kicker">AWAITING LIVE OBSERVATION</p>
          <h1 id="atlas-city-name">도시의 날씨를<br />검색해 주세요</h1>
          <p>{{ isInitializing ? '서울의 실시간 날씨를 불러오고 있습니다.' : '사진과 정보 구조는 유지되며, 가짜 날씨 데이터는 표시하지 않습니다.' }}</p>
        </div>

        <a class="atlas-scroll-cue" href="#forecast" aria-label="향후 18시간 예보로 이동">
          <span>SCROLL TO FORECAST</span>
          <span class="atlas-scroll-line" aria-hidden="true"></span>
        </a>
      </div>
    </section>

    <section id="forecast" class="atlas-timeline" aria-labelledby="timeline-title">
      <header>
        <div>
          <p>LIVE FORECAST / 3-HOUR INTERVALS</p>
          <h2 id="timeline-title">향후 18시간</h2>
        </div>
        <span>{{ activeCity ? `${activeCity.name} · 3시간 간격 예보` : '도시를 검색하면 실제 예보가 표시됩니다.' }}</span>
      </header>
      <div v-if="forecastReadings.length" class="forecast-grid" :aria-label="`${activeCity.name}의 향후 18시간 실제 기온 예보`">
        <article v-for="reading in forecastReadings" :key="reading.timestamp">
          <time :datetime="new Date(reading.timestamp * 1000).toISOString()">{{ reading.label }}</time>
          <strong>{{ formatTemperature(reading.temperature) }}</strong>
          <span>{{ reading.description || '날씨 설명 없음' }}</span>
          <small>{{ reading.precipitationProbability ? `강수 ${reading.precipitationProbability}%` : '강수 가능성 낮음' }}</small>
        </article>
      </div>
      <p v-else class="timeline-state" role="status">{{ isForecastLoading ? '실시간 예보를 동기화하고 있습니다.' : forecastError || '조회된 도시가 없어 예보를 표시하지 않습니다.' }}</p>
    </section>

    <section class="atlas-command-bar" aria-label="도시 검색과 온도 단위 설정">
      <SearchBar
        :current-query="searchQuery"
        :is-loading="isSearching || isInitializing"
        :error-message="commandError"
        :status-message="commandStatus"
        @update-query="updateSearchQuery"
        @search-city="handleCitySearch"
      />
      <UnitToggler />
    </section>

    <section class="city-journal" aria-labelledby="city-index-title">
      <header class="city-journal-heading">
        <div>
          <p>CITY INDEX</p>
          <h2 id="city-index-title">도시 아카이브</h2>
        </div>
        <div v-if="weatherList.length" class="city-meta" aria-label="도시 관측 요약">
          <span
            ><b>{{ String(weatherList.length).padStart(2, '0') }}</b> CITIES</span
          >
          <span v-if="averageTemperature !== null"
            >AVG <b>{{ formatTemperature(averageTemperature) }}</b></span
          >
          <span v-if="warmestCity"
            >WARMEST <b>{{ warmestCity.name }} {{ formatTemperature(warmestCity.temp) }}</b></span
          >
        </div>
        <span v-else class="city-meta">NO LIVE CITIES</span>
      </header>

      <div class="list-controls">
        <div class="filter-groups">
          <fieldset>
            <legend>도시 보기 범위</legend>
            <button type="button" :class="{ active: !favoritesOnly }" :aria-pressed="!favoritesOnly" @click="favoritesOnly = false">전체 도시</button>
            <button type="button" :class="{ active: favoritesOnly }" :aria-pressed="favoritesOnly" @click="favoritesOnly = true">
              즐겨찾기 <small>{{ favoriteCityCount }}</small>
            </button>
          </fieldset>
          <fieldset>
            <legend>날씨 상태</legend>
            <button v-for="status in statusOptions" :key="status" type="button" :class="{ active: selectedStatus === status }" @click="selectedStatus = status">
              {{ status }} <small>{{ getStatusCount(status) }}</small>
            </button>
          </fieldset>
        </div>
        <label
          >정렬<select v-model="selectedSort">
            <option value="default">기본 순서</option>
            <option value="temp-desc">기온 높은 순</option>
            <option value="temp-asc">기온 낮은 순</option>
            <option value="name">도시 이름순</option>
          </select></label
        >
      </div>

      <div v-if="weatherList.length" class="city-index-layout">
        <aside class="city-index-preview" aria-label="선택 도시 이미지 미리보기">
          <div class="city-index-image" :style="{ backgroundImage: `url(${activeAtlasImage})` }"></div>
          <div class="city-index-shade" aria-hidden="true"></div>
          <div v-if="activeCity" class="city-index-caption">
            <span>{{ activeAtlasHeadline }}</span
            ><strong>{{ activeCity.name }}</strong
            ><small>{{ formatTemperature(activeCity.temp) }} / {{ activeCity.status }}</small>
          </div>
        </aside>
        <div class="city-index-data">
          <WeatherCard
            v-for="city in displayedWeatherList"
            :key="city.id"
            :city-item="city"
            :is-favorite="isFavorite(city.id)"
            :is-active="city.id === activeCity?.id"
            @preview-city="previewCity"
            @toggle-favorite="handleToggleFavorite"
            @click-detail="showDetail"
          />
          <div v-if="!displayedWeatherList.length" class="city-empty">
            <p>{{ favoritesOnly ? 'SAVED CITIES' : 'FILTERED ARCHIVE' }}</p>
            <strong>{{ favoritesOnly ? '저장한 즐겨찾기 도시가 없습니다.' : '조건에 맞는 도시가 없습니다.' }}</strong
            ><button type="button" @click="resetFilters">전체 도시 보기</button>
          </div>
        </div>
      </div>
      <div v-else class="city-empty city-empty-full">
        <p>LIVE CITY ARCHIVE</p>
        <strong>아직 불러온 실시간 도시가 없습니다.</strong><span>위 검색창에서 도시를 조회하거나 API 환경변수를 확인해 주세요.</span>
      </div>
    </section>

    <ElBacktop :right="24" :bottom="24" aria-label="페이지 맨 위로 이동" />
  </main>
</template>

<style scoped>
.dashboard-wrapper {
  min-width: 0;
  background: var(--atlas-paper);
  color: var(--atlas-ink);
}
.atlas-hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  color: #f2efe7;
  background: #202623;
}
.atlas-backdrop,
.atlas-shade,
.atlas-grain {
  position: absolute;
  inset: 0;
}
.atlas-backdrop {
  background-position: center;
  background-size: cover;
  transition: opacity 0.7s ease;
}
.atlas-shade {
  background: linear-gradient(90deg, rgba(14, 17, 16, 0.82) 0%, rgba(14, 17, 16, 0.45) 56%, rgba(14, 17, 16, 0.68) 100%);
}
.atlas-grain {
  opacity: 0.12;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
}
.atlas-frame {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  padding: clamp(6.5rem, 10vh, 8.5rem) clamp(1.25rem, 5vw, 5rem) 6rem;
}
.atlas-index {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(242, 239, 231, 0.35);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.13em;
}
.atlas-copy {
  margin-top: clamp(2.5rem, 7vh, 5.5rem);
}
.atlas-kicker {
  margin: 0 0 0.8rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.17em;
}
.atlas-title-line {
  display: flex;
  align-items: flex-end;
  gap: clamp(1rem, 3vw, 3rem);
  min-width: 0;
}
.atlas-title-line h1,
.atlas-empty-copy h1 {
  margin: 0;
  font-size: clamp(3.25rem, 7.2vw, 7.5rem);
  font-weight: 620;
  letter-spacing: -0.075em;
  line-height: 0.78;
  white-space: nowrap;
}
.atlas-title-line.is-medium h1 {
  font-size: clamp(3rem, 6.2vw, 6.5rem);
}
.atlas-title-line.is-long h1 {
  max-width: min(76vw, 72rem);
  font-size: clamp(2.5rem, 5vw, 5rem);
  line-height: 0.84;
  white-space: normal;
  overflow-wrap: anywhere;
}
.atlas-condition {
  max-width: 20rem;
  margin: 0 0 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid currentColor;
  font-size: clamp(0.72rem, 1vw, 0.9rem);
  font-weight: 700;
  letter-spacing: 0.07em;
}
.atlas-temperature {
  position: absolute;
  right: clamp(1.25rem, 5vw, 5rem);
  bottom: 4.5rem;
  font-size: clamp(5.5rem, 14vw, 13rem);
  font-weight: 250;
  letter-spacing: -0.04em;
  line-height: 0.7;
  font-variant-numeric: tabular-nums;
}
.atlas-metrics {
  position: absolute;
  left: clamp(1.25rem, 5vw, 5rem);
  bottom: 4.8rem;
  display: flex;
  gap: clamp(1.4rem, 4vw, 4rem);
  margin: 0;
}
.atlas-metrics div {
  min-width: 6.5rem;
}
.atlas-metrics dt {
  margin-bottom: 0.35rem;
  color: rgba(242, 239, 231, 0.64);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}
.atlas-metrics dd {
  margin: 0;
  font-size: clamp(0.9rem, 1.5vw, 1.25rem);
  font-weight: 650;
}
.atlas-navigation {
  position: absolute;
  right: clamp(1.25rem, 5vw, 5rem);
  top: clamp(7.8rem, 13vh, 9.5rem);
  display: grid;
  grid-template-columns: 2.25rem auto 2.25rem;
  align-items: center;
  gap: 0.55rem;
}
.atlas-navigation button {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
}
.atlas-navigation span {
  min-width: 3.75rem;
  text-align: center;
  white-space: nowrap;
}
.atlas-navigation button:focus-visible,
.atlas-city-rail button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}
.atlas-city-rail {
  position: absolute;
  right: clamp(1.25rem, 5vw, 5rem);
  top: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.55rem;
  transform: translateY(-50%);
}
.atlas-city-rail button {
  padding: 0.15rem 0;
  border: 0;
  border-bottom: 1px solid transparent;
  color: rgba(242, 239, 231, 0.58);
  background: transparent;
  cursor: pointer;
}
.atlas-city-rail button.active {
  border-color: currentColor;
  color: #fff;
}
.atlas-empty-copy {
  margin-top: clamp(5rem, 13vh, 9rem);
  max-width: 65rem;
}
.atlas-empty-copy h1 {
  white-space: normal;
}
.atlas-empty-copy > p:last-child {
  max-width: 34rem;
  margin-top: 2rem;
  color: rgba(242, 239, 231, 0.7);
}
.atlas-command-bar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 2rem;
  padding: 1.2rem clamp(1.25rem, 5vw, 5rem) 1.6rem;
  border-top: 1px solid rgba(242, 239, 231, 0.35);
  border-bottom: 1px solid rgba(242, 239, 231, 0.22);
  background: #1b201e;
}
.atlas-command-bar :deep(.unit-toggler) {
  padding-top: 0.1rem;
}
.atlas-command-bar :deep(.unit-label) {
  color: rgba(242, 239, 231, 0.6);
}
.atlas-command-bar :deep(.unit-button) {
  border-color: rgba(242, 239, 231, 0.45);
  color: rgba(242, 239, 231, 0.5);
  background: transparent;
}
.atlas-command-bar :deep(.unit-button .active) {
  color: #fff;
}
.atlas-scroll-cue {
  position: absolute;
  right: clamp(1.25rem, 5vw, 5rem);
  bottom: 1.4rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: #f2efe7;
  text-decoration: none;
  font-size: 0.61rem;
  font-weight: 700;
  letter-spacing: 0.11em;
}
.atlas-scroll-line {
  display: block;
  width: 3rem;
  height: 1px;
  background: currentColor;
  animation: line-pulse 2.2s ease-in-out infinite;
}
.atlas-timeline,
.city-journal {
  padding: clamp(3rem, 5vw, 4.5rem) clamp(1.25rem, 5vw, 5rem);
  scroll-margin-top: 5.5rem;
}
.atlas-timeline {
  border-bottom: 1px solid var(--atlas-line);
}
.atlas-timeline header,
.city-journal-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid var(--atlas-line-strong);
}
.atlas-timeline header p,
.city-journal-heading p,
.city-empty p {
  margin: 0 0 0.45rem;
  color: var(--atlas-muted);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}
.atlas-timeline h2,
.city-journal h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3.4vw, 3.8rem);
  font-weight: 570;
  letter-spacing: -0.055em;
  line-height: 0.95;
}
.atlas-timeline header > span {
  color: var(--atlas-muted);
  font-size: 0.78rem;
}
.forecast-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  border-bottom: 1px solid var(--atlas-line);
}
.forecast-grid article {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 1.15rem 1rem 1.25rem;
  border-right: 1px solid var(--atlas-line);
}
.forecast-grid article:first-child {
  padding-left: 0;
}
.forecast-grid article:last-child {
  padding-right: 0;
  border-right: 0;
}
.forecast-grid time,
.forecast-grid small {
  color: var(--atlas-muted);
  font-size: 0.8rem;
}
.forecast-grid strong {
  margin: 0.45rem 0 0.2rem;
  font-size: clamp(1.35rem, 2.2vw, 2rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}
.forecast-grid span {
  min-height: 2.5em;
  color: var(--atlas-ink);
  font-size: 0.78rem;
  line-height: 1.35;
}
.forecast-grid small {
  margin-top: 0.6rem;
}
.timeline-state {
  min-height: 10rem;
  margin: 0;
  padding: 4rem 0;
  color: var(--atlas-muted);
}
.city-journal {
  max-width: 1700px;
  margin: 0 auto;
}
.city-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.7rem 1.5rem;
  color: var(--atlas-muted);
  font-size: 0.66rem;
  letter-spacing: 0.09em;
}
.city-meta b {
  color: var(--atlas-ink);
}
.list-controls {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--atlas-line);
}
.filter-groups {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
}
.filter-groups fieldset + fieldset {
  padding-left: 1.5rem;
  border-left: 1px solid var(--atlas-line);
}
.list-controls fieldset {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  border: 0;
}
.list-controls legend {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
.list-controls button,
.list-controls select {
  padding: 0.35rem 0.55rem;
  border: 1px solid transparent;
  border-radius: 0;
  color: var(--atlas-muted);
  background: transparent;
  font: inherit;
  font-size: 0.72rem;
  cursor: pointer;
}
.list-controls button.active {
  border-color: var(--atlas-ink);
  color: var(--atlas-ink);
}
.list-controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--atlas-muted);
  font-size: 0.7rem;
}
.list-controls select {
  border-bottom-color: var(--atlas-line-strong);
  color: var(--atlas-ink);
}
.city-index-layout {
  display: grid;
  grid-template-columns: minmax(240px, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(2rem, 6vw, 7rem);
  padding-top: clamp(2rem, 5vw, 5rem);
}
.city-index-preview {
  position: sticky;
  top: 6rem;
  height: clamp(430px, 62vh, 700px);
  overflow: hidden;
  color: #f2efe7;
}
.city-index-image,
.city-index-shade {
  position: absolute;
  inset: 0;
}
.city-index-image {
  background-position: center;
  background-size: cover;
}
.city-index-shade {
  background: linear-gradient(180deg, rgba(20, 22, 21, 0.12), rgba(20, 22, 21, 0.82));
}
.city-index-caption {
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  left: 2rem;
  display: flex;
  flex-direction: column;
}
.city-index-caption span {
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.13em;
}
.city-index-caption strong {
  font-size: clamp(2rem, 3.5vw, 3.8rem);
  font-weight: 560;
  letter-spacing: -0.06em;
}
.city-index-caption small {
  font-size: 0.76rem;
}
.city-index-data {
  min-width: 0;
  counter-reset: city-row;
}
.city-empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-height: 15rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--atlas-line);
}
.city-empty strong {
  font-size: clamp(1.3rem, 2vw, 2rem);
  font-weight: 560;
}
.city-empty span {
  margin-top: 0.5rem;
  color: var(--atlas-muted);
}
.city-empty button {
  margin-top: 1rem;
  padding: 0.4rem 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  background: transparent;
  cursor: pointer;
}
.city-empty-full {
  min-height: 26rem;
}
.atlas-fade-enter-active,
.atlas-fade-leave-active,
.atlas-copy-enter-active,
.atlas-copy-leave-active {
  transition:
    opacity 0.65s ease,
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}
.atlas-fade-enter-from,
.atlas-fade-leave-to {
  opacity: 0;
}
.atlas-copy-enter-from {
  opacity: 0;
  transform: translateY(18px);
}
.atlas-copy-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
@keyframes line-pulse {
  50% {
    opacity: 0.35;
    transform: scaleX(0.72);
  }
}
@media (max-width: 760px) {
  .atlas-frame {
    padding: 6.4rem 1rem 5.5rem;
  }
  .atlas-index span:nth-child(2) {
    display: none;
  }
  .atlas-copy {
    margin-top: 4.2rem;
  }
  .atlas-title-line {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.7rem;
  }
  .atlas-title-line h1,
  .atlas-title-line.is-medium h1,
  .atlas-title-line.is-long h1,
  .atlas-empty-copy h1 {
    font-size: clamp(3rem, 15vw, 4.8rem);
    line-height: 0.85;
    white-space: normal;
  }
  .atlas-condition {
    margin: 0;
  }
  .atlas-temperature {
    right: 1rem;
    bottom: 6rem;
    font-size: clamp(5.2rem, 29vw, 8rem);
  }
  .atlas-metrics {
    right: 1rem;
    bottom: 2.3rem;
    left: 1rem;
    justify-content: space-between;
    gap: 0.6rem;
  }
  .atlas-metrics div {
    min-width: 0;
  }
  .atlas-metrics dd {
    font-size: 0.83rem;
  }
  .atlas-navigation {
    top: 8rem;
    right: 1rem;
  }
  .atlas-city-rail {
    display: none;
  }
  .atlas-command-bar {
    grid-template-columns: 1fr;
    gap: 0.55rem;
    padding: 0.8rem 1rem 1.05rem;
  }
  .atlas-command-bar :deep(.unit-toggler) {
    justify-content: flex-end;
  }
  .atlas-scroll-cue {
    right: auto;
    bottom: 0.75rem;
    left: 1rem;
  }
  .atlas-scroll-cue > span:first-child {
    display: none;
  }
  .atlas-timeline,
  .city-journal {
    padding: 3.5rem 1rem;
  }
  .atlas-timeline header,
  .city-journal-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .forecast-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .forecast-grid article,
  .forecast-grid article:first-child,
  .forecast-grid article:last-child {
    padding: 1rem 0.8rem;
    border-right: 1px solid var(--atlas-line);
    border-bottom: 1px solid var(--atlas-line);
  }
  .forecast-grid article:nth-child(even) {
    border-right: 0;
  }
  .forecast-grid article:nth-last-child(-n + 2) {
    border-bottom: 0;
  }
  .list-controls {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.7rem;
  }
  .filter-groups {
    align-items: flex-start;
    flex-direction: column;
  }
  .filter-groups fieldset + fieldset {
    padding-left: 0;
    border-left: 0;
  }
  .city-index-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .city-index-preview {
    position: relative;
    top: auto;
    height: 56svh;
    min-height: 360px;
  }
  .city-meta {
    justify-content: flex-start;
  }
  .city-index-caption {
    right: 1.2rem;
    bottom: 1.2rem;
    left: 1.2rem;
  }
}
@media (max-width: 390px) {
  .atlas-frame {
    padding-top: 5.8rem;
  }
  .atlas-index {
    font-size: 0.58rem;
  }
  .atlas-copy {
    margin-top: 3.7rem;
  }
  .atlas-temperature {
    bottom: 6rem;
  }
  .atlas-metrics {
    bottom: 2.3rem;
  }
  .atlas-scroll-cue {
    bottom: 0.75rem;
  }
  .atlas-command-bar {
    padding-bottom: 0.8rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .atlas-fade-enter-active,
  .atlas-fade-leave-active,
  .atlas-copy-enter-active,
  .atlas-copy-leave-active {
    transition: none;
  }
  .atlas-scroll-line {
    animation: none;
  }
}
</style>
