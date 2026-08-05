<script setup>
import { ref } from 'vue'

const stations = ref([
  { id: 'station-seoul', city: '서울', temperature: 26 },
  { id: 'station-busan', city: '부산', temperature: 24 },
  { id: 'station-jeju', city: '제주', temperature: 27 },
])

const removeStation = (stationId) => {
  stations.value = stations.value.filter((station) => station.id !== stationId)
}

const resetStations = () => {
  stations.value = [
    { id: 'station-seoul', city: '서울', temperature: 26 },
    { id: 'station-busan', city: '부산', temperature: 24 },
    { id: 'station-jeju', city: '제주', temperature: 27 },
  ]
}
</script>

<template>
  <div class="practice-section">
    <h2>v-for와 안정적인 key</h2>
    <p>변경 가능한 목록에서는 배열 index 대신 데이터의 고유 ID를 key로 사용합니다.</p>
    <ul class="station-list">
      <li v-for="(station, index) in stations" :key="station.id">
        <span>{{ String(index + 1).padStart(2, '0') }} · {{ station.city }}</span>
        <strong>{{ station.temperature }}°C</strong>
        <button type="button" @click="removeStation(station.id)">제거</button>
      </li>
    </ul>
    <p v-if="!stations.length">표시할 관측소가 없습니다.</p>
    <button type="button" :disabled="stations.length === 3" @click="resetStations">목록 복원</button>
  </div>
</template>

<style scoped>
.station-list {
  margin: 1rem 0;
  padding: 0;
  list-style: none;
}

.station-list li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 1rem;
  padding: 0.65rem 0;
  border-bottom: 1px solid var(--atlas-line);
}
</style>
