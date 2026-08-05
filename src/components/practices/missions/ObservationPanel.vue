<script setup>
defineProps({
  metrics: { type: Array, required: true },
})
</script>

<template>
  <article class="observation-panel">
    <header><slot name="header" /></header>
    <div class="metric-grid">
      <slot v-for="metric in metrics" name="metric" :key="metric.id" :metric="metric">
        <p>{{ metric.label }}: {{ metric.value }}</p>
      </slot>
    </div>
    <footer><slot name="actions">추가 동작이 없습니다.</slot></footer>
  </article>
</template>

<style scoped>
.observation-panel {
  border-top: 1px solid var(--atlas-ink);
  border-bottom: 1px solid var(--atlas-line);
}

header,
footer {
  padding: 1rem 0;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--atlas-line);
  border-bottom: 1px solid var(--atlas-line);
}

.metric-grid > :deep(*) {
  margin: 0;
  padding: 1rem;
  border-right: 1px solid var(--atlas-line);
}

.metric-grid > :deep(*:last-child) {
  border-right: 0;
}

@media (max-width: 560px) {
  .metric-grid {
    grid-template-columns: 1fr;
  }

  .metric-grid > :deep(*) {
    border-right: 0;
    border-bottom: 1px solid var(--atlas-line);
  }
}
</style>
