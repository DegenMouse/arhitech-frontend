<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">{{ isNew ? 'Create New Project' : 'Edit Project' }}</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Project Name -->
        <div>
          <label for="projectName" class="block text-sm font-medium text-gray-700 mb-2">
            Project Name *
          </label>
          <input
            id="projectName"
            v-model="formData.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter project name"
          />
        </div>

        <!-- Deadline -->
        <div>
          <label for="deadline" class="block text-sm font-medium text-gray-700 mb-2">
            Deadline *
          </label>
          <input
            id="deadline"
            v-model="formData.deadline"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Users Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Team Members
          </label>
          <div class="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
            <div v-if="members.length === 0" class="text-sm text-gray-500 italic">
              No team members available
            </div>
            <div 
              v-else
              v-for="member in members" 
              :key="member.id"
              class="flex items-center space-x-3"
            >
              <input
                :id="'member-' + member.id"
                v-model="formData.usersInProject"
                :value="member.id"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label :for="'member-' + member.id" class="text-sm text-gray-700">
                {{ member.attributes?.username || member.attributes?.email || 'Unknown User' }}
              </label>
            </div>
            
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
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
const props = defineProps({
  members: {
    type: Array,
    default: () => []
  },
  isNew: {
    type: Boolean,
    default: false
  },
  prevFormData: {
    type: Object,
    default: () => ({
      name: '',
      deadline: '',
      usersInProject: []
    })
  }
})

const emit = defineEmits(['close', 'create-project', 'edit-project'])

const formData = reactive({
  name: props.prevFormData.name,
  deadline: props.prevFormData.deadline,
  usersInProject: props.prevFormData.usersInProject
})

const error = ref('')
// const isSubmitting = ref(false)

const handleSubmit = async () => {
    
  if (!formData.name.trim()) {
    error.value = 'Project name is required'
    return
  }

  if (!formData.deadline) {
    error.value = 'Deadline is required'
    return
  }else{
    const selectedDate = new Date(formData.deadline);
    const currentDate = new Date();
    
    if (selectedDate < currentDate) {
      error.value = 'Deadline cannot be in the past'
      return
    }
  }

  error.value = ''

  const submitObject = {
    name: formData.name.trim(),
    deadline: formData.deadline,
    usersInProject: [...formData.usersInProject]
  }

  if(props.isNew){
    emit('create-project', submitObject)
  }else{
    emit('edit-project', submitObject)
  }

  emit('close')
}
</script>
