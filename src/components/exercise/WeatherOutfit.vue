<script setup>
import { computed } from 'vue'
import { useTemperature } from '@/composables/useTemperature'
import { getOutfitRecommendation } from '@/utils/outfitRecommendation'

const props = defineProps({
  temperature: { type: Number, default: null },
  feelsLike: { type: Number, default: null },
  status: { type: String, default: '' },
  description: { type: String, default: '' },
  windSpeed: { type: Number, default: null },
  humidity: { type: Number, default: null },
  precipitation: { type: Number, default: null },
  precipitationType: { type: String, default: '' },
})

const { formatTemperature } = useTemperature()
const outfitRecommendation = computed(() => getOutfitRecommendation(props))

const observationSummary = computed(() => {
  if (!outfitRecommendation.value) return '기온 정보 없음'
  const condition = props.description || props.status || '날씨 설명 없음'
  return `${condition} · 체감 기준 ${formatTemperature(outfitRecommendation.value.referenceTemperature)}`
})
</script>

<template>
  <section class="outfit-module" aria-labelledby="outfit-title">
    <header>
      <div>
        <p>WHAT TO WEAR / LIVE GUIDE</p>
        <h2 id="outfit-title">오늘의 옷차림</h2>
      </div>
      <span>현재 관측 기준</span>
    </header>

    <template v-if="outfitRecommendation">
      <div class="outfit-lead">
        <span>{{ observationSummary }}</span>
        <strong>{{ outfitRecommendation.label }}</strong>
      </div>

      <dl class="outfit-table">
        <div>
          <dt>상의</dt>
          <dd>{{ outfitRecommendation.top }}</dd>
        </div>
        <div>
          <dt>아우터</dt>
          <dd>{{ outfitRecommendation.outer }}</dd>
        </div>
        <div>
          <dt>하의</dt>
          <dd>{{ outfitRecommendation.bottom }}</dd>
        </div>
        <div>
          <dt>신발</dt>
          <dd>{{ outfitRecommendation.shoes }}</dd>
        </div>
      </dl>

      <div class="outfit-notes">
        <p>WEATHER NOTES</p>
        <ul v-if="outfitRecommendation.notes.length">
          <li v-for="note in outfitRecommendation.notes" :key="note">{{ note }}</li>
        </ul>
        <span v-else>현재 관측에서 추가 준비물이 필요한 비·눈·강풍 조건은 확인되지 않았습니다.</span>
      </div>
    </template>

    <p v-else class="outfit-empty" role="status">기온 정보가 없어 옷차림을 추천할 수 없습니다.</p>
    <small class="outfit-disclaimer">현재 관측값을 바탕으로 한 참고 정보입니다. 외출 시간대의 예보도 함께 확인해 주세요.</small>
  </section>
</template>

<style scoped>
.outfit-module {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding-left: clamp(1.5rem, 3vw, 4rem);
  border-left: 1px solid var(--atlas-line);
}

.outfit-module header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--atlas-line-strong);
}

.outfit-module header p,
.outfit-notes p {
  margin: 0 0 0.4rem;
  color: var(--atlas-muted);
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.outfit-module h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 3rem);
  font-weight: 570;
  letter-spacing: -0.055em;
  line-height: 0.95;
}

.outfit-module header > span {
  color: var(--atlas-muted);
  font-size: 0.72rem;
  white-space: nowrap;
}

.outfit-lead {
  display: grid;
  gap: 0.4rem;
  padding: 0.35rem 0 1.3rem;
}

.outfit-lead span {
  color: var(--atlas-accent);
  font-size: 0.72rem;
  font-weight: 750;
}

.outfit-lead strong {
  font-size: clamp(1.45rem, 2.4vw, 2.5rem);
  font-weight: 570;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.outfit-table {
  margin: 0;
  border-top: 1px solid var(--atlas-line);
}

.outfit-table div {
  display: grid;
  grid-template-columns: 5rem minmax(0, 1fr);
  gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--atlas-line);
}

.outfit-table dt {
  color: var(--atlas-muted);
  font-size: 0.78rem;
  font-weight: 650;
}

.outfit-table dd {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 620;
}

.outfit-notes {
  margin-top: 1.35rem;
}

.outfit-notes ul {
  display: grid;
  gap: 0.35rem;
  margin: 0;
  padding-left: 1.1rem;
  color: var(--atlas-ink);
  font-size: 0.8rem;
}

.outfit-notes > span,
.outfit-empty,
.outfit-disclaimer {
  color: var(--atlas-muted);
  font-size: 0.75rem;
  line-height: 1.6;
}

.outfit-empty {
  min-height: 18rem;
  margin: 0;
  display: grid;
  place-items: center;
  border: 1px solid var(--atlas-line);
}

.outfit-disclaimer {
  display: block;
  margin-top: auto;
  padding-top: 1.4rem;
}

@media (max-width: 900px) {
  .outfit-module {
    padding-top: 2.75rem;
    padding-left: 0;
    border-top: 1px solid var(--atlas-line);
    border-left: 0;
  }
}

@media (max-width: 520px) {
  .outfit-module header {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.7rem;
  }
}
</style>
