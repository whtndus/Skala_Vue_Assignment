<script setup>
import { computed } from 'vue'
import { useTemperature } from '@/composables/useTemperature'

/**
 * WeatherCard.vue — 개별 도시 날씨 카드 컴포넌트 (프리미엄 디자인 적용)
 *
 * 1. props: cityItem (도시 데이터 객체: { id, name, temp, status })
 * 2. emits:
 *   - 'select-card': 카드 클릭 시 부모에게 도시 선택 메시지 전달
 *   - 'click-detail': [상세보기] 요청 시 도시 ID 전달
 * 3. actions Scoped Slot: 부모가 상세보기 영역을 커스터마이징할 수 있도록 city, requestDetail 제공
 */
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite', 'preview-city'])
const { convertTemperature, unitSymbol } = useTemperature()

const displayTemp = computed(() => convertTemperature(props.cityItem.temp))

const requestDetail = () => {
  emit('click-detail', props.cityItem.id)
}

// 날씨 상태별 이모지 아이콘 매핑
const getWeatherIcon = (status) => {
  const iconMap = { 맑음: '☀️', 비: '🌧️', 구름: '☁️', 눈: '❄️' }
  return iconMap[status] || '🌤️'
}

// 날씨 상태별 카드 배경 그라데이션 클래스 매핑
const getCardGradient = (status) => {
  const gradientMap = { 맑음: 'card-sunny', 비: 'card-rainy', 구름: 'card-cloudy', 눈: 'card-snowy' }
  return gradientMap[status] || 'card-default'
}
</script>

<template>
  <div
    class="weather-card"
    :class="getCardGradient(cityItem.status)"
    role="button"
    tabindex="0"
    @mouseenter="emit('preview-city', cityItem)"
    @focusin="emit('preview-city', cityItem)"
    @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
  >
    <button
      type="button"
      class="favorite-button"
      :class="{ active: isFavorite }"
      :aria-label="isFavorite ? `${cityItem.name} 즐겨찾기 해제` : `${cityItem.name} 즐겨찾기 추가`"
      :aria-pressed="isFavorite"
      @click.stop="emit('toggle-favorite', cityItem)"
    >
      {{ isFavorite ? '★' : '☆' }}
    </button>

    <div class="card-header">
      <span class="weather-icon" :data-weather-icon="getWeatherIcon(cityItem.status)" aria-hidden="true">—</span>
      <div>
        <h4 class="city-name">{{ cityItem.name }}</h4>
        <small>{{ cityItem.country || '대한민국' }}</small>
      </div>
    </div>

    <div class="card-body">
      <p class="temp">{{ displayTemp }}{{ unitSymbol }}</p>
      <strong>{{ cityItem.status }}</strong>

      <!-- 기온에 따라 더움 / 보통 / 선선함 3단계 라벨 표시 -->
      <span v-if="cityItem.temp >= 25" class="label label-hot">WARM / 25+</span>
      <span v-else-if="cityItem.temp >= 20" class="label label-normal">MILD / 20—24</span>
      <span v-else class="label label-cool">COOL / BELOW 20</span>
    </div>

    <div class="card-footer">
      <slot name="actions" :city="cityItem" :request-detail="requestDetail">
        <!-- 슬롯을 사용하지 않을 때 표시되는 기본 상세보기 버튼 -->
        <button class="detail-btn" type="button" @click.stop="requestDetail">상세보기</button>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  display: grid;
  grid-template-columns: 56px minmax(180px, 1.35fr) minmax(260px, 1fr) auto;
  align-items: center;
  min-height: 112px;
  border: 0;
  border-bottom: 1px solid #a7a59f;
  color: #1f211f;
  background: transparent;
  cursor: pointer;
  counter-increment: city-row;
  transition:
    color 600ms ease,
    padding 600ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 600ms ease;
}

.weather-card::before {
  color: #777872;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  content: counter(city-row, decimal-leading-zero);
}

.weather-card:hover,
.weather-card:focus-visible {
  padding-inline: 1rem;
  color: #f3f1eb;
  background: #242825;
  outline: none;
}

.weather-card:hover::before,
.weather-card:focus-visible::before,
.weather-card:hover .card-header small,
.weather-card:focus-visible .card-header small,
.weather-card:hover .label,
.weather-card:focus-visible .label {
  color: rgba(243, 241, 235, 0.62);
}

.favorite-button {
  grid-column: 4;
  grid-row: 1;
  align-self: start;
  justify-self: end;
  margin-top: 0.75rem;
  padding: 0;
  border: 0;
  color: currentColor;
  background: transparent;
  font-size: 1rem;
  cursor: pointer;
}

.favorite-button.active {
  color: #9bb9bc;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weather-icon {
  width: 1.5rem;
  overflow: hidden;
  font-size: 1.1rem;
  filter: grayscale(1);
}

.city-name {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2.6rem);
  font-weight: 650;
  letter-spacing: -0.045em;
  line-height: 1;
}

.card-header small {
  display: block;
  margin-top: 0.4rem;
  color: #70716d;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.card-body {
  display: grid;
  grid-template-columns: minmax(90px, 0.7fr) minmax(70px, 0.5fr) 1fr;
  align-items: baseline;
  gap: 1rem;
}

.temp {
  margin: 0;
  font-size: clamp(1.55rem, 3.5vw, 2.8rem);
  font-weight: 300;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.05em;
}

.card-body strong,
.label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.label {
  color: #747570;
}

.card-footer {
  grid-column: 4;
  grid-row: 1;
  align-self: end;
  justify-self: end;
  margin-bottom: 0.75rem;
}

.detail-btn {
  padding: 0.25rem 0;
  border: 0;
  border-bottom: 1px solid currentColor;
  color: inherit;
  background: transparent;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
}

@media (max-width: 760px) {
  .weather-card {
    grid-template-columns: 34px 1fr auto;
    gap: 0.4rem;
    min-height: 138px;
  }

  .card-header {
    grid-column: 2;
  }

  .card-body {
    grid-column: 2 / -1;
    grid-template-columns: 80px 60px 1fr;
    margin-top: 0.8rem;
  }

  .favorite-button,
  .card-footer {
    grid-column: 3;
  }
}
</style>
