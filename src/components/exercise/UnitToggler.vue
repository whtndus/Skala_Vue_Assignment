<script setup>
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
const { unit, unitSymbol } = storeToRefs(configStore)
</script>

<template>
  <div class="unit-toggler" aria-label="온도 단위 설정">
    <span class="unit-label">온도 단위</span>
    <button
      type="button"
      class="unit-button"
      :aria-label="`온도 단위를 ${unit === 'celsius' ? '화씨' : '섭씨'}로 변경`"
      :title="`현재 단위: ${unitSymbol}`"
      @click="configStore.toggleUnit"
    >
      <span :class="{ active: unit === 'celsius' }">°C</span>
      <span class="divider" aria-hidden="true">/</span>
      <span :class="{ active: unit === 'fahrenheit' }">°F</span>
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.unit-label {
  color: #718096;
  font-size: 0.75rem;
  font-weight: 600;
}

.unit-button {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  min-height: 36px;
  padding: 0.35rem 0.65rem;
  border: 1px solid #cbd5e0;
  border-radius: 999px;
  background: #fff;
  color: #94a3b8;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.unit-button:hover {
  border-color: #4a90d9;
  box-shadow: 0 4px 12px rgba(74, 144, 217, 0.16);
  transform: translateY(-1px);
}

.unit-button:focus-visible {
  outline: 3px solid rgba(74, 144, 217, 0.25);
  outline-offset: 2px;
}

.unit-button span {
  font-size: 0.82rem;
  font-weight: 600;
}

.unit-button .active {
  color: #1a6fa8;
  font-weight: 800;
}

.unit-button .divider {
  color: #cbd5e0;
}
</style>
