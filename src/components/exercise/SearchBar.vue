<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  statusMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query', 'search-city'])

const queryModel = computed({
  get: () => props.currentQuery,
  set: (value) => emit('update-query', value),
})

const submitSearch = () => {
  emit('search-city', props.currentQuery.trim())
}
</script>

<template>
  <div class="command-search">
    <form class="command-search-form" @submit.prevent="submitSearch">
      <label for="atlas-city-search">도시 검색</label>
      <input id="atlas-city-search" v-model="queryModel" type="search" autocomplete="off" placeholder="도시 이름을 입력하세요" :disabled="isLoading" />
      <button type="submit" :disabled="isLoading || !currentQuery.trim()">
        {{ isLoading ? '조회 중' : '도시 검색 ↗' }}
      </button>
    </form>

    <p v-if="errorMessage" class="command-status command-error" role="alert">{{ errorMessage }}</p>
    <p v-else-if="statusMessage" class="command-status" role="status">{{ statusMessage }}</p>
  </div>
</template>

<style scoped>
.command-search {
  min-width: 0;
}

.command-search-form {
  display: grid;
  grid-template-columns: auto minmax(180px, 1fr) auto;
  align-items: center;
  gap: 1rem;
}

label {
  color: rgba(242, 239, 231, 0.66);
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.12em;
}

input {
  min-width: 0;
  padding: 0.55rem 0;
  border: 0;
  border-bottom: 1px solid rgba(242, 239, 231, 0.55);
  border-radius: 0;
  outline: 0;
  color: #f2efe7;
  background: transparent;
  font: inherit;
  font-size: clamp(1rem, 1.6vw, 1.25rem);
}

input::placeholder {
  color: rgba(242, 239, 231, 0.46);
}

input:focus-visible {
  border-bottom-color: #fff;
  box-shadow: 0 2px 0 #fff;
}

input:disabled {
  opacity: 0.55;
  cursor: wait;
}

button {
  min-height: 40px;
  padding: 0.55rem 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  border-radius: 0;
  color: #f2efe7;
  background: transparent;
  font-size: 0.78rem;
  font-weight: 750;
  letter-spacing: 0.05em;
  cursor: pointer;
}

button:hover:not(:disabled) {
  color: #b9cbd0;
}

button:focus-visible {
  outline: 2px solid #f2efe7;
  outline-offset: 4px;
}

button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.command-status {
  margin: 0.55rem 0 0 calc(4.5rem + 1rem);
  color: #b9cbd0;
  font-size: 0.75rem;
}

.command-error {
  color: #e2b5aa;
}

@media (max-width: 760px) {
  .command-search-form {
    grid-template-columns: 1fr auto;
    gap: 0.65rem 1rem;
  }

  label {
    grid-column: 1 / -1;
  }

  .command-status {
    margin-left: 0;
  }
}
</style>
