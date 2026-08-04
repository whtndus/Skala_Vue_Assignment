<script setup>
import { ref, watch } from 'vue'

const city = ref('서울')
const forecastDate = ref('오늘')
const logMessage = ref('조건을 변경해 보세요.')

watch([city, forecastDate], ([newCity, newDate], [oldCity, oldDate]) => {
  logMessage.value = `${oldCity}·${oldDate} → ${newCity}·${newDate}`
})
</script>

<template>
  <div class="practice-section">
    <h2>watch() 여러 소스 동시 감시</h2>
    <label>
      도시
      <select v-model="city">
        <option>서울</option>
        <option>수원</option>
        <option>부산</option>
      </select>
    </label>
    &nbsp;
    <label>
      예보
      <select v-model="forecastDate">
        <option>오늘</option>
        <option>내일</option>
        <option>주간</option>
      </select>
    </label>
    <p class="watch-log">{{ logMessage }}</p>
  </div>
</template>

<style scoped>
.watch-log {
  margin-top: 0.75rem;
  color: #17694f;
  font-weight: 700;
}
</style>
