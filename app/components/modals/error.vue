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
  <!-- Enhanced modal overlay with improved backdrop -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="emit('close')">
    <!-- Enhanced modal content with modern design -->
    <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-md w-full mx-auto transform transition-all duration-200" @click.stop>
      <!-- Enhanced modal header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <!-- Error icon -->
          <div class="p-2 bg-red-100 rounded-xl">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-red-600">{{ displayTitle }}</h3>
        </div>
        <!-- Enhanced close button -->
        <button @click="emit('close')" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Enhanced error message content -->
      <div class="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
        <p class="text-red-800 leading-relaxed">{{ message }}</p>
      </div>
      
      <!-- Enhanced action button -->
      <div class="flex justify-end">
        <!-- Enhanced OK button -->
        <button
          @click="emit('close')"
          class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-105"
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