<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'
import { useWeatherStore } from '@/stores/weatherStore'
import clearCityImage from '@/assets/weather-atlas/clear-city.jpg'
import rainCityImage from '@/assets/weather-atlas/rain-city.jpg'
import cloudCityImage from '@/assets/weather-atlas/cloud-city.jpg'
import snowCityImage from '@/assets/weather-atlas/snow-city.jpg'

const route = useRoute()
const { formatTemperature } = useTemperature()
const weatherStore = useWeatherStore()
const { isSearching, searchError } = storeToRefs(weatherStore)

const city = computed(() => weatherStore.findWeatherById(route.params.cityId))
const dataSourceLabel = computed(() => (city.value?.source === 'live' ? 'OpenWeather 실시간 관측 정보' : '샘플 관측 데이터'))
const precipitationLabel = computed(() => (city.value?.precipitationType === 'rainfall' ? '최근 1시간 강수량' : '강수 확률'))
const precipitationUnit = computed(() => (city.value?.precipitationType === 'rainfall' ? 'mm' : '%'))
const homeRoute = computed(() => ({
  name: 'weather-home',
  query: {
    ...(typeof route.query.q === 'string' ? { q: route.query.q } : {}),
    ...(typeof route.query.status === 'string' ? { status: route.query.status } : {}),
    ...(typeof route.query.sort === 'string' ? { sort: route.query.sort } : {}),
  },
}))

const weatherIcon = computed(() => {
  const iconMap = { 맑음: '☀️', 비: '🌧️', 구름: '☁️', 눈: '❄️' }
  return iconMap[city.value?.status] || '🌤️'
})

const detailClass = computed(() => {
  const classMap = {
    맑음: 'detail-sunny',
    비: 'detail-rainy',
    구름: 'detail-cloudy',
    눈: 'detail-snowy',
  }
  return classMap[city.value?.status] || 'detail-default'
})

const detailImage = computed(() => {
  const imageMap = { 맑음: clearCityImage, 비: rainCityImage, 구름: cloudCityImage, 눈: snowCityImage }
  return imageMap[city.value?.status] || cloudCityImage
})

const detailHeadline = computed(() => {
  const headlineMap = {
    맑음: 'CLEAR ABOVE THE CITY',
    비: 'RAIN AFTER MIDNIGHT',
    구름: 'CLOUDS OVER THE WATER',
    눈: 'WHITE AIR, HIGH GROUND',
  }
  return headlineMap[city.value?.status] || 'WEATHER ACROSS THE CITY'
})

onMounted(async () => {
  if (!city.value && typeof route.query.city === 'string') {
    await weatherStore.searchCityWeather(route.query.city)
  }
})
</script>

<template>
  <div class="detail-page">
    <template v-if="city">
      <section class="weather-hero" :class="detailClass" :style="{ backgroundImage: `url(${detailImage})` }">
        <div class="detail-shade" aria-hidden="true"></div>
        <div class="page-heading">
          <p class="eyebrow">{{ detailHeadline }}</p>
          <h1>{{ city.name }}</h1>
          <p>{{ city.observedAt }} / {{ dataSourceLabel }}</p>
        </div>

        <div class="detail-temperature" :data-icon="weatherIcon">
          <p class="weather-status">
            {{ city.status }}<template v-if="city.description"> / {{ city.description }}</template>
          </p>
          <h2>{{ formatTemperature(city.temp) }}</h2>
        </div>
        <div class="hero-summary">
          <span>CURRENT FEEL</span>
          <strong>체감 온도 {{ formatTemperature(city.feelsLike) }}</strong>
        </div>
      </section>

      <section class="observation-card" aria-labelledby="observation-title">
        <div class="card-header">
          <h2 id="observation-title">상세 관측 정보</h2>
          <span>{{ city.observedAt }} 업데이트</span>
        </div>

        <dl class="observation-grid">
          <div>
            <dt>습도</dt>
            <dd>{{ city.humidity }}<small>%</small></dd>
          </div>
          <div>
            <dt>풍속</dt>
            <dd>{{ city.windSpeed }}<small>m/s</small></dd>
          </div>
          <div>
            <dt>{{ precipitationLabel }}</dt>
            <dd>
              {{ city.precipitation }}<small>{{ precipitationUnit }}</small>
            </dd>
          </div>
          <div>
            <dt>체감 온도</dt>
            <dd>{{ formatTemperature(city.feelsLike) }}</dd>
          </div>
        </dl>
      </section>

      <div class="navigation-actions">
        <RouterLink class="back-link secondary" :to="homeRoute">← 이전 목록으로 돌아가기</RouterLink>
        <RouterLink class="back-link" to="/">메인으로 돌아가기</RouterLink>
      </div>
    </template>

    <section v-else-if="isSearching" class="empty-state" aria-live="polite">
      <span aria-hidden="true">WAIT</span>
      <h1>실시간 날씨를 불러오는 중입니다</h1>
      <p>도시 관측 정보를 잠시만 기다려 주세요.</p>
    </section>

    <section v-else class="empty-state">
      <span aria-hidden="true">404</span>
      <h1>도시 정보를 찾을 수 없습니다</h1>
      <p v-if="searchError">{{ searchError }}</p>
      <p v-else>
        <strong>{{ route.params.cityId }}</strong
        >에 해당하는 관측 정보가 없습니다.
      </p>
      <div class="navigation-actions">
        <RouterLink class="back-link secondary" :to="homeRoute">← 이전 목록으로 돌아가기</RouterLink>
        <RouterLink class="back-link" to="/">메인으로 돌아가기</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-heading {
  margin-bottom: 1.25rem;
  text-align: center;
}

