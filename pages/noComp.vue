<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div class="w-full max-w-lg">
          
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-8 text-center">
            <button @click="createCompany" class="w-full max-w-sm h-16 bg-gray-800 text-white text-lg font-semibold rounded-lg hover:bg-gray-700 transform hover:scale-102 transition-all duration-200 shadow-md hover:shadow-lg">
              Create Company
            </button>
          </div>
          
          <div class="bg-white rounded-xl shadow-lg p-8 text-center">
            <button @click="showJoinModal = true" class="w-full max-w-sm h-16 bg-gray-600 text-white text-lg font-semibold rounded-lg hover:bg-gray-500 transform hover:scale-102 transition-all duration-200 shadow-md hover:shadow-lg">
              Join Company
            </button>
          </div>
        </div>
      </div>
      
      <!-- Join Company Modal -->
      <ModalsJoinCompany v-if="showJoinModal"
        @close="showJoinModal = false"
      />
      
      <!-- Confirm Leave Company Modal -->
      <ModalsConfirm 
        v-if="showLeaveModal"
        title="Leave Company"
        message="Are you sure you want to leave this company? This action cannot be undone."
        confirm-text="Leave Company"
        @close="showLeaveModal = false"
        @confirm="handleLeaveCompany"
      />
      
      <!-- Error Modal -->
      <ModalsError 
        v-if="showErrorModal"
        :title="errorTitle"
        :message="errorMessage"
        @close="showErrorModal = false"
      />
    </div>
  </template>
    
  <script setup>
  // import JoinCompanyModal from '~/components/modals/join-company.vue'
  const dbApi = useRuntimeConfig().public.dbApi
  const { auth } = useUser()
  
  const showJoinModal = ref(false)
  const showLeaveModal = ref(false)
  const showErrorModal = ref(false)
  const errorTitle = ref('')
  const errorMessage = ref('')
  
  const createCompany = () => {
    navigateTo('/create-company')
  }
  
  </script>