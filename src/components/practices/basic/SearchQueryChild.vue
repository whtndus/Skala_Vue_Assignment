<script setup>
defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="child-field">자식 컴포넌트 입력<input :value="modelValue" type="text" @input="emit('update:modelValue', $event.target.value)" /></label>
</template>

<style scoped>
.child-field {
  display: grid;
  gap: 0.45rem;
  font-size: 0.78rem;
  font-weight: 700;
}
.child-field input {
  width: 100%;
}
</style>
