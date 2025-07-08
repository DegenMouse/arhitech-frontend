<template>
  <div class="p-8">
    <div v-if="hasCompany">
      <h2 class="text-3xl font-semibold text-gray-800 mb-4">Welcome to your dashboard!</h2>
      <p class="text-gray-600">You're now logged in and can manage your company.</p>
    </div>
    
    <div v-else class="max-w-md">
      <h2 class="text-3xl font-semibold text-gray-800 mb-4">No Company Found</h2>
      <p class="text-gray-600 mb-6">You need to be part of a company to use the dashboard.</p>
      
      <div class="space-y-4">
        <button @click="createCompany" class="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Create Company
        </button>
        <button @click="joinCompany" class="w-full p-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
          Join Company
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const hasCompany = ref(true)

onMounted(() => {
  const companyName = localStorage.getItem('company_name')
  hasCompany.value = !!companyName
})

const createCompany = () => {
  navigateTo('/create-company')
}

const joinCompany = () => {
  navigateTo('/join-company')
}
</script>