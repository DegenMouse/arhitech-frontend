<!--
  pages/login.vue
  ---------------
  Enhanced authentication page with modern UI design and improved user experience.
  Features a sleek toggle between login and signup modes with professional styling.
  Uses FormData for login requests and JSON for signup requests.
  Stores JWT token in localStorage and redirects to dashboard on success.
  Includes comprehensive error handling and visual feedback for users.
-->
<template>
  <!-- Enhanced main authentication container with gradient background -->
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="w-full max-w-md">
      <!-- Enhanced app branding section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-[#0743ae] rounded-2xl mb-4">
          <div class="text-white text-3xl font-bold bonbance-font">A</div>
        </div>
        <h1 class="text-3xl font-light text-gray-900 mb-2">Welcome to ArhiTech</h1>
        <p class="text-gray-600">Romanian architectural document management system</p>
      </div>
      
      <!-- Enhanced authentication form -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <!-- Enhanced mode toggle buttons -->
        <div class="mb-6">
          <div class="flex bg-gray-100 rounded-xl p-1">
            <button 
              type="button"
              @click="isSignUp = false" 
              :class="!isSignUp ? 'bg-[#0743ae] text-white shadow-sm' : 'text-gray-600'"
              class="flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-100 text-sm"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a2 2 0 01-2-2V7a2 2 0 012-2h7a3 3 0 013 3v1"></path>
              </svg>
              Log In
            </button>
            <button 
              type="button"
              @click="isSignUp = true" 
              :class="isSignUp ? 'bg-[#0743ae] text-white shadow-sm' : 'text-gray-600'"
              class="flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-100 text-sm"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Sign Up
            </button>
          </div>
        </div>

        <form @submit.prevent="isSignUp ? handleSignUp() : handleLogin()" class="space-y-5">
          <!-- Enhanced name field (only shown for signup) -->
          <div v-if="isSignUp" class="space-y-2">
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input
                id="name"
                v-model="name"
                type="text"
                required
                placeholder="Enter your full name"
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0743ae] focus:outline-none focus:ring-2 focus:ring-[#0743ae] focus:ring-offset-2 transition-all duration-100 hover:border-gray-300"
              />
            </div>
          </div>

        <div v-if="isSignUp" class="space-y-4">
  <!-- Account type toggle -->
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">Account Type</label>
    <div class="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-100">
      <!-- Current selection with icon on the left -->
      <div class="flex items-center space-x-2">
        <svg v-if="!isArhitect" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <span class="text-sm font-medium text-gray-900">{{ isArhitect ? 'Architect' : 'Client' }}</span>
      </div>
      
      <!-- Compact Toggle Switch on the right -->
      <div class="relative">
        <input 
          id="isArhitect"
          v-model="isArhitect"
          type="checkbox"
          class="sr-only"
        />
        <label 
          for="isArhitect" 
          class="relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus-within:outline-none focus-within:ring-2 focus-within:ring-[#0743ae] focus-within:ring-offset-2"
          :class="isArhitect ? 'bg-[#0743ae]' : 'bg-gray-200'"
        >
          <span 
            class="inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ease-in-out"
            :class="isArhitect ? 'translate-x-5' : 'translate-x-1'"
          ></span>
        </label>
      </div>
    </div>
  </div>
  
  <!-- Warning message -->
  <div class="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4">
    <div class="flex items-center">
      <svg class="flex-shrink-0 w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      <p class="text-amber-700 text-sm font-medium">Selectează „Arhitect” pentru management și optimizare workflow sau „Client” pentru vizualizare și comunicare legată de proiect.</p>
    </div>
  </div>
</div>
        

          <!-- Enhanced email field -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="Enter your email"
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0743ae] focus:outline-none focus:ring-2 focus:ring-[#0743ae] focus:ring-offset-2 transition-all duration-100 hover:border-gray-300"
              />
            </div>
          </div>
    
          <!-- Enhanced password field -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="Enter your password"
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0743ae] focus:outline-none focus:ring-2 focus:ring-[#0743ae] focus:ring-offset-2 transition-all duration-100 hover:border-gray-300"
              />
            </div>
          </div>
    
          <!-- Enhanced error message display -->
          <div v-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-red-700 text-sm font-medium">{{ errorMessage }}</p>
            </div>
          </div>

          <!-- Enhanced submit button -->
          <button
            type="submit"
            class="w-full bg-[#0743ae] hover:bg-[#0743ae]/90 text-white py-3 rounded-xl font-medium transition-all duration-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0743ae] focus:ring-offset-2 transform hover:scale-105"
          >
            <svg v-if="!isSignUp" class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a2 2 0 01-2-2V7a2 2 0 012-2h7a3 3 0 013 3v1"></path>
            </svg>
            <svg v-else class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            {{ isSignUp ? 'Create Account' : 'Sign In' }}
          </button>
          
          <!-- Enhanced mode toggle link -->
          <div class="text-center pt-4">
            <button 
              type="button"
              @click="isSignUp = !isSignUp"
              class="text-sm text-gray-600 hover:text-[#0743ae] transition-colors duration-100"
            >
              {{ isSignUp ? 'Already have an account? Sign in' : 'Need an account? Create one' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-sm text-gray-500">
          &copy; 2025 ArhiTech. Professional architectural document management.
        </p>
      </div>
    </div>
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
const { auth, profile } = useUser()

// Reactive form state variables
const error = ref(false)
const isSignUp = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')
const isArhitect = ref('true')
const errorMessage = ref('')

/** 
 * Handles user login by sending credentials to the API
 * Uses FormData for the request body and stores JWT on success
 */
async function handleLogin() {
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
    }).then(async data => {
      if(data.jwt){
        // Store JWT token and trigger auth re-evaluation
        localStorage.setItem('jwt', data.jwt)
        auth.value.reEvalRequired = true

        await fetchUserData()
        
        if(profile.value.accountType === 'arhitect'){
          navigateTo('/arhitect/dashboard')
        }else if(profile.value.accountType === 'client'){
          navigateTo('/client/dashboard')
        }
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

<style scoped>
@font-face {
  font-family: 'Bonbance';
  src: url('/fonts/Bonbance-BoldCondensed.otf') format('opentype');
  font-weight: bold;
  font-style: normal;
}

.bonbance-font {
  font-family: 'Bonbance', sans-serif;
}
</style>