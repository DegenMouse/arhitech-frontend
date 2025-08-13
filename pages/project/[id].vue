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
  <!-- Enhanced project container with modern design -->
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Project content when loaded -->
      <div v-if="project.instance">
        <!-- Enhanced project header with better spacing and styling -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="p-3 bg-[#0743ae]/10 rounded-xl">
                <svg class="w-8 h-8 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-3xl font-medium text-gray-900 mb-1">{{ project.instance.attributes?.name || 'Unnamed Project' }}</h1>
                <p class="text-gray-600">Project Details & Management</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="px-4 py-2 bg-[#0743ae]/10 text-[#0743ae] rounded-xl text-sm font-medium border border-[#0743ae]/20">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Phase: {{ project.instance.relationships?.phase_id?.data?.id || 'No Phase' }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Enhanced tab navigation -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div class="border-b border-gray-100">
            <nav class="flex space-x-0">
              <button
                v-for="(tab, index) in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  activeTab === tab.id
                    ? 'bg-[#0743ae]/5 text-[#0743ae] border-b-2 border-[#0743ae]'
                    : 'text-gray-600 hover:text-[#0743ae] hover:bg-gray-50',
                  'flex-1 py-4 px-6 font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="tab.id === 'documents'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  <path v-if="tab.id === 'clocked-in'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  <path v-if="tab.id === 'settings'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                </svg>
                <span>{{ tab.name }}</span>
              </button>
            </nav>
          </div>

          <!-- Enhanced tab panels with proper padding -->
          <div class="p-8">
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

      </div>
      
      <!-- Enhanced loading state -->
      <div v-else class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 bg-[#0743ae]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#0743ae] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-medium text-gray-900 mb-2">Loading Project</h2>
          <p class="text-gray-600">Please wait while we fetch your project details...</p>
        </div>
      </div>
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
