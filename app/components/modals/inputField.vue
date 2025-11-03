<!--
  components/modals/inputField.vue
  -------------------------------
  Generic input field modal component for collecting user input with validation.
  Features customizable title, label, placeholder, and submit button text.
  Includes built-in validation support with custom validation functions.
  Provides error handling and display with form validation feedback.
  Used for various input scenarios like joining companies with codes.
  Includes click-outside-to-close functionality and responsive design.
-->
<template>
  <!-- Enhanced modal overlay with improved backdrop -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="emit('close')">
    <!-- Enhanced modal content with modern design -->
    <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-md w-full mx-auto transform transition-all duration-200" @click.stop>
      <!-- Enhanced modal header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <!-- Input icon -->
          <div class="p-2 bg-[#0743ae]/10 rounded-xl">
            <svg class="w-6 h-6 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
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
      
      <!-- Enhanced input form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Enhanced input field container -->
        <div>
          <label for="input" class="block text-sm font-medium text-gray-700 mb-2">
            {{ label }}
          </label>
          <!-- Enhanced input field with improved styling -->
          <input
            id="input"
            v-model="inputValue"
            type="text"
            required
            :placeholder="placeholder"
            :class="[
              'w-full px-4 py-3 border-2 rounded-xl transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-offset-2',
              error 
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 bg-white focus:border-[#0743ae] focus:ring-[#0743ae] hover:border-gray-300'
            ]"
          />
          <!-- Enhanced error message display -->
          <div v-if="error" class="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm flex items-center">
              <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ errorMessage }}
            </p>
          </div>
        </div>
        
        <!-- Enhanced form action buttons -->
        <div class="flex gap-3">
          <!-- Enhanced cancel button -->
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-medium transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Cancel
          </button>
          <!-- Enhanced submit button -->
          <button
            type="submit"
            class="flex-1 px-6 py-3 bg-[#0743ae] hover:bg-[#0743ae]/90 text-white rounded-xl font-medium transition-all duration-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0743ae] focus:ring-offset-2 transform hover:scale-105"
          >
            {{ submitText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Component props for customization
const props = defineProps({
  title: {
    type: String,
    default: 'Enter Value'
  },
  label: {
    type: String,
    default: 'Value'
  },
  placeholder: {
    type: String,
    default: 'Enter value'
  },
  submitText: {
    type: String,
    default: 'Submit'
  },
  validate: {
    type: Function,
    default: () => ({ isValid: true, errorMessage: '' })
  }
})

// Component events
const emit = defineEmits(['close', 'submit'])

// Reactive form state
const inputValue = ref('')
const error = ref(false)
const errorMessage = ref('')

/**
 * Handles form submission with validation
 * Performs required field check and custom validation if provided
 * Emits submit event with trimmed value on success
 */
const handleSubmit = () => {
  const trimmedValue = inputValue.value.trim()
  
  // Check for required field
  if (!trimmedValue) {
    error.value = true
    errorMessage.value = 'This field is required'
    return
  }
  
  // Handle case where no custom validation is provided
  if (!props.validate) {
    error.value = false
    emit('submit', trimmedValue)
    emit('close')
    return
  }
  
  // Perform custom validation
  const validation = props.validate(trimmedValue)
  
  if (validation.isValid) {
    // Validation passed - emit submit and close
    error.value = false
    emit('submit', trimmedValue)
    emit('close')
  } else {
    // Validation failed - show error message
    error.value = true
    errorMessage.value = validation.errorMessage || 'Invalid input'
  }
}
</script>
