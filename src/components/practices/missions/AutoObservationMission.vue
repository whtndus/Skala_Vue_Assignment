<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const count = ref(0)
const isRunning = ref(false)
const lifecycleLog = ref([])
let timerId = null

const record = (message) => {
  lifecycleLog.value = [message, ...lifecycleLog.value].slice(0, 4)
}

const stopObservation = () => {
  if (timerId !== null) window.clearInterval(timerId)
  timerId = null
  isRunning.value = false
}

const startObservation = () => {
  if (timerId !== null) return
  isRunning.value = true
  record('관측 타이머를 시작했습니다.')
  timerId = window.setInterval(() => {
    count.value += 1
    record(`${count.value}번째 자동 관측을 완료했습니다.`)
  }, 2000)
}

onMounted(() => {
  record('onMounted: 컴포넌트가 DOM에 연결되었습니다.')
  startObservation()
})

onUnmounted(() => {
  stopObservation()
})
</script>

<template>
  <div class="mission-demo">
    <header class="mission-intro">
      <div>
        <p class="mission-kicker">Lifecycle mission</p>
        <h3>자동 관측 시뮬레이터</h3>
        <p>컴포넌트가 나타날 때 작업을 시작하고 사라질 때 타이머를 정리합니다.</p>
      </div>
      <code class="mission-code">onMounted · onUnmounted · cleanup</code>
    </header>

    <div class="mission-grid">
      <section class="mission-panel dark">
        <p class="mission-label">Observation count</p>
        <div class="mission-stat">
          <span>{{ isRunning ? 'AUTO REFRESH ON' : 'PAUSED' }}</span>
          <strong>{{ String(count).padStart(2, '0') }}</strong>
        </div>
        <div class="mission-actions">
          <button v-if="isRunning" type="button" @click="stopObservation">일시 정지</button>
          <button v-else type="button" @click="startObservation">다시 시작</button>
          <button type="button" @click="count += 1">수동 관측</button>
        </div>
      </section>

      <section class="mission-panel">
        <p class="mission-label">Visible lifecycle log</p>
        <ol class="mission-list" aria-live="polite">
          <li v-for="(log, index) in lifecycleLog" :key="`${log}-${index}`">{{ log }}</li>
        </ol>
      </section>
    </div>

    <ul class="mission-checkpoints">
      <li>중복 타이머 방지</li>
      <li>언마운트 시 interval 정리</li>
      <li>훅 결과를 화면에 표시</li>
    </ul>
  </div>
</template>

<style scoped>
@import '@/assets/practice-mission.css';

.mission-panel.dark button {
  border-color: #8a8f8c;
  color: var(--atlas-paper-soft);
}
</style>
