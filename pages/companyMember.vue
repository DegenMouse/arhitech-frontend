<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header with company name and leave button -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">{{ company.companyName }}</h1>
        <button 
          @click="showLeaveModal = true"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Leave Company
        </button>
      </div>
      
      <!-- Main content area -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <p class="text-gray-600">Welcome to your company dashboard.</p>
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
      v-if="error.show"
      :title="error.title"
      :message="error.message"
      @close="error.show = false"
    />
  </div>
</template>

<script setup>
const dbApi = useRuntimeConfig().public.dbApi
const { auth, company } = useUser()

const showLeaveModal = ref(false)

const error = reactive({
  show: false,
  title: '',
  message: ''
})


const handleLeaveCompany = async () => {
  console.log('Leaving company')
  await fetch(dbApi + '/data/users/' + auth.value.id, {
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
      error.title = 'Failed to Leave Company'
      error.message = 'There was an error while trying to leave the company. Please try again.'
      error.show = true
      throw new Error('Failed to leave company')
    }
    return res.json()
  }).then(() => {
    fetchCompany().then(() => {
      navigateTo('/noComp')
    }).catch(err => {
      console.error('Failed to fetch company:', err)
      error.title = 'Error retrieving company'
      error.message = "This error might resolve with a page reload"
      error.show = true
      throw new Error('Failed to fetch company')
    })
  }).catch(err => {
    console.error(err)
    if (!error.show) {
      error.title = 'Network Error'
      error.message = 'Unable to connect to the server. Please check your internet connection and try again.'
      error.show = true
    }
  })

  
}
</script>
