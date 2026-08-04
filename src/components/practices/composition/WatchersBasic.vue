<script setup>
import { ref, watch } from 'vue'

const currentCity = ref('서울')
const logMessage = ref('도시를 변경해 보세요.')

watch(currentCity, (newCity, oldCity) => {
  logMessage.value = `${oldCity}에서 ${newCity}(으)로 변경되었습니다.`
})
</script>

<template>
  <div class="practice-section">
    <h2>watch() 기본 감시</h2>
    <p>
      현재 도시: <strong>{{ currentCity }}</strong>
    </p>
    <button @click="currentCity = '서울'">서울</button>&nbsp; <button @click="currentCity = '수원'">수원</button>&nbsp;
    <button @click="currentCity = '부산'">부산</button>
    <p class="watch-log">{{ logMessage }}</p>
  </div>
</template>

<style scoped>
.watch-log {
  margin-top: 0.75rem;
  color: #17694f;
  font-weight: 700;
}
</style>
