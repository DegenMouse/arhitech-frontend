<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Welcome to MyApp</h1>
        <p class="text-gray-600 mt-2">Simple login page built with Nuxt 3</p>
      </div>
      
      <form @submit.prevent="isSignUp ? handleSignUp() : handleLogin()" class="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <div class="mb-4">
          <div class="flex rounded-lg border border-gray-300">
            <button 
              type="button"
              @click="isSignUp = false" 
              :class="!isSignUp ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
              class="flex-1 py-2 px-4 rounded-l-lg transition"
            >
              Log In
            </button>
            <button 
              type="button"
              @click="isSignUp = true" 
              :class="isSignUp ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
              class="flex-1 py-2 px-4 rounded-r-lg transition"
            >
              Sign Up
            </button>
          </div>
        </div>

        <label v-if="isSignUp" class="block mb-4">
          <span class="text-gray-700">Name</span>
          <input
            v-model="name"
            type="text"
            required
            class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

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
  
        <p v-if="notAuth" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {{ isSignUp ? 'Sign Up' : 'Log In' }}
        </button>
        
        <button 
          type="button"
          @click="isSignUp = !isSignUp"
          class="w-full mt-3 text-sm text-gray-600 hover:text-gray-800 transition"
        >
          {{ isSignUp ? 'Already have an account? Log in' : 'No account? Create one' }}
        </button>
      </form>
    </div>
</template>
  
<script setup>
definePageMeta({
 layout: false
})

const config = useRuntimeConfig()

const notAuth = ref(false)
const isSignUp = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('Username or password is incorrect')

function handleLogin() {
  console.log('handleLogin called')
  if (email.value && password.value) {
    notAuth.value = false

    const apiUrl = config.public.apiUrl
    console.log('Logging in with', email.value, password.value)

    const formData = new FormData();
    formData.append("email", email.value);
    formData.append("password", password.value);

    fetch(apiUrl + '/auth/login/', {
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
        
        navigateTo('/')
      } 
      
    }).catch(error => {
      console.error(error)
    })
  }
}

function handleSignUp() {
  console.log('handleSignUp called', {name: name.value, email: email.value, password: password.value})
  if (name.value && email.value && password.value) {
    const apiUrl = config.public.apiUrl
    console.log('Signing up with', name.value, email.value, password.value)
    
    const requestBody = {
      data: {
        attributes: {
          id: "",
          name: name.value,
          email: email.value,
          password: password.value
        }
      }
    }
    
    fetch(apiUrl + '/data/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }).then(res => {
      if(!res.ok){
        notAuth.value = true
        errorMessage.value = 'Sign up failed'
        throw new Error('Sign up failed')
      }
      return res.json()
    }).then(data => {
      console.log(data)
      // After successful signup, automatically log in
      handleLogin()
    }).catch(error => {
      console.error(error)
    })
  }
}
</script>