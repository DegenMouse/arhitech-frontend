<!--
  pages/projects.vue
  -----------------
  Enhanced projects listing page with modern UI design and progress tracking.
  Displays all projects the current user is assigned to with phase information and progress bars.
  Each project card shows name, phase, completion percentage, and deadline.
  Features improved styling consistent with the application's design system.
  Handles empty state when user has no projects assigned.
-->
<template>
  <!-- Enhanced projects container with modern design -->
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Enhanced page header -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-[#0743ae]/10 rounded-xl">
            <svg class="w-8 h-8 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-medium text-gray-900 mb-1">My Projects</h1>
            <p class="text-gray-600">Track progress and manage your assigned projects</p>
          </div>
        </div>
      </div>

      <!-- Enhanced empty state -->
      <div v-if="projects.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">No Projects Yet</h3>
        <p class="text-gray-600 mb-6">You haven't been assigned to any projects. Contact your administrator to get started.</p>
        <NuxtLink to="/companies" class="inline-flex items-center px-4 py-2 bg-[#0743ae] text-white rounded-xl hover:bg-[#0743ae]/90 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          Go to Company
        </NuxtLink>
      </div>
      
      <!-- Enhanced projects grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Enhanced project card -->
        <div 
          v-for="project in projects" 
          @click="navigateTo('/project/' + project.id)"
          :key="project.id"
          class="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#0743ae]/30 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
        >
          <!-- Project header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 truncate group-hover:text-[#0743ae] transition-colors duration-200">
                {{ project.attributes?.name || 'Unnamed Project' }}
              </h3>
              <div class="flex items-center space-x-2 mt-2">
                <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  {{ project.attributes?.localitate || 'Location Timisoara' }}
                </span>
              </div>
            </div>
            <div class="p-2 bg-[#0743ae]/10 rounded-xl group-hover:bg-[#0743ae]/20 transition-colors duration-200">
              <svg class="w-5 h-5 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>


          <!-- Project details -->
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>Deadline: {{ formatDeadline(project.attributes?.deadline) }}</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{{ project.attributes?.localitate || 'Location Timisoara' }}</span>
            </div>
          </div>
        </div>
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

// Set page title
useHead({
  title: 'My Projects - ArhiTech'
})


/**
 * Formats deadline for display
 */
const formatDeadline = (deadline) => {
  if (!deadline) return 'No deadline'
  try {
    return new Date(deadline).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return deadline
  }
}

// Fetch user's projects on component mount
onMounted(async () => {
  try {
    // Fetch projects where user is a member
    console.log("id",auth.value.id)
    // const res = await fetch(dbApi + '/data/users/' + auth.value.id + '/users_in_project/?include=project_id')
    const res = await fetch(dbApi + '/data/users_in_company/' + auth.value.id + '?include=projects')
    
    if (!res.ok) {
      throw new Error('Failed to fetch projects')
    }
    
    const data = await res.json()

    console.log("data",data)
    
    // Process projects and add mock data
    // const projectsData = data.includes || []
    let projectsData = data.includes || []
    
    // Fetch phase information for each project
    projects.value = await Promise.all(
      projectsData.map(async (project) => {
        return project
      })
    )
  } catch (err) {
    console.error('Failed to fetch projects:', err)
  }
})
</script>
