<script setup>
import { computed, ref } from 'vue'

const stations = ref([
  { id: 'seoul', city: '서울', temp: 26, status: '맑음', alert: false },
  { id: 'busan', city: '부산', temp: 24, status: '비', alert: true },
  { id: 'jeju', city: '제주', temp: 27, status: '구름', alert: false },
])
const selectedId = ref('seoul')
const showDetails = ref(true)
const selectedStation = computed(() => stations.value.find((station) => station.id === selectedId.value))

const selectStation = (stationId) => {
  selectedId.value = stationId
}
</script>

<template>
  <div class="mission-demo">
    <header class="mission-intro">
      <div>
        <p class="mission-kicker">Directive mission</p>
        <h3>미니 날씨 현황판</h3>
        <p>반복·조건 렌더링과 클래스 바인딩을 한 화면에서 확인합니다.</p>
      </div>
      <code class="mission-code">v-for · v-if · v-show · :class</code>
    </header>

    <div class="mission-grid">
      <section class="mission-panel">
        <p class="mission-label">Stations</p>
        <div class="mission-actions">
          <button v-for="station in stations" :key="station.id" type="button" :class="{ active: selectedId === station.id }" @click="selectStation(station.id)">
            {{ station.city }}
          </button>
        </div>
        <button type="button" @click="showDetails = !showDetails">상세 정보 {{ showDetails ? '숨기기' : '보기' }}</button>
      </section>

      <section v-if="selectedStation" class="mission-panel dark" :class="{ 'weather-alert': selectedStation.alert }">
        <p class="mission-label">Current station</p>
        <div class="mission-stat">
          <span>{{ selectedStation.city }} · {{ selectedStation.status }}</span>
          <strong>{{ selectedStation.temp }}°</strong>
        </div>
        <p v-if="selectedStation.alert" class="mission-status">강수 알림이 활성화된 관측소입니다.</p>
        <p v-else class="mission-muted">현재 등록된 기상 알림이 없습니다.</p>
        <p v-show="showDetails" class="mission-muted">관측소 ID: {{ selectedStation.id.toUpperCase() }}</p>
      </section>
    </div>

    <ul class="mission-checkpoints">
      <li>안정적인 key 사용</li>
      <li>조건에 따른 문구 전환</li>
      <li>상태 기반 클래스 적용</li>
    </ul>
  </div>
</template>

<style scoped>
@import '@/assets/practice-mission.css';

.mission-actions {
  margin-bottom: 0.75rem;
}

button.active {
  color: var(--atlas-paper-soft);
  background: var(--atlas-ink);
}

.weather-alert {
  border-left: 4px solid #87a9af;
}
</style>
