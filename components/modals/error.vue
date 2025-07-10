<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="emit('close')">
    <div class="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4" @click.stop>
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-semibold text-red-600">{{title}}</h3>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="mb-8">
        <p class="text-gray-600">{{ message }}</p>
      </div>
      
      <div class="flex justify-end">
        <button
          @click="emit('close')"
          class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'An error occurred'
  },
  message: {
    type: String,
    default: 'Something went wrong. Please try again.'
  }
})

const emit = defineEmits(['close'])
</script> 