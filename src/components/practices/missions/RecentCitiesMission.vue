<script setup>
import { usePracticeRecentCitiesStore } from '@/stores/practiceRecentCities'

const store = usePracticeRecentCitiesStore()
const candidates = ['서울', '부산', '제주', '강릉']
</script>

<template>
  <div class="mission-demo">
    <header class="mission-intro">
      <div>
        <p class="mission-kicker">Pinia mission</p>
        <h3>최근 조회 도시 스토어</h3>
        <p>실제 서비스 상태와 분리된 연습용 스토어에서 최근 도시를 관리합니다.</p>
      </div>
      <code class="mission-code">state · getter · action</code>
    </header>

    <div class="mission-grid">
      <section class="mission-panel">
        <p class="mission-label">Store actions</p>
        <div class="mission-actions">
          <button v-for="city in candidates" :key="city" type="button" @click="store.addCity(city)">조회 {{ city }}</button>
          <button type="button" @click="store.reset">초기화</button>
        </div>
      </section>

      <section class="mission-panel dark">
        <p class="mission-label">Shared state · {{ store.count }} cities</p>
        <ul class="mission-list">
          <li v-for="city in store.cities" :key="city">
            <strong>{{ city }}</strong>
            <button type="button" @click="store.removeCity(city)">삭제</button>
          </li>
        </ul>
      </section>
    </div>

    <ul class="mission-checkpoints">
      <li>상태는 스토어에서 소유</li>
      <li>변경 로직은 action으로 호출</li>
      <li>서비스 스토어와 실습 상태 분리</li>
    </ul>
  </div>
</template>

<style scoped>
@import '@/assets/practice-mission.css';

.mission-panel.dark .mission-list li {
  border-color: #4f5552;
}

.mission-panel.dark button {
  border-color: #8a8f8c;
  color: var(--atlas-paper-soft);
}
</style>
