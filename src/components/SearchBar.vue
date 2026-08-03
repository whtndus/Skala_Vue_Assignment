<script setup>
import { computed, ref } from 'vue'

/**
 * SearchBar.vue — 도시 검색 전용 컴포넌트
 * 
 * 1. props: 
 *   - currentQuery: 부모(WeatherParent)로부터 수신하는 검색어
 *   - matchedCities: 검색어에 매칭된 도시명 배열 (추가 정보 표시)
 * 2. emits: 입력 확정(change) 시 정리된 검색어를 'update-query' 이벤트로 부모에게 전달
 */
const props = defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  matchedCities: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update-query'])
const inputMode = ref('realtime')

// props는 직접 수정할 수 없으므로 writable computed를 통해 부모 상태와 동기화
const queryModel = computed({
  get: () => props.currentQuery,
  set: (value) => emit('update-query', value),
})
</script>

<template>
  <div class="search-bar">
    <fieldset class="input-mode-selector">
      <legend>검색어 반영 방식</legend>
      <label>
        <input v-model="inputMode" type="radio" value="realtime" />
        실시간 @input
      </label>
      <label>
        <input v-model="inputMode" type="radio" value="lazy" />
        v-model.trim.lazy
      </label>
    </fieldset>

    <input
      v-if="inputMode === 'realtime'"
      type="text"
      placeholder="검색할 도시 이름을 입력하세요"
      :value="currentQuery"
      class="search-input"
      @input="$emit('update-query', $event.target.value)"
    />
    <input
      v-else
      v-model.trim.lazy="queryModel"
      type="text"
      placeholder="입력 후 포커스를 해제하세요"
      class="search-input"
    />

    <p class="mode-description">
      <template v-if="inputMode === 'realtime'">
        입력할 때마다 부모의 검색어와 카드 목록이 갱신됩니다.
      </template>
      <template v-else>
        change 이벤트가 발생할 때 앞뒤 공백을 제거한 검색어가 반영됩니다.
      </template>
    </p>

    <p class="parent-query">
      부모 searchQuery: <strong>{{ currentQuery || '(빈 값)' }}</strong>
    </p>

    <p class="search-info" v-if="currentQuery.trim()">
      검색 중인 도시:
      <strong v-if="matchedCities.length">{{ matchedCities.join(', ') }}</strong>
      <span v-else class="no-result">일치하는 도시가 없습니다.</span>
    </p>
  </div>
</template>

<style scoped>
.input-mode-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border, #dee2e6);
  border-radius: 8px;
}

.input-mode-selector legend {
  padding: 0 0.35rem;
  color: var(--color-heading, #2c3e50);
  font-size: 0.85rem;
  font-weight: 600;
}

.input-mode-selector label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border, #dee2e6);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-background, #ffffff);
  color: var(--color-text, #2c3e50);
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-input:focus {
  border-color: #4a90d9;
  box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.15);
}

.mode-description,
.parent-query {
  margin-top: 0.65rem;
  color: #777;
  font-size: 0.82rem;
}

.parent-query {
  margin-bottom: 0;
}

.parent-query strong {
  color: #4a90d9;
}

.search-info {
  margin-top: 0.75rem;
  font-size: 0.95rem;
  color: var(--color-text, #2c3e50);
  padding: 0.5rem 0.75rem;
  background: var(--color-background, #ffffff);
  border-radius: 6px;
  border-left: 3px solid #4a90d9;
}

.search-info strong {
  color: #4a90d9;
  font-weight: 700;
}

.no-result {
  color: #e74c3c;
  font-style: italic;
}
</style>
