<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="emit('close')">
    <div class="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4" @click.stop>
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-semibold text-gray-800">{{ title }}</h3>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="input" class="block text-sm font-medium text-gray-700 mb-2">
            {{ label }}
          </label>
          <input
            id="input"
            v-model="inputValue"
            type="text"
            required
            :placeholder="placeholder"
            :class="[
              'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              error ? 'border-red-500' : 'border-gray-300'
            ]"
          />
          <p v-if="error" class="text-red-500 text-sm mt-2">
            {{ errorMessage }}
          </p>
        </div>
        
        <div class="flex gap-3">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ submitText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
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

const emit = defineEmits(['close', 'submit'])

const inputValue = ref('')
const error = ref(false)
const errorMessage = ref('')

const handleSubmit = () => {
  const trimmedValue = inputValue.value.trim()
  
  if (!trimmedValue) {
    error.value = true
    errorMessage.value = 'This field is required'
    return
  }
  
  if (!props.validate) {
    error.value = false
    emit('submit', trimmedValue)
    emit('close')
    return
  }
  const validation = props.validate(trimmedValue)
  
  if (validation.isValid) {
    error.value = false
    emit('submit', trimmedValue)
    emit('close')
  } else {
    error.value = true
    errorMessage.value = validation.errorMessage || 'Invalid input'
  }
}
</script>
