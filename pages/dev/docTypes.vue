<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">DocTypes Management</h1>
      <button @click="addDocType" 
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
              <span :class="Number(docType.isInput) ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ Number(docType.isInput) ? 'Input' : 'Output' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span v-if="docType.tag" 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ docType.tag }}
              </span>
              <span v-else class="text-gray-400 text-xs">-</span>
            </td>
            <!-- localitate_name -->
            <td class="px-6 py-4 whitespace-nowrap text-sm" :class="docType.localitate ? 'text-gray-900' : 'text-gray-400'">
              {{ docType.localitate || 'general' }}
            </td>
            <!-- requiredDocs -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <button v-if="docType.requiredDocs && docType.requiredDocs.length > 0" 
                      @click="requiredDocsModal.show = true; requiredDocsModal.docType = docType"
                      class="text-blue-600 hover:text-blue-900 text-xs">
                View ({{ docType.requiredDocs.length }})
              </button>
              <span v-else class="text-gray-400 text-xs">-</span>
            </td>
            <!-- minio template actions -->
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <!-- Template actions for output docTypes -->
              <template v-if="!Number(docType.isInput)">
                <button @click="uploadTplModal.show = true; uploadTplModal.docType = docType"
                        class="text-indigo-600 hover:text-indigo-900 mr-2 text-xs">
                  {{ docType.hasTemplate ? 'Update' : 'Upload' }}
                </button>
                <button v-if="docType.hasTemplate"
                        @click="viewTemplate(docType)"
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
            <!-- edit and delete -->
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="editDocType(docType)"
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

    

    <!-- Template Viewer Modal -->
    <ModalsFile
      v-if="viewTplModal.show"
      :url="viewTplModal.url"
      @close="viewTplModal.show = false"
    />

    <!-- Required Docs Viewer Modal -->
    <DevRequiredDocsViewer
      v-if="requiredDocsModal.show"
      :requiredDocs="requiredDocsModal.docType?.requiredDocs"
      @close="requiredDocsModal.show = false"
    />

    <!-- Upload File Modal -->
    <ModalsUploadFile 
      v-if="uploadTplModal.show" 
      :singleFile="true" 
      :fileName="uploadTplModal.docType?.name"
      @close="uploadTplModal.show = false" 
      @upload="handleTemplateUpload" 
    />

    <!-- Edit DocType Modal -->
    <DevDocTypeEditModal
      v-if="editModal.show"
      :isNew="editModal.isNew"
      :form="editModal.form"
      :saving="editModal.saving"
      :docTypes="docTypes"
      @close="editModal.show = false"
      @save="saveDocType"
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

// Upload modal state
const uploadTplModal = reactive({
  show: false,
  docType: null,
  uploading: false
})

// View modal state  
const viewTplModal = reactive({
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
    isInput: 1,
    tag: null,
    localitate_id: null,
    requiredDocs: []
  },
  saving: false
})



/**
 * Check if template exists in MinIO for a docType
 */
async function checkMinioTpl(docType) {
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

    console.log("data")
    console.log(data)
    // return
    
    // Process docTypes with relationships
    docTypes.value = await Promise.all(data.data.map(async doc => {
      const docType = {
        ...doc.attributes,
        localitate_id: doc.relationships.localitate_id?.data?.id || null,
        localitate: data.includes?.find(obj => obj.id === doc.relationships.localitate_id?.data?.id)?.attributes?.denumire || null,
      }

      docType.hasTemplate = (!Number(doc.attributes.isInput)) ? checkMinioTpl(docType) : null;

      docType.requiredDocs = await fetch(`${dbApi}/data/doc_packages?include=adjacent&filter=main=${docType.id}`)
      .then(res => res.json())
      .then(data => {
        // console.log("pkg data")
        // console.log(data)
        return data.includes?.map(include => {
          return {
            id: include.id,
            name: include.attributes.name
          }
        }) || []
      })
      .catch(err => console.error('Error fetching doc packages:', err))

      // console.log("docType")
      // console.log(docType)
      // return

      return docType
    }))
    
  } catch (err) {
    console.error('Error fetching docTypes:', err)
    error.value.message = 'Failed to load docTypes'
  } finally {
    loading.value = false
  }
}


/**
 * Handle template upload from ModalsUploadFile
 */
async function handleTemplateUpload(file, path = null) {
  // if (!uploadTplModal.docType || !file) return
  
  try {
    
    if (!path) {
      const locationPath = uploadTplModal.docType.localitate_id || 'general'
      path = `${locationPath}/${uploadTplModal.docType.id}`
    }

    console.log("templatePath")
    console.log(path)
    
    // Get presigned URL for templates bucket
    const minioResponse = await fetch(`/api/minio-put?path=${encodeURIComponent(path)}&bucket=templates`)
    
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
    const docTypeIndex = docTypes.value.findIndex(dt => dt.id === uploadTplModal.docType?.id)
    if (docTypeIndex !== -1) {
      docTypes.value[docTypeIndex].hasTemplate = true
    }
    
    success.value.message = 'Template uploaded successfully'
    
  } catch (err) {
    console.error('Upload error:', err)
    error.value.title = 'Upload Failed'
    error.value.message = err.message
  }
}

/**
 * View template in modal
 */
