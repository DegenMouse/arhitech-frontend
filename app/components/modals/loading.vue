<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="w-16 h-16 bg-[#0743ae]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-[#0743ae] animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h2 class="text-xl font-medium text-gray-900 mb-2">{{ title }}</h2>
      <p class="text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Loading'
  },
  message: {
    type: String,
    default: 'Please wait...'
  }
})
</script>

