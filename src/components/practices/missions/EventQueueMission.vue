<script setup>
import { ref } from 'vue'

const candidates = ['서울', '부산', '제주', '강릉']
const queue = ref(['서울'])
const selectedCity = ref('서울')
const eventLog = ref('도시 버튼을 눌러 이벤트를 발생시켜 보세요.')

const addCity = (city) => {
  if (!queue.value.includes(city)) queue.value.push(city)
  selectedCity.value = city
  eventLog.value = `${city} 관측 요청을 대기열에 추가했습니다.`
}

const removeCity = (city) => {
  queue.value = queue.value.filter((item) => item !== city)
  if (selectedCity.value === city) selectedCity.value = queue.value[0] || ''
  eventLog.value = `${city} 관측 요청을 제거했습니다.`
}
</script>

<template>
  <div class="mission-demo">
    <header class="mission-intro">
      <div>
        <p class="mission-kicker">Event mission</p>
        <h3>관측 도시 대기열</h3>
        <p>버튼 이벤트와 이벤트 전파 차단을 이용해 목록을 제어합니다.</p>
      </div>
      <code class="mission-code">@click · @click.stop · handler</code>
    </header>

    <div class="mission-grid">
      <section class="mission-panel">
        <p class="mission-label">Add station</p>
        <div class="mission-actions">
          <button v-for="city in candidates" :key="city" type="button" @click="addCity(city)">+ {{ city }}</button>
        </div>
      </section>

      <section class="mission-panel" @click="eventLog = '대기열 패널을 클릭했습니다.'">
        <p class="mission-label">Observation queue</p>
        <ul v-if="queue.length" class="mission-list">
          <li v-for="city in queue" :key="city" @click="selectedCity = city">
            <strong>{{ city }}</strong>
            <button type="button" aria-label="도시 제거" @click.stop="removeCity(city)">제거</button>
          </li>
        </ul>
        <p v-else class="mission-muted">대기 중인 도시가 없습니다.</p>
      </section>
    </div>

    <p class="mission-output" aria-live="polite">선택: {{ selectedCity || '없음' }}\n{{ eventLog }}</p>
    <ul class="mission-checkpoints">
      <li>핸들러에 값 전달</li>
      <li>버블링 차단</li>
      <li>이벤트 결과 화면 표시</li>
    </ul>
  </div>
</template>

<style scoped>
@import '@/assets/practice-mission.css';
</style>
