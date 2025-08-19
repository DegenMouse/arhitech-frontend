<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">DocTypes Management</h1>
      <button @click="openAddModal" 
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
        + Add New DocType
      </button>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Loading docTypes...</p>
    </div>
    
    <!-- DocTypes table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Followed By</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required Docs</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Actions</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Manage</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="docType in docTypes" :key="docType.id" 
              :class="docType.isNull ? 'bg-gray-100 hover:bg-gray-200' : 'hover:bg-gray-50'">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ docType.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ docType.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="docType.isInput === '1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ docType.isInput === '1' ? 'Input' : 'Output' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span v-if="docType.tag" 
                    :class="{
                      'bg-yellow-100 text-yellow-800': docType.tag === 'CU',
                      'bg-purple-100 text-purple-800': docType.tag === 'avize',
                      'bg-indigo-100 text-indigo-800': docType.tag === 'studii'
                    }"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ docType.tag }}
              </span>
              <span v-else class="text-gray-400 text-xs">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ docType.localitate_name || (docType.localitate_id ? `ID: ${docType.localitate_id}` : 'General') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span v-if="docType.followedBy_name" class="text-blue-600">
                {{ docType.followedBy_name }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <button v-if="docType.requiredDocs && docType.requiredDocs.length > 0" 
                      @click="openRequiredDocsModal(docType)"
                      class="text-blue-600 hover:text-blue-900 text-xs">
                View ({{ docType.requiredDocs.length }})
              </button>
              <span v-else class="text-gray-400 text-xs">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <!-- Template actions for output docTypes -->
              <template v-if="docType.isInput === '0'">
                <button @click="openUploadModal(docType)"
                        class="text-indigo-600 hover:text-indigo-900 mr-2 text-xs">
                  {{ docType.hasTemplate ? 'Update' : 'Upload' }}
                </button>
                <button @click="viewTemplate(docType)"
                        class="text-green-600 hover:text-green-900 mr-2 text-xs">
                  View
                </button>
                <button v-if="docType.hasTemplate"
                        @click="removeTemplate(docType)"
                        class="text-orange-600 hover:text-orange-900 text-xs">
                  Remove
                </button>
              </template>
              <span v-else class="text-gray-400 text-xs">N/A</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="openEditModal(docType)"
                      class="text-blue-600 hover:text-blue-900 mr-2 text-xs">
                Edit
              </button>
              <button @click="deleteDocType(docType)"
                      class="text-red-600 hover:text-red-900 text-xs">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Upload Modal -->
    <ModalsUploadFile 
      v-if="uploadModal.show" 
      :singleFile="true" 
      :fileName="uploadModal.docType?.name"
      @close="closeUploadModal" 
      @upload="handleTemplateUpload" 
    />

    <!-- Template Viewer Modal -->
    <ModalsFile
      v-if="viewModal.show"
      :url="viewModal.url"
      @close="closeViewModal"
    />

    <!-- Required Docs Viewer Modal -->
    <DevRequiredDocsViewer
      :show="requiredDocsModal.show"
      :docType="requiredDocsModal.docType"
      :requiredDocs="requiredDocsModal.docType?.requiredDocs"
      @close="closeRequiredDocsModal"
    />

    <!-- Edit DocType Modal -->
    <div v-if="editModal.show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editModal.isNew ? 'Add New DocType' : `Edit DocType "${editModal.docType?.name}"` }}
          </h3>
          
          <form @submit.prevent="saveDocType">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input v-model="editModal.form.name"
                     type="text"
                     required
                     class="block w-full border border-gray-300 rounded px-3 py-2">
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select v-model="editModal.form.isInput"
                      class="block w-full border border-gray-300 rounded px-3 py-2">
                <option :value="1">Input Document</option>
                <option :value="0">Output Document</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tag (optional)
              </label>
              <select v-model="editModal.form.tag"
                      class="block w-full border border-gray-300 rounded px-3 py-2">
                <option :value="null">None</option>
                <option value="CU">CU (Construction Permit)</option>
                <option value="avize">Avize (Approvals)</option>
                <option value="studii">Studii (Studies)</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Location (optional)
              </label>
              <select v-model="editModal.form.localitate_id"
                      class="block w-full border border-gray-300 rounded px-3 py-2">
                <option :value="null">General (all locations)</option>
                <option value="155243">Timișoara</option>
                <option value="155289">Ghiroda</option>
                <option value="155314">Giroc</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Followed By (for requests)
              </label>
              <div class="flex items-center space-x-2">
                <div class="flex-1">
                  <input v-model="editModal.followedByName" 
                         type="text" 
                         readonly 
                         placeholder="None selected"
                         class="block w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-700">
                </div>
                <button type="button" 
                        @click="openFollowedBySelector"
                        class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  {{ editModal.form.followedBy ? 'Change' : 'Select' }}
                </button>
                <button v-if="editModal.form.followedBy" 
                        type="button" 
                        @click="clearFollowedBy"
                        class="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">
                  Clear
                </button>
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Is Null (optional document)
              </label>
              <select v-model="editModal.form.isNull"
                      class="block w-full border border-gray-300 rounded px-3 py-2">
                <option :value="0">No</option>
                <option :value="1">Yes</option>
              </select>
            </div>

            <div v-if="editModal.form.followedBy" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Required Documents Package
              </label>
              <div class="flex items-center space-x-2">
                <div class="flex-1">
                  <input :value="editModal.requiredDocsText" 
                         type="text" 
                         readonly 
                         placeholder="No documents selected"
                         class="block w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-700">
                </div>
                <button type="button" 
                        @click="openRequiredDocsSelector"
                        class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  {{ editModal.form.requiredDocs.length > 0 ? 'Change' : 'Select' }}
                </button>
                <button v-if="editModal.form.requiredDocs.length > 0" 
                        type="button" 
                        @click="clearRequiredDocs"
                        class="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">
                  Clear
                </button>
              </div>
            </div>

            <!-- PDF Upload for new OUTPUT docTypes only -->
            <div v-if="editModal.isNew && editModal.form.isInput === 0" class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Template PDF <span class="text-red-500">*</span>
              </label>
              <input type="file"
                     ref="pdfInput"
                     @change="handlePdfSelect"
                     accept=".pdf,application/pdf"
                     required
                     class="block w-full border border-gray-300 rounded px-3 py-2">
              <p class="text-sm text-gray-500 mt-1">Only PDF files are accepted for output documents</p>
              <p v-if="editModal.fileError" class="text-sm text-red-500 mt-1">{{ editModal.fileError }}</p>
            </div>
            
            <div class="flex items-center justify-end space-x-4">
              <button type="button" @click="closeEditModal" 
                      class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button type="submit" 
                      :disabled="editModal.saving"
                      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                {{ editModal.saving ? 'Saving...' : (editModal.isNew ? 'Create' : 'Save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- DocType Selector Modals -->
    <DevDocTypeSelector
      :show="followedByModal.show"
      title="Select Followed By DocType"
      :docTypes="docTypes"
      :excludeIds="[editModal.docType?.id].filter(Boolean)"
      :initialSelection="followedByModal.selected"
      @close="closeFollowedByModal"
      @select="onFollowedBySelected"
    />

    
    <DevDocTypeSelector
      :show="requiredDocsSelector.show"
      title="Select Required Documents"
      :docTypes="docTypes"
      :excludeIds="[editModal.form.followedBy].filter(Boolean)"
      
      multiple
      :initialSelection="requiredDocsSelector.selected"
      @close="closeRequiredDocsSelector"
      @select="onRequiredDocsSelected"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dev'
})

const config = useRuntimeConfig()
const dbApi = config.public.dbApi
const { error, success } = useUI()

// Data
const loading = ref(true)
const docTypes = ref([])

// Computed properties for filtering docTypes
const inputDocTypes = computed(() => docTypes.value.filter(dt => dt.isInput === '1'))
const outputDocTypes = computed(() => docTypes.value.filter(dt => dt.isInput === '0'))

// Upload modal state
const uploadModal = reactive({
  show: false,
  docType: null,
  selectedFile: null,
  uploading: false
})

// View modal state  
const viewModal = reactive({
  show: false,
  docType: null,
  url: null
})

// Required docs modal state
const requiredDocsModal = reactive({
  show: false,
  docType: null
})

// Edit modal state
const editModal = reactive({
  show: false,
  docType: null,
  isNew: false,
  form: {
    name: '',
    isInput: 1,
    isNull: 0,
    tag: null,
    localitate_id: null,
    followedBy: null,
    requiredDocs: []
  },
  selectedFile: null,
  fileError: null,
  saving: false,
  followedByName: '',
  requiredDocsText: ''
})

// DocType selector modals state
const followedByModal = reactive({
  show: false,
  selected: null
})

const requiredDocsSelector = reactive({
  show: false,
  selected: []
})

/**
 * Handle PDF file selection and validation
 */
function handlePdfSelect(event) {
  const file = event.target.files[0]
  editModal.fileError = null
  editModal.selectedFile = null
  
  if (!file) return
  
  // Validate file type
  if (file.type !== 'application/pdf') {
    editModal.fileError = 'Only PDF files are allowed'
    event.target.value = '' // Clear the input
    return
  }
  
  // Validate file size (optional - 50MB limit)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    editModal.fileError = 'File size must be less than 50MB'
    event.target.value = '' // Clear the input
    return
  }
  
  editModal.selectedFile = file
  console.log('PDF file selected:', file.name, file.type, file.size)
}

/**
 * Check if template exists in MinIO for a docType
 */
async function checkTemplateExists(docType) {
  try {
    const locationPath = docType.localitate_id || 'general'
    const templatePath = `${locationPath}/${docType.id}`
    
    console.log(`Checking template for docType ${docType.id}: ${templatePath}`)
    
    const response = await fetch(`/api/minio-get?path=${encodeURIComponent(templatePath)}&bucket=templates`)
    
    if (!response.ok) {
      console.log(`Presigned URL failed for ${templatePath}: ${response.status}`)
      return false
    }
    
    // Get the presigned URL and test if the resource actually exists
    const { url } = await response.json()
    console.log(`Testing actual file existence: ${url}`)
    
    const testResponse = await fetch(url, { method: 'GET' })
    const exists = testResponse.ok
    console.log(`File exists: ${exists}, status: ${testResponse.status}`)
    
    return exists
  } catch (err) {
    console.error(`Error checking template for docType ${docType.id}:`, err)
    return false
  }
}

/**
 * Fetch all docTypes from the API
 */
async function fetchDocTypes() {
  try {
    loading.value = true
    const response = await fetch(`${dbApi}/data/docTypes?include=localitate_id,followedBy`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch docTypes')
    }
    
    const data = await response.json()
    
    // Process docTypes with relationships
    docTypes.value = await Promise.all(data.data.map(async (doc) => {
      const docType = {
        ...doc.attributes,
        // Extract localitate from relationships
        localitate_id: doc.relationships.localitate_id?.data?.id || null,
        // Extract followedBy from relationships
        followedBy: doc.relationships.followedBy?.data?.id || null
      }
      
      // If localitate is included, find the name
      if (docType.localitate_id && data.includes) {
        const localitate = data.includes.find(inc => 
          inc.type === 'localitati' && inc.id === docType.localitate_id
        )
        if (localitate) {
          docType.localitate_name = localitate.attributes.denumire
        }
      }
      
      // If followedBy is included, find the name
      if (docType.followedBy && data.includes) {
        const followedByDoc = data.includes.find(inc => 
          inc.type === 'docTypes' && inc.id === docType.followedBy
        )
        if (followedByDoc) {
          docType.followedBy_name = followedByDoc.attributes.name
        }
      }
      
      // Check if template exists for output documents only
      if (docType.isInput === '0') {
        docType.hasTemplate = await checkTemplateExists(docType)
      } else {
        docType.hasTemplate = null // No template status for input documents
      }
      
      return docType
    }))
    
    // Fetch required documents for each docType
    await fetchRequiredDocs()
    
  } catch (err) {
    console.error('Error fetching docTypes:', err)
    error.value.show = true
    error.value.title = 'Error'
    error.value.message = 'Failed to load docTypes'
  } finally {
    loading.value = false
  }
}

/**
 * Fetch required documents packages for all docTypes
 */
async function fetchRequiredDocs() {
  try {
    const response = await fetch(`${dbApi}/data/doc_packages`)
    
    if (!response.ok) {
      console.warn('Could not fetch doc packages')
      return
    }
    
    const data = await response.json()
    
    // Group packages by main docType
    const packagesByMain = {}
    data.data.forEach(pkg => {
      // Extract IDs from relationships (JSON:API format)
      const mainId = pkg.relationships.main?.data?.id
      const adjacentId = pkg.relationships.adjacent?.data?.id
      
      if (!mainId || !adjacentId) return
      
      if (!packagesByMain[mainId]) {
        packagesByMain[mainId] = []
      }
      
      // Find the adjacent docType in our docTypes array to get the name
      const adjacentDocType = docTypes.value.find(dt => dt.id == adjacentId)
      
      if (adjacentDocType) {
        packagesByMain[mainId].push({
          id: adjacentId,
          name: adjacentDocType.name
        })
      }
    })
    
    // Add required docs to docTypes
    docTypes.value.forEach(docType => {
      docType.requiredDocs = packagesByMain[docType.id] || []
    })
    
  } catch (err) {
    console.warn('Error fetching required docs:', err)
  }
}

/**
 * Open upload modal for a docType
 */
function openUploadModal(docType) {
  uploadModal.show = true
  uploadModal.docType = docType
  uploadModal.selectedFile = null
  uploadModal.uploading = false
}

/**
 * Handle template upload from ModalsUploadFile
 */
async function handleTemplateUpload(file) {
  if (!uploadModal.docType || !file) return
  
  try {
    const docType = uploadModal.docType
    
    // Determine template path based on location
    const locationPath = docType.localitate_id || 'general'
    const templatePath = `${locationPath}/${docType.id}`
    
    // Get presigned URL for templates bucket
    const minioResponse = await fetch(`/api/minio-put?path=${encodeURIComponent(templatePath)}&bucket=templates`)
    
    if (!minioResponse.ok) {
      throw new Error('Failed to get upload URL')
    }
    
    const { url } = await minioResponse.json()
    
    // Upload file to MinIO
    const uploadResponse = await fetch(url, {
      method: 'PUT',
      body: file
    })
    
    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file')
    }
    
    // Update local state - template now exists
    const docTypeIndex = docTypes.value.findIndex(dt => dt.id === docType.id)
    if (docTypeIndex !== -1) {
      docTypes.value[docTypeIndex].hasTemplate = true
    }
    
    success.value.show = true
    success.value.message = 'Template uploaded successfully'
    uploadModal.show = false
    
  } catch (err) {
    console.error('Upload error:', err)
    error.value.show = true
    error.value.title = 'Upload Failed'
    error.value.message = err.message
  }
}

