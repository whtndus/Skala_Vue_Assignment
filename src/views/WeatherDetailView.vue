<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useTemperature } from '@/composables/useTemperature'
import { fetchForecastByCoordinates, formatCityTime, getWeatherErrorMessage } from '@/services/openWeatherApi'
import { useWeatherStore } from '@/stores/weatherStore'
import { getWeatherAtlasImage } from '@/utils/weatherAtlas'
import FiveDayWeatherJournal from '@/components/exercise/FiveDayWeatherJournal.vue'
import WeatherMap from '@/components/exercise/WeatherMap.vue'
import WeatherOutfit from '@/components/exercise/WeatherOutfit.vue'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()
const { isSearching, searchError } = storeToRefs(weatherStore)
const { formatTemperature } = useTemperature()
const queryCityName = computed(() => (typeof route.query.city === 'string' ? route.query.city.trim() : ''))
const city = computed(() => weatherStore.findWeatherById(String(route.params.cityId)) || null)
const homeRoute = computed(() => ({
  name: 'weather-home',
  query: {
    ...(typeof route.query.status === 'string' ? { status: route.query.status } : {}),
    ...(typeof route.query.sort === 'string' ? { sort: route.query.sort } : {}),
    ...(route.query.favorite === '1' ? { favorite: '1' } : {}),
  },
}))

