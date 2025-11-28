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
  <!-- Enhanced sidebar container with modern design -->
  <div class="w-72 h-screen bg-gray-50 border-r-2 border-gray-300 flex flex-col shadow-sm">
    <!-- Enhanced company header section -->
    <div class="p-6 border-b-2 border-gray-300">
      <div class="flex items-center space-x-3">
        <div class="p-2 bg-[#0743ae]/10 rounded-xl">
          <div class="w-6 h-6 text-[#0743ae] text-xl select-none font-bold bonbance-font flex items-center justify-center">A</div>
        </div>
        <div>
          <div class="text-lg font-semibold text-gray-900">{{ company.companyName || 'No Company' }}</div>
          <div class="text-xs text-gray-500">{{ company.isAdmin ? 'Administrator' : 'Member' }}</div>
        </div>
      </div>
    </div>
    
    <!-- Enhanced navigation menu -->
    <nav @click="console.log($route.path)" class="flex-1 p-4 space-y-2">
      <!-- Dashboard link with improved styling -->
      <NuxtLink to="/arhitect/dashboard" 
        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-100 group" 
        :class="$route.path === '/arhitect/dashboard' 
          ? 'bg-[#0743ae]/10 text-[#0743ae] border-2 border-[#0743ae]/30' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-[#0743ae]'">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
        <span class="font-medium">Dashboard</span>
      </NuxtLink>
      
      <!-- Company link with improved styling -->
      <NuxtLink to="/arhitect/companies" 
        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-100 group"
        :class="$route.path === '/arhitect/companies' || $route.path === '/arhitect/companyAdmin' || $route.path === '/arhitect/companyMember' || $route.path === '/arhitect/noComp' 
          ? 'bg-[#0743ae]/10 text-[#0743ae] border-2 border-[#0743ae]/30' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-[#0743ae]'">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span class="font-medium">Companie</span>
      </NuxtLink>
      
      <!-- Projects link with improved styling -->
      <NuxtLink to="/arhitect/projects" 
        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-100 group"
        :class="$route.path.startsWith('/arhitect/projects')
          ? 'bg-[#0743ae]/10 text-[#0743ae] border-2 border-[#0743ae]/30' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-[#0743ae]'">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <span class="font-medium">Proiecte</span>
      </NuxtLink>

      <!-- Chat -->
      <NuxtLink to="/arhitect/chats"
        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-100 group"
        :class="$route.path.startsWith('/arhitect/chat')
          ? 'bg-[#0743ae]/10 text-[#0743ae] border-2 border-[#0743ae]/30'
          : 'text-gray-700 hover:bg-gray-100 hover:text-[#0743ae]'">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <span class="font-medium">Mesaje</span>
      </NuxtLink>

      <!-- <NuxtLink to="/test" 
        class="flex items-center space-x-3 p-3 rounded-xl transition-all duration-100 group"
        :class="$route.path.startsWith('/test') 
          ? 'bg-[#0743ae]/10 text-[#0743ae] border-2 border-[#0743ae]/30' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-[#0743ae]'">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
        <span class="font-medium">Test</span>
      </NuxtLink> -->
    </nav>
    
    <!-- Enhanced user account section -->
    <div class="p-1 border-t-2 border-gray-300">
      <!-- User info button with improved styling -->
      <button 
        @click="toggleMenu = !toggleMenu" 
        class="w-full p-4 text-left hover:bg-gray-100 rounded-xl transition-all duration-100 flex items-center space-x-3 group">
        <div class="w-10 h-10 bg-[#0743ae]/10 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <div class="font-medium text-gray-900">{{ profile.username || 'User' }}</div>
          <div class="text-sm text-gray-500">{{ profile.email || '' }}</div>
        </div>
        <svg class="w-4 h-4 text-gray-400 group-hover:text-[#0743ae] transition-colors" 
             :class="{ 'rotate-180': toggleMenu }" 
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      <!-- Enhanced collapsible user menu -->
      <div v-if="toggleMenu && auth.isLoggedIn" 
           class="mt-2 bg-gray-50 border-2 border-gray-300 rounded-xl shadow-sm overflow-hidden">
        <!-- Account settings link -->
        <NuxtLink to="/arhitect/account" 
                  class="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-100 transition-colors duration-100">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span class="text-gray-700 font-medium">Account</span>
        </NuxtLink>
        
        <!-- Logout button -->
        <button @click="logout" 
                class="flex items-center space-x-3 w-full p-3 text-left hover:bg-red-50 transition-colors duration-100 border-t-2 border-gray-300">
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span class="text-red-600 font-medium">Logout</span>
        </button>
      </div>
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
    email: '', 
    accountType: '',
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
  navigateTo('/login')
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