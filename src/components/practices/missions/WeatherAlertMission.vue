<script setup>
import { computed, reactive, ref } from 'vue'

const initialForm = () => ({ city: '서울', threshold: 30, unit: 'celsius', conditions: ['비'], memo: '', enabled: true })
const form = reactive(initialForm())
const submitted = ref(null)
const summary = computed(() => `${form.city} · ${form.threshold}°${form.unit === 'celsius' ? 'C' : 'F'} · ${form.conditions.join(', ') || '조건 없음'}`)

const submitForm = () => {
  submitted.value = { ...form, conditions: [...form.conditions] }
}

const resetForm = () => {
  Object.assign(form, initialForm())
  submitted.value = null
}
</script>

<template>
  <form class="mission-demo" @submit.prevent="submitForm">
    <header class="mission-intro">
      <div>
        <p class="mission-kicker">Form mission</p>
        <h3>날씨 알림 설정</h3>
        <p>여러 폼 요소와 v-model 수식어를 하나의 설정 데이터로 묶습니다.</p>
      </div>
      <code class="mission-code">v-model.trim · .number · checkbox</code>
    </header>

    <div class="mission-grid">
      <section class="mission-panel mission-stack">
        <label class="mission-field">
          <span>도시</span>
          <select v-model="form.city">
            <option>서울</option>
            <option>부산</option>
            <option>제주</option>
          </select>
        </label>
        <label class="mission-field">
          <span>기온 임계값</span>
          <input v-model.number="form.threshold" type="number" min="-30" max="60" />
        </label>
        <fieldset class="mission-fieldset">
          <legend>온도 단위</legend>
          <label><input v-model="form.unit" type="radio" value="celsius" /> 섭씨</label>
          <label><input v-model="form.unit" type="radio" value="fahrenheit" /> 화씨</label>
        </fieldset>
        <fieldset class="mission-fieldset">
          <legend>알림 조건</legend>
          <label><input v-model="form.conditions" type="checkbox" value="비" /> 비</label>
          <label><input v-model="form.conditions" type="checkbox" value="눈" /> 눈</label>
          <label><input v-model="form.conditions" type="checkbox" value="강풍" /> 강풍</label>
        </fieldset>
        <label class="mission-field">
          <span>메모</span>
          <textarea v-model.trim="form.memo" rows="3" placeholder="알림 목적을 입력하세요"></textarea>
        </label>
        <label class="mission-check"><input v-model="form.enabled" type="checkbox" /> 알림 활성화</label>
        <div class="mission-actions">
          <button type="submit">설정 저장</button>
          <button type="button" @click="resetForm">초기화</button>
        </div>
      </section>

      <section class="mission-panel dark">
        <p class="mission-label">Live state</p>
        <p>{{ summary }}</p>
        <p class="mission-muted">상태: {{ form.enabled ? '활성' : '비활성' }}</p>
        <p class="mission-muted">메모: {{ form.memo || '입력되지 않음' }}</p>
        <pre v-if="submitted" class="mission-output">{{ JSON.stringify(submitted, null, 2) }}</pre>
        <p v-else class="mission-muted">저장하면 제출 시점의 상태가 표시됩니다.</p>
      </section>
    </div>

    <ul class="mission-checkpoints">
      <li>자료형이 유지되는지 확인</li>
      <li>제출 기본 동작 차단</li>
      <li>초기 상태 복원</li>
    </ul>
  </form>
</template>

<style scoped>
@import '@/assets/practice-mission.css';

.mission-panel.dark .mission-output {
  background: rgba(255, 255, 255, 0.08);
}
</style>
