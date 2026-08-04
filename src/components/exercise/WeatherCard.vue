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

const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])
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
  <div class="weather-card" :class="getCardGradient(cityItem.status)" @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)">
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
      <span class="weather-icon">{{ getWeatherIcon(cityItem.status) }}</span>
      <h4 class="city-name">{{ cityItem.name }} ({{ cityItem.status }})</h4>
    </div>

    <div class="card-body">
      <p class="temp">현재 기온: {{ displayTemp }}{{ unitSymbol }}</p>

      <!-- 기온에 따라 더움 / 보통 / 선선함 3단계 라벨 표시 -->
      <span v-if="cityItem.temp >= 25" class="label label-hot">🔥 더움 (25도 이상)</span>
      <span v-else-if="cityItem.temp >= 20" class="label label-normal">🌤️ 보통 (20~24도)</span>
      <span v-else class="label label-cool">❄️ 선선함 (20도 미만)</span>
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
  border-radius: 14px;
  padding: 1.5rem;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.weather-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.05);
  opacity: 0;
  transition: opacity 0.3s;
}

.weather-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.weather-card:hover::before {
  opacity: 1;
}

.favorite-button {
  position: absolute;
  z-index: 2;
  top: 0.85rem;
  right: 0.85rem;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 50%;
  color: inherit;
  background: rgba(255, 255, 255, 0.18);
  font-size: 1.35rem;
  line-height: 1;
  backdrop-filter: blur(5px);
}

.favorite-button:hover:not(:disabled),
.favorite-button.active {
  color: #ffe082;
  background: rgba(255, 255, 255, 0.32);
}

/* Card Gradient Variants */
.card-sunny {
  background: linear-gradient(135deg, #ff9a56 0%, #ff6b35 50%, #e8532e 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
}

.card-rainy {
  background: linear-gradient(135deg, #667eea 0%, #4a6cf7 50%, #3b5bdb 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(74, 108, 247, 0.3);
}

.card-cloudy {
  background: linear-gradient(135deg, #a8c0d6 0%, #7b9dba 50%, #6b8caa 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(123, 157, 186, 0.3);
}

.card-snowy {
  background: linear-gradient(135deg, #85cdc9 0%, #82c9ce 100%);
  color: #2c3e50;
  box-shadow: 0 4px 16px rgba(116, 235, 229, 0.3);
}

.card-default {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(86, 171, 47, 0.3);
}

/* Card Inner Elements */
.card-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
  padding-right: 2.25rem;
}

.weather-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.city-name {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.3px;
  margin: 0;
}

.card-body {
  margin-bottom: 1.25rem;
}

.temp {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.6rem;
  opacity: 0.95;
}

/* Labels (v-if / v-else) */
.label {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.label-hot {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(4px);
}

.label-normal {
  background: rgba(255, 255, 255, 0.25);
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(4px);
}

.label-cool {
  background: rgba(255, 255, 255, 0.25);
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(4px);
}

/* Card Footer & Detail Button */
.card-footer {
  display: flex;
  justify-content: flex-end;
}

.detail-btn {
  padding: 0.5rem 1.1rem;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.25s,
    transform 0.2s,
    border-color 0.25s;
  backdrop-filter: blur(4px);
}

.detail-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.03);
}

.detail-btn:active {
  transform: scale(0.97);
}
</style>
