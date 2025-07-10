<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-lg">
      <div class="text-center">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">{{ company.companyName }}</h2>
          <p class="text-lg text-gray-600 mb-6">This is your company.</p>
          <button 
            @click="showLeaveModal = true"
            class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Leave Company
          </button>
        </div>
      </div>
    </div>
    
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
const { auth, company } = useUser()

const showLeaveModal = ref(false)
const showErrorModal = ref(false)
const errorTitle = ref('')
const errorMessage = ref('')


const handleLeaveCompany = () => {
  console.log('Leaving company')
  fetch(dbApi + '/data/users/' + auth.value.id, {
    method: 'PATCH',
    body: JSON.stringify({
        data: {
            id: auth.value.id,
            attributes: {
                company_id: null
            }
        }
    })
  }).then(res => {
    if(!res.ok){
      errorTitle.value = 'Failed to Leave Company'
      errorMessage.value = 'There was an error while trying to leave the company. Please try again.'
      showErrorModal.value = true
      throw new Error('Failed to leave company')
    }
    return res.json()
  }).then(() => {
    fetchCompany()
  }).catch(err => {
    console.error(err)
    if (!showErrorModal.value) {
      errorTitle.value = 'Network Error'
      errorMessage.value = 'Unable to connect to the server. Please check your internet connection and try again.'
      showErrorModal.value = true
    }
  })
}
</script>