/**
 * Close upload modal and reset state
 */
function closeUploadModal() {
  uploadModal.show = false
  uploadModal.docType = null
  uploadModal.selectedFile = null
  uploadModal.uploading = false
}

/**
 * View template in modal
 */
async function viewTemplate(docType) {
  if (!docType.hasTemplate) return
  
  try {
    viewModal.show = true
    viewModal.docType = docType
    viewModal.url = null
    
    // Build template path
    const locationPath = docType.localitate_id || 'general'
    const templatePath = `${locationPath}/${docType.id}`
    
    // Get presigned URL for viewing
    const response = await fetch(`/api/minio-get?path=${encodeURIComponent(templatePath)}&bucket=templates`)
    
    if (!response.ok) {
      throw new Error('Failed to get template URL')
    }
    
    const { url } = await response.json()
    viewModal.url = url
    
  } catch (err) {
    console.error('View template error:', err)
    error.value.show = true
    error.value.title = 'Error'
    error.value.message = 'Failed to load template'
    viewModal.show = false
  }
}

/**
 * Close view modal
 */
function closeViewModal() {
  viewModal.show = false
  viewModal.docType = null
  viewModal.url = null
}

/**
 * Open required docs modal
 */
function openRequiredDocsModal(docType) {
  requiredDocsModal.show = true
  requiredDocsModal.docType = docType
}

