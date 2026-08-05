<script setup>
import { computed } from 'vue'
import { useTemperature } from '@/composables/useTemperature'
import { getOutfitRecommendation, isWeatherNumber } from '@/utils/outfitRecommendation'

const props = defineProps({
  readings: { type: Array, default: () => [] },
  cityName: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
})

const { formatTemperature } = useTemperature()
const timePeriods = [
  { key: 'morning', label: '아침', minHour: 6, maxHour: 11, targetHour: 9 },
  { key: 'daytime', label: '낮', minHour: 12, maxHour: 17, targetHour: 15 },
  { key: 'evening', label: '저녁', minHour: 18, maxHour: 23, targetHour: 21 },
]

const findClosestReading = (readings, targetHour) =>
  readings.reduce((closest, reading) => (!closest || Math.abs(reading.localHour - targetHour) < Math.abs(closest.localHour - targetHour) ? reading : closest), null)

const dailyForecasts = computed(() => {
  const groups = new Map()
  props.readings.forEach((reading) => {
    if (!reading.dateKey) return
    if (!groups.has(reading.dateKey)) groups.set(reading.dateKey, [])
    groups.get(reading.dateKey).push(reading)
  })

  return [...groups.entries()].slice(0, 3).map(([dateKey, readings], index) => {
    const temperatures = readings
      .flatMap((reading) => [reading.tempMin, reading.temperature, reading.tempMax])
      .filter(isWeatherNumber)
      .map(Number)
    const representative =
      findClosestReading(
        readings.filter((reading) => isWeatherNumber(reading.localHour)),
        14,
      ) || readings[0]
    const precipitationProbabilities = readings
      .map((reading) => reading.precipitationProbability)
      .filter(isWeatherNumber)
      .map(Number)
    const timeOutfits = timePeriods
      .map((period) => {
        const periodReadings = readings.filter((reading) => isWeatherNumber(reading.localHour) && reading.localHour >= period.minHour && reading.localHour <= period.maxHour)
        const reading = findClosestReading(periodReadings, period.targetHour)
        const recommendation = reading ? getOutfitRecommendation(reading) : null
        return reading && recommendation ? { ...period, reading, recommendation } : null
      })
      .filter(Boolean)

    return {
      dateKey,
      index: index + 1,
      dateLabel: readings[0]?.dateLabel || dateKey,
      description: representative?.description || representative?.status || '날씨 설명 없음',
      status: representative?.status || '구름',
      minTemperature: temperatures.length ? Math.min(...temperatures) : null,
      maxTemperature: temperatures.length ? Math.max(...temperatures) : null,
      precipitationProbability: precipitationProbabilities.length ? Math.max(...precipitationProbabilities) : null,
      timeOutfits,
    }
  })
})
</script>

<template>
  <section id="five-day-journal" class="forecast-journal" aria-labelledby="forecast-journal-title">
    <header class="journal-heading">
      <div>
        <p>FIVE DAY / FIELD FORECAST</p>
        <h2 id="forecast-journal-title">3일간 날씨</h2>
      </div>
      <span>{{ cityName ? `${cityName} · 3시간 간격 예보` : 'OpenWeather Forecast' }}</span>
    </header>

    <div v-if="dailyForecasts.length" class="daily-list">
      <article v-for="day in dailyForecasts" :key="day.dateKey" class="daily-entry">
        <div class="daily-summary">
          <span class="daily-number">{{ String(day.index).padStart(2, '0') }}</span>
          <div>
            <time :datetime="day.dateKey">{{ day.dateLabel }}</time
            ><strong>{{ day.description }}</strong>
          </div>
          <dl>
            <div>
              <dt>최저</dt>
              <dd>{{ day.minTemperature === null ? '정보 없음' : formatTemperature(day.minTemperature) }}</dd>
            </div>
            <div>
              <dt>최고</dt>
              <dd>{{ day.maxTemperature === null ? '정보 없음' : formatTemperature(day.maxTemperature) }}</dd>
            </div>
            <div>
              <dt>강수</dt>
              <dd>
                {{ day.precipitationProbability === null ? '정보 없음' : `${day.precipitationProbability}%` }}
              </dd>
            </div>
          </dl>
        </div>

        <div v-if="day.timeOutfits.length" class="time-outfits" :aria-label="`${day.dateLabel} 시간대별 옷차림`">
          <article v-for="slot in day.timeOutfits" :key="slot.key">
            <div class="time-meta">
              <span>{{ slot.label }}</span
              ><time>{{ slot.reading.timeLabel }}</time>
            </div>
            <strong>{{ formatTemperature(slot.recommendation.referenceTemperature) }}</strong>
            <p>{{ slot.recommendation.label }}</p>
            <small
              >{{ slot.recommendation.top }}<template v-if="slot.recommendation.outer"> · {{ slot.recommendation.outer }}</template></small
            >
            <em v-if="slot.recommendation.notes[0]">{{ slot.recommendation.notes[0] }}</em>
          </article>
        </div>
        <p v-else class="time-empty">이 날짜에는 아침·낮·저녁 시간대 예보가 충분하지 않습니다.</p>
      </article>
    </div>

    <p v-else class="journal-state" role="status">
      {{ loading ? '5일 예보와 시간대별 옷차림을 연결하고 있습니다.' : errorMessage || '표시할 5일 예보가 없습니다.' }}
    </p>
  </section>
