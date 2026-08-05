<script setup>
import { ref } from 'vue'
import ObservationPanel from './ObservationPanel.vue'

const metrics = [
  { id: 'humidity', label: '습도', value: 68, unit: '%' },
  { id: 'wind', label: '풍속', value: 3.2, unit: 'm/s' },
  { id: 'pressure', label: '기압', value: 1012, unit: 'hPa' },
]
const saved = ref(false)
</script>

<template>
  <div class="mission-demo">
    <header class="mission-intro">
      <div>
        <p class="mission-kicker">Slot mission</p>
        <h3>재사용 가능한 관측 패널</h3>
        <p>자식이 레이아웃과 데이터를 제공하고 부모가 표현 방식을 결정합니다.</p>
      </div>
      <code class="mission-code">named slot · scoped slot · fallback</code>
    </header>

    <ObservationPanel :metrics="metrics">
      <template #header>
        <p class="mission-label">Seoul / Detailed observation</p>
        <h4>상세 관측 정보</h4>
      </template>
      <template #metric="{ metric }">
        <div class="custom-metric">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
          <small>{{ metric.unit }}</small>
        </div>
      </template>
      <template #actions>
        <button type="button" @click="saved = !saved">{{ saved ? '저장됨' : '관측 정보 저장' }}</button>
      </template>
    </ObservationPanel>

    <ul class="mission-checkpoints">
      <li>이름 슬롯으로 영역 분리</li>
      <li>범위 슬롯으로 데이터 노출</li>
      <li>재사용 컴포넌트는 레이아웃 소유</li>
    </ul>
  </div>
</template>

<style scoped>
@import '@/assets/practice-mission.css';

h4 {
  margin: 0;
  font-size: 1.4rem;
}

.custom-metric {
  display: grid;
  gap: 0.2rem;
}

.custom-metric span,
.custom-metric small {
  color: var(--atlas-muted);
  font-size: 0.72rem;
}

.custom-metric strong {
  font-size: 1.6rem;
  font-weight: 450;
}
</style>
