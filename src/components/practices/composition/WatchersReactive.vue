<script setup>
import { reactive, ref, watch } from 'vue'

const product = reactive({ name: '노트북', price: 1000 })
const objectLog = ref('reactive 객체를 통째로 감시합니다.')
const priceLog = ref('특정 속성을 getter로 감시합니다.')

watch(product, (newProduct, oldProduct) => {
  objectLog.value = `객체 감지: old ${oldProduct.price} / new ${newProduct.price}`
})

watch(
  () => product.price,
  (newPrice, oldPrice) => {
    priceLog.value = `가격 감지: ${oldPrice}원 → ${newPrice}원`
  },
)
</script>

<template>
  <div class="practice-section">
    <h2>reactive 데이터 watch()</h2>
    <p>{{ product.name }} · {{ product.price }}원</p>
    <button @click="product.price += 500">가격 500원 증가</button>
    <p>{{ objectLog }}</p>
    <p>{{ priceLog }}</p>
  </div>
</template>
