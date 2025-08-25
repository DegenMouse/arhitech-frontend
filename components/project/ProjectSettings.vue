<!--
  components/project/ProjectSettings.vue
  --------------------------------------
  Single project settings panel with focused design for project configuration.
  Features inline editing forms, member management, and project actions.
  Designed specifically for managing individual projects with better UX.
  Includes expandable sections and direct editing capabilities.
-->
<template>
  <div class="space-y-6">
    
    <!-- Admin Access Required Message -->
    <div v-if="!isAdmin" class="text-center py-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Admin Access Required</h3>
      <p class="text-gray-600">Only company administrators can access project settings.</p>
    </div>
    
    <!-- Project Information Section (Admin Only) -->
    <div v-else class="space-y-6">
      <!-- Basic Information Card -->
      <div class="border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Project Information</h3>
          <button
            @click="toggleEditMode"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {{ isEditingBasic ? 'Cancel' : 'Edit' }}
          </button>
        </div>
        
        <!-- Display Mode -->
        <div v-if="!isEditingBasic" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-500">Project Name</label>
            <p class="text-base text-gray-900">{{ project.instance?.attributes?.name || 'Unnamed Project' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500">Deadline</label>
            <p class="text-base text-gray-900">{{ formatDate(project.instance?.attributes?.deadline) || 'No deadline set' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-500">Phase</label>
            <p class="text-base text-gray-900">{{ project.instance?.relationships?.phase_id?.data?.id || 'No phase' }}</p>
          </div>
        </div>
        
        <!-- Edit Mode -->
        <form v-else @submit.prevent="saveBasicInfo" class="space-y-4">
          <div>
            <label for="projectName" class="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              id="projectName"
              v-model="editForm.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label for="projectDeadline" class="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input
              id="projectDeadline"
              v-model="editForm.deadline"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="flex space-x-3 pt-2">
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Save Changes
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Team Members Card -->
      <div class="border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Team Members</h3>
          <button
            @click="toggleMemberEdit"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {{ isEditingMembers ? 'Done' : 'Manage' }}
          </button>
        </div>
        
        <!-- Members Display -->
        <div v-if="!isEditingMembers">
          <div v-if="projectMembers.length > 0" class="flex flex-wrap gap-2">
            <div 
              v-for="member in projectMembers" 
              :key="member.id"
              class="flex items-center space-x-2 bg-blue-50 text-blue-800 px-3 py-2 rounded-full text-sm"
            >
              <div class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium">
                {{ (member.username || member.email || 'U').charAt(0).toUpperCase() }}
              </div>
              <span>{{ member.username || member.email || 'Unknown User' }}</span>
            </div>
          </div>
          <p v-else class="text-gray-500 text-sm italic">No team members assigned to this project</p>
        </div>
        
        <!-- Members Edit Mode -->
        <div v-else class="space-y-4">
          <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-4">
            <div v-if="allCompanyMembers.length === 0" class="text-gray-500 text-sm italic">
              No company members available
            </div>
            <div v-else class="space-y-3">
              <label 
                v-for="member in allCompanyMembers" 
                :key="member.id"
                class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  v-model="selectedMembers"
                  :value="member.id"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {{ (member.username || member.email || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ member.username || 'No username' }}</p>
                    <p class="text-xs text-gray-500">{{ member.email || 'No email' }}</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <button
            @click="saveMemberChanges"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Update Team Members
          </button>
        </div>
      </div>

      <!-- Project Clients Card -->
      <div class="border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Project Clients</h3>
          <button
            @click="toggleClientEdit"
            class="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {{ isEditingClients ? 'Done' : 'Manage' }}
          </button>
        </div>
        
        <!-- Clients Display -->
        <div v-if="!isEditingClients">
          <div v-if="projectClients.length > 0" class="flex flex-wrap gap-2">
            <div 
              v-for="client in projectClients" 
              :key="client.id"
              class="flex items-center space-x-2 bg-green-50 text-green-800 px-3 py-2 rounded-full text-sm"
            >
              <div class="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs font-medium">
                {{ (client.username || client.email || 'C').charAt(0).toUpperCase() }}
              </div>
              <span>{{ client.username || client.email || 'Unknown Client' }}</span>
            </div>
          </div>
          <p v-else class="text-gray-500 text-sm italic">No clients assigned to this project</p>
        </div>
        
        <!-- Clients Edit Mode -->
        <div v-else class="space-y-4">
          <!-- Add Client by ID -->
          <div class="border border-gray-200 rounded-md p-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Add Client by ID</label>
            <div class="flex space-x-2">
              <input
                v-model="newClientId"
                type="text"
                placeholder="Enter client user ID"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                @click="addClientById"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                Add Client
              </button>
            </div>
          </div>
          
          <!-- Current Clients List -->
          <div v-if="projectClients.length > 0" class="border border-gray-200 rounded-md p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Current Clients</h4>
            <div class="space-y-2">
              <div 
                v-for="client in projectClients" 
                :key="client.id"
                class="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                    {{ (client.username || client.email || 'C').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ client.username || 'No username' }}</p>
                    <p class="text-xs text-gray-500">{{ client.email || 'No email' }}</p>
                  </div>
                </div>
                <button
                  @click="removeClient(client.id)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          
          <button
            @click="isEditingClients = false"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Done Managing Clients
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="border border-red-200 rounded-lg p-6 bg-red-50">
        <h3 class="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
        <p class="text-sm text-red-700 mb-4">Once you delete a project, there is no going back. Please be certain.</p>
        <button
          @click="deleteProject"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Delete Project
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component props
const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

// Component events
const emit = defineEmits(['fetchProject'])

// Get runtime configuration and user data
const dbApi = useRuntimeConfig().public.dbApi
const { company } = useUser()
const { success, error } = useUI()

// Check if current user is admin
const isAdmin = computed(() => {
  return company.value?.isAdmin === true
})

// Edit mode states
const isEditingBasic = ref(false)
const isEditingMembers = ref(false)
const isEditingClients = ref(false)

// Reactive data for project members and all company members
const projectMembers = ref([])
const allCompanyMembers = ref([])
const selectedMembers = ref([])

// Reactive data for project clients
const projectClients = ref([])
const newClientId = ref('')

// Edit form data
const editForm = reactive({
  name: '',
  deadline: ''
})

/**
 * Fetch project members
 */
const fetchProjectMembers = () => {
  if (!props.project.instance?.id) return
  
  fetch(dbApi + '/data/projects/' + props.project.instance.id + '/users_in_project/?include=user_id')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch project members')
      }
      return res.json()
    })
    .then(data => {
      // Map members with their user data
      projectMembers.value = data.data.map(userInProject => {
        const userData = data.includes?.find(include => 
          include.id === userInProject.relationships?.user_id?.data?.id
        )
        return {
          id: userData?.id,
          username: userData?.attributes?.username,
          email: userData?.attributes?.email
        }
      }).filter(member => member.id) // Filter out any invalid members
    })
    .catch(err => {
      console.error('Failed to fetch project members:', err)
    })
}

/**
 * Fetch all company members for the edit modal
 */
const fetchCompanyMembers = () => {
  if (!company.value?.id) return

  fetch(dbApi + '/data/companies/' + company.value.id + '/users_in_company/?include=user_id')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch company members')
      }
      return res.json()
    })
    .then(data => {
      // Map company members with their user data
      allCompanyMembers.value = data.data.map(userInCompany => {
        const userData = data.includes?.find(include => 
          include.id === userInCompany.relationships?.user_id?.data?.id
        )
        return {
          id: userData?.id,
          username: userData?.attributes?.username,
          email: userData?.attributes?.email
        }
      }).filter(member => member.id) // Filter out any invalid members
    })
    .catch(err => {
      console.error('Failed to fetch company members:', err)
    })
}

