<script setup>
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
const { unit, unitSymbol } = storeToRefs(configStore)
</script>

<template>
  <div class="unit-toggler" aria-label="온도 단위 설정">
    <span class="unit-label">온도 단위</span>
    <button type="button" class="unit-button" :aria-label="`온도 단위를 ${unit === 'celsius' ? '화씨' : '섭씨'}로 변경`" :title="`현재 단위: ${unitSymbol}`" @click="configStore.toggleUnit">
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
  flex: 0 0 auto;
}

.unit-label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.unit-button {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 32px;
  padding: 0.25rem 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--unit-control-muted, var(--atlas-muted));
  cursor: pointer;
  transition: color 160ms ease;
}

.unit-button:hover {
  color: var(--unit-control-color, var(--atlas-ink));
}

.unit-button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.unit-button span {
  padding-bottom: 0.1rem;
  border-bottom: 1px solid transparent;
  font-size: 0.75rem;
  font-weight: 650;
}

.unit-button .active {
  border-bottom-color: currentColor;
  color: var(--unit-control-color, var(--atlas-ink));
  font-weight: 800;
}

.unit-button .divider {
  border-bottom: 0;
  color: var(--unit-control-divider, var(--atlas-line));
}
</style>