/**
 * Close required docs modal
 */
function closeRequiredDocsModal() {
  requiredDocsModal.show = false
  requiredDocsModal.docType = null
}

/**
 * Open followed by selector modal
 */
function openFollowedBySelector() {
  followedByModal.selected = editModal.form.followedBy ? 
    docTypes.value.find(dt => dt.id === editModal.form.followedBy) : null
  followedByModal.show = true
}

/**
 * Close followed by selector modal
 */
function closeFollowedByModal() {
  followedByModal.show = false
  followedByModal.selected = null
}

/**
 * Handle followed by selection
 */
function onFollowedBySelected(selectedDocType) {
  if (selectedDocType) {
    editModal.form.followedBy = selectedDocType.id
    editModal.followedByName = selectedDocType.name
  }
  closeFollowedByModal()
}

/**
 * Clear followed by selection
 */
function clearFollowedBy() {
  editModal.form.followedBy = null
  editModal.followedByName = ''
  editModal.form.requiredDocs = []
  editModal.requiredDocsText = ''
}

/**
 * Open required docs selector modal
 */
function openRequiredDocsSelector() {
  // Convert IDs to docType objects for initial selection
  requiredDocsSelector.selected = editModal.form.requiredDocs.map(id =>
    docTypes.value.find(dt => dt.id === id)
  ).filter(Boolean)
  requiredDocsSelector.show = true
}

