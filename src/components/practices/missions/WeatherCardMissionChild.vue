<script setup>
defineProps({
  city: { type: String, required: true },
  temperature: { type: Number, required: true },
  isFavorite: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-favorite', 'change-unit'])
</script>

<template>
  <article class="weather-card">
    <p>LIVE OBSERVATION</p>
    <h4>{{ city }}</h4>
    <strong>{{ temperature }}°</strong>
    <span>{{ isFavorite ? '즐겨찾는 관측소' : '일반 관측소' }}</span>
    <div>
      <button type="button" @click="emit('toggle-favorite')">{{ isFavorite ? '즐겨찾기 해제' : '즐겨찾기' }}</button>
      <button type="button" @click="emit('change-unit')">단위 전환 요청</button>
    </div>
  </article>
</template>

<style scoped>
.weather-card {
  display: grid;
  gap: 0.6rem;
  padding: 1.25rem;
  color: var(--atlas-paper-soft);
  background: var(--atlas-ink);
}

p,
h4,
strong,
span {
  margin: 0;
}

p {
  color: #b8c9cc;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
}

h4 {
  font-size: 1.2rem;
  font-weight: 560;
}

strong {
  font-size: clamp(2.8rem, 8vw, 5rem);
  font-weight: 350;
  letter-spacing: -0.08em;
  line-height: 0.9;
}

span {
  color: #b8c9cc;
  font-size: 0.78rem;
}

div {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

button {
  border-color: #8a8f8c;
  color: var(--atlas-paper-soft);
}
</style>
