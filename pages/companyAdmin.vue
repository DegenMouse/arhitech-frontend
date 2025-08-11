<!--
  pages/companyAdmin.vue
  ---------------------
  Company administrator dashboard page that provides management tools for company operations.
  Features team management, project creation/management, and company leave functionality.
  Integrates multiple modal components for different admin tasks.
  Handles data fetching for members and projects with error handling.
  Provides a centralized interface for company administrators to manage their organization.
-->
<template>
  <!-- Main admin dashboard container -->
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header section with company name and leave option -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-800">{{ company.companyName }}</h1>
          <!-- Leave company button -->
          <button 
            @click="handleLeaveCompany"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Leave Company
          </button>
        </div>
      </div>
      
      <!-- Main dashboard content area -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h2>
        
        <!-- Admin action buttons grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Team management button -->
          <button 
            @click="showMembersModal = true"
            class="p-6 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-center border border-gray-200"
          >
            <div class="font-semibold text-lg">Manage Team</div>
          </button>
          
          <!-- Project management button -->
          <button 
            @click="showManageProjectsModal = true"
            class="p-6 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-center border border-gray-200"
          >
            <div class="font-semibold text-lg">Manage Projects</div>
          </button>
          
          <!-- Create project button -->
          <button 
            @click="showCreateProjectModal = true"
            class="p-6 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-center border border-gray-200"
          >
            <div class="font-semibold text-lg">Create Project</div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Team members management modal -->
    <ModalsAdminManageMembers 
      v-if="showMembersModal"
      :members="members"
      @close="showMembersModal = false"
      @remove-member="handleRemoveMember"
    />

    <!-- Project creation modal -->
    <ModalsAdminEditProject 
      v-if="showCreateProjectModal"
      :members="members"
      :isNew="true"
      @close="showCreateProjectModal = false; fetchProjects()"
    />

    <!-- Project management modal -->
    <ModalsAdminManageProjects 
      v-if="showManageProjectsModal"
      :projects="projects"
      :members="members"
      @close="showManageProjectsModal = false"
      @fetchProjects="fetchProjects"
    />
  </div>
</template>

<script setup>
// Get runtime configuration and user data
const dbApi = useRuntimeConfig().public.dbApi
const { auth, company } = useUser()
const { confirm } = useConfirm()
const { error, success } = useUI()

// Modal state management
const showMembersModal = ref(false) // Modal for managing members
const members = ref([]) // Company members list
const showCreateProjectModal = ref(false) // Modal for creating a project
const showManageProjectsModal = ref(false) // Modal for managing projects
const projects = ref([]) // Company projects list



// Initialize data on component mount
onMounted(async () => {
  try{
    await fetchMembers()
    await fetchProjects()
  }catch(err){
    console.error('Failed to fetch members or projects:', err)
    error.value.message = 'Unable to load members AND/OR projects. Please check your internet connection and try again.'
    error.value.show = true
  }
})

/**
 * Handles leaving the company using the leaveCompany composable
 * Navigates to noComp page on success
 */
const handleLeaveCompany = async () => {

  const ok = await confirm("Are you sure you want to leave this company? This will result in the deletion of your company if you are it's founder. This is a BUG and needs to be fixed.")
  if(!ok) return

  try{
    await leaveCompany()
    navigateTo('/noComp')
  }catch(err){
    console.error('Failed to leave company:', err)
    error.value.message = 'Unable to leave company. Please check your internet connection and try again.'
    error.value.show = true
  }
}

/**
 * Fetches all members of the company
 * Retrieves user IDs from company relationship and fetches full user data
 */
const fetchMembers = async () => {
  console.log("fetching members")
  const res = await fetch(dbApi + '/data/admins/' + auth.value.id + '/company_id/?include=users_in_company')
  if(!res.ok){
      throw new Error('Failed to fetch users in company, status: ' + res.status)
  }
  const data = await res.json()

  // Extract member IDs from the response
  const memberIds = data.includes.map(include => include.relationships.user_id.data.id);

  // Fetch full user data for each member ID
  members.value = await Promise.all(
    memberIds.map(async memberId => {
      const res = await fetch(dbApi + '/data/users/' + memberId)
      if(!res.ok){
        throw new Error('Failed to fetch user, status: ' + res.status)
      }
      const data = await res.json()
      return { ...data.data.attributes };
  }));
}

/**
 * Fetches all projects for the company
 * Includes user assignments for each project
 */
const fetchProjects = async (projectId = null) => {
  console.log("fetching projects")

  const res = await fetch(dbApi + '/data/admins/' + auth.value.id + '/company_id/?include=projects')
  if (!res.ok) {
    throw new Error('Failed to fetch projects')
  }
    
  const data = await res.json()

  const projs = data.includes || null
  if(!projs){
    console.log("no projects")
    projects.value = []
    return
  }


  // I want that the projects object also contains the users_in_project but those I have to get separetely
  projects.value = await Promise.all(
    // retrieve members for each project
    projs.map(async (project) => {
      // only the userIds are retrieved from here
      const res = await fetch(dbApi + '/data/users_in_project/?filter=project_id=' + project.id)
      if (!res.ok) {
        throw new Error('Failed to fetch users in project')
      }
      const json = await res.json()

      return{
        ...project.attributes,
        // the whole user object is retrieved from the existing membersArray
        users_in_project: json.data.map(({ relationships }) => {
          const userId = relationships.user_id.data.id
          return (
            members.value.find(m => m.id === userId) || 
            { id: userId, attributes: { username: 'Unknown User' } }
          )
        })
      }
    }
  ))
  console.log("projects.value")
  console.log(projects.value)
}

/**
 * Removes a member from the company
 * Deletes the user-company relationship and updates local state
 */
const handleRemoveMember = async (memberId) => {
  try{
    const res = await fetch(dbApi + '/data/users_in_company/' + memberId, {
      method: 'DELETE'
    })
    if(!res.ok){
      throw new Error('Failed to remove member')
    }

    const index = members.value.findIndex(member => member.id === memberId)
    if (index > -1) {
      members.value.splice(index, 1)
    }
    success.value.message = 'Member removed successfully'
    success.value.show = true
  }catch(err){
    console.error('Failed to remove member:', err)
    error.value.message = 'Unable to remove member. Please try again.'
    error.value.show = true
  }
}

</script>
