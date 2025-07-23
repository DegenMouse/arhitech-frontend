<!--
  pages/account.vue
  ----------------
  User account settings page that displays profile information and company details.
  Shows username, email, company membership status, and admin role if applicable.
  Read-only display of user data from the useUser composable.
  Provides a clean interface for users to view their account information.
-->
<template>
  <!-- Main account page container -->
  <div class="p-8">
    <!-- Page header -->
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>

    <!-- Account information card -->
    <div class="max-w-lg bg-white rounded-lg shadow p-6">
      <!-- Profile information section -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Profile Information</h2>
        <div class="space-y-4">
          <!-- Username display -->
          <div>
            <label class="block text-sm font-medium text-gray-600">Username</label>
            <div class="mt-1 text-gray-900">{{ profile.username }}</div>
          </div>
          <!-- Email display -->
          <div>
            <label class="block text-sm font-medium text-gray-600">Email</label>
            <div class="mt-1 text-gray-900">{{ profile.email }}</div>
          </div>
        </div>
      </div>

      <!-- Company information section -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Company Information</h2>
        <!-- Show company details if user is in a company -->
        <div v-if="company.isInCompany">
          <div class="text-gray-900">{{ company.companyName }}</div>
          <div class="text-sm text-gray-600">
            {{ company.isAdmin ? 'Administrator' : 'Member' }}
          </div>
        </div>
        <!-- Show message if user is not in a company -->
        <div v-else class="text-gray-600">
          Not currently part of any company
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Get user profile and company data from the user composable
const { profile, company } = useUser()
</script>
