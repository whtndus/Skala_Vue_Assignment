<script setup>
/**
 * WeatherApp.vue — 날씨 대시보드 (Composition API + script setup)
 */
import { ref, computed, watch, watchEffect } from 'vue'

// ──────────────────────────────────────────────
// 1. 배열 렌더링 (v-for) — 가상 백엔드 날씨 데이터
// ──────────────────────────────────────────────
// 각 도시 객체는 고유 id를 가지며, 템플릿에서 :key 바인딩에 사용된다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

// ──────────────────────────────────────────────
// 3. 양방향 바인딩 및 한글 처리 (:value + @input)
// ──────────────────────────────────────────────
// v-model은 한글 IME 조합 중 글자가 한 박자 늦게 반영되는 이슈가 있어,:value와 @input 이벤트를 직접 바인딩하여 실시간 동기화를 보장한다.
const searchText = ref('')

// @input 핸들러: 이벤트 객체에서 최신 입력값을 꺼내 ref에 즉시 반영
const onInput = (event) => {
  searchText.value = event.target.value
}

// ──────────────────────────────────────────────
// 2. computed — 검색어 기반 실시간 필터링
// ──────────────────────────────────────────────
// searchText가 변할 때마다 자동으로 재계산되어 일치하는 도시만 걸러낸 새 배열을 반환
const filteredList = computed(() => {
  const query = searchText.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(query))
})

// ──────────────────────────────────────────────
// computed — 매칭된 첫 번째 도시 이름 추출
// ──────────────────────────────────────────────
// 추가 기능: 검색어에 매칭되는 도시명을 찾아 UI에 표시
const matchedCity = computed(() => {
  const query = searchText.value.trim()
  if (!query) return ''
  const found = weatherList.value.find((city) => city.name.includes(query))
  return found ? found.name : ''
})

// ──────────────────────────────────────────────
// 3. 이벤트 핸들링 — 카드 클릭 시 도시 선택
// ──────────────────────────────────────────────
// 함수를 분리하여 재사용성과 가독성을 높였다.
const selectedCity = ref('')

const selectCity = (cityName) => {
  selectedCity.value = cityName
}

// ──────────────────────────────────────────────
// 4. 이벤트 수식어 (.stop) — 상세보기 알림
// ──────────────────────────────────────────────
// 버튼에 @click.stop을 사용하여 부모 카드의 click 이벤트 버블링을 차단
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// ──────────────────────────────────────────────
// 5. watch — 선택 도시 변경 감시
// ──────────────────────────────────────────────
// selectedCity 값이 바뀔 때마다 콘솔에 로그를 남겨 디버깅에 활용한다.
watch(selectedCity, (newCity, oldCity) => {
  console.log(`📌 [watch] 선택 도시 변경: "${oldCity || '없음'}" → "${newCity}"`)
})

// ──────────────────────────────────────────────
// 6. watchEffect — 검색어 자동 추적
// ──────────────────────────────────────────────
// 의존성을 명시하지 않아도 내부에서 참조하는 반응형 데이터를 자동 감지하여 searchText가 변할 때마다 실행
watchEffect(() => {
  if (searchText.value) {
    console.log(`🔎 [watchEffect] 검색어 "${searchText.value}" → ${filteredList.value.length}건 매칭`)
  }
})

// ──────────────────────────────────────────────
// 7. 헬퍼 함수 — 날씨 상태별 아이콘 매핑
// ──────────────────────────────────────────────
// status 문자열을 이모지 아이콘으로 변환
const getWeatherIcon = (status) => {
  const iconMap = { '맑음': '☀️', '비': '🌧️', '구름': '☁️' }
  return iconMap[status] || '🌤️'
}

// ──────────────────────────────────────────────
// 8. 헬퍼 함수 — 날씨 상태별 카드 그라데이션 클래스
// ──────────────────────────────────────────────
// 동적 :class 바인딩과 함께 사용하여 카드마다 다른 색상 테마를 적용
const getCardGradient = (status) => {
  const gradientMap = { '맑음': 'card-sunny', '비': 'card-rainy', '구름': 'card-cloudy' }
  return gradientMap[status] || 'card-default'
}
</script>