.page-heading h1 {
  margin: 0.2rem 0;
  color: var(--color-heading, #2c3e50);
  font-size: 2rem;
  font-weight: 700;
}

.page-heading p:not(.eyebrow) {
  color: #777;
  font-size: 0.9rem;
}

.eyebrow {
  color: #4a90d9;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.weather-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding: 2rem;
  overflow: hidden;
  border-radius: 0;
  color: #fff;
  box-shadow: none;
}

.detail-sunny {
  background: #2d312d;
}
.detail-rainy {
  background: #1f292e;
}
.detail-cloudy {
  background: #4a5252;
}
.detail-snowy {
  background: #c8cecc;
}
.detail-default {
  background: #333834;
}

.weather-icon {
  display: block;
  font-size: 3.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.weather-status {
  margin-top: 0.5rem;
  font-weight: 600;
}

.weather-hero h2 {
  margin: 0;
  font-size: 3.4rem;
  font-weight: 700;
  line-height: 1.1;
}

.hero-summary {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 0.2rem;
  text-align: right;
}

.hero-summary span {
  font-size: 1.4rem;
  font-weight: 700;
}

.hero-summary strong {
  font-size: 0.9rem;
  opacity: 0.9;
}

.observation-card {
  margin-bottom: 1.25rem;
  padding: 1.25rem;
  border: 1px solid var(--color-border, #e9ecef);
  border-radius: 0;
  background: var(--color-background-soft, #f8f9fa);
  box-shadow: none;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border, #e9ecef);
}

.card-header h2 {
  margin: 0;
  color: var(--color-heading, #2c3e50);
  font-size: 1.2rem;
  font-weight: 600;
}

.card-header span {
  color: #888;
  font-size: 0.78rem;
}

.observation-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 0;
}

.observation-grid div {
  padding: 1rem 0.75rem;
  border: 1px solid var(--color-border, #e9ecef);
  border-radius: 0;
  background: var(--color-background, #fff);
  text-align: center;
}

.observation-grid dt {
  margin-bottom: 0.45rem;
  color: #777;
  font-size: 0.8rem;
}

.observation-grid dd {
  margin: 0;
  color: #4a90d9;
  font-size: 1.35rem;
  font-weight: 700;
}

.observation-grid small {
  margin-left: 2px;
  color: #888;
  font-size: 0.75rem;
}

.navigation-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.empty-state .navigation-actions {
  justify-content: center;
}

.back-link {
  display: inline-flex;
  padding: 0.6rem 1rem;
  border: 1px solid #4a90d9;
  border-radius: 0;
  background: #4a90d9;
  color: #fff;
  font-weight: 600;
}

.back-link:hover {
  background: #347abd;
}

.back-link.secondary {
  background: transparent;
  color: #4a90d9;
}

.back-link.secondary:hover {
  background: rgba(74, 144, 217, 0.12);
}

.empty-state {
  padding: 4rem 1.5rem;
  border: 1px solid var(--color-border, #e9ecef);
  border-radius: 0;
  background: var(--color-background-soft, #f8f9fa);
  text-align: center;
}

.empty-state > span {
  font-size: 3.5rem;
}

.empty-state h1 {
  margin: 0.75rem 0 0.25rem;
  color: var(--color-heading, #2c3e50);
  font-size: 1.7rem;
  font-weight: 700;
}

.empty-state p {
  margin-bottom: 1.25rem;
  color: #777;
}

@media (max-width: 700px) {
  .observation-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .weather-hero {
    align-items: flex-start;
    flex-direction: column;
  }
  .hero-summary {
    align-items: flex-start;
    text-align: left;
  }
  .card-header {
    align-items: flex-start;
    flex-direction: column;
  }
}

/* Cinematic atlas detail */
.detail-page {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0 0 6rem;
  color: #252925;
}

.weather-hero {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  min-height: 680px;
  height: 78svh;
  margin: 0 0 clamp(4rem, 8vw, 8rem);
  padding: clamp(6rem, 10vw, 9rem) max(3vw, calc((100vw - 1280px) / 2)) 4vw;
  overflow: hidden;
  border-radius: 0;
  color: #f2efe7;
  background-color: #222825;
  background-position: center;
  background-size: cover;
  box-shadow: none;
  isolation: isolate;
}

.detail-sunny,
.detail-rainy,
.detail-cloudy,
.detail-snowy,
.detail-default {
  background-color: #222825;
}

.detail-shade {
  position: absolute;
  z-index: -1;
  inset: 0;
  background: rgba(12, 16, 15, 0.42);
}

.page-heading {
  position: absolute;
  top: clamp(6.5rem, 12vw, 10rem);
  left: max(3vw, calc((100vw - 1280px) / 2));
  margin: 0;
  text-align: left;
}

.page-heading h1 {
  margin: 0.6rem 0;
  color: inherit;
  font-size: clamp(4rem, 9vw, 8rem);
  font-weight: 650;
  letter-spacing: -0.075em;
  line-height: 0.92;
}

.page-heading p:not(.eyebrow),
.eyebrow {
  color: inherit;
  font-size: clamp(0.75rem, 0.8vw, 0.82rem);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.detail-temperature {
  align-self: end;
}

.weather-icon {
  display: none;
}

.weather-status {
  margin: 0 0 0.8rem;
  font-size: clamp(0.75rem, 0.85vw, 0.82rem);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.weather-hero h2 {
  margin: 0 0 0 -0.025em;
  color: inherit;
  font-size: clamp(7rem, min(18vw, 24svh), 16rem);
  font-weight: 250;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.09em;
  line-height: 0.92;
}

.hero-summary {
  align-items: flex-end;
  align-self: end;
  padding-bottom: 0.5rem;
  text-align: right;
}

.hero-summary span {
  font-size: 0.75rem;
  letter-spacing: 0.14em;
}

.hero-summary strong {
  font-size: 1rem;
}

.observation-card,
.navigation-actions {
  width: min(100% - 3rem, 1280px);
  margin-right: auto;
  margin-left: auto;
}

.observation-card {
  margin-bottom: 2.5rem;
  padding: 0;
  border: 0;
  border-top: 1px solid #262a27;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.card-header {
  margin: 0;
  padding: 1rem 0 2rem;
  border-bottom: 1px solid #aaa8a1;
}

.card-header h2 {
  color: #222623;
  font-size: clamp(1.5rem, 3vw, 2.7rem);
  font-weight: 550;
  letter-spacing: -0.045em;
}

.observation-grid {
  display: block;
}

.observation-grid div {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  padding: 1.15rem 0;
  border: 0;
  border-bottom: 1px solid #aaa8a1;
  border-radius: 0;
  background: transparent;
  text-align: left;
}

.observation-grid dt {
  margin: 0;
  color: #5e625e;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.observation-grid dd {
  color: #222623;
  font-size: clamp(1.2rem, 2.5vw, 2rem);
  font-weight: 450;
}

.back-link {
  border-radius: 0;
  color: #f0eee7;
  background: #252a27;
}

.back-link.secondary {
  border-color: #474d49;
  color: #303632;
  background: transparent;
}

.empty-state {
  width: min(100% - 3rem, 900px);
  margin: 4rem auto;
  border-radius: 0;
  box-shadow: none;
}

@media (max-width: 640px) {
  .weather-hero {
    grid-template-columns: 1fr;
    min-height: 680px;
    padding: 7rem 1rem 1rem;
  }

  .page-heading {
    top: 8rem;
    left: 1rem;
  }

  .page-heading h1 {
    font-size: clamp(3.6rem, 20vw, 5.6rem);
  }

  .weather-hero h2 {
    font-size: clamp(6.5rem, min(32vw, 20svh), 9rem);
  }

  .hero-summary {
    align-items: flex-start;
    padding-bottom: 1rem;
    text-align: left;
  }

  .observation-card,
  .navigation-actions {
    width: calc(100% - 2rem);
  }
}
</style>