/**
 * Close required docs selector modal
 */
function closeRequiredDocsSelector() {
  requiredDocsSelector.show = false
  requiredDocsSelector.selected = []
}

/**
 * Handle required docs selection
 */
function onRequiredDocsSelected(selectedDocTypes) {
  editModal.form.requiredDocs = selectedDocTypes.map(dt => dt.id)
  editModal.requiredDocsText = selectedDocTypes.length > 0 ?
    `${selectedDocTypes.length} document(s): ${selectedDocTypes.map(dt => dt.name).join(', ')}` :
    ''
  closeRequiredDocsSelector()
}

/**
 * Clear required docs selection
 */
function clearRequiredDocs() {
  editModal.form.requiredDocs = []
  editModal.requiredDocsText = ''
}

/**
 * Open add modal for new docType
 */
function openAddModal() {
  editModal.show = true
  editModal.docType = null
  editModal.isNew = true
  editModal.form = {
    name: '',
    isInput: 1,
    isNull: 0,
    tag: null,
    localitate_id: null,
    followedBy: null,
    requiredDocs: []
  }
  editModal.selectedFile = null
  editModal.fileError = null
  editModal.saving = false
  editModal.followedByName = ''
  editModal.requiredDocsText = ''
}

/**
 * Open edit modal for existing docType
 */
