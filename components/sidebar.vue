<template>
  <div class="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
    <div class="p-4">
      <div class="text-lg font-bold text-gray-800">{{ companyName || 'No Company' }}</div>
    </div>
    
    <nav class="flex-1 p-4">
      <NuxtLink to="/dashboard" class="block p-2 rounded hover:bg-gray-100" 
        :class="{ 'bg-gray-100': $route.path === '/dashboard' }">
        Dashboard
      </NuxtLink>
      <NuxtLink to="/projects" class="block p-2 rounded hover:bg-gray-100 mt-1"
        :class="{ 'bg-gray-100': $route.path === '/projects' }">
        Projects
      </NuxtLink>
    </nav>
    
    <div class="p-4 border-t border-gray-200">
      <button @click="showMenu = !showMenu" class="w-full p-2 text-left hover:bg-gray-100 rounded">
        {{ userEmail || 'User' }}
      </button>
      <div v-if="showMenu" class="mt-2 border border-gray-200 rounded bg-white">
        <button @click="goToAccount" class="w-full p-2 text-left hover:bg-gray-100">Account</button>
        <button @click="logout" class="w-full p-2 text-left hover:bg-gray-100 text-red-600">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const showMenu = ref(false)
const userEmail = ref('')
const companyName = ref('')

onMounted(() => {
  userEmail.value = localStorage.getItem('email') || ''
  companyName.value = localStorage.getItem('company_name') || ''
})

const logout = () => {
  localStorage.removeItem('jwt')
  localStorage.removeItem('email')
  localStorage.removeItem('id')
  localStorage.removeItem('company_name')
  showMenu.value = false
  navigateTo('/')
}

const goToAccount = () => {
  showMenu.value = false
  navigateTo('/account')
}
</script>