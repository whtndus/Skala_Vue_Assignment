<script setup>
import { ref, watchEffect } from 'vue'

const username = ref('홍길동')
const age = ref(20)
const logMessage = ref('')

watchEffect(() => {
  logMessage.value = `자동 감지: ${username.value}, ${age.value}세`
})
</script>

<template>
  <div class="practice-section">
    <h2>watchEffect() 자동 의존성 감시</h2>
    <p>이름: {{ username }} · 나이: {{ age }}세</p>
    <button @click="username = '이순신'">이름 변경</button>&nbsp;
    <button @click="age++">나이 증가</button>
    <p class="watch-log">{{ logMessage }}</p>
  </div>
</template>

<style scoped>
.watch-log {
  color: #17694f;
  font-weight: 700;
}
</style>
