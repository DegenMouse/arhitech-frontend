<!--
  components/modals/admin/editProject.vue
  --------------------------------------
  Modal component for creating and editing projects in the admin interface.
  Features form inputs for project name, deadline, and team member selection.
  Supports both creation (isNew=true) and editing modes with validation.
  Includes date validation to prevent past deadlines and required field checks.
  Emits events for project creation/editing with form data.
  Provides responsive design with scrollable content for mobile compatibility.
-->
<template>
  <!-- Modal overlay with backdrop -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- Modal content container -->
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Modal header with title and close button -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">{{ isNew ? 'Create New Project' : 'Edit Project' }}</h2>
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

      <!-- Project form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Project name input field -->
        <div>
          <label for="projectName" class="block text-sm font-medium text-gray-700 mb-2">
            Project Name *
          </label>
          <input
            id="projectName"
            v-model="project.name"
            type="text"
            
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter project name"
          />
        </div>

        <!-- Project deadline input field -->
        <div>
          <label for="deadline" class="block text-sm font-medium text-gray-700 mb-2">
            Deadline *
          </label>
          <input
            id="deadline"
            v-model="project.deadline"
            type="date"
            
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Person type dropdown -->
        <div>
          <label for="personType" class="block text-sm font-medium text-gray-700 mb-2">
            Forma Juridica *
          </label>
          <select
            id="personType"
            v-model="project.persoana_fizica"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="1">Persoana fizica</option>
            <option :value="0">Persoana juridica</option>
          </select>
        </div>

        <!-- Team members selection with checkboxes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Team Members
          </label>
          <!-- Scrollable members list -->
          <div class="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
            <!-- Empty state for no members -->
            <div v-if="members.length === 0" class="text-sm text-gray-500 italic">
              No team members available
            </div>
            <!-- Member checkbox list -->
            <div 
              v-else
              v-for="member in members" 
              :key="member.id"
              class="flex items-center space-x-3"
            >
              <input
                :id="'member-' + member.id"
                v-model="project.usersInProject"
                :value="member.id"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label :for="'member-' + member.id" class="text-sm text-gray-700">
                {{ member.username || member.email || 'Unknown User' }}
              </label>
            </div>
            
          </div>
        </div>

        <!-- Error message display -->
        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <!-- Form action buttons -->
        <div class="flex justify-end space-x-3 pt-4">
          <!-- Cancel button -->
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <!-- Submit button with loading state -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Project' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Component props definition
const props = defineProps({
  members: {
    type: Array,
    default: () => []
  },
  isNew: {
    type: Boolean,
    default: false
  },
  prevData: {
    type: Object,
    default: () => ({
      name: '',
      deadline: '',
      persoana_fizica: 1,
      usersInProject: []
    })
  }
})

const dbApi = useRuntimeConfig().public.dbApi
const { auth, company } = useUser()
const {success} = useUI()

const project = reactive({
  ...props.prevData
})



// Component events
const emit = defineEmits(['close', 'submit'])

// Form validation state
const error = ref('')
// const isSubmitting = ref(false)

/**
 * Handles form submission with validation
 * Validates required fields and date constraints
 * Emits appropriate event based on isNew prop
 */
const handleSubmit = async () => {
  console.log("handleSubmit")
  console.log(props.isNew)

  const addUsers = asymDiff(project.usersInProject, props.prevData.usersInProject)
  const rmvUsers = asymDiff(props.prevData.usersInProject, project.usersInProject)

  // Check if deadline is in the past
  if (new Date(project.deadline) < new Date()) {
    error.value = 'Deadline cannot be in the past'
    return
  }

  // Clear any previous errors
  error.value = ''

  project.name = project.name.trim()
  const method = props.isNew ? 'POST' : 'PATCH'

  try{
    // Create the project first
    const res = await fetch(dbApi + '/data/projects' + (props.isNew ? '' : '/' + project.id), {
      method: method,
      body: JSON.stringify({
        data: {
          ...(props.isNew ? {} : { id: project.id }),
          attributes: {
            ...(props.isNew ? {} : { id: project.id }),
            name: project.name,
            deadline: project.deadline,
            persoana_fizica: project.persoana_fizica,
            company_id: company.value.id,
            admin_id: auth.value.id
          }
        }
      })
    })
    if(!res.ok){
      throw new Error('Failed to edit/ add project')
    }else{
      console.log("project edited/ added")
    }
    const data = await res.json()

    const projectId = data.data.id

    // Assign users to the project
    for (const userId of addUsers) {
      const res = await fetch(dbApi + '/data/users_in_project', {
        method: 'POST',
        body: JSON.stringify({
          data: { attributes: { project_id: projectId, user_id: userId } }
        })
      })
      if (!res.ok) {
        throw new Error('Failed to add user to project: ' + userId)
      }
    }

    for (const userId of rmvUsers) {
      const res = await fetch(dbApi + '/data/users_in_project/?filter=project_id=' + projectId + ',user_id=' + userId, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('Failed to remove user from project: ' + userId)
      }
    }

    success.value.message = 'Project created successfully'

    emit('close')
    await fetchProjects()
  }catch(err){
    console.error('Failed to create project:', err)
    error.value.message = 'Unable to create project. Please try again.'
  }

  // emit('close')
}
</script>
