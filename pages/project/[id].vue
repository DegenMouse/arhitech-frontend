<!--
  pages/project/[id].vue
  ---------------------
  Dynamic project detail page with 3-panel tabbed interface.
  Panel 1: Project Documents - document management and workflow
  Panel 2: Clocked In - time tracking functionality (placeholder)
  Panel 3: Settings - project configuration and team management
  Integrates with MinIO for file storage and provides comprehensive project management.
-->
<template>
  <!-- Main project container -->
  <div class="p-8">
    <!-- Project content when loaded -->
    <div v-if="project.instance">
      <!-- Project header with name and phase -->
      <div class="flex items-center gap-4 mb-6">
        <h1 class="text-2xl font-bold">{{ project.instance.attributes?.name || 'Unnamed Project' }}</h1>
        <div class="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium">
          Phase: {{ project.instance.relationships?.phase_id?.data?.id || 'No Phase' }}
        </div>
      </div>
      
      <!-- Tab navigation -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab panels -->
      <div class="mb-6">
        <!-- Documents Panel -->
        <ProjectDocuments
          v-show="activeTab === 'documents'"
          :project="project"
        />

        <!-- Clocked In Panel -->
        <ProjectClockedIn
          v-show="activeTab === 'clocked-in'"
          :project="project"
        />

        <!-- Settings Panel -->
        <ProjectSettings
          v-show="activeTab === 'settings'"
          :project="project"
          @fetchProject="fetchProject"
        />
      </div>

    </div>
    
    <!-- Loading state -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600">Loading project...</p>
    </div>
  </div>
</template>

<script setup>
// Get route information and API configuration
const route = useRoute()
const dbApi = useRuntimeConfig().public.dbApi

// Tab management
const activeTab = ref('documents')
const tabs = [
  { id: 'documents', name: 'Project Documents' },
  { id: 'clocked-in', name: 'Clocked In' },
  { id: 'settings', name: 'Settings' }
]

// Reactive project data structure
const project = ref({
  id: null,
  instance: null
})




/**
 * Fetch basic project information
 */
const fetchProject = () => {
  fetch(dbApi + '/data/projects/' + project.value.id + '?include=phase_id')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch project')
      }
      return res.json()
    })
    .then(data => {
      project.value.instance = data.data
    })
    .catch(err => {
      console.error('Failed to fetch project:', err)
    })
}

// Initialize project data on component mount
onMounted(() => {
  project.value.id = route.params.id
  fetchProject()
})
</script>
