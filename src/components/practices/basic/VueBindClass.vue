<script setup>
import { ref } from 'vue'

const isActive = ref(true)
const hasError = ref(false)
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 고급 (클래스 바인딩)</h2>

    <p :class="{ active: isActive, error: hasError }">버튼을 눌러 이 문단의 클래스를 변경해 보세요.</p>

    <button @click="isActive = !isActive">active 클래스 토글</button>&nbsp;
    <button @click="hasError = !hasError">error 클래스 토글</button>
  </div>
</template>

<style scoped>
.active {
  color: #42b883;
  font-weight: bold;
}

.error {
  color: #e53935;
}
</style>