async function viewTemplate(docType) {
  if (!docType.hasTemplate) return
  
  try {
    viewTplModal.show = true
    viewTplModal.docType = docType
    viewTplModal.url = null
    
    // Build template path
    const locationPath = docType.localitate_id || 'general'
    const templatePath = `${locationPath}/${docType.id}`
    
    // Get presigned URL for viewing
    const response = await fetch(`/api/minio-get?path=${encodeURIComponent(templatePath)}&bucket=templates`)
    
    if (!response.ok) {
      throw new Error('Failed to get template URL')
    }
    
    const { url } = await response.json()
    viewTplModal.url = url
    
  } catch (err) {
    console.error('View template error:', err)
    error.value.title = 'Error'
    error.value.message = 'Failed to load template'
    viewTplModal.show = false
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
    
    success.value.message = 'Template removed successfully'
    
  } catch (err) {
    console.error('Remove template error:', err)
    error.value.title = 'Remove Failed'
    error.value.message = err.message
  }
}





/**
 * Open add modal for new docType
 */
function addDocType() {
  editModal.show = true
  editModal.isNew = true
  editModal.docType = null
  editModal.form = {
    name: '',
    isInput: 1,
    tag: null,
    localitate_id: null,
    requiredDocs: []
  }
  editModal.saving = false
}

/**
 * Open edit modal for existing docType
 */
function editDocType(docType) {
  editModal.show = true
  editModal.isNew = false
  editModal.docType = docType
  editModal.form = {
    name: docType.name,
    isInput: parseInt(docType.isInput),
    tag: docType.tag,
    localitate_id: docType.localitate_id,
    requiredDocs: docType.requiredDocs ? docType.requiredDocs.map(rd => rd.id) : []
  }
  editModal.saving = false
}


/**
 * Save docType changes or create new docType
 */
async function saveDocType(data) {
  try {
    console.log("saveDocType")
    console.log(data)
    
    editModal.saving = true
    
    const { form, file } = data

    console.log(form)
    
    const requestBody = {
      data: {
        ...(!editModal.isNew ? { id: editModal.docType.id } : {}),
        attributes: {
          name: form.name,
          isInput: form.isInput != null ? Number(form.isInput) : 0,
          tag: form.tag,
          localitate_id: form.localitate_id ? Number(form.localitate_id) : null
        }
      }
    }
    
    // add / edit docType in DB
    const res = await fetch(`${dbApi}/data/docTypes${editModal.isNew ? '' : `/${editModal.docType.id}`}`, {
      method: editModal.isNew ? 'POST' : 'PATCH',
      body: JSON.stringify(requestBody)
    })
    // let res
    // if (editModal.isNew) {
    //   // Create new docType
    //   res = await fetch(`${dbApi}/data/docTypes`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(requestBody)
    //   })
    // } else {
    //   // Update existing docType
    //   if (!editModal.docType?.id) {
    //     throw new Error('Could not find docType to update')
    //   }
      
    //   requestBody.data.id = editModal.docType.id
    //   res = await fetch(`${dbApi}/data/docTypes/${editModal.docType.id}`, {
    //     method: 'PATCH',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(requestBody)
    //   })
    // }
    
    if (!res.ok) {
      const errorText = await res.text()
      console.log('Error response:', errorText)
      error.value.message = errorText
      throw new Error(`Failed to ${editModal.isNew ? 'create' : 'update'} docType: ${res.status} ${errorText}`)
    }
    
    const responseData = await res.json()
    console.log('Success response:', responseData)
    
    // Get docType ID (new or existing)
    const docTypeId = editModal.isNew ? responseData.data.id : editModal.docType.id
    let hasTemplate = null
    let hasUploadedTemplate = false
    
    // Handle template upload for new OUTPUT docTypes
    if (editModal.isNew && form.isInput == 0 && file) {
      const locationPath = form.localitate_id || 'general'
      const templatePath = `${locationPath}/${docTypeId}`
      
      handleTemplateUpload(file, templatePath)
      hasTemplate = true
      hasUploadedTemplate = true
    } else if (form.isInput === 1) {
      // For INPUT docTypes, no template status (they don't use templates)
      hasTemplate = false
    }
    
    await saveRequiredDocsPackages(docTypeId, form.requiredDocs)
    
    
    // Update local state
    const requiredDocsForState = form.requiredDocs.map(id => ({
      id,
      name: getDocTypeNameById(id)
    })).filter(doc => doc.name)

    const newDocType = {
      ...responseData.data.attributes,
      localitate_id: form.localitate_id,
      hasTemplate: hasTemplate,
      requiredDocs: requiredDocsForState
    }
    
    if (editModal.isNew) {
      docTypes.value.push(newDocType)
    } else {
      // Update existing docType in local state
      const docTypeIndex = docTypes.value.findIndex(dt => dt.id === docTypeId)
      if (docTypeIndex !== -1) {
        docTypes.value[docTypeIndex] = newDocType
      }
    }
    
    success.value.message = 'DocType updated successfully'
    
    // Close modal
    editModal.show = false
    
  } catch (err) {
    console.error('Save docType error:', err)
    error.value.title = `${editModal.isNew ? 'Create' : 'Save'} Failed`
    error.value.message = err.message
  } finally {
    editModal.saving = false
  }
}


/**
 * Save required documents packages for a docType
 */
async function saveRequiredDocsPackages(mainDocTypeId, requiredDocIds) {
  try {
    // First, delete existing packages for this main docType
    await fetch(`${dbApi}/data/doc_packages?filter=main=${mainDocTypeId}`, {
      method: 'DELETE'
    }).catch(err => {
      console.error('Error deleting required docs packages:', err)
    })
    
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
    
    success.value.message = `DocType "${docType.name}" deleted successfully`
    
  } catch (err) {
    console.error('Delete docType error:', err)
    error.value.title = 'Delete Failed'
    error.value.message = err.message
  }
}

// Load docTypes on mount
onMounted(() => {
  fetchDocTypes()
})
</script>