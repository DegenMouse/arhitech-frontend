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
          <label for="companyName" class="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            id="companyName"
            v-model="formData.name"
            type="text"
            placeholder="Enter company name"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label for="companyEmail" class="block text-sm font-medium text-gray-700 mb-2">
            Company Email
          </label>
          <input
            id="companyEmail"
            v-model="formData.email"
            type="email"
            placeholder="Enter company email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="emit('close')"
            class="flex-1 px-4 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Company
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
    default: 'Create Company'
  }
})

const emit = defineEmits(['close', 'submit'])

const formData = reactive({
  name: '',
  email: ''
})

const handleSubmit = () => {
  emit('submit', {
    name: formData.name.trim(),
    email: formData.email.trim()
  })
}
</script>
