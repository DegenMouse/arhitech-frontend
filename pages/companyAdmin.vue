<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-lg">
      <div class="text-center">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Company Admin Panel</h2>
          <p class="text-gray-600 mb-6">Welcome to the admin dashboard for {{ company.companyName }}</p>
          
          <div class="space-y-4">
            <button 
              class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Members
            </button>
            
            <button 
              class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Company Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { company } = useUser()
</script>
