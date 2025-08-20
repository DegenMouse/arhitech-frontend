<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto w-[600px] shadow-lg rounded-md bg-white flex flex-col max-h-[80vh]">
      <!-- Fixed Header -->
      <div class="flex-shrink-0 p-5 border-b bg-white rounded-t-md">
        <h3 class="text-lg font-medium text-gray-900">
          {{ isNew ? 'Add New DocType' : 'Edit DocType' }}
        </h3>
      </div>
      
      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-5">
        <form @submit.prevent="save">
          <!-- Name Field -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Name <span class="text-red-500">*</span>
            </label>
            <input v-model="localForm.name"
                   type="text"
                   required
                   class="block w-full border border-gray-300 rounded px-3 py-2">
          </div>

          <!-- Type Field -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Type <span class="text-red-500">*</span>
            </label>
            <select v-model="localForm.isInput"
                    class="block w-full border border-gray-300 rounded px-3 py-2">
              <option :value="1">Input Document</option>
              <option :value="0">Output Document</option>
            </select>
          </div>

          <!-- Tag Field -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tag (optional)
            </label>
            <select v-model="localForm.tag"
                    class="block w-full border border-gray-300 rounded px-3 py-2">
              <option :value="null">None</option>
              <option value="CU">CU (Construction Permit)</option>
              <option value="avize">Avize (Approvals)</option>
              <option value="studii">Studii (Studies)</option>
            </select>
          </div>

          <!-- Location Field -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Location (optional)
            </label>
            <select v-model="localForm.localitate_id"
                    class="block w-full border border-gray-300 rounded px-3 py-2">
              <option :value="null">General (all locations)</option>
              <option value="155243">Timișoara</option>
              <option value="155289">Ghiroda</option>
              <option value="155314">Giroc</option>
            </select>
          </div>


          <!-- Required Documents Field -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Required Documents
            </label>
            
            <!-- Selected docs display -->
            <div v-if="selectedDocs.length > 0" class="mb-2 p-3 bg-gray-50 rounded border">
              <div class="text-sm text-gray-600 mb-2">Selected ({{ selectedDocs.length }}):</div>
              <div class="flex flex-wrap gap-1">
                <div v-for="doc in selectedDocs" :key="doc.id" 
                     class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {{ doc.name }}
                  <button type="button" @click="removeDoc(doc.id)"
                          class="ml-1 text-blue-600 hover:text-blue-800">×</button>
                </div>
              </div>
            </div>

            <!-- Add docs section -->
            <div class="border border-gray-300 rounded">
              <!-- Search -->
              <div class="p-3 border-b">
                <input v-model="docSearch"
                       type="text"
                       placeholder="Search documents..."
                       class="w-full px-3 py-1 border border-gray-300 rounded text-sm">
              </div>
              
              <!-- Doc list -->
              <div class="max-h-40 overflow-y-auto">
                <div v-if="filteredDocs.length === 0" class="p-3 text-center text-gray-500 text-sm">
                  No documents found
                </div>
                <div v-for="doc in filteredDocs" :key="doc.id"
                     class="p-2 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-b-0"
                     @click="addDoc(doc)">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">{{ doc.name }}</div>
                      <div class="text-xs text-gray-500">
                        ID: {{ doc.id }} | 
                        <span :class="Number(doc.isInput) ? 'text-blue-600' : 'text-green-600'">
                          {{ Number(doc.isInput) ? 'Input' : 'Output' }}
                        </span>
                        <span v-if="doc.tag" class="ml-1">| {{ doc.tag }}</span>
                      </div>
                    </div>
                    <div v-if="isDocSelected(doc.id)" class="text-blue-600">✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- PDF Upload for new OUTPUT documents -->
          <div v-if="isNew && localForm.isInput === 0" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Template PDF <span class="text-red-500">*</span>
            </label>
            
            <div v-if="!selectedFile" class="border-2 border-dashed border-gray-300 rounded p-4 text-center">
              <button type="button" @click="showUploadModal = true"
                      class="text-blue-600 hover:text-blue-800">
                Click to select PDF template
              </button>
              <p class="text-xs text-gray-500 mt-1">Required for output documents</p>
            </div>
            
            <div v-else class="p-3 bg-green-50 border border-green-200 rounded">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm font-medium text-green-800">{{ selectedFile.name }}</div>
                </div>
                <button type="button" @click="removeFile"
                        class="text-red-600 hover:text-red-800">Remove</button>
              </div>
            </div>
            
            <div v-if="fileError" class="text-sm text-red-500 mt-1">{{ fileError }}</div>
          </div>
        </form>
      </div>
      
      <!-- Fixed Footer with Buttons -->
      <div class="flex-shrink-0 p-5 border-t bg-white rounded-b-md">
        <div class="flex items-center justify-end space-x-4">
          <button type="button" @click="$emit('close')" 
                  class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button type="submit" 
                  @click="save"
                  :disabled="saving || !isFormValid"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {{ saving ? 'Saving...' : (isNew ? 'Create' : 'Save') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <ModalsUploadFile 
      v-if="showUploadModal"
      :singleFile="true"
      fileName="Template PDF"
      @close="showUploadModal = false"
      @upload="handleFileUpload"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  isNew: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  },
  docTypes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

// Local form state
const localForm = reactive({
  name: '',
  isInput: 1,
  tag: null,
  localitate_id: null,
  requiredDocs: []
})

// File upload state
const selectedFile = ref(null)
const fileError = ref(null)
const showUploadModal = ref(false)

// Required docs state
const selectedDocIds = ref(new Set())
const docSearch = ref('')

// Computed properties
const selectedDocs = computed(() => {
  return props.docTypes.filter(doc => selectedDocIds.value.has(doc.id))
})

const filteredDocs = computed(() => {
  return props.docTypes.filter(doc => {
    // Exclude already selected docs
    if (selectedDocIds.value.has(doc.id)) return false
    
    // Search filter
    if (docSearch.value) {
      const query = docSearch.value.toLowerCase()
      return doc.name.toLowerCase().includes(query) ||
             doc.id.toString().includes(query) ||
             (doc.tag && doc.tag.toLowerCase().includes(query))
    }
    
    return true
  }).sort((a, b) => a.name.localeCompare(b.name))
})

const isFormValid = computed(() => {
  if (!localForm.name.trim()) return false
  if (props.isNew && localForm.isInput === 0 && !selectedFile.value) return false
  return true
})

// Methods
function addDoc(doc) {
  selectedDocIds.value.add(doc.id)
  if (!localForm.requiredDocs.includes(doc.id)) {
    localForm.requiredDocs.push(doc.id)
  }
}

function removeDoc(id) {
  selectedDocIds.value.delete(id)
  const formIndex = localForm.requiredDocs.indexOf(id)
  if (formIndex !== -1) {
    localForm.requiredDocs.splice(formIndex, 1)
  }
}

function isDocSelected(id) {
  return selectedDocIds.value.has(id)
}

function handleFileUpload(file) {
  fileError.value = null
  
  // Validate file type
  if (file.type !== 'application/pdf') {
    fileError.value = 'Only PDF files are allowed'
    return
  }
  
  // Validate file size (50MB limit)
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    fileError.value = 'File size must be less than 50MB'
    return
  }
  
  selectedFile.value = file
}

function removeFile() {
  selectedFile.value = null
  fileError.value = null
}


function save() {
  if (!isFormValid.value) return
  
  // Emit save with form data and file
  emit('save', {
    form: { ...localForm },
    file: selectedFile.value
  })
}

// Initialize form when props change (only once when modal opens)
let isInitialized = false

watchEffect(() => {
  if (!isInitialized) {
    // Copy form data only on first initialization
    Object.assign(localForm, props.form)
    
    // Initialize selected docs
    if (props.form.requiredDocs && props.form.requiredDocs.length > 0) {
      selectedDocIds.value = new Set(props.form.requiredDocs)
    } else {
      selectedDocIds.value = new Set()
    }
    
    isInitialized = true
  }
})
</script>