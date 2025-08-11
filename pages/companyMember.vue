<!--
  pages/companyMember.vue
  ----------------------
  Company member dashboard page for non-admin users who are part of a company.
  Provides a simplified interface compared to the admin dashboard.
  Features company information display and leave company functionality.
  Uses the same leave company logic as the admin page but with different messaging.
  Serves as a basic dashboard for regular company members.
-->
<template>
  <!-- Main member dashboard container -->
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header section with company name and leave option -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">{{ company.companyName }}</h1>
        <!-- Leave company button -->
        <button 
          @click="handleLeaveCompany"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Leave Company
        </button>
      </div>
      
      <!-- Main dashboard content area -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <p class="text-gray-600">Welcome to your company dashboard.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Get company data from user composable
const { company } = useUser()
const { confirm } = useConfirm()
const { error, success } = useUI()

/**
 * Handles leaving the company using the leaveCompany composable
 * Navigates to noComp page on success
 */
const handleLeaveCompany = async () => {
  const ok = await confirm("Are you sure you want to leave this company? This action cannot be undone.")
  if(!ok) return
  
  try{
    await leaveCompany()
    navigateTo('/noComp')
  }catch(err){
    console.error('Failed to leave company:', err)
    error.value.message = 'Unable to leave company. Please check your internet connection and try again.'
    error.value.show = true
  }
}

</script>
