<!--
  components/modals/error.vue
  --------------------------
  Error notification modal component for displaying error messages to users.
  Features customizable title and message with red styling for error indication.
  Includes click-outside-to-close functionality and responsive design.
  Used throughout the application for consistent error handling and user feedback.
  Provides simple OK button for dismissal and proper error state styling.
-->
<template>
  <!-- Modal overlay with click-outside-to-close -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="emit('close')">
    <!-- Modal content container with click stop propagation -->
    <div class="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4" @click.stop>
      <!-- Modal header with error title and close button -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-semibold text-red-600">{{displayTitle}}</h3>
        <!-- Close button with X icon -->
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Error message content -->
      <div class="mb-8">
        <p class="text-gray-600">{{ message }}</p>
      </div>
      
      <!-- Action button -->
      <div class="flex justify-end">
        <!-- OK button for dismissing error -->
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
// Component props for error customization
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

// Component events
const emit = defineEmits(['close'])

// Computed property to handle null/empty title fallback
const displayTitle = computed(() => {
  return !props.title || props.title.trim() === '' ? 'An error occurred' : props.title
})
</script> 