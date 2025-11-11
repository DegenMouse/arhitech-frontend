<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ title }}
        </h3>
        
        <!-- Search input -->
        <div class="mb-4">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search docTypes..."
            class="block w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
        </div>
        
        <!-- DocTypes list -->
        <div class="max-h-60 overflow-y-auto border border-gray-300 rounded">
          <div v-if="filteredDocTypes.length === 0" class="text-center py-4 text-gray-500">
            No docTypes found
          </div>
          
          <div v-for="docType in filteredDocTypes" :key="docType.id" 
               class="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
               @click="selectDocType(docType)">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ docType.name }}</p>
              <div class="flex items-center space-x-2 mt-1">
                <span :class="docType.isInput === '1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" 
                      class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ docType.isInput === '1' ? 'Input' : 'Output' }}
                </span>
                <span v-if="docType.tag" 
                      :class="{
                        'bg-yellow-100 text-yellow-800': docType.tag === 'CU',
                        'bg-purple-100 text-purple-800': docType.tag === 'avize',
                        'bg-indigo-100 text-indigo-800': docType.tag === 'studii'
                      }"
                      class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ docType.tag }}
                </span>
                <span class="text-xs text-gray-500">ID: {{ docType.id }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Selected docType display (for single selection) -->
        <div v-if="!multiple && selectedDocType" class="mt-4 p-3 bg-blue-50 rounded-lg">
          <p class="text-sm font-medium text-blue-900">Selected:</p>
          <p class="text-sm text-blue-800">{{ selectedDocType.name }}</p>
        </div>
        
        <!-- Selected docTypes display (for multiple selection) -->
        <div v-if="multiple && selectedDocTypes.length > 0" class="mt-4">
          <p class="text-sm font-medium text-gray-900 mb-2">Selected ({{ selectedDocTypes.length }}):</p>
          <div class="max-h-32 overflow-y-auto space-y-1">
            <div v-for="docType in selectedDocTypes" :key="docType.id" 
                 class="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
              <span class="text-blue-800">{{ docType.name }}</span>
              <button @click="removeSelectedDocType(docType.id)" 
                      class="text-red-600 hover:text-red-800 ml-2">
                ×
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button @click="cancel" 
                  class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button @click="confirm" 
                  :disabled="!canConfirm"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ multiple ? `Select ${selectedDocTypes.length}` : 'Select' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Select DocType'
  },
  docTypes: {
    type: Array,
    default: () => []
  },
  excludeIds: {
    type: Array,
    default: () => []
  },
  filterType: {
    type: String,
    default: null // 'input', 'output', or null for all
  },
  multiple: {
    type: Boolean,
    default: false
  },
  initialSelection: {
    type: [Object, Array],
    default: null
  }
})

const emit = defineEmits(['close', 'select'])

// Local state
const searchQuery = ref('')
const selectedDocType = ref(null)
const selectedDocTypes = ref([])

// Computed properties
const filteredDocTypes = computed(() => {
  let filtered = props.docTypes.filter(docType => {
    // Exclude specified IDs
    if (props.excludeIds.includes(docType.id)) return false
    
    // Filter by type if specified
    if (props.filterType === 'input' && docType.isInput !== '1') return false
    if (props.filterType === 'output' && docType.isInput !== '0') return false
    
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      return docType.name.toLowerCase().includes(query) ||
             docType.id.toString().includes(query) ||
             (docType.tag && docType.tag.toLowerCase().includes(query))
    }
    
    return true
  })
  
  return filtered.sort((a, b) => a.name.localeCompare(b.name))
})

const canConfirm = computed(() => {
  return props.multiple ? selectedDocTypes.value.length > 0 : selectedDocType.value !== null
})

// Methods
function selectDocType(docType) {
  if (props.multiple) {
    // Check if already selected
    if (selectedDocTypes.value.find(dt => dt.id === docType.id)) {
      removeSelectedDocType(docType.id)
    } else {
      selectedDocTypes.value.push(docType)
    }
  } else {
    selectedDocType.value = docType
  }
}

function removeSelectedDocType(id) {
  const index = selectedDocTypes.value.findIndex(dt => dt.id === id)
  if (index !== -1) {
    selectedDocTypes.value.splice(index, 1)
  }
}

function cancel() {
  emit('close')
}

function confirm() {
  if (props.multiple) {
    emit('select', selectedDocTypes.value)
  } else {
    emit('select', selectedDocType.value)
  }
}

// Watch for show prop changes to reset state
watch(() => props.show, (newShow) => {
  if (newShow) {
    searchQuery.value = ''
    
    if (props.multiple) {
      selectedDocTypes.value = Array.isArray(props.initialSelection) ? [...props.initialSelection] : []
    } else {
      selectedDocType.value = props.initialSelection || null
    }
  }
})
</script>