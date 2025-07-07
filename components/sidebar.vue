<template>
  <div class="flex h-screen flex-col justify-between border-e border-gray-100 bg-white w-64">
    <div class="px-4 py-6">
      <span class="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-base text-gray-600">
        Momo
      </span>
      
      <hr class="my-6 border-gray-200" />
  
      <ul class="mt-6 space-y-1">
        <li>
          <NuxtLink 
            to="/dashboard" 
            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            :class="{ 'bg-gray-100 text-gray-700': $route.path === '/dashboard' }"
          >
            Dashboard
          </NuxtLink>
        </li>
        
        <li>
          <NuxtLink 
            to="/projects" 
            class="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            :class="{ 'bg-gray-100 text-gray-700': $route.path === '/projects' }"
          >
            Projects
          </NuxtLink>
        </li>
      </ul>
    </div>
  
    <div class="sticky inset-x-0 bottom-0 border-t border-gray-100 relative">
      <button 
        @click="showUserMenu = !showUserMenu"
        class="flex items-center gap-2 bg-white p-4 hover:bg-gray-50 w-full text-left"
      >
        <div class="size-10 rounded-full bg-gray-200 flex items-center justify-center">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <div>
          <p class="text-xs">
            <strong class="block font-medium">Octav Oprita</strong>
            <span class="text-gray-500">Click for options</span>
          </p>
        </div>
      </button>
      
      <div v-if="showUserMenu" class="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-t-lg shadow-lg">
        <div class="p-2">
          <button
            @click="goToAccount"
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Account
          </button>
          
          <button
            @click="logout"
            class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const showUserMenu = ref(false)

const logout = async () => {
  showUserMenu.value = false
  await navigateTo('/')
}

const goToAccount = async () => {
  showUserMenu.value = false
  await navigateTo('/account')
}
</script>