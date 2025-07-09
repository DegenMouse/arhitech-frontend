<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>

    <div class="max-w-lg bg-white rounded-lg shadow p-6">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Profile Information</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600">Username</label>
            <div class="mt-1 text-gray-900">{{ profile.username }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">Email</label>
            <div class="mt-1 text-gray-900">{{ profile.email }}</div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Company Information</h2>
        <div v-if="company.isInCompany">
          <div class="text-gray-900">{{ company.companyName }}</div>
          <div class="text-sm text-gray-600">
            {{ company.isAdmin ? 'Administrator' : 'Member' }}
          </div>
        </div>
        <div v-else class="text-gray-600">
          Not currently part of any company
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { profile, company } = useUser()
</script>