function openEditModal(docType) {
  editModal.show = true
  editModal.docType = docType
  editModal.isNew = false
  editModal.form.name = docType.name
  editModal.form.isInput = parseInt(docType.isInput)
  editModal.form.isNull = parseInt(docType.isNull)
  editModal.form.tag = docType.tag
  editModal.form.localitate_id = docType.localitate_id
  editModal.form.followedBy = docType.followedBy
  editModal.form.requiredDocs = docType.requiredDocs ? docType.requiredDocs.map(rd => rd.id) : []
  editModal.saving = false
  
  // Set display names
  editModal.followedByName = docType.followedBy_name || ''
  editModal.requiredDocsText = docType.requiredDocs && docType.requiredDocs.length > 0 ?
    `${docType.requiredDocs.length} document(s): ${docType.requiredDocs.map(rd => rd.name).join(', ')}` :
    ''
}

/**
 * Close edit modal
 */
function closeEditModal() {
  editModal.show = false
  editModal.docType = null
  editModal.isNew = false
  editModal.form = {
    name: '',
    isInput: 1,
    isNull: 0,
    tag: null,
    localitate_id: null,
    followedBy: null,
    requiredDocs: []
  }
  editModal.selectedFile = null
  editModal.fileError = null
  editModal.saving = false
  editModal.followedByName = ''
  editModal.requiredDocsText = ''
}

