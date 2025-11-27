<template>
  <!-- Loading state -->
  <ModalsLoading
    v-if="loading"
    title="Loading Chat Rooms"
    message="Please wait while we fetch your chat rooms..."
  />

  <!-- Content -->
  <div v-else>
    <div v-for="chat in chatRooms" :key="chat.projectId">
      <button
        @click="navigateTo('/client/chat/' + chat.projectId)"
        class="w-full p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#0743ae]/30 hover:shadow-md transition-all duration-200 text-left"
      >
        <div class="flex items-center justify-between">
          <span class="text-gray-900 font-medium">Chat {{ chat.chatName }}</span>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'client'
})

const dbApi = useRuntimeConfig().public.dbApi
const { auth } = useUser()

// Reactive rooms list
const chatRooms = ref([])
const projects = ref([])
const loading = ref(true)

async function fetchClientProjects() {
  try {
    const userId = auth.value.id
    
    if (!userId) {
      console.error('User ID is missing')
      loading.value = false
      return
    }

    const res = await fetch(dbApi + `/data/clients_in_project/?include=project_id&filter=user_id=${userId}`)
    
    if (!res.ok) {
      throw new Error('Failed to fetch client projects')
    }

    const data = await res.json()
    
    // Extract project IDs and project data from the response
    const projectData = data.includes || []
    
    if (projectData.length === 0) {
      loading.value = false
      return
    }

    // Map projects to chat rooms (all projects client is in are chat rooms)
    chatRooms.value = projectData.map(project => ({
      projectId: project.id,
      chatName: project.attributes?.name || 'Unknown Project'
    }))
  } catch (error) {
    console.error('Error fetching client projects:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    await fetchClientProjects()
  } catch (error) {
    console.error('Error loading chat rooms:', error)
  }
})
</script>