<template>
  <div class="p-8 bg-gray-50 min-h-full flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Company Access
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Join or view your company
        </p>
      </div>

      <div v-if="!showJoinForm" class="space-y-4">
        <button
          @click="showJoinForm = true"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Join Company
        </button>

        <button
          @click="viewCompany"
          class="group relative w-full flex justify-center py-3 px-4 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          View Company
        </button>
      </div>

      <div v-if="showJoinForm" class="space-y-4">
        <div>
          <label for="company-code" class="block text-sm font-medium text-gray-700">
            Company Code
          </label>
          <input
            id="company-code"
            v-model="companyCode"
            type="text"
            required
            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Enter company code"
          />
        </div>

        <div class="flex space-x-3">
          <button
            @click="joinCompany"
            :disabled="!companyCode.trim()"
            class="flex-1 group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
          
          <button
            @click="showJoinForm = false"
            class="flex-1 group relative flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showJoinForm = ref(false)
const companyCode = ref('')

const joinCompany = async () => {
  if (!companyCode.value.trim()) return
  
  await navigateTo('/dashboard')
}

const viewCompany = async () => {
  await navigateTo('/dashboard')
}
</script>