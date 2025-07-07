<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Welcome to MyApp</h1>
        <p class="text-gray-600 mt-2">Simple login page built with Nuxt 3</p>
      </div>
  
      <form @submit.prevent="handleLogin" class="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <label class="block mb-4">
          <span class="text-gray-700">Email</span>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>
  
        <label class="block mb-6">
          <span class="text-gray-700">Password</span>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>
  
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const password = ref('')
  const router = useRouter()
  
  function handleLogin() {
    // Placeholder logic
    if (email.value && password.value) {
      console.log('Logging in with', email.value, password.value)
  
      // In a real app, you'd make an API call here.
      // Simulate redirect after "login"
      router.push('/join-company')
    }
  }
  </script>
  