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
  
        <p v-if="notAuth" class="text-red-500 text-sm mb-4">Username or password is incorrect</p>
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
  // import { useRouter } from 'vue-router'

  const config = useRuntimeConfig()

  const notAuth = ref(false)
  const email = ref('')
  const password = ref('')
  // const router = useRouter()
  
  function handleLogin() {
    // Placeholder logic
    if (email.value && password.value) {
      
      const apiUrl = config.public.apiUrl
      console.log('Logging in with', email.value, password.value)
      console.log(apiUrl + '/auth/login')

      const formData = new FormData();
      formData.append("email", email.value);
      formData.append("password", password.value);

      fetch(apiUrl + '/auth/login', {
        method: 'POST',
        body: formData
      }).then(res => {
        if(!res.ok){
          notAuth.value = true
          throw new Error('Login failed')
        }
        return res.json()
      }).then(data => {
        console.log(data)

        if(data.jwt){
          localStorage.setItem('jwt', data.jwt)
          const decodedJwt = JSON.parse(atob(data.jwt.split('.')[1]))
          localStorage.setItem('email', decodedJwt.email)
          localStorage.setItem('id', decodedJwt.id)
          navigateTo('/join-company')
        } 
        
      }).catch(error => {
        console.error(error)
      })
    }
  }
  </script>
  