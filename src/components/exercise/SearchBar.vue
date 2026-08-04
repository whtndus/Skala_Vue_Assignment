<script setup>
import { computed, ref } from 'vue'

/**
 * SearchBar.vue — 도시 검색 전용 컴포넌트
 * 
 * 1. props: 
 *   - currentQuery: 부모(WeatherHomeView)로부터 수신하는 검색어
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
  isLoading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query', 'search-city'])
const inputMode = ref('realtime')

const submitSearch = () => {
  emit('search-city', props.currentQuery.trim())
}

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

    <form class="search-form" @submit.prevent="submitSearch">
      <input
        v-if="inputMode === 'realtime'"
        type="search"
        placeholder="도시 이름을 입력하세요 (예: 서울, London)"
        :value="currentQuery"
        class="search-input"
        aria-label="날씨를 검색할 도시"
        @input="$emit('update-query', $event.target.value)"
      />
      <input
        v-else
        v-model.trim.lazy="queryModel"
        type="search"
        placeholder="도시 이름 입력 후 Enter"
        class="search-input"
        aria-label="날씨를 검색할 도시"
      />
      <button
        type="submit"
        class="search-button"
        :disabled="isLoading || !currentQuery.trim()"
      >
        {{ isLoading ? '조회 중...' : '실시간 날씨 조회' }}
      </button>
    </form>

    <p class="mode-description">
      <template v-if="inputMode === 'realtime'">
        입력 중에는 현재 목록을 필터링하고, Enter 또는 조회 버튼으로 API를 호출합니다.
      </template>
      <template v-else>
        change 이벤트로 검색어를 반영한 뒤 Enter 또는 조회 버튼으로 API를 호출합니다.
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

    <p v-if="errorMessage" class="api-error" role="alert">{{ errorMessage }}</p>
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
  flex: 1 1 260px;
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

.search-form {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.search-button {
  flex: 0 0 auto;
  padding: 0.75rem 1rem;
  border: 1px solid #4a90d9;
  border-radius: 8px;
  background: #4a90d9;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}

.search-button:hover:not(:disabled) {
  background: #347abd;
}

.search-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
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

.api-error {
  margin: 0.75rem 0 0;
  padding: 0.7rem 0.8rem;
  border: 1px solid #fecaca;
  border-radius: 7px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.85rem;
}
</style>
