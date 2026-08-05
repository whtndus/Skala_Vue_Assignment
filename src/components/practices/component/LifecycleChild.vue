<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const count = ref(0)
const logs = ref(['setup · 반응형 상태를 준비했습니다.'])
let timerId = null

const addLog = (message) => {
  logs.value = [message, ...logs.value].slice(0, 5)
}

const increment = async (source = '수동') => {
  count.value += 1
  await nextTick()
  addLog(`updated · ${source} 갱신 #${count.value}`)
}

onMounted(() => {
  addLog('mounted · DOM 연결 및 타이머 시작')
  timerId = window.setInterval(() => increment('자동'), 3000)
})

onUnmounted(() => {
  window.clearInterval(timerId)
})
</script>

<template>
  <div class="lifecycle-demo">
    <div>
      <p class="phase-label">ACTIVE COMPONENT</p>
      <strong>{{ count }}</strong>
      <button type="button" @click="increment('수동')">수동 갱신</button>
    </div>
    <ol aria-live="polite">
      <li v-for="(log, index) in logs" :key="`${log}-${index}`">{{ log }}</li>
    </ol>
  </div>
</template>

<style scoped>
.lifecycle-demo {
  display: grid;
  grid-template-columns: minmax(140px, 0.7fr) minmax(0, 1.3fr);
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--atlas-line);
}

.lifecycle-demo > div {
  display: grid;
  align-content: start;
  gap: 0.6rem;
}

.phase-label {
  margin: 0;
  color: var(--atlas-accent);
  font-family: var(--font-mono);
  font-size: 0.68rem;
}

strong {
  font-size: 3rem;
  font-weight: 380;
  line-height: 1;
}

ol {
  margin: 0;
  padding: 0;
  color: var(--atlas-muted);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  list-style: none;
}

li {
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--atlas-line);
}

@media (max-width: 560px) {
  .lifecycle-demo {
    grid-template-columns: 1fr;
  }
}
</style>
