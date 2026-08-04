<script setup>
import { computed, ref } from 'vue'

const count = ref(0)
const unrelatedCount = ref(0)

const getDoubleByMethod = () => {
  console.log('일반 함수가 다시 실행됐습니다.')
  return count.value * 2
}

const doubleCount = computed(() => {
  console.log('computed가 count 변경을 감지해 다시 계산했습니다.')
  return count.value * 2
})
</script>

<template>
  <div class="practice-section">
    <h2>computed() 캐싱 비교</h2>
    <p>count: {{ count }} · 관계없는 값: {{ unrelatedCount }}</p>
    <button @click="count++">count 증가</button>&nbsp;
    <button @click="unrelatedCount++">관계없는 값 증가</button>
    <p>일반 함수 결과: {{ getDoubleByMethod() }}</p>
    <p>computed 결과: {{ doubleCount }}</p>
    <small>관계없는 값을 변경한 뒤 브라우저 콘솔에서 실행 횟수 차이를 확인해 보세요.</small>
  </div>
</template>
