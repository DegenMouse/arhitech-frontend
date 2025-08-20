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
  <!-- Main admin dashboard container with improved background -->
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Enhanced header section with better spacing and typography -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <div>
          <h1 class="text-4xl font-light text-gray-900 mb-2">{{ company.companyName }}</h1>
          <p class="text-gray-600 font-medium">Admin Dashboard</p>
        </div>
      </div>
      
      <!-- Enhanced main dashboard content area -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
        <div class="mb-10">
          <h2 class="text-2xl font-medium text-gray-900 mb-3">Quick Actions</h2>
          <p class="text-gray-600">Manage your company operations efficiently</p>
        </div>
        
        <!-- Improved admin action buttons grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Enhanced team management button -->
          <button 
            @click="showMembersModal = true"
            class="group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#0743ae] rounded-2xl p-8 transition-all duration-200 hover:shadow-xl hover:scale-105 text-left focus:outline-none focus:ring-2 focus:ring-[#0743ae] focus:ring-offset-2"
          >
            <div class="flex items-center space-x-4 mb-4">
              <div class="p-3 bg-[#0743ae]/10 group-hover:bg-[#0743ae]/20 rounded-xl transition-colors duration-200">
                <svg class="w-6 h-6 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
            <h3 class="font-semibold text-xl text-gray-900 group-hover:text-[#0743ae] transition-colors duration-200 mb-2">Manage Team</h3>
            <p class="text-gray-600 text-sm">Add, remove, and organize team members</p>
          </button>
          
          <!-- Enhanced project management button -->
          <button 
            @click="showManageProjectsModal = true"
            class="group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#0743ae] rounded-2xl p-8 transition-all duration-200 hover:shadow-xl hover:scale-105 text-left focus:outline-none focus:ring-2 focus:ring-[#0743ae] focus:ring-offset-2"
          >
            <div class="flex items-center space-x-4 mb-4">
              <div class="p-3 bg-[#0743ae]/10 group-hover:bg-[#0743ae]/20 rounded-xl transition-colors duration-200">
                <svg class="w-6 h-6 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
            </div>
            <h3 class="font-semibold text-xl text-gray-900 group-hover:text-[#0743ae] transition-colors duration-200 mb-2">Manage Projects</h3>
            <p class="text-gray-600 text-sm">View, edit, and oversee all company projects</p>
          </button>
          
          <!-- Enhanced create project button -->
          <button 
            @click="showCreateProjectModal = true"
            class="group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#0743ae] rounded-2xl p-8 transition-all duration-200 hover:shadow-xl hover:scale-105 text-left focus:outline-none focus:ring-2 focus:ring-[#0743ae] focus:ring-offset-2"
          >
            <div class="flex items-center space-x-4 mb-4">
              <div class="p-3 bg-[#0743ae]/10 group-hover:bg-[#0743ae]/20 rounded-xl transition-colors duration-200">
                <svg class="w-6 h-6 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
            </div>
            <h3 class="font-semibold text-xl text-gray-900 group-hover:text-[#0743ae] transition-colors duration-200 mb-2">Create Project</h3>
            <p class="text-gray-600 text-sm">Start a new project and assign team members</p>
          </button>
        </div>
      </div>

      <!-- Leave company section moved to bottom -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">Company Settings</h3>
            <p class="text-sm text-gray-600">Manage your company membership</p>
          </div>
          <!-- Smaller, less prominent leave company button -->
          <button 
            @click="handleLeaveCompany"
            class="px-4 py-2 text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Leave Company
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
  }catch(err){
    console.error('Failed to remove member:', err)
    error.value.message = 'Unable to remove member. Please try again.'
  }
}

</script>
