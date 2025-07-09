<template>
  <div class="p-8">
    {{ company.value?.isInCompany ?? 'not found' }}
    <!-- <div v-if="isInCompany">
      <h2 class="text-3xl font-semibold text-gray-800 mb-4">{{ company.companyName }}</h2>
      <p class="text-gray-600 mb-6">This is your company.</p>
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
    </div> -->
  </div>
</template>
  
<script setup>
const { company } = useUser()
// const isInCompany = ref(company.value.isInCompany)
// console.log("isInCompany.value")
// console.log(isInCompany.value)

  
  
// const createCompany = () => {
// navigateTo('/create-company')
// }

// const joinCompany = () => {
// navigateTo('/join-company')
// }
</script>