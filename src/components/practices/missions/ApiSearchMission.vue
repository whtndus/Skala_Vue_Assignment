<script setup>
import { ref } from 'vue'
import { fetchWeatherByCity, getWeatherErrorMessage } from '@/services/openWeatherApi'

const cityName = ref('서울')
const weather = ref(null)
const requestState = ref('idle')
const errorMessage = ref('')

const searchWeather = async () => {
  const normalizedCity = cityName.value.trim()
  if (!normalizedCity) {
    requestState.value = 'error'
    errorMessage.value = '도시 이름을 입력해 주세요.'
    return
  }

  requestState.value = 'loading'
  errorMessage.value = ''

  try {
    weather.value = await fetchWeatherByCity(normalizedCity)
    requestState.value = 'success'
  } catch (error) {
    weather.value = null
    requestState.value = 'error'
    errorMessage.value = getWeatherErrorMessage(error)
  }
}
</script>

<template>
  <form class="mission-demo" @submit.prevent="searchWeather">
    <header class="mission-intro">
      <div>
        <p class="mission-kicker">Axios mission</p>
        <h3>도시 날씨 요청 상태 머신</h3>
        <p>실제 OpenWeather 서비스 함수를 이용해 대기·로딩·성공·실패 화면을 분리합니다.</p>
      </div>
      <code class="mission-code">async/await · loading · error · retry</code>
    </header>

    <section class="mission-panel mission-stack">
      <label class="mission-field">
        <span>도시 이름</span>
        <input v-model.trim="cityName" type="search" placeholder="예: 서울, Busan" autocomplete="off" />
      </label>
      <div class="mission-actions">
        <button type="submit" :disabled="requestState === 'loading'">{{ requestState === 'loading' ? '요청 중…' : '날씨 조회' }}</button>
        <button v-if="requestState === 'error'" type="button" @click="searchWeather">다시 시도</button>
      </div>
    </section>

    <section class="mission-panel dark" aria-live="polite" :aria-busy="requestState === 'loading'">
      <p class="mission-label">Request state · {{ requestState }}</p>
      <p v-if="requestState === 'idle'" class="mission-muted">조회할 도시를 입력하고 요청을 시작하세요.</p>
      <p v-else-if="requestState === 'loading'">관측소를 찾고 실시간 데이터를 요청하고 있습니다.</p>
      <p v-else-if="requestState === 'error'" class="mission-status error" role="alert">{{ errorMessage }}</p>
      <div v-else-if="weather" class="mission-stat">
        <span>{{ weather.name }} · {{ weather.description }}</span>
        <strong>{{ weather.temp }}°</strong>
        <p class="mission-muted">습도 {{ weather.humidity }}% · 풍속 {{ weather.windSpeed }}m/s</p>
      </div>
    </section>

    <ul class="mission-checkpoints">
      <li>API 서비스 함수 재사용</li>
      <li>요청 중 중복 제출 방지</li>
      <li>오류와 재시도 UI 제공</li>
    </ul>
  </form>
</template>

<style scoped>
@import '@/assets/practice-mission.css';
</style>
