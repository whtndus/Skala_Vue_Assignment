<script setup>
import { computed, ref, watch } from 'vue'

const forecasts = {
  서울: [25, 28, 27, 23],
  부산: [24, 25, 26, 24],
  제주: [27, 29, 28, 26],
}
const selectedCity = ref('서울')
const threshold = ref(26)
const watchLog = ref('서울 예보를 분석하고 있습니다.')
const temperatures = computed(() => forecasts[selectedCity.value])
const average = computed(() => temperatures.value.reduce((sum, value) => sum + value, 0) / temperatures.value.length)
const maximum = computed(() => Math.max(...temperatures.value))
const hotHours = computed(() => temperatures.value.filter((temperature) => temperature >= threshold.value).length)

watch(selectedCity, (city, previousCity) => {
  watchLog.value = `${previousCity}에서 ${city}(으)로 관측 대상을 변경했습니다.`
})
</script>

<template>
  <div class="mission-demo">
    <header class="mission-intro">
      <div>
        <p class="mission-kicker">Computed / watch mission</p>
        <h3>예보 분석 패널</h3>
        <p>원본 예보는 유지하고 필요한 통계만 계산하며 도시 변경을 감지합니다.</p>
      </div>
      <code class="mission-code">computed · watch · derived state</code>
    </header>

    <div class="mission-grid">
      <section class="mission-panel mission-stack">
        <label class="mission-field">
          <span>관측 도시</span>
          <select v-model="selectedCity">
            <option v-for="city in Object.keys(forecasts)" :key="city">{{ city }}</option>
          </select>
        </label>
        <label class="mission-field">
          <span>고온 기준 {{ threshold }}°C</span>
          <input v-model.number="threshold" type="range" min="20" max="32" />
        </label>
        <p class="mission-output" aria-live="polite">{{ watchLog }}</p>
      </section>

      <section class="mission-panel dark">
        <p class="mission-label">Derived forecast</p>
        <div class="mission-stat">
          <span>{{ selectedCity }} 평균</span>
          <strong>{{ average.toFixed(1) }}°</strong>
        </div>
        <p>최고 {{ maximum }}° · 기준 이상 {{ hotHours }}회</p>
        <p class="mission-muted">원본 관측값: {{ temperatures.join(' / ') }}</p>
      </section>
    </div>

    <ul class="mission-checkpoints">
      <li>파생 값을 computed로 분리</li>
      <li>원본 배열 변경 없음</li>
      <li>watch에서 이전 값 확인</li>
    </ul>
  </div>
</template>

<style scoped>
@import '@/assets/practice-mission.css';
</style>