const detailImage = computed(() => getWeatherAtlasImage(city.value))
const detailHeadline = computed(
  () => ({ 맑음: 'CLEAR ABOVE THE CITY', 비: 'RAIN AFTER MIDNIGHT', 구름: 'CLOUDS OVER THE WATER', 눈: 'WHITE AIR, HIGH GROUND' })[city.value?.status] || 'WEATHER ACROSS THE CITY',
)
const isMissing = (value) => value === null || value === undefined
const visibility = computed(() => (isMissing(city.value?.visibilityMeters) ? null : `${Number(city.value.visibilityMeters / 1000).toFixed(city.value.visibilityMeters % 1000 ? 1 : 0)} km`))
const timezoneLabel = computed(() => {
  if (isMissing(city.value?.timezoneOffset)) return null
  const offset = Number(city.value.timezoneOffset)
  const sign = offset >= 0 ? '+' : '-'
  const hours = String(Math.floor(Math.abs(offset) / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((Math.abs(offset) % 3600) / 60)).padStart(2, '0')
  return `UTC${sign}${hours}:${minutes}`
})
const observedTime = computed(() => formatCityTime(city.value?.observedTimestamp, city.value?.timezoneOffset, { year: 'numeric', month: 'long', day: 'numeric' }))
const valueOrNull = (value, unit = '') => (isMissing(value) ? null : `${value}${unit}`)
const observationRows = computed(() =>
  [
    ['국가', city.value?.country || null],
    ['주·행정구역', city.value?.state || null],
    ['현재 기온', isMissing(city.value?.temp) ? null : formatTemperature(city.value.temp)],
    ['체감 온도', isMissing(city.value?.feelsLike) ? null : formatTemperature(city.value.feelsLike)],
    ['최저 기온', isMissing(city.value?.tempMin) ? null : formatTemperature(city.value.tempMin)],
    ['최고 기온', isMissing(city.value?.tempMax) ? null : formatTemperature(city.value.tempMax)],
    ['습도', valueOrNull(city.value?.humidity, '%')],
    ['구름량', valueOrNull(city.value?.cloudiness, '%')],
    ['가시거리', visibility.value],
  ].filter(([, value]) => value !== null),
)
const atmosphereRows = computed(() =>
  [
    ['대기압', valueOrNull(city.value?.pressure, ' hPa')],
    ['해수면 기압', valueOrNull(city.value?.seaLevelPressure, ' hPa')],
    ['지면 기압', valueOrNull(city.value?.groundLevelPressure, ' hPa')],
    ['풍속', valueOrNull(city.value?.windSpeed, ' m/s')],
    ['풍향', city.value?.windDirection ? `${city.value.windDirection} / ${city.value.windDegrees}°` : valueOrNull(city.value?.windDegrees, '°')],
    ['돌풍', valueOrNull(city.value?.windGust, ' m/s')],
    [city.value?.precipitationType === 'snow' ? '최근 1시간 적설량' : '최근 1시간 강수량', valueOrNull(city.value?.precipitation, ' mm')],
  ].filter(([, value]) => value !== null),
)
const solarRows = computed(() =>
  [
    ['일출', city.value?.sunriseAt || null],
    ['일몰', city.value?.sunsetAt || null],
    ['관측 시간', observedTime.value || city.value?.observedAt || null],
    ['시간대', timezoneLabel.value],
  ].filter(([, value]) => value !== null),
)

const forecastReadings = ref([])
const isForecastLoading = ref(false)
const forecastError = ref('')
let forecastRequestId = 0

watch(
  () => [city.value?.coordinates?.lat, city.value?.coordinates?.lon],
  async ([latitude, longitude]) => {
    const requestId = ++forecastRequestId
    forecastReadings.value = []
    forecastError.value = ''
    isForecastLoading.value = false

    if (latitude === null || latitude === undefined || longitude === null || longitude === undefined || !Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) return

    isForecastLoading.value = true
    try {
      const readings = await fetchForecastByCoordinates({ lat: latitude, lon: longitude })
      if (requestId === forecastRequestId) forecastReadings.value = readings
    } catch (error) {
      if (requestId === forecastRequestId) forecastError.value = getWeatherErrorMessage(error)
    } finally {
      if (requestId === forecastRequestId) isForecastLoading.value = false
    }
  },
  { immediate: true },
)

let detailRequestId = 0
const isResolvingRoute = ref(false)
const observationElement = ref(null)
let lastFocusedRoute = ''

watch(
  () => [String(route.params.cityId || ''), queryCityName.value],
  async ([routeCityId, cityName]) => {
    const requestId = ++detailRequestId
    const cityById = weatherStore.findWeatherById(routeCityId)
    if (cityById || !cityName) {
      isResolvingRoute.value = false
      return
    }

    isResolvingRoute.value = true
    const resolvedCity = await weatherStore.searchCityWeather(cityName)
    if (requestId !== detailRequestId) return
    isResolvingRoute.value = false

    if (resolvedCity?.id === routeCityId) return

    await router.replace({
      name: 'not-found',
      query: { from: route.fullPath },
    })
  },
  { immediate: true },
)

watch(
  () => [route.fullPath, city.value?.id],
  async ([routeKey, cityId]) => {
    if (!cityId || lastFocusedRoute === routeKey) return

    lastFocusedRoute = routeKey
    await nextTick()

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    observationElement.value?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  },
  { immediate: true, flush: 'post' },
)
</script>

<template>
  <main class="detail-page">
    <template v-if="city">
      <section class="detail-hero" :style="{ backgroundImage: `url(${detailImage})` }" aria-labelledby="detail-city-name">
        <div class="detail-shade" aria-hidden="true"></div>
        <div class="detail-grain" aria-hidden="true"></div>
        <div class="detail-meta">
          <span>WEATHER / ATLAS</span><span>{{ city.country || 'COUNTRY UNKNOWN' }}</span
          ><span>OPENWEATHER / LIVE</span>
        </div>
        <div class="detail-copy">
          <p>{{ detailHeadline }}</p>
          <h1 id="detail-city-name">{{ city.name }}</h1>
          <span
            >{{ city.status }}<template v-if="city.description"> / {{ city.description }}</template></span
          >
        </div>
        <strong class="detail-temperature">{{ formatTemperature(city.temp) }}</strong>
        <p class="current-feel"><span>CURRENT FEEL</span>체감 온도 {{ formatTemperature(city.feelsLike) }}</p>
      </section>

      <section id="observation" ref="observationElement" class="observation-section" aria-labelledby="observation-title">
        <header>
          <div>
            <p>DETAILED OBSERVATION</p>
            <h2 id="observation-title">현재 관측 정보</h2>
          </div>
          <span>{{ city.observedAt || '시간 정보 없음' }} · OpenWeather</span>
        </header>
        <div class="observation-grid">
          <article class="observation-panel">
            <h3><span>01</span>현재 상태</h3>
            <dl class="data-table">
              <div v-for="[label, value] in observationRows" :key="label">
                <dt>{{ label }}</dt>
                <dd>{{ value }}</dd>
              </div>
            </dl>
          </article>

          <article class="observation-panel">
            <h3><span>02</span>바람과 대기</h3>
            <dl class="data-table">
              <div v-for="[label, value] in atmosphereRows" :key="label">
                <dt>{{ label }}</dt>
                <dd>{{ value }}</dd>
              </div>
              <div v-if="!atmosphereRows.length">
                <dt>관측 정보</dt>
                <dd>정보 없음</dd>
              </div>
            </dl>
          </article>

          <article class="observation-panel">
            <h3><span>03</span>일출·일몰과 시간</h3>
            <dl class="data-table">
              <div v-for="[label, value] in solarRows" :key="label">
                <dt>{{ label }}</dt>
                <dd>{{ value }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <section class="location-style-section" aria-label="위치와 오늘의 옷차림">
        <div class="location-style-grid">
          <WeatherMap :latitude="city.coordinates?.lat" :longitude="city.coordinates?.lon" :city-name="city.name" />
          <WeatherOutfit
            :temperature="city.temp"
            :feels-like="city.feelsLike"
            :status="city.status"
            :description="city.description"
            :wind-speed="city.windSpeed"
            :humidity="city.humidity"
            :precipitation="city.precipitation"
            :precipitation-type="city.precipitationType"
          />
        </div>
      </section>

      <FiveDayWeatherJournal :readings="forecastReadings" :city-name="city.name" :loading="isForecastLoading" :error-message="forecastError" />

      <nav class="detail-navigation" aria-label="상세 페이지 이동">
        <RouterLink :to="homeRoute">← 도시 아카이브로 돌아가기</RouterLink>
        <a href="#five-day-journal">5일 예보 다시 보기 ↑</a>
      </nav>
    </template>

    <section v-else class="detail-empty" aria-live="polite">
      <p>{{ isSearching || isResolvingRoute ? 'LOADING LIVE OBSERVATION' : 'OBSERVATION NOT FOUND' }}</p>
      <h1>{{ isSearching || isResolvingRoute ? '실시간 날씨를 불러오는 중입니다' : '도시 정보를 찾을 수 없습니다' }}</h1>
      <span>{{ isSearching || isResolvingRoute ? '잠시만 기다려 주세요.' : searchError || '검색 경로와 API 환경변수를 확인해 주세요.' }}</span
      ><RouterLink :to="homeRoute">← 도시 아카이브로 돌아가기</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.detail-page {
  min-width: 0;
  background: var(--atlas-paper);
  color: var(--atlas-ink);
}
.detail-hero {
  position: relative;
  min-height: 520px;
  height: 64svh;
  overflow: hidden;
  color: #f2efe7;
  background-position: center;
  background-size: cover;
}
.detail-shade,
.detail-grain {
  position: absolute;
  inset: 0;
}
.detail-shade {
  background: linear-gradient(90deg, rgba(14, 17, 16, 0.76), rgba(14, 17, 16, 0.25) 65%, rgba(14, 17, 16, 0.55));
}
.detail-grain {
  opacity: 0.1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.detail-meta {
  position: absolute;
  z-index: 1;
  top: clamp(5.8rem, 8vw, 7rem);
  right: 5vw;
  left: 5vw;
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(242, 239, 231, 0.35);
  font-size: 0.65rem;
  font-weight: 750;
  letter-spacing: 0.12em;
}
.detail-copy {
  position: absolute;
  z-index: 1;
  top: clamp(9rem, 17vh, 11rem);
  left: 5vw;
}
.detail-copy p {
  margin: 0 0 0.8rem;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.15em;
}
.detail-copy h1 {
  margin: 0;
  font-size: clamp(3.5rem, 7vw, 7rem);
  font-weight: 590;
  letter-spacing: -0.075em;
  line-height: 0.78;
}
.detail-copy span {
  display: block;
  margin-top: 1.3rem;
  font-size: 0.84rem;
  font-weight: 700;
}
.detail-temperature {
  position: absolute;
  z-index: 1;
  right: 4vw;
  bottom: 3rem;
  font-size: clamp(5.5rem, 14vw, 13rem);
  font-weight: 240;
  letter-spacing: -0.035em;
  line-height: 0.7;
}
.current-feel {
  position: absolute;
  z-index: 1;
  bottom: 2rem;
  left: 5vw;
  margin: 0;
  font-weight: 650;
}
.current-feel span {
  display: block;
  margin-bottom: 0.35rem;
  color: rgba(242, 239, 231, 0.6);
  font-size: 0.62rem;
  letter-spacing: 0.13em;
}
.observation-section {
  padding: clamp(3rem, 5vw, 4.5rem) clamp(1.25rem, 5vw, 5rem);
  border-bottom: 1px solid var(--atlas-line);
  scroll-margin-top: 5.5rem;
}
.observation-section header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--atlas-line-strong);
}
.observation-section header p {
  margin: 0 0 0.4rem;
  color: var(--atlas-muted);
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}
.observation-section h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3.4vw, 3.8rem);
  font-weight: 570;
  letter-spacing: -0.055em;
  line-height: 0.95;
}
.observation-section header > span {
  color: var(--atlas-muted);
  font-size: 0.73rem;
}
.observation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1.5rem, 3vw, 3rem);
  padding-top: 2rem;
}
.observation-panel {
  min-width: 0;
  border-top: 1px solid var(--atlas-line-strong);
}
.observation-panel h3 {
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
  margin: 0;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--atlas-line);
  font-size: 1rem;
  font-weight: 650;
}
.observation-panel h3 span {
  color: var(--atlas-accent);
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}
.data-table {
  min-width: 0;
  margin: 0;
}
.data-table div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 1rem;
  padding: 0.58rem 0;
  border-bottom: 1px solid var(--atlas-line);
}
.data-table dt {
  color: var(--atlas-muted);
  font-size: 0.85rem;
  font-weight: 600;
}
.data-table dd {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 650;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.location-style-section {
  padding: clamp(3rem, 5vw, 4.5rem) clamp(1.25rem, 5vw, 5rem);
  border-bottom: 1px solid var(--atlas-line);
}
.location-style-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.5rem, 3vw, 4rem);
}
.detail-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 3rem 5vw 6rem;
}
.detail-navigation a,
.detail-empty a {
  padding: 0.45rem 0;
  border-bottom: 1px solid currentColor;
  color: var(--atlas-ink);
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 700;
}
.detail-navigation a:focus-visible,
.detail-empty a:focus-visible {
  outline: 2px solid var(--atlas-accent);
  outline-offset: 4px;
}
.detail-empty {
  min-height: 80svh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  padding: 8rem 5vw;
}
.detail-empty p {
  color: var(--atlas-muted);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}
