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
        @click="navigateTo('/arhitect/chat/' + chat.projectId)"
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
    
    const dbApi = useRuntimeConfig().public.dbApi
    const { auth } = useUser()

    // Reactive rooms list
    const chatRooms = ref([])
    const projects = ref([])
    const loading = ref(true)
    
    async function getExistingChats() {
        for (const project of projects.value) {
            console.log("💔")
            const projectId = project.id
            // const clientsInProject = project.relationships.clientsInProject
            console.log(projectId)
            const res = await fetch(dbApi + '/data/clients_in_project/?filter=project_id=' + projectId, {
                method: 'GET'
            })
            const parsedRes = await res.json();
            if (parsedRes.data.length !=0 )
                chatRooms.value.push({projectId, chatName: project.attributes.name})
        }
    }

    onMounted(async () => {
        try {
            await fetchProjects(projects)
            await getExistingChats()
        } catch (error) {
            console.error('Error loading chat rooms:', error)
        } finally {
            loading.value = false
        }
    })

</script>