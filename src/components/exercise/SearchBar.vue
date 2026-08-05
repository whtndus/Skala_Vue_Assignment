<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  loading: {
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

const emit = defineEmits(['update:modelValue', 'submit', 'close'])
const inputElement = ref(null)

const queryModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const submitLocation = () => {
  const cityName = props.modelValue.trim()
  if (!cityName || props.loading) return
  emit('submit', cityName)
}

const focusInput = () => inputElement.value?.focus()
const closeOnEscape = (event) => {
  if (!event.isComposing) emit('close')
}

defineExpose({ focusInput })
</script>

<template>
  <article class="location-search" @keydown.esc.stop="closeOnEscape">
    <header class="location-search-heading">
      <div>
        <p>ADD LIVE LOCATION</p>
        <h3>새로 관측할 도시를 입력하세요</h3>
      </div>
      <button type="button" class="close-button" aria-label="관측 지점 추가 패널 닫기" @click="emit('close')">닫기</button>
    </header>

    <form class="location-search-form" @submit.prevent="submitLocation">
      <label for="atlas-location-search">도시 또는 지역명</label>
      <div class="location-form-row">
        <input id="atlas-location-search" ref="inputElement" v-model="queryModel" type="search" autocomplete="off" placeholder="서울, 제주, London" :disabled="loading" />
        <button type="submit" class="submit-button" :disabled="loading || !modelValue.trim()">
          {{ loading ? '관측 데이터 연결 중' : '실시간 관측 불러오기' }}
        </button>
      </div>

      <p v-if="errorMessage" class="location-message error-message" role="alert">{{ errorMessage }}</p>
      <p v-else-if="loading" class="location-message" role="status">OpenWeather 실시간 관측 데이터를 연결하고 있습니다.</p>
      <p v-else-if="statusMessage" class="location-message" role="status">{{ statusMessage }}</p>
    </form>

    <footer>LIVE DATA / OPENWEATHER</footer>
  </article>
</template>

<style scoped>
.location-search {
  padding: clamp(1.4rem, 3vw, 2.25rem) clamp(1.25rem, 4vw, 3rem);
  border-top: 1px solid rgba(243, 241, 235, 0.48);
  border-bottom: 1px solid rgba(243, 241, 235, 0.28);
  border-radius: 1px;
  color: var(--atlas-paper-soft);
  background: #202522;
}

.location-search-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(243, 241, 235, 0.2);
}

.location-search-heading p {
  margin: 0 0 0.35rem;
  color: #a9bdc3;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.location-search-heading h3 {
  margin: 0;
  color: var(--atlas-paper-soft);
  font-size: clamp(1.05rem, 2vw, 1.4rem);
  font-weight: 570;
  letter-spacing: -0.025em;
}

.close-button,
.submit-button {
  border-radius: 1px;
  font: inherit;
  cursor: pointer;
}

.close-button {
  padding: 0.25rem 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  color: rgba(243, 241, 235, 0.72);
  background: transparent;
  font-size: 0.74rem;
}

.location-search-form {
  width: min(100%, 540px);
  padding: 1.5rem 0 1.25rem;
}

.location-search-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(243, 241, 235, 0.7);
  font-size: 0.75rem;
  font-weight: 700;
}

.location-form-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
}

.location-form-row input {
  min-width: 0;
  min-height: 44px;
  padding: 0.65rem 0.75rem;
  border: 1px solid rgba(243, 241, 235, 0.42);
  border-radius: 1px;
  outline: 0;
  color: var(--atlas-paper-soft);
  background: rgba(243, 241, 235, 0.04);
  font: inherit;
}

.location-form-row input::placeholder {
  color: rgba(243, 241, 235, 0.4);
}

.submit-button {
  min-height: 44px;
  padding: 0.65rem 1rem;
  border: 1px solid var(--atlas-paper-soft);
  color: var(--atlas-ink);
  background: var(--atlas-paper-soft);
  font-size: 0.78rem;
  font-weight: 750;
  white-space: nowrap;
}

.close-button:hover:not(:disabled) {
  color: #fff;
}

.submit-button:hover:not(:disabled) {
  border-color: #b8cbd0;
  background: #b8cbd0;
}

.close-button:focus-visible,
.submit-button:focus-visible,
.location-form-row input:focus-visible {
  outline: 2px solid #d6e2e4;
  outline-offset: 3px;
}

.location-form-row input:disabled,
.submit-button:disabled {
  opacity: 0.48;
  cursor: not-allowed;
}

.location-message {
  margin: 0.65rem 0 0;
  color: #b8cbd0;
  font-size: 0.75rem;
  line-height: 1.5;
}

.error-message {
  color: #efb8ac;
}

.location-search footer {
  padding-top: 0.8rem;
  border-top: 1px solid rgba(243, 241, 235, 0.2);
  color: rgba(243, 241, 235, 0.46);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

@media (max-width: 560px) {
  .location-search {
    padding: 1.25rem 1rem;
  }

  .location-form-row {
    grid-template-columns: 1fr;
  }

  .submit-button {
    width: 100%;
  }
}
</style>
