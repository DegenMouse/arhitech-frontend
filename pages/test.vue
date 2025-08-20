<template>
  <button @click="test" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Click me!
  </button>
</template>

<script setup>
const { error, success } = useUI()
const test = () => {
  success.value.message = 'test'
  // error.value.show = true
}
</script>
