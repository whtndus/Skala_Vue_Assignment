<script setup>
const id = 'user-profile-card'
const src = 'https://vuejs.org/images/logo.png'
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 단축 문법</h2>
    <p>속성명과 변수명이 같으면 <code>:id="id"</code>를 <code>:id</code>로 줄일 수 있습니다.</p>
    <div :id>
      <img :src alt="Vue 로고" class="shorthand-logo" />
      <p>적용된 id: {{ id }}</p>
    </div>
  </div>
</template>

<style scoped>
.shorthand-logo {
  width: 54px;
  margin-top: 0.75rem;
}
</style>
