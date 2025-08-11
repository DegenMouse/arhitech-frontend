<!--
  components/project/ProjectClockedIn.vue
  ---------------------------------------
  Project clocked in panel component for time tracking functionality.
  Currently empty placeholder for future time tracking features.
  Will handle employee time tracking, work sessions, and activity logging.
-->
<template>
  <div class="bg-white rounded shadow p-4">
    <h2 class="text-base font-medium text-gray-700 mb-4">Clocked In</h2>
    
    <!-- Placeholder content -->
    <div class="text-center py-8 text-gray-500">
      <p class="text-lg">Time Tracking</p>
      <p class="text-sm mt-2">This feature will be implemented soon</p>
    </div>
  </div>
</template>

<script setup>
// Component props
const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})
</script>