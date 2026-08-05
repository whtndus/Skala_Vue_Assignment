<script setup>
import { ref } from 'vue'

const note = ref('')
const isEnabled = ref(true)
const weatherTypes = ref(['비'])
const unit = ref('섭씨')
const selectedCity = ref('서울')
</script>

<template>
  <div class="practice-section form-practice">
    <h2>HTML Form 요소와 v-model 매핑</h2>
    <p class="practice-description">서로 무관한 입력 예제 대신 하나의 날씨 알림 설정으로 데이터 형태를 비교합니다.</p>

    <div class="form-grid">
      <label>
        <span>관측 메모 · textarea</span>
        <textarea v-model="note" rows="3" placeholder="예: 출근 전 확인"></textarea>
      </label>

      <label class="inline-control"><input v-model="isEnabled" type="checkbox" /> 알림 활성화 · Boolean</label>

      <fieldset>
        <legend>알림 날씨 · Array</legend>
        <label><input v-model="weatherTypes" type="checkbox" value="비" /> 비</label>
        <label><input v-model="weatherTypes" type="checkbox" value="눈" /> 눈</label>
        <label><input v-model="weatherTypes" type="checkbox" value="강풍" /> 강풍</label>
      </fieldset>

      <fieldset>
        <legend>온도 단위 · String</legend>
        <label><input v-model="unit" type="radio" value="섭씨" /> 섭씨</label>
        <label><input v-model="unit" type="radio" value="화씨" /> 화씨</label>
      </fieldset>

      <label>
        <span>관측 도시 · select</span>
        <select v-model="selectedCity">
          <option>서울</option>
          <option>부산</option>
          <option>제주</option>
        </select>
      </label>
    </div>

    <pre class="state-preview" aria-live="polite">city: {{ selectedCity }}
unit: {{ unit }}
enabled: {{ isEnabled }}
weatherTypes: {{ weatherTypes }}
note: {{ note || '(비어 있음)' }}</pre>
  </div>
</template>

<style scoped>
.practice-description {
  color: var(--atlas-muted);
  font-size: 0.85rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.form-grid > label,
fieldset {
  display: grid;
  gap: 0.4rem;
}

.form-grid > label > span,
legend {
  color: var(--atlas-muted);
  font-size: 0.76rem;
  font-weight: 700;
}

fieldset {
  align-content: start;
  margin: 0;
  padding: 0.8rem;
  border: 1px solid var(--atlas-line);
}

fieldset label,
.inline-control {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
}

.state-preview {
  margin: 0;
  padding: 1rem;
  border-left: 2px solid var(--atlas-accent);
  background: rgba(30, 33, 31, 0.05);
  font-size: 0.78rem;
  white-space: pre-wrap;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