<template>
  <div class="weather-app">
    <div class="app-header">
      <h1>🌤️ 과제 1: 날씨</h1>
    </div>

    <!-- 도시 검색 — 양방향 바인딩 + 한글 IME 처리
         v-model 대신 :value + @input 조합으로 한글 실시간 반영
         ※ 교안과 다른 점: matchedCity computed로 매칭 결과를 별도 표시 -->
    <section class="search-section">
      <h2>🔍 도시 검색</h2>
      <div class="search-box">
        <!-- :value로 단방향 출력, @input으로 입력을 수동 캡처하여 IME 이슈 해결 -->
        <input
          type="text"
          placeholder="검색할 도시 이름을 입력하세요"
          :value="searchText"
          @input="onInput"
          class="search-input"
        />
        <!-- [추가] 교안에는 검색어만 표시하지만, 여기서는 매칭 도시까지 안내 -->
        <p class="search-result" v-if="searchText.trim()">
          검색 중인 도시:
          <strong v-if="matchedCity">{{ matchedCity }}</strong>
          <span v-else class="no-result">일치하는 도시가 없습니다.</span>
        </p>
      </div>
    </section>

    <!-- 선택 상태바 — 카드 클릭 결과 표시
        v-if/v-else로 초기 안내 메시지를 분리 표시 -->
    <div class="status-bar" v-if="selectedCity">
      <span class="status-icon">📍</span>
      <span>{{ selectedCity }}이 선택되었습니다.</span>
    </div>
    <div class="status-bar status-bar-empty" v-else>
      <span class="status-icon">💡</span>
      <span>카드를 클릭하거나 검색해 보세요.</span>
    </div>

    <!-- 지역별 날씨 현황 — v-for 배열 렌더링
        :key에 고유 id를 바인딩하여 Vue의 가상 DOM 효율적 패치 보장
        filteredList(computed)로 검색 필터링된 결과만 렌더 -->
    <section class="weather-section">
      <h2>🌏 지역별 날씨 현황</h2>
      <div class="weather-grid">
        <!-- v-for: filteredList를 순회, :key에 weather.id 바인딩 -->
        <!-- @click: 카드 클릭 시 selectCity 함수 호출 → 상태바 업데이트 -->
        <!-- :class: 날씨 상태에 따라 동적으로 그라데이션 클래스 적용 -->
        <div
          v-for="weather in filteredList"
          :key="weather.id"
          class="weather-card"
          :class="getCardGradient(weather.status)"
          @click="selectCity(weather.name)"
        >
          <!--날씨 아이콘 + 도시명 헤더-->
          <div class="card-header">
            <span class="weather-icon">{{ getWeatherIcon(weather.status) }}</span>
            <h3 class="city-name">{{ weather.name }} ({{ weather.status }})</h3>
          </div>

          <div class="card-body">
            <p class="temp">현재 기온: {{ weather.temp }}°C</p>

            <!-- 조건부 렌더링 (v-if / v-else)
                 기온 25도 기준으로 더움/선선함 라벨 분기 -->
            <span class="label label-hot" v-if="weather.temp >= 25">
              🔥 더움 (25도 이상)
            </span>
            <span class="label label-cool" v-else>
              ❄️ 선선함 (25도 미만)
            </span>
          </div>

          <div class="card-footer">
            <!-- 이벤트 수식어 @click.stop
                 .stop 수식어로 event.stopPropagation() 자동 호출
                 → 버튼 클릭이 부모 카드의 @click까지 전파되지 않음 -->
            <button
              class="detail-btn"
              @click.stop="showDetail(weather.name, weather.status)"
            >
              상세보기
            </button>
          </div>
        </div>
      </div>

      <!-- 검색 결과가 0건일 때 안내 메시지 -->
      <div class="no-data" v-if="filteredList.length === 0">
        <p>😢 검색 결과가 없습니다.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.weather-app {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.app-header {
  text-align: center;
  margin-bottom: 2rem;
}

.app-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.5px;
}

/* Section Titles */
h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-border);
}

/* Search Section */
.search-section {
  margin-bottom: 1.5rem;
}

.search-box {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.25rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-box:focus-within {
  border-color: #4a90d9;
  box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.15);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #4a90d9;
}

.search-input::placeholder {
  color: rgba(128, 128, 128, 0.6);
}

.search-result {
  margin-top: 0.75rem;
  font-size: 0.95rem;
  color: var(--color-text);
  padding: 0.5rem 0.75rem;
  background: var(--color-background);
  border-radius: 6px;
  border-left: 3px solid #4a90d9;
}

.search-result strong {
  color: #4a90d9;
  font-weight: 700;
}

.no-result {
  color: #e74c3c;
  font-style: italic;
}

/* Status Bar */
.status-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  background: linear-gradient(135deg, #e8f4fd 0%, #d1ecf9 100%);
  color: #1a6fa8;
  border: 1px solid #b8dff5;
  animation: fadeIn 0.3s ease;
}

.status-bar-empty {
  background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
  color: #888;
  border-color: #ddd;
}

.status-icon {
  font-size: 1.1rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Weather Cards Grid */
.weather-section {
  margin-bottom: 2rem;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

.weather-card {
  border-radius: 14px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.weather-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  opacity: 0;
  transition: opacity 0.3s;
}

.weather-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.weather-card:hover::before {
  opacity: 1;
}

/* Card Gradient Variants */
.card-sunny {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b35 50%, #e8532e 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
}

.card-rainy {
  background: linear-gradient(135deg, #667eea 0%, #4a6cf7 50%, #3b5bdb 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(74, 108, 247, 0.3);
}

.card-cloudy {
  background: linear-gradient(135deg, #a8c0d6 0%, #7b9dba 50%, #6b8caa 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(123, 157, 186, 0.3);
}

.card-default {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(86, 171, 47, 0.3);
}

/* Card Inner Elements */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.weather-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.city-name {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.card-body {
  margin-bottom: 1.25rem;
}

.temp {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.6rem;
  opacity: 0.95;
}

/* Labels (v-if / v-else) */
.label {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.label-hot {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(4px);
}

.label-cool {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(4px);
}

/* Card Footer & Detail Button */
.card-footer {
  display: flex;
  justify-content: flex-end;
}

.detail-btn {
  padding: 0.5rem 1.1rem;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s, transform 0.2s, border-color 0.25s;
  backdrop-filter: blur(4px);
}

.detail-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.7);
  transform: scale(1.03);
}

.detail-btn:active {
  transform: scale(0.97);
}

/* No Data */
.no-data {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #999;
  font-size: 1.1rem;
}

/* Dark Mode Overrides */
@media (prefers-color-scheme: dark) {
  .status-bar {
    background: linear-gradient(135deg, #1a3a52 0%, #1e4060 100%);
    color: #7bbfe8;
    border-color: #2a5070;
  }

  .status-bar-empty {
    background: linear-gradient(135deg, #2a2a2a 0%, #333 100%);
    color: #777;
    border-color: #444;
  }

  .search-result {
    border-left-color: #5a9fd4;
  }

  .search-result strong {
    color: #7bbfe8;
  }
}
</style>
