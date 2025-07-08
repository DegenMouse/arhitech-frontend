<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold mb-4">Join Company</h2>
    <p class="text-gray-600 mb-6">Enter the company ID to join a company</p>
    
    <div class="max-w-sm">
      <label class="block mb-2 text-sm font-medium text-gray-700">Company ID</label>
      <input 
        v-model="companyId" 
        type="text"
        class="w-full p-3 border border-gray-300 rounded mb-4" 
        placeholder="Enter company ID"
        required
      >
      
      <div class="flex gap-2">
        <button 
          @click="joinCompany" 
          :disabled="!companyId.trim()" 
          class="flex-1 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Join Company
        </button>
        <button 
          @click="goBack" 
          class="flex-1 p-3 border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
      
      <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
      <p v-if="success" class="text-green-500 text-sm mt-4">Successfully joined company!</p>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const companyId = ref('')
const error = ref('')
const success = ref(false)

const joinCompany = async () => {
  if (!companyId.value.trim()) return
  
  const userId = localStorage.getItem('id')
  const jwt = localStorage.getItem('jwt')
  
  if (!userId || !jwt) {
    error.value = 'User not authenticated'
    return
  }
  
  const requestBody = {
    data: {
      id: userId,
      type: "users",
      attributes: {
        company_id: companyId.value.trim()
      }
    }
  }
  
  try {
    const response = await fetch(`${config.public.apiUrl}/data/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(requestBody)
    })
    
    if (!response.ok) {
      throw new Error('Failed to join company')
    }
    
    // Fetch company name and update localStorage
    const companyResponse = await fetch(`${config.public.apiUrl}/data/users/${userId}/company_id`, {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    })
    
    if (companyResponse.ok) {
      const companyData = await companyResponse.json()
      if (companyData.data && companyData.data.attributes && companyData.data.attributes.name) {
        localStorage.setItem('company_name', companyData.data.attributes.name)
      }
    }
    
    success.value = true
    error.value = ''
    
    // Redirect to dashboard after 1 second
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 1000)
    
  } catch (err) {
    error.value = err.message || 'Failed to join company'
    success.value = false
  }
}

const goBack = () => {
  navigateTo('/dashboard')
}
</script>