// Watch for project changes and fetch members
watch(() => props.project.instance?.id, (newId) => {
  if (newId) {
    fetchProjectMembers()
  }
}, { immediate: true })

// Watch for company changes and fetch company members
watch(() => company.value?.id, (newId) => {
  if (newId) {
    fetchCompanyMembers()
  }
}, { immediate: true })

/**
 * Fetch project clients
 */
const fetchProjectClients = () => {
  if (!props.project.instance?.id) return
  
  fetch(dbApi + '/data/projects/' + props.project.instance.id + '/clients_in_project/?include=user_id')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch project clients')
      }
      return res.json()
    })
    .then(data => {
      // Map clients with their user data
      projectClients.value = data.data.map(clientInProject => {
        const userData = data.includes?.find(include => 
          include.id === clientInProject.relationships?.user_id?.data?.id
        )
        return {
          id: userData?.id,
          username: userData?.attributes?.username,
          email: userData?.attributes?.email
        }
      }).filter(client => client.id) // Filter out any invalid clients
    })
    .catch(err => {
      console.error('Failed to fetch project clients:', err)
    })
}

// Watch for project changes and fetch clients
watch(() => props.project.instance?.id, (newId) => {
  if (newId) {
    fetchProjectClients()
  }
}, { immediate: true })

/**
 * Format date for display
 */
const formatDate = (dateString) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Toggle basic info edit mode
 */
const toggleEditMode = () => {
  if (!isAdmin.value) return
  
  if (isEditingBasic.value) {
    cancelEdit()
  } else {
    const projectData = props.project.instance?.attributes
    editForm.name = projectData?.name || ''
    editForm.deadline = projectData?.deadline || ''
    isEditingBasic.value = true
  }
}

