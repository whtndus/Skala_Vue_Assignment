<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const requestedPath = typeof route.query.from === 'string' ? route.query.from : route.fullPath
</script>

<template>
  <section class="not-found">
    <span class="error-code">404</span>
    <h1>페이지를 찾을 수 없습니다</h1>
    <p>
      요청하신 <strong>{{ requestedPath }}</strong> 경로가 존재하지 않습니다.
    </p>
    <RouterLink to="/">메인 대시보드로 돌아가기</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  max-width: 650px;
  margin: 3rem auto 0;
  padding: 3.5rem 1.5rem;
  border: 1px solid var(--color-border, #e9ecef);
  border-radius: 0;
  background: var(--color-background-soft, #f8f9fa);
  box-shadow: none;
  text-align: center;
}

.error-code {
  display: block;
  color: #4a90d9;
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.not-found h1 {
  margin: 0;
  color: var(--color-heading, #2c3e50);
  font-size: 1.8rem;
  font-weight: 700;
}

.not-found p {
  margin: 0.6rem 0 1.5rem;
  color: #777;
}

.not-found strong {
  color: #4a90d9;
  overflow-wrap: anywhere;
}

.not-found a {
  display: inline-flex;
  padding: 0.6rem 1rem;
  border-radius: 0;
  background: #303632;
  color: #fff;
  font-weight: 600;
}

.not-found a:hover {
  background: #347abd;
}
</style>
