<script setup>
import { ref } from 'vue'
import PropsEmitsChild from './PropsEmitsChild.vue'

const selectedCity = ref('서울')
const requestLog = ref('자식 컴포넌트의 요청을 기다리고 있습니다.')

const handleRefreshRequest = (city) => {
  requestLog.value = `${city}의 관측 정보 갱신 요청을 받았습니다.`
}
</script>

<template>
  <div class="practice-section">
    <h2>Props로 전달하고 Emits로 요청하기</h2>
    <div class="parent-flow">
      <section>
        <p class="flow-label">PARENT STATE</p>
        <select v-model="selectedCity" aria-label="관측 도시">
          <option>서울</option>
          <option>부산</option>
          <option>제주</option>
        </select>
        <p class="request-log" aria-live="polite">{{ requestLog }}</p>
      </section>
      <PropsEmitsChild :city="selectedCity" @refresh-request="handleRefreshRequest" />
    </div>
  </div>
</template>

<style scoped>
.parent-flow {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 1rem;
}

.parent-flow > section {
  padding: 1rem;
  border: 1px solid var(--atlas-line);
}

.flow-label {
  color: var(--atlas-accent);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
}

.request-log {
  color: var(--atlas-muted);
  font-size: 0.8rem;
}

@media (max-width: 600px) {
  .parent-flow {
    grid-template-columns: 1fr;
  }
}
</style>