/**
 * Cancel editing and reset form
 */
const cancelEdit = () => {
  isEditingBasic.value = false
  editForm.name = ''
  editForm.deadline = ''
}

/**
 * Save basic project information
 */
const saveBasicInfo = async () => {
  if (!isAdmin.value || !props.project.instance?.id) return
  
  try {
    const res = await fetch(dbApi + '/data/projects/' + props.project.instance.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          id: props.project.instance.id,
          attributes: {
            name: editForm.name,
            deadline: editForm.deadline
          }
        }
      })
    })
    
    if (!res.ok) {
      throw new Error('Failed to update project')
    }
    
    success.value.message = 'Project information updated successfully'
    isEditingBasic.value = false
    emit('fetchProject')
  } catch (err) {
    console.error('Failed to update project:', err)
    error.value.message = 'Failed to update project information'
  }
}

/**
 * Toggle member edit mode
 */
const toggleMemberEdit = () => {
  if (!isAdmin.value) return
  
  if (isEditingMembers.value) {
    isEditingMembers.value = false
  } else {
    selectedMembers.value = projectMembers.value.map(member => member.id)
    isEditingMembers.value = true
  }
}

/**
 * Save member changes
 */
const saveMemberChanges = async () => {
  if (!isAdmin.value || !props.project.instance?.id) return
  
  try {
    const currentMemberIds = projectMembers.value.map(member => member.id)
    const addUsers = selectedMembers.value.filter(id => !currentMemberIds.includes(id))
    const removeUsers = currentMemberIds.filter(id => !selectedMembers.value.includes(id))
    
    // Add new users
    for (const userId of addUsers) {
      const res = await fetch(dbApi + '/data/users_in_project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: { 
            attributes: { 
              project_id: props.project.instance.id, 
              user_id: userId 
            } 
          }
        })
      })
      if (!res.ok) {
        throw new Error('Failed to add user to project: ' + userId)
      }
    }
    
    // Remove users
    for (const userId of removeUsers) {
      const res = await fetch(dbApi + '/data/users_in_project/?filter=project_id=' + props.project.instance.id + ',user_id=' + userId, {
        method: 'DELETE'
      })
      if (!res.ok) {
        throw new Error('Failed to remove user from project: ' + userId)
      }
    }
    
    success.value.message = 'Team members updated successfully'
    isEditingMembers.value = false
    fetchProjectMembers() // Refresh member list
  } catch (err) {
    console.error('Failed to update team members:', err)
    error.value.message = 'Failed to update team members'
  }
}

/**
 * Toggle client edit mode
 */
const toggleClientEdit = () => {
  if (!isAdmin.value) return
  isEditingClients.value = !isEditingClients.value
  if (!isEditingClients.value) {
    newClientId.value = ''
  }
}

/**
 * Add a client by their user ID
 */
const addClientById = async () => {
  if (!isAdmin.value || !props.project.instance?.id || !newClientId.value.trim()) return
  
  try {
    const res = await fetch(dbApi + '/data/clients_in_project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: { 
          attributes: { 
            project_id: props.project.instance.id, 
            user_id: newClientId.value.trim() 
          } 
        }
      })
    })
    
    if (!res.ok) {
      throw new Error('Failed to add client to project')
    }
    
    success.value.message = 'Client added successfully'
    newClientId.value = ''
    fetchProjectClients() // Refresh client list
  } catch (err) {
    console.error('Failed to add client:', err)
    error.value.message = 'Failed to add client to project'
  }
}

/**
 * Remove a client from the project
 */
const removeClient = async (clientId) => {
  if (!isAdmin.value || !props.project.instance?.id) return
  
  try {
    const res = await fetch(dbApi + '/data/clients_in_project/?filter=project_id=' + props.project.instance.id + ',user_id=' + clientId, {
      method: 'DELETE'
    })
    
    if (!res.ok) {
      throw new Error('Failed to remove client from project')
    }
    
    success.value.message = 'Client removed successfully'
    fetchProjectClients() // Refresh client list
  } catch (err) {
    console.error('Failed to remove client:', err)
    error.value.message = 'Failed to remove client from project'
  }
}

/**
 * Deletes the current project after user confirmation
 */
const deleteProject = () => {
  if (!isAdmin.value || !props.project.instance) return
  
  if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
    fetch(dbApi + '/data/projects/' + props.project.instance.id, {
      method: 'DELETE'
    }).then(res => {
      if(!res.ok){
        throw new Error('Failed to delete project')
      }
      // Navigate back to projects list after deletion
      navigateTo('/projects')
    }).catch(err => {
      console.error('Failed to delete project:', err)
    })
  }
}
</script>