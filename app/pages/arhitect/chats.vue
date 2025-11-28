<template>
  <!-- Loading state -->
  <ModalsLoading
    v-if="loading"
    title="Încărcare conversații"
    message="Te rugăm să aștepți în timp ce încărcăm conversațiile tale..."
  />

  <!-- Enhanced chats container with modern design -->
  <div v-else class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Enhanced page header -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-[#0743ae]/10 rounded-xl">
            <svg class="w-8 h-8 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-medium text-gray-900 mb-1">Conversații</h1>
            <p class="text-gray-600">Gestionează conversațiile tale de proiect</p>
          </div>
        </div>
      </div>

      <!-- Enhanced empty state -->
      <div v-if="chatRooms.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">Nu există conversații</h3>
        <p class="text-gray-600">Nu ai conversații active momentan.</p>
      </div>

      <!-- Enhanced chat rooms list -->
      <div v-else class="space-y-4">
        <button
          v-for="chat in chatRooms"
          :key="chat.projectId"
          @click="navigateTo('/arhitect/chat/' + chat.projectId)"
          class="group w-full bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#0743ae]/30 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] text-left"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4 flex-1 min-w-0">
              <div class="p-2 bg-[#0743ae]/10 rounded-xl group-hover:bg-[#0743ae]/20 transition-colors duration-200">
                <svg class="w-5 h-5 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 truncate group-hover:text-[#0743ae] transition-colors duration-200">
                  {{ chat.chatName }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">Conversație proiect</p>
              </div>
            </div>
            <div class="p-2 bg-[#0743ae]/10 rounded-xl group-hover:bg-[#0743ae]/20 transition-colors duration-200">
              <svg class="w-5 h-5 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </button>
      </div>
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