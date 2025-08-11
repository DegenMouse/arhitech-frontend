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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
            <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Actions</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Manage</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="docType in docTypes" :key="docType.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ docType.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ docType.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="docType.isInput === '1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ docType.isInput === '1' ? 'Input' : 'Output' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ docType.phase_id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ docType.localitate_name || (docType.localitate_id ? `ID: ${docType.localitate_id}` : 'General') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="docType.required === '1' ? 'text-red-600' : 'text-gray-400'" class="text-sm">
                {{ docType.required === '1' ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
              <span v-if="docType.isInput === '1'"></span>
              <span v-else-if="docType.hasTemplate" class="text-green-600 text-xs">✓ Available</span>
              <span v-else class="text-red-600 text-xs">Missing</span>
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
                <option value="1">Input Document</option>
                <option value="0">Output Document</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Phase
              </label>
              <select v-model="editModal.form.phase_id"
                      class="block w-full border border-gray-300 rounded px-3 py-2">
                <option value="anteCU">Before Construction Permit (anteCU)</option>
                <option value="postCU">After Construction Permit (postCU)</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Location (optional)
              </label>
              <select v-model="editModal.form.localitate_id"
                      class="block w-full border border-gray-300 rounded px-3 py-2">
                <option :value="null">General (all locations)</option>
                <option value="1">Ghiroda</option>
                <option value="2">Giroc</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Required
              </label>
              <select v-model="editModal.form.required"
                      class="block w-full border border-gray-300 rounded px-3 py-2">
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <!-- PDF Upload for new OUTPUT docTypes only -->
            <div v-if="editModal.isNew && editModal.form.isInput === '0'" class="mb-6">
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

// Edit modal state
const editModal = reactive({
  show: false,
  docType: null,
  isNew: false,
  form: {
    name: '',
    isInput: '1',
    required: '0',
    phase_id: 'anteCU',
    localitate_id: null
  },
  selectedFile: null,
  fileError: null,
  saving: false
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
    const response = await fetch(`${dbApi}/data/docTypes?include=localitate_id`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch docTypes')
    }
    
    const data = await response.json()
    
    // Process docTypes with relationships
    docTypes.value = await Promise.all(data.data.map(async (doc) => {
      const docType = {
        ...doc.attributes,
        // Extract phase from relationships
        phase_id: doc.relationships.phase_id?.data?.id || null,
        // Extract localitate from relationships
        localitate_id: doc.relationships.localitate_id?.data?.id || null
      }
      
      // If localitate is included, find the name
      if (docType.localitate_id && data.includes) {
        const localitate = data.includes.find(inc => 
          inc.type === 'localitate' && inc.id === docType.localitate_id
        )
        if (localitate) {
          docType.localitate_name = localitate.attributes.nume
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
 * Open add modal for new docType
 */
function openAddModal() {
  editModal.show = true
  editModal.docType = null
  editModal.isNew = true
  editModal.form = {
    name: '',
    isInput: '1',
    required: '0',
    phase_id: 'anteCU',
    localitate_id: null
  }
  editModal.selectedFile = null
  editModal.fileError = null
  editModal.saving = false
}

/**
 * Open edit modal for existing docType
 */
function openEditModal(docType) {
  editModal.show = true
  editModal.docType = docType
  editModal.isNew = false
  editModal.form.name = docType.name
  editModal.form.isInput = docType.isInput
  editModal.form.required = docType.required
  editModal.form.phase_id = docType.phase_id
  editModal.form.localitate_id = docType.localitate_id
  editModal.saving = false
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
    isInput: '1',
    required: '0',
    phase_id: 'anteCU',
    localitate_id: null
  }
  editModal.selectedFile = null
  editModal.fileError = null
  editModal.saving = false
}

/**
 * Save docType changes or create new docType
 */
async function saveDocType() {
  try {
    editModal.saving = true
    
    // For new OUTPUT docTypes, validate that a PDF file is selected
    if (editModal.isNew && editModal.form.isInput === '0' && !editModal.selectedFile) {
      editModal.fileError = 'PDF template file is required for output documents'
      editModal.saving = false
      return
    }
    
    const requestBody = {
      data: {
        attributes: {
          name: editModal.form.name,
          isInput: editModal.form.isInput,
          required: editModal.form.required,
          phase_id: editModal.form.phase_id,
          localitate_id: editModal.form.localitate_id
        }
      }
    }
    
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
      if (editModal.form.isInput === '0' && editModal.selectedFile) {
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
      } else if (editModal.form.isInput === '1') {
        // For INPUT docTypes, no template status (they don't use templates)
        hasTemplate = null
      }
      
      // Add new docType to local state
      const newDocType = {
        ...responseData.data.attributes,
        phase_id: editModal.form.phase_id,
        localitate_id: editModal.form.localitate_id,
        localitate_name: editModal.form.localitate_id === '1' ? 'Ghiroda' : editModal.form.localitate_id === '2' ? 'Giroc' : null,
        hasTemplate: hasTemplate
      }
      docTypes.value.push(newDocType)
    } else {
      // Update existing docType in local state
      const docTypeIndex = docTypes.value.findIndex(dt => dt.id === editModal.docType.id)
      if (docTypeIndex !== -1) {
        docTypes.value[docTypeIndex].name = editModal.form.name
        docTypes.value[docTypeIndex].isInput = editModal.form.isInput
        docTypes.value[docTypeIndex].required = editModal.form.required
        docTypes.value[docTypeIndex].phase_id = editModal.form.phase_id
        docTypes.value[docTypeIndex].localitate_id = editModal.form.localitate_id
        docTypes.value[docTypeIndex].localitate_name = editModal.form.localitate_id === '1' ? 'Ghiroda' : editModal.form.localitate_id === '2' ? 'Giroc' : null
      }
    }
    
    success.value.show = true
    if (editModal.isNew) {
      if (editModal.form.isInput === '0' && editModal.selectedFile) {
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