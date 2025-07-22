<!--
  components/modals/admin/manageProjects.vue
  ------------------------------------------
  Modal component for managing company projects in the admin interface.
  Displays a list of all projects with their details and team members.
  Features project editing, deletion, and team member management.
  Integrates with editProject modal for project modifications.
  Handles complex user assignment changes with add/remove operations.
  Provides comprehensive project overview with member lists and action buttons.
  Emits events for project refetching after modifications.
-->
<template>
  <!-- Modal overlay with backdrop -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- Modal content container -->
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Modal header with title and close button -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Manage Projects</h2>
        <!-- Close button with X icon -->
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Projects list section -->
      <div class="p-6">
        <!-- Empty state when no projects -->
        <div v-if="projects.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-lg">No projects found</p>
          <p class="text-sm mt-2">Create your first project to get started</p>
        </div>

        <!-- Projects list -->
        <div v-else class="space-y-4">
          <!-- Individual project card -->
          <div 
            v-for="project in projects" 
            :key="project.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <!-- Project header with name, deadline, and action buttons -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800">
                  {{ project.attributes?.name || 'Unnamed Project' }}
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  Deadline: {{ project.attributes?.deadline || 'no date' }}
                </p>
              </div>
              <!-- Project action buttons -->
              <div class="flex space-x-2">
                <!-- Edit project button -->
                <button
                  @click="editProjBtn(project)"
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <!-- Delete project button -->
                <button
                  @click="deleteProject(project.id)"
                  class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            <!-- Project team members section -->
            <div class="mt-3">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Team Members:</h4>
              <!-- Members list with tags -->
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="member in project.users_in_project || []" 
                  :key="member.id"
                  class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {{ member.attributes?.username || member.attributes?.email || 'Unknown User' }}
                </span>
                <!-- Empty state for no members -->
                <span v-if="!project.users_in_project?.length" class="text-sm text-gray-500 italic">
                  No members assigned
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    

    <!-- Edit project modal -->
    <ModalsAdminEditProject
      v-if="showEditProjectModal"
      :prevFormData="oldData"
      :members="members"
      @close="showEditProjectModal = false"
      @edit-project="handleEditProject"
    />
  </div>
</template>

<script setup>
// Component props for projects and members data
const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  },
  members: {
    type: Array,
    default: () => []
  }
})
// Component events
const emit = defineEmits(['close', 'reFetchProjects'])

// Get runtime configuration for API
const dbApi = useRuntimeConfig().public.dbApi

// Modal state for edit project modal
const showEditProjectModal = ref(false)

// Variables to store edit state
var editedProjectId = null
var oldData = {
  name: '',
  deadline: '',
  usersInProject: []
}

/**
 * Opens the edit project modal with current project data
 * Prepares the form data for editing
 * @param {Object} project - The project object to edit
 */
const editProjBtn = (project) => {
  // Set form data from current project
  oldData.name = project.attributes?.name || ''
  oldData.deadline = project.attributes?.deadline || ''
  oldData.usersInProject = project.users_in_project?.map(member => member.id) || []
  
  // Store project ID for editing
  editedProjectId = project.id

  // Show edit modal
  showEditProjectModal.value = true
}

/**
 * Handles project editing with comprehensive change detection
 * Updates project attributes and manages team member changes
 * @param {Object} newData - The updated project data
 */
const handleEditProject = async (newData) => {
  console.log("project was edited...processing")
  console.log(newData)
  let hasChanges = false;
  
  // Check for changes in project attributes (excluding users)
  for (const key in oldData) {
    if (key === 'usersInProject') continue;

    if (oldData[key] !== newData[key]) {
      hasChanges = true;
      break;
    }
  }

  console.log("hasChanges", hasChanges)
  console.log("projectId", editedProjectId)

  // Update project attributes if changes detected
  if(hasChanges){
    await fetch(dbApi + '/data/projects/' + editedProjectId, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          id: editedProjectId,
          attributes: {
            name: newData.name,
            deadline: newData.deadline
          }
        }
      })
    })
    .then(res => {
      if(!res.ok){
        throw new Error('Failed to edit project')
      }
    })
  }

  // Handle team member changes - Add new users to project
  for (const userId of newData.usersInProject) {
    if (!oldData.usersInProject.includes(userId)) {
      fetch(dbApi + '/data/users_in_project', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            attributes: {
              id: "",
              project_id: editedProjectId,
              user_id: userId
            }
          }
        })
      }).then(res => {
        if (!res.ok) {
          throw new Error('Failed to add user to project')
        }
      }).catch(err => {
        console.error('Failed to add user to project:', err)
      })
    }
  }

  // Handle team member changes - Remove users from project
  for (const userId of oldData.usersInProject) {
    if (!newData.usersInProject.includes(userId)) {
      fetch(dbApi + '/data/users_in_project/?filter=project_id=' + editedProjectId + ',user_id=' + userId, {
        method: 'DELETE'
      }).then(res => {
        if (!res.ok) {
          throw new Error('Failed to remove user from project')
        }
      }).catch(err => {
        console.error('Failed to remove user from project:', err)
      })
    }
  }

  // Emit refetch event after all operations are complete
  emit('reFetchProjects')

  console.log("Changes detected:", hasChanges);
}

/**
 * Deletes a project after user confirmation
 * @param {string} projectId - The ID of the project to delete
 */
const deleteProject = (projectId) => {
  if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
    fetch(dbApi + '/data/projects/' + projectId, {
      method: 'DELETE'
    }).then(res => {
      if(!res.ok){
        throw new Error('Failed to delete project')
      }
    })
  }
}




 
</script>