.detail-empty h1 {
  max-width: 900px;
  margin: 0.5rem 0;
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 580;
  letter-spacing: -0.065em;
  line-height: 0.9;
}
.detail-empty span {
  margin: 1rem 0 2rem;
  color: var(--atlas-muted);
}
@media (max-width: 980px) {
  .observation-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .observation-panel:last-child {
    grid-column: 1 / -1;
  }
}
@media (max-width: 900px) {
  .location-style-grid {
    grid-template-columns: 1fr;
    gap: 2.75rem;
  }
}
@media (max-width: 700px) {
  .detail-hero {
    height: 66svh;
    min-height: 520px;
  }
  .detail-meta {
    top: 5.8rem;
    right: 1rem;
    left: 1rem;
  }
  .detail-meta span:nth-child(2) {
    display: none;
  }
  .detail-copy {
    top: 8.5rem;
    left: 1rem;
  }
  .detail-copy h1 {
    font-size: clamp(3rem, 15vw, 4.8rem);
  }
  .detail-temperature {
    right: 1rem;
    bottom: 3.5rem;
    font-size: clamp(5rem, 28vw, 7.5rem);
  }
  .current-feel {
    bottom: 1.2rem;
    left: 1rem;
  }
  .observation-section {
    padding: 2.75rem 1rem;
  }
  .observation-section header {
    align-items: flex-start;
    flex-direction: column;
  }
  .observation-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding-top: 1.5rem;
  }
  .observation-panel:last-child {
    grid-column: auto;
  }
  .location-style-section {
    padding: 2.75rem 1rem;
  }
  .detail-navigation {
    align-items: flex-start;
    flex-direction: column;
    padding: 2.5rem 1rem 5rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
  }
}
</style>
