<script setup>
import { computed } from 'vue'
import { useTemperature } from '@/composables/useTemperature'

const props = defineProps({
  cityItem: { type: Object, required: true },
  isFavorite: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
})
const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite', 'preview-city'])
const { convertTemperature, unitSymbol } = useTemperature()
const displayTemperature = computed(() => `${convertTemperature(props.cityItem.temp)}${unitSymbol.value}`)

const openDetail = () => {
  emit('select-card', `${props.cityItem.name}이 선택되었습니다.`)
  emit('click-detail', props.cityItem.id)
}
</script>

<template>
  <article
    class="weather-card"
    :class="{ active: isActive }"
    role="link"
    tabindex="0"
    :aria-label="`${cityItem.name} 상세 관측 정보 보기`"
    @mouseenter="emit('preview-city', cityItem)"
    @focus="emit('preview-city', cityItem)"
    @click="openDetail"
    @keydown.enter.prevent="openDetail"
    @keydown.space.prevent="openDetail"
  >
    <div class="city-copy">
      <h3>{{ cityItem.name }}</h3>
      <small>{{ cityItem.state || cityItem.country || '국가 정보 없음' }}</small>
    </div>
    <p class="temperature">{{ displayTemperature }}</p>
    <p class="condition">
      {{ cityItem.status }}<small>{{ cityItem.description || '상세 설명 없음' }}</small>
    </p>
    <button
      type="button"
      class="favorite-button"
      :class="{ active: isFavorite }"
      :aria-label="isFavorite ? `${cityItem.name} 즐겨찾기 해제` : `${cityItem.name} 즐겨찾기 추가`"
      :aria-pressed="isFavorite"
      @click.stop="emit('toggle-favorite', cityItem)"
    >
      <span aria-hidden="true">{{ isFavorite ? '★' : '☆' }}</span
      ><span>SAVE</span>
    </button>
  </article>
</template>

<style scoped>
.weather-card {
  display: grid;
  grid-template-columns: 3rem minmax(150px, 1.25fr) minmax(90px, 0.55fr) minmax(130px, 0.8fr) auto;
  align-items: center;
  gap: 1rem;
  min-height: 104px;
  border-bottom: 1px solid var(--atlas-line);
  color: var(--atlas-ink);
  cursor: pointer;
  counter-increment: city-row;
  transition:
    padding 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.35s,
    background-color 0.35s;
}
.weather-card::before {
  color: var(--atlas-muted);
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  content: counter(city-row, decimal-leading-zero);
}
.weather-card:hover,
.weather-card:focus-visible,
.weather-card.active {
  padding-inline: 1rem;
  color: var(--atlas-paper-soft);
  background: var(--atlas-ink);
  outline: 0;
}
.weather-card:focus-visible {
  box-shadow: inset 0 0 0 2px var(--atlas-accent);
}
.weather-card:hover::before,
.weather-card:focus-visible::before,
.weather-card.active::before,
.weather-card:hover small,
.weather-card:focus-visible small,
.weather-card.active small {
  color: rgba(243, 241, 235, 0.58);
}
.city-copy h3 {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.8rem);
  font-weight: 590;
  letter-spacing: -0.055em;
  line-height: 0.9;
}
.city-copy small,
.condition small {
  display: block;
  margin-top: 0.45rem;
  color: var(--atlas-muted);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
}
.temperature {
  margin: 0;
  font-size: clamp(1.7rem, 3vw, 2.7rem);
  font-weight: 300;
  letter-spacing: -0.06em;
  font-variant-numeric: tabular-nums;
}
.condition {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 750;
}
.favorite-button {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  color: inherit;
  background: transparent;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  cursor: pointer;
}
.favorite-button.active {
  color: #a9c0c5;
}
.favorite-button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}
@media (max-width: 720px) {
  .weather-card {
    grid-template-columns: 2rem 1fr auto;
    grid-template-rows: auto auto;
    gap: 0.35rem 1rem;
    padding-block: 1.2rem;
  }
  .city-copy {
    grid-column: 2;
  }
  .temperature {
    grid-column: 3;
    grid-row: 1;
  }
  .condition {
    grid-column: 2;
    grid-row: 2;
  }
  .condition small {
    display: none;
  }
  .favorite-button {
    grid-column: 3;
    grid-row: 2;
  }
  .weather-card:hover,
  .weather-card:focus-visible,
  .weather-card.active {
    padding-inline: 0.7rem;
  }
}
</style>
