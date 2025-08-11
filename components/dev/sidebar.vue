<!--
  components/dev/sidebar.vue
  -------------------------
  Development sidebar component for dev tools and utilities.
  Provides navigation for development-specific pages and tools.
  Used in the dev layout for development purposes.
-->
<template>
  <!-- Dev sidebar container with distinct styling -->
  <div class="w-64 h-screen bg-gray-900 border-r border-gray-700 flex flex-col">
    <!-- Dev header section -->
    <div class="p-4 bg-gray-800">
      <div class="text-lg font-bold text-yellow-400">🛠️ Dev Tools</div>
      <div class="text-xs text-gray-400">Development Environment</div>
    </div>
    
    <!-- Dev navigation menu -->
    <nav class="flex-1 p-4">
      <!-- Dashboard -->
      <NuxtLink to="/dev" 
                class="block p-2 rounded hover:bg-gray-800 text-gray-300 hover:text-white" 
                :class="{ 'bg-gray-800 text-white': $route.path === '/dev' }">
        🏠 Dashboard
      </NuxtLink>
      
      <!-- DocTypes Management -->
      <NuxtLink to="/dev/docTypes" 
                class="block p-2 rounded hover:bg-gray-800 text-gray-300 hover:text-white mt-1" 
                :class="{ 'bg-gray-800 text-white': $route.path === '/dev/docTypes' }">
        📄 DocTypes Manager
      </NuxtLink>
      
      <!-- Placeholder for future dev tools -->
      <div class="mt-6 text-xs text-gray-500 uppercase tracking-wider">Coming Soon</div>
      <div class="mt-2 text-sm text-gray-600">🗄️ Database Inspector</div>
      <div class="mt-1 text-sm text-gray-600">📁 MinIO Browser</div>
      <div class="mt-1 text-sm text-gray-600">🔍 API Tester</div>
    </nav>
    
    <!-- Dev footer with back to main app -->
    <div class="p-4 border-t border-gray-700">
      <NuxtLink to="/" 
                class="block p-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-center text-sm">
        ← Back to Main App
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// No specific logic needed for dev sidebar currently
</script>