</template>

<style scoped>
.daily-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.forecast-journal {
  padding: clamp(3rem, 5vw, 5rem) clamp(1.25rem, 5vw, 5rem);
  border-bottom: 1px solid var(--atlas-line);
  scroll-margin-top: 5.5rem;
}

.journal-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--atlas-line-strong);
}

.journal-heading p {
  margin: 0 0 0.4rem;
  color: var(--atlas-muted);
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.journal-heading h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3.4vw, 3.8rem);
  font-weight: 570;
  letter-spacing: -0.055em;
  line-height: 0.95;
}

.journal-heading > span {
  color: var(--atlas-muted);
  font-size: 0.73rem;
}

.daily-entry {
  min-width: 0;
  padding: 1.5rem;
  border: 1px solid var(--atlas-line-strong);
}
  /* padding: 1.5rem 1.25rem 2rem;
  border-bottom: 1px solid var(--atlas-line-strong);

  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease;
} */
.time-outfits > article {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background-color 180ms ease;
}

.time-outfits > article:hover {
  position: relative;
  z-index: 1;
  transform: translateY(-6px);
  background: var(--atlas-surface, #ffffffe6);
  box-shadow: 0 12px 24px rgba(20, 22, 21, 0.12);
}

.daily-summary {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  align-items: start;
  gap: 1rem;
}

.daily-number {
  color: var(--atlas-accent);
  font-size: 0.9rem;
  font-weight: 800;
}

.daily-summary time,
.daily-summary strong {
  display: block;
}

.daily-summary time {
  color: var(--atlas-muted);
  font-size: 0.72rem;
  font-weight: 700;
}

.daily-summary strong {
  margin-top: 0.2rem;
  font-size: clamp(1.15rem, 1.7vw, 1.5rem);
  font-weight: 620;
}

.daily-summary dl {
  grid-column: 2;
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: start;
  gap: 1.5rem;
  margin: 0;
}

.daily-summary dl div {
  display: grid;
  gap: 0.15rem;
}

.daily-summary dt {
  color: var(--atlas-muted);
  font-size: 0.8rem;
  font-weight: 700;
}

.daily-summary dd {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.daily-summary time {
  font-size: 1rem;
}

.time-outfits {
  grid-template-columns: 1fr;
  margin: 1.25rem 0 0;
}

.time-outfits > article {
  min-width: 0;
  padding: 1rem;
  border-right: 1px solid var(--atlas-line);
  border-bottom: 1px solid var(--atlas-line);
}

.time-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  color: var(--atlas-muted);
  font-size: 0.9rem;
  font-weight: 750;
}
.time-outfits > article > strong {
  display: block;
  margin-top: 0.9rem;
  font-size: clamp(1.6rem, 2.5vw, 2.6rem);
  font-weight: 470;
  letter-spacing: -0.04em;
}

.time-outfits p {
  margin: 0.3rem 0 0.6rem;
  font-size: 0.85rem;
  font-weight: 700;
}

.time-outfits small,
.time-outfits em,
.time-empty,
.journal-state {
  color: var(--atlas-muted);
  font-size: 0.72rem;
  font-style: normal;
  line-height: 1.55;
}

.time-outfits em {
  display: block;
  margin-top: 0.55rem;
  color: var(--atlas-accent);
}

.time-empty {
  margin: 1rem 0 0 4.25rem;
}

.journal-state {
  min-height: 16rem;
  margin: 0;
  display: grid;
  place-items: center;
}

@media (max-width: 760px) {
  .forecast-journal {
    padding: 2.75rem 1rem;
  }

  .journal-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.8rem;
  }

  .daily-summary {
    grid-template-columns: 2rem minmax(0, 1fr);
  }

  .daily-summary dl {
    grid-column: 2;
    justify-content: start;
    gap: 1.25rem;
  }

  .time-outfits {
    grid-template-columns: 1fr;
    margin-left: 2rem;
  }

  .time-empty {
    margin-left: 2rem;
  }
}
</style>
