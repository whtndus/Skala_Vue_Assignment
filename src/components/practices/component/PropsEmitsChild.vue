<script setup>
defineProps({
  city: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['refresh-request'])
</script>

<template>
  <section class="child-container">
    <p>CHILD COMPONENT · PROP</p>
    <strong>{{ city }}</strong>
    <span>부모가 선택한 도시를 읽기 전용으로 표시합니다.</span>
    <button type="button" @click="emit('refresh-request', city)">관측 갱신 요청 · EMIT</button>
  </section>
</template>

<style scoped>
.child-container {
  display: grid;
  gap: 0.65rem;
  padding: 1rem;
  border: 1px solid var(--atlas-ink);
  color: var(--atlas-paper-soft);
  background: var(--atlas-ink);
}

p,
strong,
span {
  margin: 0;
}

p {
  color: #b8c9cc;
  font-family: var(--font-mono);
  font-size: 0.68rem;
}

strong {
  font-size: 1.8rem;
  font-weight: 500;
}

span {
  color: #b8c9cc;
  font-size: 0.78rem;
}

button {
  justify-self: start;
  border-color: #8a8f8c;
  color: var(--atlas-paper-soft);
}
</style>
