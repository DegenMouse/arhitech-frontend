<!--
  pages/account.vue
  ----------------
  User account settings page that displays profile information and company details.
  Shows username, email, company membership status, and admin role if applicable.
  Read-only display of user data from the useUser composable.
  Provides a clean interface for users to view their account information.
-->
<template>
  <!-- Enhanced account page container with modern design -->
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Enhanced page header -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-[#0743ae]/10 rounded-xl">
            <svg class="w-8 h-8 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-medium text-gray-900 mb-1">Account Settings</h1>
            <p class="text-gray-600">Manage your profile and account preferences</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Enhanced profile information card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div class="flex items-center space-x-3 mb-6">
            <div class="p-2 bg-[#0743ae]/10 rounded-xl">
              <svg class="w-6 h-6 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">Profile Information</h2>
          </div>
          
          <div class="space-y-6">
            <!-- Enhanced username display -->
            <div class="bg-gray-50 rounded-xl p-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">Username</label>
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-white rounded-lg">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div class="text-gray-900 font-medium">{{ profile.username || 'Not set' }}</div>
              </div>
            </div>
            
            <!-- Enhanced email display -->
            <div class="bg-gray-50 rounded-xl p-4">
              <label class="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-white rounded-lg">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div class="text-gray-900 font-medium">{{ profile.email || 'Not set' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced company information card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div class="flex items-center space-x-3 mb-6">
            <div class="p-2 bg-[#0743ae]/10 rounded-xl">
              <svg class="w-6 h-6 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">Company Information</h2>
          </div>
          
          <!-- Show company details if user is in a company -->
          <div v-if="company.isInCompany" class="space-y-4">
            <div class="bg-[#0743ae]/5 rounded-xl p-4 border border-[#0743ae]/10">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-[#0743ae]/10 rounded-lg">
                    <svg class="w-4 h-4 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900">{{ company.companyName }}</div>
                    <div class="text-sm text-gray-600">{{ company.isAdmin ? 'Administrator' : 'Member' }}</div>
                  </div>
                </div>
                <div class="px-3 py-1 bg-[#0743ae]/20 text-[#0743ae] rounded-full text-xs font-medium">
                  Active
                </div>
              </div>
              <div class="text-sm text-gray-600">
                You have {{ company.isAdmin ? 'full administrative access' : 'member access' }} to this company's projects and resources.
              </div>
            </div>
          </div>
          
          <!-- Show message if user is not in a company -->
          <div v-else class="text-center py-8">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No Company</h3>
            <p class="text-gray-600 mb-4">You're not currently part of any company. Join or create one to get started.</p>
            <NuxtLink to="/noComp" class="inline-flex items-center px-4 py-2 bg-[#0743ae] text-white rounded-xl hover:bg-[#0743ae]/90 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Get Started
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Get user profile and company data from the user composable
const { profile, company } = useUser()
</script>
