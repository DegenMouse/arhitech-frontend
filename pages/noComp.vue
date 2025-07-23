<!--
  pages/noComp.vue
  ---------------
  Company selection page for users who are not currently part of any company.
  Provides options to either create a new company or join an existing one.
  Features two main action buttons with modal forms for each option.
  Handles company creation and joining with proper validation and error handling.
  Redirects to company dashboard after successful company association.
-->
<template>
  <!-- Main company selection container with centered layout -->
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-lg">
        
      <!-- Company action buttons container -->
      <div class="space-y-6">
        <!-- Create company button card -->
        <div class="bg-white rounded-xl shadow-lg p-8 text-center">
          <button @click="showCreateModal = true" class="w-full max-w-sm h-16 bg-gray-800 text-white text-lg font-semibold rounded-lg hover:bg-gray-700 transform hover:scale-102 transition-all duration-200 shadow-md hover:shadow-lg">
            Create Company
          </button>
        </div>
        
        <!-- Join company button card -->
        <div class="bg-white rounded-xl shadow-lg p-8 text-center">
          <button @click="showJoinModal = true" class="w-full max-w-sm h-16 bg-gray-600 text-white text-lg font-semibold rounded-lg hover:bg-gray-500 transform hover:scale-102 transition-all duration-200 shadow-md hover:shadow-lg">
            Join Company
          </button>
        </div>
      </div>
    </div>
    
    <!-- Join company modal with UUID validation -->
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

    <!-- Create company modal -->
    <ModalsLoggedoutCreateCompany 
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @submit="handleCreateCompany"
    />

    <!-- Error display modal -->
    <ModalsError 
      v-if="error.show"
      :title="error.title"
      :message="error.message"
      @close="error.show = false"
    />

  </div>
</template>
    
<script setup>
// Get runtime configuration and user data
const dbApi = useRuntimeConfig().public.dbApi
const { auth } = useUser()

// Modal state management
const showJoinModal = ref(false) // Modal for joining existing company
const showCreateModal = ref(false) // Modal for creating new company

// Error modal state
const error = reactive({
  show: false,
  title: '',
  message: ''
})

/**
 * Handles joining an existing company using a company code
 * Validates the company code and creates user-company relationship
 */
const handleJoinCompany = async (companyCode) => {
  console.log("handleJoinCompany")
  
  // Create user-company relationship
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
    // Fetch company data and navigate to company dashboard
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

/**
 * Handles creating a new company
 * Creates company record and associates current user as creator
 */
const handleCreateCompany = async (companyData) => {
  console.log("handleCreateCompany", companyData)
  
  // Create new company record
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
    // Fetch company data and navigate to company dashboard
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