<script setup>
/**
 * WeatherHomeView.vue — / 경로의 날씨 대시보드 화면
 *
 * 1. 원본 날씨 데이터와 선택 상태, 대시보드 통계 관리
 * 2. 검색 로직은 useWeatherSearch Composable로 재사용
 * 3. BaseDashboardCard와 WeatherCard의 Named/Scoped Slot 커스터마이징
 */
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherSearch } from '@/composables/useWeatherSearch'
import { weatherData } from '@/data/weatherData'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'

const router = useRouter()
const route = useRoute()

// 1. 가상 백엔드 날씨 데이터 배열
const weatherList = ref(weatherData)

// 2. 상태바 제어 반응형 데이터
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 3. 검색 상태와 파생 데이터는 Composable에서 관리
const { searchQuery, filteredWeatherList } = useWeatherSearch(weatherList)

const statusOptions = ['전체', '맑음', '비', '구름', '눈']
const sortOptions = ['default', 'temp-desc', 'temp-asc', 'name']

// URL의 검색·필터·정렬 값을 화면 상태와 동기화
const getQueryText = (query) => (typeof query === 'string' ? query : '')
const getStatus = (query) => (statusOptions.includes(query) ? query : '전체')
const getSort = (query) => (sortOptions.includes(query) ? query : 'default')

searchQuery.value = getQueryText(route.query.q)
const selectedStatus = ref(getStatus(route.query.status))
const selectedSort = ref(getSort(route.query.sort))

watch([searchQuery, selectedStatus, selectedSort], ([newQuery, newStatus, newSort]) => {
  const nextQuery = { ...route.query }
  const normalizedQuery = newQuery.trim()

  if (normalizedQuery) nextQuery.q = normalizedQuery
  else delete nextQuery.q

  if (newStatus !== '전체') nextQuery.status = newStatus
  else delete nextQuery.status

  if (newSort !== 'default') nextQuery.sort = newSort
  else delete nextQuery.sort

  const hasSameQuery =
    getQueryText(route.query.q) === (nextQuery.q || '') &&
    getQueryText(route.query.status) === (nextQuery.status || '') &&
    getQueryText(route.query.sort) === (nextQuery.sort || '')

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
  const statusFiltered =
    selectedStatus.value === '전체'
      ? filteredWeatherList.value
      : filteredWeatherList.value.filter((city) => city.status === selectedStatus.value)

  const sortedList = [...statusFiltered]

  if (selectedSort.value === 'temp-desc') return sortedList.sort((a, b) => b.temp - a.temp)
  if (selectedSort.value === 'temp-asc') return sortedList.sort((a, b) => a.temp - b.temp)
  if (selectedSort.value === 'name') return sortedList.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  return sortedList
})

const resultCount = computed(() => displayedWeatherList.value.length)
const matchedCities = computed(() => displayedWeatherList.value.map((city) => city.name))

const getStatusCount = (status) => {
  if (status === '전체') return filteredWeatherList.value.length
  return filteredWeatherList.value.filter((city) => city.status === status).length
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

// 5. watch — 상태바 문구 업데이트 감시
watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

// 6. 상세 페이지로 이동
const showDetail = (cityId) => {
  router.push({
    name: 'weather-detail',
    params: { cityId },
    query: { ...route.query },
  })
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- 1) 도시 검색 영역 (BaseDashboardCard 슬롯 주입) -->
    <BaseDashboardCard>
      <template #header>
        <h3 class="dashboard-card-title">🔍 도시 검색</h3>
      </template>

      <SearchBar
        :current-query="searchQuery"
        :matched-cities="matchedCities"
        @update-query="(val) => (searchQuery = val)"
      />
    </BaseDashboardCard>

    <!-- 2) 선택 도시 상태바 -->
    <div class="status-bar">
      <span class="status-icon">{{ selectedCityInfo === '카드를 클릭하거나 검색해 보세요.' ? '💡' : '📍' }}</span>
      <span>{{ selectedCityInfo }}</span>
    </div>

    <!-- 3) 통계 요약 섹션 -->
    <section class="stats-section">
      <div class="stat-card">
        <span class="stat-label">검색 결과</span>
        <span class="stat-value">{{ resultCount }}<small>개 도시</small></span>
      </div>
      <div class="stat-card">
        <span class="stat-label">전체 평균 기온</span>
        <span class="stat-value">{{ avgTemp }}<small>°C</small></span>
      </div>
      <div class="stat-card">
        <span class="stat-label">가장 더운 도시</span>
        <span class="stat-value">{{ hottestCity.name }}<small> {{ hottestCity.temp }}°C</small></span>
      </div>
    </section>

    <!-- 4) 지역별 날씨 현황 영역 (BaseDashboardCard 슬롯 주입) -->
    <BaseDashboardCard>
      <template #header>
        <h3 class="dashboard-card-title">🏙️ 지역별 날씨 현황</h3>
      </template>

      <div class="list-controls">
        <fieldset class="status-filter">
          <legend>날씨 상태</legend>
          <button
            v-for="status in statusOptions"
            :key="status"
            type="button"
            :class="{ active: selectedStatus === status }"
            :aria-pressed="selectedStatus === status"
            @click="selectedStatus = status"
          >
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

      <div class="weather-grid">
        <WeatherCard
          v-for="item in displayedWeatherList"
          :key="item.id"
          :city-item="item"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="showDetail"
        >
          <template #actions="{ city, requestDetail }">
            <button class="custom-detail-btn" type="button" @click.stop="requestDetail">
              {{ city.name }} 상세보기
            </button>
          </template>
        </WeatherCard>
      </div>

      <!-- 검색 결과 없을 시 안내 -->
      <p v-if="displayedWeatherList.length === 0" class="no-result">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>

      <template #footer>
        <p class="dashboard-card-summary">현재 {{ resultCount }}개 도시를 표시하고 있습니다.</p>
      </template>
    </BaseDashboardCard>
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

/* Status Bar */
.status-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1.25rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  background: linear-gradient(135deg, #e8f4fd 0%, #d1ecf9 100%);
  color: #1a6fa8;
  border: 1px solid #b8dff5;
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
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
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
  transition: background 0.2s, border-color 0.2s, color 0.2s;
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
  border-radius: 8px;
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
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s, transform 0.2s, border-color 0.25s;
  backdrop-filter: blur(4px);
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
</style>
