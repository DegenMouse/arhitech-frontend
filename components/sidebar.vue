<!--
  components/sidebar.vue
  ---------------------
  Main navigation sidebar component that provides app-wide navigation.
  Displays company name, navigation links, and user account controls.
  Features collapsible user menu with account and logout options.
  Handles user logout by clearing all stored data and redirecting to home.
  Uses active route highlighting for current page indication.
  Integrates with useUser composable for authentication and user data.
-->
<template>
  <!-- Main sidebar container with fixed width and full height -->
  <div class="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
    <!-- Company name header section -->
    <div class="p-4">
      <div class="text-lg font-bold text-gray-800">{{ company.companyName || 'No Company' }}</div>
    </div>
    
    <!-- Main navigation menu -->
    <nav class="flex-1 p-4">
      <!-- Dashboard link with active state -->
      <NuxtLink to="/" class="block p-2 rounded hover:bg-gray-100" 
        :class="{ 'bg-gray-100': $route.path === '/' }">
        Dashboard
      </NuxtLink>
      <!-- Companies link with active state -->
      <NuxtLink to="/companies" class="block p-2 rounded hover:bg-gray-100 mt-1"
        :class="{ 'bg-gray-100': $route.path === '/companies' }">
        Companies
      </NuxtLink>
      <!-- Projects link with active state -->
      <NuxtLink to="/projects" class="block p-2 rounded hover:bg-gray-100 mt-1"
        :class="{ 'bg-gray-100': $route.path === '/projects' }">
        Projects
      </NuxtLink>
    </nav>
    
    <!-- User account section with collapsible menu -->
    <div @click="toggleMenu = !toggleMenu" class="p-4 border-t border-gray-200">
      <!-- Collapsible user menu -->
      <div v-if="toggleMenu && auth.isLoggedIn" class="mt-2 border border-gray-200 rounded bg-white">
        <!-- Account settings link -->
        <NuxtLink to="/account" class="w-full p-2 text-left hover:bg-gray-100 block">Account</NuxtLink>
        <!-- Logout button -->
        <button @click="logout" class="w-full p-2 text-left hover:bg-gray-100 text-red-600">Logout</button>
      </div>
      <!-- User name display button -->
      <button class="w-full p-2 text-left hover:bg-gray-100 rounded mt-2">
        {{ profile.username || 'User' }}
        <!-- {{ profile.email || 'User' }} -->
        <!-- {{ profile }} -->
      </button>
      
    </div>
  </div>
</template>

<script setup>
// Get user data from composable
const { auth, profile, company } = useUser()
console.log("profile")
console.log(profile.value)
// Toggle state for user menu
const toggleMenu = ref(false)

/**
 * Handles user logout by clearing all stored data
 * Resets authentication, profile, and company data
 * Removes JWT from localStorage and redirects to home
 */
const logout = () => {
  // Remove all data stored about user
  // Maybe create a function to do this later when we have more data to remove
  
  // Reset authentication state
  auth.value = {
    jwtToken: null,
    expireDate: null,
    isLoggedIn: false,
    id: null
  }

  // Reset profile data
  profile.value = { 
    username: '',
    email: '' 
  }

  // Reset company data
  company.value = { 
    companyName: "", 
    isInCompany: false, 
    isAdmin: false
  }

  // Remove JWT from browser storage
  localStorage.removeItem('jwt')

  // Navigate to home page
  navigateTo('/')
}

</script>