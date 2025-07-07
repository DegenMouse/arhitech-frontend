<template>
    <div class="flex">
      <sidebar /> <!-- Your dashboard/sidebar -->
      <div class="flex-1">
        <NuxtPage />
      </div>
    </div>
  </template>
  
  <script setup>
  import DashboardSidebar from '~/components/sidebar.vue'
  </script>
  