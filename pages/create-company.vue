<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold mb-4">Create Company</h2>
    <p class="text-gray-600 mb-6">Enter company details to create a new company</p>
    
    <div class="max-w-sm">
      <label class="block mb-2 text-sm font-medium text-gray-700">Company Name</label>
      <input 
        v-model="companyName" 
        type="text"
        class="w-full p-3 border border-gray-300 rounded mb-4" 
        placeholder="Enter company name"
        required
      >
      
      <label class="block mb-2 text-sm font-medium text-gray-700">Company Email</label>
      <input 
        v-model="companyEmail" 
        type="email"
        class="w-full p-3 border border-gray-300 rounded mb-4" 
        placeholder="Enter company email"
        required
      >
      
      <div class="flex gap-2">
        <button 
          @click="createCompany" 
          :disabled="!canCreate" 
          class="flex-1 p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Company
        </button>
        <button 
          @click="goBack" 
          class="flex-1 p-3 border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
      
      <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
      <p v-if="success" class="text-green-500 text-sm mt-4">Successfully created company!</p>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const companyName = ref('')
const companyEmail = ref('')
const error = ref('')
const success = ref(false)

const canCreate = computed(() => {
  return companyName.value.trim() && companyEmail.value.trim()
})

const createCompany = async () => {
  if (!canCreate.value) return
  
  const jwt = localStorage.getItem('jwt')
  
  if (!jwt) {
    error.value = 'User not authenticated'
    return
  }
  
  const requestBody = {
    data: {
      type: "companies",
      attributes: {
        id: "",
        name: companyName.value.trim(),
        email: companyEmail.value.trim()
      }
    }
  }
  
  try {
    const response = await fetch(`${config.public.apiUrl}/data/companies/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify(requestBody)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to create company: ${response.status} ${errorText}`)
    }
    
    const responseText = await response.text()
    let data = {}
    
    if (responseText) {
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.log('Response is not JSON:', responseText)
        data = { success: true }
      }
    } else {
      data = { success: true }
    }
    
    // Store company info in localStorage
    if (data.data && data.data.attributes) {
      localStorage.setItem('company_name', data.data.attributes.name)
      if (data.data.id) {
        localStorage.setItem('company_id', data.data.id)
      }
    }
    
    success.value = true
    error.value = ''
    
    // Redirect to dashboard after 1 second
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 1000)
    
  } catch (err) {
    error.value = err.message || 'Failed to create company'
    success.value = false
  }
}

const goBack = () => {
  navigateTo('/dashboard')
}
</script>