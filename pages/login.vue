<!--
  pages/login.vue
  ---------------
  Authentication page that handles both login and signup functionality.
  Features a toggle between login and signup modes with form validation.
  Uses FormData for login requests and JSON for signup requests.
  Stores JWT token in localStorage and redirects to home page on success.
  Includes error handling and user feedback for failed attempts.
-->
<template>
    <!-- Main authentication container with centered layout -->
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <!-- App branding and description -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">Welcome to ArhiTech</h1>
      </div>
      
      <!-- Authentication form with toggle between login/signup -->
      <form @submit.prevent="isSignUp ? handleSignUp() : handleLogin()" class="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <!-- Mode toggle buttons (Login/Sign Up) -->
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

        <!-- Name field (only shown for signup) -->
        <label v-if="isSignUp" class="block mb-4">
          <span class="text-gray-700">Name</span>
          <input
            v-model="name"
            type="text"
            required
            class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <!-- Email field (required for both modes) -->
        <label class="block mb-4">
          <span class="text-gray-700">Email</span>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>
  
        <!-- Password field (required for both modes) -->
        <label class="block mb-6">
          <span class="text-gray-700">Password</span>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>
  
        <!-- Error message display -->
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>
        <!-- Submit button (changes text based on mode) -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {{ isSignUp ? 'Sign Up' : 'Log In' }}
        </button>
        
        <!-- Mode toggle link -->
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
// Disable default layout for this page
definePageMeta({
 layout: false
})

// Get runtime configuration and user composable
const config = useRuntimeConfig()
const dbApi = config.public.dbApi
const { auth } = useUser()

// Reactive form state variables
const error = ref(false)
const isSignUp = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

/**
 * Handles user login by sending credentials to the API
 * Uses FormData for the request body and stores JWT on success
 */
function handleLogin() {
  if (email.value && password.value) {
    error.value = false

    // Create FormData for login request
    const formData = new FormData();
    formData.append("email", email.value);
    formData.append("password", password.value);

    // Send login request to API
    fetch(dbApi + '/auth/login/', {
      method: 'POST',
      body: formData
    }).then(res => {
      if(!res.ok){
        error.value = true
        errorMessage.value = 'Username or password is incorrect'
        throw new Error('Login failed')
      }
      return res.json()
    }).then(data => {
      if(data.jwt){
        // Store JWT token and trigger auth re-evaluation
        localStorage.setItem('jwt', data.jwt)
        auth.value.reEvalRequired = true
        navigateTo('/companies')
      } 
    }).catch(error => {console.error(error)})
  }else{
    // Show error if fields are empty
    error.value = true
    errorMessage.value = 'Please fill in all fields'
  }
}

/**
 * Handles user signup by creating a new user account
 * Uses JSON format for the request body and calls login after successful signup
 */
function handleSignUp() {
  if(name.value && email.value && password.value){
    error.value = false

    // Prepare signup request body in API format
    const requestBody = {
      data: {
        attributes: {
          id: "",
          username: name.value,
          email: email.value,
          password: password.value
        }
      }
    }
    
    // Send signup request to API
    fetch(dbApi + '/data/users', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    }).then(res => {
      if(!res.ok){
        error.value = true
        errorMessage.value = 'Sign up failed'
        throw new Error('Sign up failed')
      }
    }).then(() => { handleLogin() }).catch(error => { console.error("sign up error", error) })
  }else{
    // Show error if fields are empty
    error.value = true
    errorMessage.value = 'Please fill in all fields'
  }
}
</script>