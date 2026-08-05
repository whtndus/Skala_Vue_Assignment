<script setup>
import { ref } from 'vue'
import SearchQueryChild from './SearchQueryChild.vue'

const realtimeQuery = ref('')
const lazyQuery = ref('')
const parentQuery = ref('')
</script>

<template>
  <section class="practice-section search-binding-practice">
    <div class="binding-example">
      <label>실시간 @input<input :value="realtimeQuery" type="text" placeholder="입력 즉시 상태 반영" @input="realtimeQuery = $event.target.value" /></label>
      <output
        ><span>STATE</span><code>{{ realtimeQuery || '입력 전' }}</code></output
      >
    </div>
    <div class="binding-example">
      <label>v-model.trim.lazy<input v-model.trim.lazy="lazyQuery" type="text" placeholder="변경 이벤트에서 공백 정리" /></label>
      <output
        ><span>STATE</span><code>{{ lazyQuery || '변경 전' }}</code></output
      >
    </div>
    <div class="binding-example">
      <SearchQueryChild v-model="parentQuery" />
      <output
        ><span>PARENT SEARCHQUERY</span><code>{{ parentQuery || '동기화 전' }}</code></output
      >
    </div>
  </section>
</template>

<style scoped>
.search-binding-practice {
  display: grid;
  gap: 1.4rem;
}
.binding-example {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(180px, 0.8fr);
  gap: 1.5rem;
  align-items: end;
}
.binding-example > label {
  display: grid;
  gap: 0.45rem;
  font-size: 0.78rem;
  font-weight: 700;
}
.binding-example input {
  width: 100%;
}
output {
  display: grid;
  gap: 0.35rem;
  padding: 0.65rem 0;
  border-top: 1px solid var(--atlas-line);
  border-bottom: 1px solid var(--atlas-line);
}
output span {
  color: var(--atlas-muted);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}
code {
  overflow-wrap: anywhere;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--atlas-ink);
}
@media (max-width: 620px) {
  .binding-example {
    grid-template-columns: 1fr;
  }
}
</style>
