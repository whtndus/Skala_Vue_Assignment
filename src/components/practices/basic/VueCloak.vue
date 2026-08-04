<script setup>
import { ref } from 'vue'

const message = ref('Vue 마운트가 완료된 뒤 안전하게 표시되는 메시지입니다.')
</script>

<template>
  <div v-cloak class="practice-section">
    <h2>v-cloak 디렉티브</h2>
    <p>{{ message }}</p>
    <small>Vue가 마운트되기 전에는 CSS의 [v-cloak] 규칙으로 영역을 숨깁니다.</small>
  </div>
</template>

<style scoped>
[v-cloak] {
  display: none !important;
}
</style>
