<template>
  <div v-if="!auth.isLoggedIn" class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Welcome</h1>
      <p class="text-gray-600 mb-8">Please log in to access your dashboard</p>
      <NuxtLink 
        to="/login" 
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go to Login
      </NuxtLink>
    </div>
  </div>
  
  <div v-else class="p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">This is your Dashboard</h1>
    <p class="text-gray-600">Welcome back! You are successfully logged in.</p>
  </div>
</template>

<script setup>
const { auth } = useUser()
</script>