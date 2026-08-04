<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findWeatherById } from '@/data/weatherData'

const route = useRoute()

const city = computed(() => findWeatherById(route.params.cityId))

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
</script>

<template>
  <div class="detail-page">
    <template v-if="city">
      <div class="page-heading">
        <p class="eyebrow">지역별 상세 기상관측</p>
        <h1>{{ city.name }} 날씨</h1>
        <p>{{ city.observedAt }} 기준 Mock Data 관측 정보입니다.</p>
      </div>

      <section class="weather-hero" :class="detailClass">
        <div>
          <span class="weather-icon" aria-hidden="true">{{ weatherIcon }}</span>
          <p class="weather-status">{{ city.status }}</p>
          <h2>{{ city.temp }}°C</h2>
        </div>
        <div class="hero-summary">
          <span>{{ city.name }}</span>
          <strong>체감 온도 {{ city.feelsLike }}°C</strong>
        </div>
      </section>

      <section class="observation-card" aria-labelledby="observation-title">
        <div class="card-header">
          <h2 id="observation-title">📊 상세 관측 정보</h2>
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
            <dt>강수 확률</dt>
            <dd>{{ city.precipitation }}<small>%</small></dd>
          </div>
          <div>
            <dt>체감 온도</dt>
            <dd>{{ city.feelsLike }}<small>°C</small></dd>
          </div>
        </dl>
      </section>

      <RouterLink class="back-link" to="/">← 메인 대시보드로 돌아가기</RouterLink>
    </template>

    <section v-else class="empty-state">
      <span aria-hidden="true">🗺️</span>
      <h1>도시 정보를 찾을 수 없습니다</h1>
      <p><strong>{{ route.params.cityId }}</strong>에 해당하는 관측 정보가 없습니다.</p>
      <RouterLink class="back-link" to="/">메인 대시보드로 돌아가기</RouterLink>
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
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.14);
}

.detail-sunny { background: linear-gradient(135deg, #ff9a56 0%, #e8532e 100%); }
.detail-rainy { background: linear-gradient(135deg, #667eea 0%, #3b5bdb 100%); }
.detail-cloudy { background: linear-gradient(135deg, #a8c0d6 0%, #6b8caa 100%); }
.detail-snowy { background: linear-gradient(135deg, #85cdc9 0%, #5eb5bd 100%); }
.detail-default { background: linear-gradient(135deg, #56ab2f 0%, #7fc94a 100%); }

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
  border-radius: 12px;
  background: var(--color-background-soft, #f8f9fa);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
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
  border-radius: 10px;
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
  font-size: 0.72rem;
}

.back-link {
  display: inline-flex;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  background: #4a90d9;
  color: #fff;
  font-weight: 600;
}

.back-link:hover {
  background: #347abd;
}

.empty-state {
  padding: 4rem 1.5rem;
  border: 1px solid var(--color-border, #e9ecef);
  border-radius: 14px;
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
  .observation-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .weather-hero { align-items: flex-start; flex-direction: column; }
  .hero-summary { align-items: flex-start; text-align: left; }
  .card-header { align-items: flex-start; flex-direction: column; }
}
</style>