/**
 * Save docType changes or create new docType
 */
async function saveDocType() {
  try {
    editModal.saving = true
    
    // For new OUTPUT docTypes, validate that a PDF file is selected
    if (editModal.isNew && editModal.form.isInput === 0 && !editModal.selectedFile) {
      editModal.fileError = 'PDF template file is required for output documents'
      editModal.saving = false
      return
    }
    
    const requestBody = {
      data: {
        attributes: {
          name: editModal.form.name,
          isInput: editModal.form.isInput != null ? Number(editModal.form.isInput) : 0,
          isNull: editModal.form.isNull != null ? Number(editModal.form.isNull) : 0,
          tag: editModal.form.tag,
          localitate_id: editModal.form.localitate_id ? Number(editModal.form.localitate_id) : null,
          followedBy: editModal.form.followedBy ? Number(editModal.form.followedBy) : null
        }
      }
    }
    
    console.log('Form values before conversion:', {
      isInput: editModal.form.isInput,
      isNull: editModal.form.isNull,
      isInputType: typeof editModal.form.isInput,
      isNullType: typeof editModal.form.isNull
    })
    console.log('Creating docType with body:', JSON.stringify(requestBody, null, 2))
    
    let response
    if (editModal.isNew) {
      // Create new docType
      response = await fetch(`${dbApi}/data/docTypes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
    } else {
      // Update existing docType
      requestBody.data.id = editModal.docType.id
      response = await fetch(`${dbApi}/data/docTypes/${editModal.docType.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
    }
    
    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error response:', errorText)
      throw new Error(`Failed to ${editModal.isNew ? 'create' : 'update'} docType: ${response.status} ${errorText}`)
    }
    
    const responseData = await response.json()
    console.log('Success response:', responseData)
    
    if (editModal.isNew) {
      const newDocTypeId = responseData.data.id
      let hasTemplate = null
      
      // Only upload template for OUTPUT docTypes
      if (editModal.form.isInput === 0 && editModal.selectedFile) {
        const locationPath = editModal.form.localitate_id || 'general'
        const templatePath = `${locationPath}/${newDocTypeId}`
        
        console.log('Uploading template for new OUTPUT docType:', { newDocTypeId, templatePath })
        
        // Get presigned URL for templates bucket
        const minioResponse = await fetch(`/api/minio-put?path=${encodeURIComponent(templatePath)}&bucket=templates`)
        
        if (!minioResponse.ok) {
          throw new Error('Failed to get upload URL for template')
        }
        
        const { url } = await minioResponse.json()
        
        // Upload file to MinIO
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          body: editModal.selectedFile
        })
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload template file')
        }
        
        console.log('Template uploaded successfully')
        hasTemplate = true
      } else if (editModal.form.isInput === 1) {
        // For INPUT docTypes, no template status (they don't use templates)
        hasTemplate = null
      }
      
      // Save required documents packages if any
      if (editModal.form.followedBy && editModal.form.requiredDocs.length > 0) {
        await saveRequiredDocsPackages(newDocTypeId, editModal.form.requiredDocs)
      }
      
      // Add new docType to local state
      const newDocType = {
        ...responseData.data.attributes,
        localitate_id: editModal.form.localitate_id,
        followedBy: editModal.form.followedBy,
        localitate_name: getLocalitateNameById(editModal.form.localitate_id),
        followedBy_name: getDocTypeNameById(editModal.form.followedBy),
        hasTemplate: hasTemplate,
        requiredDocs: editModal.form.requiredDocs.map(id => ({
          id,
          name: getDocTypeNameById(id)
        })).filter(doc => doc.name)
      }
      docTypes.value.push(newDocType)
    } else {
      // Update existing docType in local state
      const docTypeIndex = docTypes.value.findIndex(dt => dt.id === editModal.docType.id)
      if (docTypeIndex !== -1) {
        docTypes.value[docTypeIndex].name = editModal.form.name
        docTypes.value[docTypeIndex].isInput = editModal.form.isInput
        docTypes.value[docTypeIndex].isNull = editModal.form.isNull
        docTypes.value[docTypeIndex].tag = editModal.form.tag
        docTypes.value[docTypeIndex].localitate_id = editModal.form.localitate_id
        docTypes.value[docTypeIndex].followedBy = editModal.form.followedBy
        docTypes.value[docTypeIndex].localitate_name = getLocalitateNameById(editModal.form.localitate_id)
        docTypes.value[docTypeIndex].followedBy_name = getDocTypeNameById(editModal.form.followedBy)
        
        // Update required docs packages
        if (editModal.form.followedBy && editModal.form.requiredDocs.length > 0) {
          await saveRequiredDocsPackages(editModal.docType.id, editModal.form.requiredDocs)
        } else {
          await deleteRequiredDocsPackages(editModal.docType.id)
        }
        
        docTypes.value[docTypeIndex].requiredDocs = editModal.form.requiredDocs.map(id => ({
          id,
          name: getDocTypeNameById(id)
        })).filter(doc => doc.name)
      }
    }
    
    success.value.show = true
    if (editModal.isNew) {
      if (editModal.form.isInput === 0 && editModal.selectedFile) {
        success.value.message = 'DocType created and template uploaded successfully'
      } else {
        success.value.message = 'DocType created successfully'
      }
    } else {
      success.value.message = 'DocType updated successfully'
    }
    closeEditModal()
    
  } catch (err) {
    console.error('Save docType error:', err)
    error.value.show = true
    error.value.title = `${editModal.isNew ? 'Create' : 'Save'} Failed`
    error.value.message = err.message
  } finally {
    editModal.saving = false
  }
}

