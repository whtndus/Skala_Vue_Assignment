<script setup>
import { computed, ref } from 'vue'

const count = ref(0)
const unrelatedCount = ref(0)
let methodRuns = 0
let computedRuns = 0

const getDoubleByMethod = () => ({ value: count.value * 2, run: ++methodRuns })
const doubleCount = computed(() => ({ value: count.value * 2, run: ++computedRuns }))
</script>

<template>
  <div class="practice-section">
    <h2>computed() 캐싱 비교</h2>
    <p>관계없는 상태만 변경해도 메서드는 다시 호출되지만 computed는 의존 값이 바뀔 때만 재계산됩니다.</p>
    <div class="control-row">
      <button type="button" @click="count++">의존 값 증가 · {{ count }}</button>
      <button type="button" @click="unrelatedCount++">관계없는 값 증가 · {{ unrelatedCount }}</button>
    </div>
    <div class="comparison-grid">
      <p>method <strong>{{ getDoubleByMethod().value }}</strong><small>실행 #{{ getDoubleByMethod().run }}</small></p>
      <p>computed <strong>{{ doubleCount.value }}</strong><small>계산 #{{ doubleCount.run }}</small></p>
    </div>
  </div>
</template>

<style scoped>
.control-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 1rem;
  border-top: 1px solid var(--atlas-line);
  border-bottom: 1px solid var(--atlas-line);
}

.comparison-grid p {
  display: grid;
  gap: 0.2rem;
  margin: 0;
  padding: 1rem;
}

.comparison-grid p + p {
  border-left: 1px solid var(--atlas-line);
}

.comparison-grid strong {
  font-size: 2rem;
  font-weight: 450;
}

.comparison-grid small {
  color: var(--atlas-muted);
}
</style>
