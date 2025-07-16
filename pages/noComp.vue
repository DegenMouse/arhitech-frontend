<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-lg">
        
      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-lg p-8 text-center">
          <button @click="showCreateModal = true" class="w-full max-w-sm h-16 bg-gray-800 text-white text-lg font-semibold rounded-lg hover:bg-gray-700 transform hover:scale-102 transition-all duration-200 shadow-md hover:shadow-lg">
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
    <ModalsInputField 
      v-if="showJoinModal"
      title="Join Company"
      label="Company Code"
      placeholder="Enter company code"
      submitText="Join Company"
      :validate="(value) => ({
        isValid: isUUID(value),
        errorMessage: 'Please enter a valid company code'
      })"
      @close="showJoinModal = false"
      @submit="handleJoinCompany"
    />

    <!-- Create Company Modal -->
    <ModalsLoggedoutCreateCompany 
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @submit="handleCreateCompany"
    />

    <ModalsError 
      v-if="error.show"
      :title="error.title"
      :message="error.message"
      @close="error.show = false"
    />

  </div>
</template>
    
<script setup>
// import JoinCompanyModal from '~/components/modals/join-company.vue'
const dbApi = useRuntimeConfig().public.dbApi
const { auth } = useUser()

const showJoinModal = ref(false)
const showCreateModal = ref(false)

const error = reactive({
  show: false,
  title: '',
  message: ''
})

const handleJoinCompany = async (companyCode) => {
  console.log("handleJoinCompany")
  
  await fetch(dbApi + '/data/users_in_company', {
    method: 'POST',
    body: JSON.stringify({
        data: {
            attributes: {
              user_id: auth.value.id,  
              company_id: companyCode
            }
        }
    })
  }).then(res => {
    if(!res.ok){
      error.title = 'Failed to Join Company'
      error.message = 'Invalid company code or server error'
      error.show = true
      throw new Error('Invalid company code or server error')
    }
    return res.json()
  }).then(() => {
    fetchCompany().then(() => {
      navigateTo('/companies')
    }).catch(err => {
      console.error(err)
      error.title = 'Error retrieving company'
      error.message = "This error might resolve with a page reload"
      error.show = true
    })
  }).catch(err => {
    error.title = 'Error'
    error.message = err.message
    error.show = true
    console.error(err)
  })

  
}

const handleCreateCompany = async (companyData) => {
  console.log("handleCreateCompany", companyData)
  
  fetch(dbApi + '/data/companies/', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        type: "companies",
        attributes: {
          id: "",
          name: companyData.name.trim(),
          email: companyData.email.trim(),
          userCreated: auth.value.id
        }
      }
    })
  }).then(res => {
    if(!res.ok){
      error.title = 'Failed to Create Company'
      error.message = 'Invalid company data or server error'
      error.show = true
      throw new Error('Invalid company data or server error')
    }
  }).then(() => {
    fetchCompany().then(() => {
      navigateTo('/companies')
    }).catch(err => {
      console.error(err)
      error.title = 'Error retrieving company'
      error.message = "This error might resolve with a page reload"
      error.show = true
    })
  }).catch(err => {
    error.title = 'Error'
    error.message = err.message
    error.show = true
    console.error(err)
  })
  showCreateModal.value = false
}
</script>