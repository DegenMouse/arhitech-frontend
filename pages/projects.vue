<!--
  pages/projects.vue
  -----------------
  Projects listing page that displays all projects the current user is assigned to.
  Shows project name and deadline in a clickable card format.
  Each project card navigates to the individual project detail page.
  Handles empty state when user has no projects assigned.
  Fetches project data on component mount using user-project relationships.
-->
<template>
  <!-- Main projects container -->
  <div class="p-8">
    <!-- Empty state when no projects are found -->
    <div v-if="projects.length === 0" class="text-gray-600">
      No projects found.
    </div>
    
    <!-- Projects list with clickable cards -->
    <div v-else class="space-y-4">
      <!-- Individual project card -->
      <div 
        v-for="project in projects" 
        @click="navigateTo('/project/' + project.id)"
        :key="project.id"
        class="border border-gray-200 rounded-lg p-4"
      >
        <!-- Project name with fallback -->
        <h3 class="text-lg font-semibold">{{ project.attributes?.name || 'Unnamed Project' }}</h3>
        <!-- Project deadline with fallback -->
        <p class="text-sm text-gray-600">Deadline: {{ project.attributes?.deadline || 'No deadline' }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
// Get runtime configuration and user data
const dbApi = useRuntimeConfig().public.dbApi
const { auth } = useUser()

// Reactive projects list
const projects = ref([])

// Fetch user's projects on component mount
onMounted(() => {
  // Fetch projects where user is a member
  fetch(dbApi + '/data/users/' + auth.value.id + '/users_in_project/?include=project_id')
    .then(res => {
      if(!res.ok){
        throw new Error('Failed to fetch projects')
      }
      return res.json()
    })
    .then(data => {
      console.log("projects data");
      console.log(data.includes);
      // Set projects from includes or empty array if none
      projects.value = data.includes || []
    })
    .catch(err => {
      console.error('Failed to fetch projects:', err)
    })
})
</script>
