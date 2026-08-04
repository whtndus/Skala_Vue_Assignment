<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { ElSkeleton } from 'element-plus'
import { getWeatherErrorMessage } from '@/services/openWeatherApi'

const weatherData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const handleFetchWeather = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=35.158582&lon=126.804975&appid=${API_KEY}&units=metric&lang=kr`

  try {
    // 비동기 통신 가동: 서버에서 데이터를 다 가져올 때까지 await로 기다립니다.
    const response = await axios.get(URL)
    // fetch와 달리 .json() 변환 과정 없이 response.data에 알맹이가 즉시 담깁니다.
    console.log('Axios 통신 응답 전체 객체:', response)
    console.log('백엔드가 준 핵심 날씨 데이터(JSON):', response.data)
    weatherData.value = response.data
  } catch (error) {
    // 4xx, 5xx 에러나 네트워크 오프라인 시 자동으로 이 catch 영역으로 튕겨 들어옵니다.
    console.error('통신 중 에러가 발생했습니다:', error)
    errorMessage.value = getWeatherErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>⚡ Axios 통신 검증</h2>
    <button @click="handleFetchWeather" :disabled="isLoading">
      {{ isLoading ? '데이터 로딩 중...' : '실시간 날씨 데이터 당겨오기' }}
    </button>
    <el-skeleton v-if="isLoading" class="weather-skeleton" :rows="4" animated />
    <div v-else-if="errorMessage" class="error-card" role="alert">
      <span class="error-badge">통신 실패</span>
      <strong>OpenWeather 응답을 받지 못했습니다.</strong>
      <p>{{ errorMessage }}</p>
      <button type="button" @click="handleFetchWeather">다시 시도</button>
    </div>
    <div v-else-if="weatherData" class="result-card">
      <p>
        📍 위치: <strong>{{ weatherData.name }}</strong>
      </p>
      <p>
        🌡️ 현재 기온: <strong>{{ weatherData.main.temp }}°C</strong> (정상 섭씨 변환 완료)
      </p>
      <p>
        ☁️ 날씨 상태: <strong>{{ weatherData.weather[0].description }}</strong>
      </p>
      <p>
        💧 습도: <strong>{{ weatherData.main.humidity }}%</strong>
      </p>
    </div>
    <div v-else>
      <p>아직 가져온 데이터가 없습니다. 버튼을 눌러 통신을 가동하세요.</p>
    </div>
  </div>
</template>

<style scoped>
.result-card {
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  line-height: 1.8;
}
.result-card strong {
  color: #0284c7;
}

.weather-skeleton,
.error-card {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
}

.weather-skeleton {
  border: 1px solid #e2e8f0;
}

.error-card {
  display: grid;
  justify-items: start;
  gap: 0.6rem;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
}

.error-card p {
  margin: 0;
}

.error-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  color: #fff;
  background: #dc2626;
  font-size: 0.72rem;
  font-weight: 800;
}
</style>
