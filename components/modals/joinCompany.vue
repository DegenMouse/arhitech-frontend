<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="emit('close')">
    <div class="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4" @click.stop>
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-semibold text-gray-800">Join Company</h3>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="companyCode" class="block text-sm font-medium text-gray-700 mb-2">
            Company Code
          </label>
          <input
            id="companyCode"
            v-model="companyCode"
            type="text"
            required
            placeholder="Enter company code"
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
            Join Company
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const dbApi = config.public.dbApi

const { auth } = useUser()

const emit = defineEmits(['close'])

const companyCode = ref('')
const error = ref(false)
const errorMessage = ref('')

const handleSubmit = () => {
  companyCode.value = companyCode.value.trim()
  if (isUUID(companyCode.value)) {
    error.value = false
    fetch(dbApi + '/data/users/' + auth.value.id, {
      method: 'PATCH',
      body: JSON.stringify({
          data: {
              id: auth.value.id,
              attributes: {
                  company_id: companyCode.value.trim()
              }
          }
      })
    }).then(res => {
      if(!res.ok){
        error.value = true
        errorMessage.value = 'Invalid company code'
      }
    }).then(() => {
      fetchCompany()
    }).then(()=>{
      emit('close')
    }).catch(err => {
      error.value = true
      errorMessage.value = 'Network error'
      console.error(err)
    })
  } else {
    error.value = true
    errorMessage.value = 'Please enter a valid code format'
  }
}
</script>
