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
  <!-- Main member dashboard container with improved design -->
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Enhanced header section with better spacing and typography -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <div>
          <h1 class="text-4xl font-light text-gray-900 mb-2">{{ company.companyName }}</h1>
          <p class="text-gray-600 font-medium">Member Dashboard</p>
        </div>
      </div>
      
      <!-- Enhanced main dashboard content area -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
        <div class="text-center">
          <!-- Welcome section with icon -->
          <div class="mb-8">
            <div class="w-20 h-20 bg-[#0743ae]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h2 class="text-3xl font-medium text-gray-900 mb-4">Welcome Back!</h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">You're part of <span class="font-semibold text-[#0743ae]">{{ company.companyName }}</span>. Your projects and tasks will appear here as they're assigned to you.</p>
          </div>

          <!-- Status card -->
          <div class="bg-gradient-to-r from-[#0743ae]/5 to-blue-50 rounded-2xl p-8 border border-[#0743ae]/10">
            <div class="flex items-center justify-center mb-4">
              <div class="p-3 bg-[#0743ae]/10 rounded-xl">
                <svg class="w-6 h-6 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">All Set!</h3>
            <p class="text-gray-600">Your company administrator will assign projects and tasks that will appear on this dashboard. Check back regularly for updates.</p>
          </div>

          <!-- Additional info section -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-xl p-6 text-left">
              <div class="flex items-center mb-3">
                <div class="p-2 bg-green-100 rounded-lg mr-3">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900">Stay Connected</h4>
              </div>
              <p class="text-sm text-gray-600">Keep in touch with your team and stay updated on project developments.</p>
            </div>
            
            <div class="bg-gray-50 rounded-xl p-6 text-left">
              <div class="flex items-center mb-3">
                <div class="p-2 bg-blue-100 rounded-lg mr-3">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h4 class="font-medium text-gray-900">Be Ready</h4>
              </div>
              <p class="text-sm text-gray-600">When projects are assigned, you'll be able to manage documents and track progress here.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Leave company section moved to bottom -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">Company Settings</h3>
            <p class="text-sm text-gray-600">Manage your company membership</p>
          </div>
          <!-- Smaller, less prominent leave company button -->
          <button 
            @click="handleLeaveCompany"
            class="px-4 py-2 text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Leave Company
          </button>
        </div>
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
  }
}

</script>