/**
 * Helper function to get localitate name by ID
 */
function getLocalitateNameById(id) {
  if (id === 155243) return 'Timișoara'
  if (id === 155289) return 'Ghiroda'
  if (id === 155314) return 'Giroc'
  return null
}

/**
 * Helper function to get docType name by ID
 */
function getDocTypeNameById(id) {
  const docType = docTypes.value.find(dt => dt.id === id)
  return docType?.name || null
}

/**
 * Save required documents packages for a docType
 */
async function saveRequiredDocsPackages(mainDocTypeId, requiredDocIds) {
  try {
    // First, delete existing packages for this main docType
    await deleteRequiredDocsPackages(mainDocTypeId)
    
    // Then create new packages
    for (const adjacentId of requiredDocIds) {
      const requestBody = {
        data: {
          attributes: {
            main: parseInt(mainDocTypeId),
            adjacent: parseInt(adjacentId)
          }
        }
      }
      
      const response = await fetch(`${dbApi}/data/doc_packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        console.warn(`Failed to create doc package: ${mainDocTypeId} -> ${adjacentId}`)
      }
    }
  } catch (err) {
    console.error('Error saving required docs packages:', err)
  }
}

/**
 * Delete required documents packages for a docType
 */
async function deleteRequiredDocsPackages(mainDocTypeId) {
  try {
    // Get existing packages for this main docType
    const response = await fetch(`${dbApi}/data/doc_packages`)
    
    if (!response.ok) {
      console.warn('Could not fetch existing doc packages for deletion')
      return
    }
    
    const data = await response.json()
    // Filter packages where main relationship matches our docType ID
    const packagesToDelete = data.data.filter(pkg => 
      pkg.relationships.main?.data?.id == mainDocTypeId
    )
    
    // Delete each package
    for (const pkg of packagesToDelete) {
      const deleteResponse = await fetch(`${dbApi}/data/doc_packages/${pkg.id}`, {
        method: 'DELETE'
      })
      
      if (!deleteResponse.ok) {
        console.warn(`Failed to delete doc package ${pkg.id}`)
      }
    }
  } catch (err) {
    console.error('Error deleting required docs packages:', err)
  }
}

/**
 * Remove template from MinIO
 */
async function removeTemplate(docType) {
  if (!docType.hasTemplate) return
  
  const { confirm } = useConfirm()
  const confirmed = await confirm(`Are you sure you want to remove the template for "${docType.name}"?`)
  
  if (!confirmed) return
  
  try {
    const locationPath = docType.localitate_id || 'general'
    const templatePath = `${locationPath}/${docType.id}`
    
    console.log('=== REMOVE TEMPLATE DEBUG ===')
    console.log('DocType:', docType)
    console.log('Location path:', locationPath)
    console.log('Template path:', templatePath)
    
    // Get presigned DELETE URL
    const deleteUrl = `/api/minio-del?key=${encodeURIComponent(templatePath)}&bucket=templates`
    console.log('Delete URL:', deleteUrl)
    
    const response = await fetch(deleteUrl)
    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error response body:', errorText)
      throw new Error(`Failed to get delete URL: ${response.status} ${errorText}`)
    }
    
    const { url } = await response.json()
    
    // Delete file from MinIO
    const deleteResponse = await fetch(url, {
      method: 'DELETE'
    })
    
    if (!deleteResponse.ok) {
      throw new Error('Failed to delete template')
    }
    
    // Update local state
    const docTypeIndex = docTypes.value.findIndex(dt => dt.id === docType.id)
    if (docTypeIndex !== -1) {
      docTypes.value[docTypeIndex].hasTemplate = false
    }
    
    success.value.show = true
    success.value.message = 'Template removed successfully'
    
  } catch (err) {
    console.error('Remove template error:', err)
    error.value.show = true
    error.value.title = 'Remove Failed'
    error.value.message = err.message
  }
}

/**
 * Delete entire docType record
 */
async function deleteDocType(docType) {
  const { confirm } = useConfirm()
  const confirmed = await confirm(`Are you sure you want to delete the docType "${docType.name}"? This will also remove any associated template and project documents.`)
  
  if (!confirmed) return
  
  try {
    // Delete docType from database
    const response = await fetch(`${dbApi}/data/docTypes/${docType.id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete docType')
    }
    
    // Remove from local state
    const docTypeIndex = docTypes.value.findIndex(dt => dt.id === docType.id)
    if (docTypeIndex !== -1) {
      docTypes.value.splice(docTypeIndex, 1)
    }
    
    success.value.show = true
    success.value.message = `DocType "${docType.name}" deleted successfully`
    
  } catch (err) {
    console.error('Delete docType error:', err)
    error.value.show = true
    error.value.title = 'Delete Failed'
    error.value.message = err.message
  }
}

// Load docTypes on mount
onMounted(() => {
  fetchDocTypes()
})
</script>