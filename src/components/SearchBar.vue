<script setup>
/**
 * SearchBar.vue — 도시 검색 전용 컴포넌트
 * 
 * 1. props: 
 *   - currentQuery: 부모(WeatherParent)로부터 수신하는 검색어
 *   - matchedCities: 검색어에 매칭된 도시명 배열 (추가 정보 표시)
 * 2. emits: 한글 IME 조작 시 입력값을 'update-query' 이벤트로 부모에게 실시간 전달
 */
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  matchedCities: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['update-query'])
</script>

<template>
  <div class="search-bar">
    <input
      type="text"
      placeholder="검색할 도시 이름을 입력하세요"
      :value="currentQuery"
      @input="$emit('update-query', $event.target.value)"
      class="search-input"
    />
    <p class="search-info" v-if="currentQuery.trim()">
      검색 중인 도시:
      <strong v-if="matchedCities.length">{{ matchedCities.join(', ') }}</strong>
      <span v-else class="no-result">일치하는 도시가 없습니다.</span>
    </p>
  </div>
</template>

<style scoped>
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
