<!--
  components/modals/confirm.vue
  ----------------------------
  Generic confirmation modal component for user action confirmations.
  Features customizable title, message, and confirm button text.
  Used for confirming destructive actions like deletions or leaving companies.
  Includes click-outside-to-close functionality and responsive design.
  Emits confirm and close events for parent component handling.
  Provides consistent confirmation UI across the application.
-->
<template>
  <!-- Enhanced modal overlay with improved backdrop -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="emit('close')">
    <!-- Enhanced modal content with modern design -->
    <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-md w-full mx-auto transform transition-all duration-200" @click.stop>
      <!-- Enhanced modal header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <!-- Warning icon for confirmation -->
          <div class="p-2 bg-orange-100 rounded-xl">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
        </div>
        <!-- Enhanced close button -->
        <button @click="emit('close')" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Enhanced confirmation message -->
      <div class="mb-8 bg-gray-50 rounded-xl p-4">
        <p class="text-gray-700 leading-relaxed">{{ message }}</p>
      </div>
      
      <!-- Enhanced action buttons -->
      <div class="flex gap-3">
        <!-- Enhanced cancel button -->
        <button
          @click="emit('close')"
          class="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-medium transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
        >
          Cancel
        </button>
        <!-- Enhanced confirm button -->
        <button
          @click="handleConfirm"
          class="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-105"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component props for customization
const props = defineProps({
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  }
})

// Component events
const emit = defineEmits(['close', 'confirm'])

/**
 * Handles confirmation by emitting confirm event and closing modal
 * Ensures both events are triggered for proper parent handling
 */
const handleConfirm = () => {
  emit('confirm')
  emit('close')
}
</script> 