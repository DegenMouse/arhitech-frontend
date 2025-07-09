<template>
  <div class="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
    <div class="p-4">
      <div class="text-lg font-bold text-gray-800">{{ company.companyName || 'No Company' }}</div>
    </div>
    
    <nav class="flex-1 p-4">
      <NuxtLink to="/" class="block p-2 rounded hover:bg-gray-100" 
        :class="{ 'bg-gray-100': $route.path === '/' }">
        Dashboard
      </NuxtLink>
      <NuxtLink to="/companies" class="block p-2 rounded hover:bg-gray-100 mt-1"
        :class="{ 'bg-gray-100': $route.path === '/companies' }">
        Companies
      </NuxtLink>
      <NuxtLink to="/projects" class="block p-2 rounded hover:bg-gray-100 mt-1"
        :class="{ 'bg-gray-100': $route.path === '/projects' }">
        Projects
      </NuxtLink>
    </nav>
    
    <div @click="toggleMenu = !toggleMenu" class="p-4 border-t border-gray-200">
      <div v-if="toggleMenu" class="mt-2 border border-gray-200 rounded bg-white">
        <NuxtLink to="/account" class="w-full p-2 text-left hover:bg-gray-100 block">Account</NuxtLink>
        <button @click="logout" class="w-full p-2 text-left hover:bg-gray-100 text-red-600">Logout</button>
      </div>
      <button class="w-full p-2 text-left hover:bg-gray-100 rounded mt-2">
        {{ profile.username || 'User' }}
        <!-- {{ profile.email || 'User' }} -->
        <!-- {{ profile }} -->
      </button>
      
    </div>
  </div>
</template>

<script setup>
const { auth, profile, company } = useUser()
console.log("profile")
console.log(profile.value)
const toggleMenu = ref(false)


const logout = () => {
  //remove all data stored about user
  //maybe create a function to do this late on when we have more data to remove
  auth.value = {
    jwtToken: null,
    expireDate: null,
    isLoggedIn: false,
    id: null
  }

  profile.value = { 
    username: '',
    email: '' 
  }

  company.value = { 
    companyName: "", 
    isInCompany: false, 
    isAdmin: false
  }

  localStorage.removeItem('jwt')

  navigateTo('/')
}

</script>