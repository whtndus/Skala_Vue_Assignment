<script setup>
import { ref, watch } from 'vue'

const user = ref({ name: '홍길동', age: 20 })
const deepLog = ref('객체 속성을 변경해 보세요.')
const ageLog = ref('나이 속성만 별도로 감시합니다.')

watch(
  user,
  (newUser) => {
    deepLog.value = `deep 감지: ${newUser.name}, ${newUser.age}세`
  },
  { deep: true },
)

watch(
  () => user.value.age,
  (newAge, oldAge) => {
    ageLog.value = `나이 감지: ${oldAge}세 → ${newAge}세`
  },
)
</script>

<template>
  <div class="practice-section">
    <h2>watch() Deep Watch</h2>
    <p>이름: {{ user.name }} · 나이: {{ user.age }}세</p>
    <button @click="user.name = '이순신'">이름 변경</button>&nbsp;
    <button @click="user.age++">나이 증가</button>
    <p>{{ deepLog }}</p>
    <p>{{ ageLog }}</p>
  </div>
</template>
