<!--
  pages/index.vue
  ----------------
  Landing/dashboard page that serves as the entry point for the application.
  Shows a welcome screen for unauthenticated users with a login link.
  For authenticated users, displays a simple dashboard welcome message.
  Uses conditional rendering based on authentication status.
-->
<template>
  <!-- Show login prompt for unauthenticated users -->
  <div v-if="!auth.isLoggedIn" class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Welcome</h1>
      <p class="text-gray-600 mb-8">Please log in to access your dashboard</p>
      <!-- Login navigation link -->
      <NuxtLink 
        to="/login" 
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go to Login
      </NuxtLink>
    </div>
      </div>
  
  <!-- Show dashboard for authenticated users -->
  <div v-else class="p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">This is your Dashboard</h1>
    <p class="text-gray-600">Welcome back! You are successfully logged in.</p>
    </div>
  </template>
  
  <script setup>
// Get authentication state from the user composable
const { auth } = useUser()
  </script>