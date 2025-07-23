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
  <!-- Modal overlay with click-outside-to-close -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="emit('close')">
    <!-- Modal content container with click stop propagation -->
    <div class="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4" @click.stop>
      <!-- Modal header with title and close button -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-semibold text-gray-800">{{ title }}</h3>
        <!-- Close button with X icon -->
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Confirmation message -->
      <div class="mb-8">
        <p class="text-gray-600">{{ message }}</p>
      </div>
      
      <!-- Action buttons -->
      <div class="flex gap-3">
        <!-- Cancel button -->
        <button
          @click="emit('close')"
          class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <!-- Confirm button with customizable text -->
        <button
          @click="handleConfirm"
          class="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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