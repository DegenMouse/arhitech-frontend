<template>
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">🛠️ Development Dashboard</h1>
        <p class="text-lg text-gray-600">Welcome to the development environment</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-3xl mb-2">📄</div>
          <h3 class="text-lg font-semibold text-gray-800">DocTypes</h3>
          <p class="text-gray-600 text-sm">Manage document templates</p>
          <NuxtLink to="/dev/docTypes" class="mt-2 inline-block text-blue-600 hover:text-blue-800">
            Go to DocTypes →
          </NuxtLink>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-3xl mb-2">🗄️</div>
          <h3 class="text-lg font-semibold text-gray-800">Database</h3>
          <p class="text-gray-600 text-sm">Coming soon</p>
          <span class="mt-2 inline-block text-gray-400 text-sm">In development</span>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-3xl mb-2">📁</div>
          <h3 class="text-lg font-semibold text-gray-800">MinIO</h3>
          <p class="text-gray-600 text-sm">Coming soon</p>
          <span class="mt-2 inline-block text-gray-400 text-sm">In development</span>
        </div>
      </div>

      <!-- Environment Info -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h2 class="text-lg font-semibold text-yellow-800 mb-2">⚠️ Development Environment</h2>
        <p class="text-yellow-700 text-sm">
          This is a development environment for testing and managing system components. 
          Changes made here may affect the production database and file storage.
        </p>
      </div>

      <!-- Available Tools -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Available Tools</h2>
        <ul class="space-y-2">
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✓</span>
            <NuxtLink to="/dev/docTypes" class="text-blue-600 hover:text-blue-800">
              DocTypes Manager - Create, edit, and manage document types
            </NuxtLink>
          </li>
          <li class="flex items-center">
            <span class="text-gray-400 mr-2">◯</span>
            <span class="text-gray-500">Database Inspector - Browse and query database tables</span>
          </li>
          <li class="flex items-center">
            <span class="text-gray-400 mr-2">◯</span>
            <span class="text-gray-500">MinIO Browser - Manage file storage and buckets</span>
          </li>
          <li class="flex items-center">
            <span class="text-gray-400 mr-2">◯</span>
            <span class="text-gray-500">API Tester - Test API endpoints and responses</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dev'
})
</script>