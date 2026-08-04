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
const { searchQuery, filteredWeatherList, matchedCities, resultCount } =
  useWeatherSearch(weatherList)

// URL의 q 값을 검색어와 동기화하여 새로고침 후에도 검색 결과를 유지
const getQueryText = (query) => (typeof query === 'string' ? query : '')

searchQuery.value = getQueryText(route.query.q)

watch(searchQuery, (newQuery) => {
  const normalizedQuery = newQuery.trim()
  const currentQuery = getQueryText(route.query.q)

  if (normalizedQuery === currentQuery) return

  const nextQuery = { ...route.query }

  if (normalizedQuery) {
    nextQuery.q = normalizedQuery
  } else {
    delete nextQuery.q
  }

  router.replace({ name: 'weather-home', query: nextQuery })
})

watch(
  () => route.query.q,
  (newQuery) => {
    const queryText = getQueryText(newQuery)
    if (queryText !== searchQuery.value) searchQuery.value = queryText
  },
)

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
  router.push({ name: 'weather-detail', params: { cityId } })
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

      <div class="weather-grid">
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :city-item="item"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="showDetail"
        >
          <template #actions="{ city, requestDetail }">
            <button class="custom-detail-btn" type="button" @click.stop="requestDetail">
              🔎 {{ city.name }} 상세보기
            </button>
          </template>
        </WeatherCard>
      </div>

      <!-- 검색 결과 없을 시 안내 -->
      <p v-if="filteredWeatherList.length === 0" class="no-result">
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
</style>
