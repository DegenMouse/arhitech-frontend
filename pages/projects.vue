<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">My Projects</h1>
    
    <div v-if="projects.length === 0" class="text-gray-600">
      No projects found.
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="project in projects" 
        :key="project.id"
        class="border border-gray-200 rounded-lg p-4"
      >
        <h3 class="text-lg font-semibold">{{ project.attributes?.name || 'Unnamed Project' }}</h3>
        <p class="text-sm text-gray-600">Deadline: {{ project.attributes?.deadline || 'No deadline' }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
const dbApi = useRuntimeConfig().public.dbApi
const { auth } = useUser()

const projects = ref([])

onMounted(() => {
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
      projects.value = data.includes || []
    })
    .catch(err => {
      console.error('Failed to fetch projects:', err)
    })
})
</script>
