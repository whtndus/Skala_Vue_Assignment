<script setup>
import ReactiveRef from '@/components/practices/composition/ReactiveRef.vue'
import ReactiveReactive from '@/components/practices/composition/ReactiveReactive.vue'
import LifecycleParent from '@/components/practices/component/LifecycleParent.vue'
import PropsEmitsParent from '@/components/practices/component/PropsEmitsParent.vue'
import SlotDefaultParent from '@/components/practices/component/SlotDefaultParent.vue'
import SlotNamedParent from '@/components/practices/component/SlotNamedParent.vue'
import SlotScopedParent from '@/components/practices/component/SlotScopedParent.vue'
import StoreCounter from '@/components/practices/library/StoreCounter.vue'
import AxiosWeather from '@/components/practices/library/AxiosWeather.vue'
import AxiosJson from '@/components/practices/library/AxiosJson.vue'
</script>

<template>
  <div class="practice-container">
    <header class="practice-heading">
      <p>SKALA VUE PRACTICE</p>
      <h1>Vue 핵심 개념 실습</h1>
      <span>반응형 상태부터 컴포넌트 통신과 전역 상태 관리까지 한 화면에서 확인합니다.</span>
    </header>

    <h2 class="section-title">1. Reactive State</h2>
    <ReactiveRef />
    <ReactiveReactive />

    <h2 class="section-title">2. Component Lifecycle</h2>
    <LifecycleParent />

    <h2 class="section-title">3. Props &amp; Emits</h2>
    <PropsEmitsParent />

    <h2 class="section-title">4. Component Slot</h2>
    <SlotDefaultParent />
    <SlotNamedParent />
    <SlotScopedParent />

    <h2 class="section-title">5. Pinia Store</h2>
    <StoreCounter />

    <h2 class="section-title">7. Axios - 날씨 데이터 연동</h2>
    <AxiosWeather />
    <AxiosJson />
  </div>
</template>

<style scoped>
@import '@/assets/practice.css';

.practice-heading {
  margin-bottom: 2rem;
  padding: 1.75rem;
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(135deg, #42b883, #35495e);
}

.practice-heading p {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.practice-heading h1 {
  margin: 0 0 0.4rem;
  color: #fff;
}

.practice-heading span {
  font-size: 0.9rem;
  opacity: 0.9;
}

.section-title {
  margin: 2.5rem 0 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 3px solid #42b883;
  color: #1a252f;
  font-size: 1.5rem;
}
</style>
