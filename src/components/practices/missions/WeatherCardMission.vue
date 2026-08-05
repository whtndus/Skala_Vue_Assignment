<script setup>
import { computed, ref } from 'vue'
import WeatherCardMissionChild from './WeatherCardMissionChild.vue'

const city = ref('서울')
const celsius = ref(26)
const unit = ref('C')
const isFavorite = ref(false)
const eventLog = ref('아직 자식 컴포넌트가 이벤트를 보내지 않았습니다.')
const displayTemperature = computed(() => (unit.value === 'C' ? celsius.value : Math.round((celsius.value * 9) / 5 + 32)))

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  eventLog.value = `toggle-favorite 수신: ${isFavorite.value ? '등록' : '해제'}`
}

const changeUnit = () => {
  unit.value = unit.value === 'C' ? 'F' : 'C'
  eventLog.value = `change-unit 수신: °${unit.value}`
}
</script>

<template>
  <div class="mission-demo">
    <header class="mission-intro">
      <div>
        <p class="mission-kicker">Props / emits mission</p>
        <h3>부모가 관리하는 날씨 카드</h3>
        <p>표시 데이터는 props로 내려보내고 사용자 요청은 emits로 올려보냅니다.</p>
      </div>
      <code class="mission-code">defineProps · defineEmits · payload</code>
    </header>

    <div class="mission-grid">
      <section class="mission-panel mission-stack">
        <p class="mission-label">Parent state</p>
        <label class="mission-field">
          <span>도시</span>
          <select v-model="city">
            <option>서울</option>
            <option>부산</option>
            <option>제주</option>
          </select>
        </label>
        <p class="mission-output" aria-live="polite">{{ eventLog }}</p>
      </section>

      <WeatherCardMissionChild :city="city" :temperature="displayTemperature" :is-favorite="isFavorite" @toggle-favorite="toggleFavorite" @change-unit="changeUnit" />
    </div>

    <ul class="mission-checkpoints">
      <li>자식은 props를 직접 변경하지 않음</li>
      <li>부모가 단일 상태 소유</li>
      <li>이벤트 이름으로 의도 전달</li>
    </ul>
  </div>
</template>

<style scoped>
@import '@/assets/practice-mission.css';
</style>
