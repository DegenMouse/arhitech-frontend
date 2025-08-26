<!--
  components/project/ProjectDocuments.vue
  ---------------------------------------
  Project documents panel component with Main Documents concept.
  Shows main documents with completion progress bars for adjacent documents.
  Features modal view for adjacent documents management and workflow.
  Integrates with doc_packages table for document relationships.
-->
<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>
    
    <!-- Main documents grid -->
    <div v-else-if="mainDocuments.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="mainDoc in mainDocuments" 
        :key="mainDoc.id" 
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
        @click="openMainDocumentModal(mainDoc)"
      >
        <!-- Main document header -->
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium text-gray-900">{{ formatDocumentName(mainDoc.docType?.name) }}</h3>
          <span 
            :class="getStateColor(mainDoc.state)" 
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ mainDoc.state }}
          </span>
        </div>
        
        <!-- Completion progress bar -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Documente necesare</span>
            <span class="font-medium text-gray-900">
              {{ mainDoc.completedCount }}/{{ mainDoc.totalCount }}
            </span>
          </div>
          
          <!-- Progress bar -->
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-300"
              :class="mainDoc.completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'"
              :style="`width: ${mainDoc.completionPercentage}%`"
            ></div>
          </div>
          
          <div class="text-xs text-gray-500">
            {{ Math.round(mainDoc.completionPercentage) }}% Complete
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else class="text-center py-8 text-gray-500">
      <p>No main documents found</p>
    </div>

  <!-- Adjacent Documents Modal -->
  <div 
    v-if="adjacentModal && adjacentModal.show" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="adjacentModal.show = false"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <!-- Modal header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ formatDocumentName(adjacentModal.mainDocument?.docType?.name) || 'Main Document' }}
          </h2>
          <button 
            @click="adjacentModal && (adjacentModal.show = false)"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div v-if="adjacentModal" class="text-sm text-gray-600">
          [ {{ (adjacentModal.adjacentDocs?.filter(doc => doc.state === 'finished').length || 0) + (adjacentModal.mainDocument?.state === 'finished' ? 1 : 0) }}/{{ (adjacentModal.adjacentDocs?.length || 0) + 1 }} Confirmate ]
        </div>
      </div>
      
      <!-- Modal content -->
      <div class="p-0">
        <!-- Main Document Section -->
        <div class="border-b border-gray-300 p-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-lg">📄</span>
            <h3 class="font-semibold text-gray-900">Document principal</h3>
          </div>
          <div class="border-b border-gray-200 mb-4"></div>
          
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-900 mb-1">
                {{ formatDocumentName(adjacentModal?.mainDocument?.docType?.name) }}
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Status:</span>
                <span 
                  :class="getStateColor(adjacentModal?.mainDocument?.state)"
                  class="text-sm font-medium capitalize"
                >
                  {{ adjacentModal?.mainDocument?.state }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <button 
                v-if="adjacentModal?.mainDocument?.state === 'missing'"
                @click="openUploadModal(adjacentModal?.mainDocument?.id)" 
                class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
              >
                Upload
              </button>
              <button 
                v-if="adjacentModal?.mainDocument?.state !== 'missing' && adjacentModal?.adjacentDocs?.every(doc => doc.state === 'finished')"
                @click="docOpen(adjacentModal?.mainDocument?.id)" 
                class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
              >
                View
              </button>
              <button 
                v-if="adjacentModal?.mainDocument?.state !== 'missing' && adjacentModal?.adjacentDocs?.every(doc => doc.state === 'finished')"
                @click="openUploadModal(adjacentModal?.mainDocument?.id)" 
                class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
              >
                Re-upload
              </button>
              <button 
                v-if="adjacentModal?.mainDocument?.state === 'progress'"
                @click="finish(adjacentModal?.mainDocument?.id, '1')" 
                class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
              >
                Finish
              </button>
            </div>
          </div>
        </div>
        
        <!-- Adjacent Documents Section -->
        <div v-if="adjacentModal && adjacentModal.adjacentDocs && adjacentModal.adjacentDocs.length" class="p-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-lg">📑</span>
            <h3 class="font-semibold text-gray-900">Documente necesare</h3>
          </div>
          <div class="border-b border-gray-200 mb-4"></div>
          
          <div class="space-y-3">
            <div 
              v-for="doc in adjacentModal.adjacentDocs" 
              :key="doc.id"
              class="flex items-center justify-between py-2"
            >
              <div class="flex items-center gap-3 flex-1">
                <span class="font-medium text-gray-900 min-w-0 flex-1">{{ formatDocumentName(doc.docType?.name) }}</span>
                <span 
                  :class="getStateColor(doc.state)"
                  class="text-sm font-medium capitalize px-2"
                >
                  {{ doc.state }}
                </span>
              </div>
              <div class="flex gap-2 ml-4">
                <button 
                  v-if="doc.state === 'missing'"
                  @click="openUploadModal(doc.id)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Upload
                </button>
                <button 
                  v-if="doc.state !== 'missing'"
                  @click="docOpen(doc.id)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Open
                </button>
                <button 
                  v-if="doc.state === 'progress'"
                  @click="openUploadModal(doc.id)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Re-upload
                </button>
                <button 
                  v-if="doc.state === 'progress'"
                  @click="finish(doc.id, '1')" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Finish
                </button>
                <button 
                  v-if="doc.state === 'finished'"
                  @click="finish(doc.id, '0')" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Unfinish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>

  <!-- File upload modal -->
  <ModalsUploadFile 
    v-if="uploadModal && uploadModal.show" 
    :singleFile="true" 
    :docId="uploadModal.docId"
    @close="uploadModal && (uploadModal.show = false)" 
    @upload="docUpload" 
  />

  <!-- Document viewing modal -->
  <ModalsFile
    v-if="documentModal && documentModal.show"
    :isPdf="documentModal.isPdf"
    :url="documentModal.url"
    :docId="documentModal.docId"
    @close="documentModal && (documentModal.show = false)"
    @change="docUpload"
  />
</template>

<script setup>
// Component props
const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

// Get user company data and configuration
const { company } = useUser()
const dbApi = useRuntimeConfig().public.dbApi
const { success } = useUI()

// Reactive data
const docs = ref([])
const docPackages = ref([])
const loading = ref(true)

// Modal state management
const uploadModal = reactive({
  show: false,
  docId: null
})
const documentModal = reactive({
  show: false,
  isPdf: true,
  url: null,
  docId: null
})
const adjacentModal = reactive({
  show: false,
  mainDocument: null,
  adjacentDocs: []
})

// Computed property for main documents
const mainDocuments = computed(() => {
  // Filter documents that are "needed" state and appear as "main" in doc_packages
  const mainDocs = docs.value.filter(doc => {
    return doc.state === 'needed' 
  })
  
  // Add completion data for each main document
  return mainDocs.map(mainDoc => {
    // Find ALL doc_packages for this main document (there can be multiple)
    const relatedPackages = docPackages.value.filter(pkg => pkg.main === mainDoc.docType_id)
    
    if (relatedPackages.length === 0) {
      // Only main document, no adjacent documents
      const isMainDocCompleted = mainDoc.state === 'finished' ? 1 : 0
      return {
        ...mainDoc,
        completedCount: isMainDocCompleted,
        totalCount: 1,
        completionPercentage: isMainDocCompleted * 100
      }
    }
    
    // Get all adjacent docType IDs for this main document
    const adjacentDocTypeIds = relatedPackages.map(pkg => pkg.adjacent)
    
    // Find all adjacent documents for this main document
    const adjacentDocs = docs.value.filter(doc => adjacentDocTypeIds.includes(doc.docType_id))
    const completedAdjacentDocs = adjacentDocs.filter(doc => doc.state === 'finished')
    
    // Include main document in completion calculation
    const isMainDocCompleted = mainDoc.state === 'finished' ? 1 : 0
    const totalDocs = adjacentDocs.length + 1 // +1 for main document
    const completedDocs = completedAdjacentDocs.length + isMainDocCompleted
    
    return {
      ...mainDoc,
      completedCount: completedDocs,
      totalCount: totalDocs,
      completionPercentage: (completedDocs / totalDocs) * 100
    }
  })
})

/**
 * Opens the adjacent documents modal for a main document
 */
function openMainDocumentModal(mainDoc) {
  // Find ALL doc_packages for this main document (there can be multiple)
  const relatedPackages = docPackages.value.filter(pkg => pkg.main === mainDoc.docType_id)
  
  if (relatedPackages.length === 0) {
    adjacentModal.adjacentDocs = []
  } else {
    // Get all adjacent docType IDs for this main document
    const adjacentDocTypeIds = relatedPackages.map(pkg => pkg.adjacent)
    
    // Find all adjacent documents
    adjacentModal.adjacentDocs = docs.value.filter(doc => adjacentDocTypeIds.includes(doc.docType_id))
  }
  
  adjacentModal.mainDocument = mainDoc
  adjacentModal.show = true
}

/**
 * Opens upload modal for a document
 */
function openUploadModal(docId) {
  uploadModal.docId = docId
  uploadModal.show = true
}

/**
 * Converts snake_case document names to Title Case with spaces
 */
function formatDocumentName(name) {
  if (!name) return 'Unknown Document'
  
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Gets CSS classes for document state styling
 */
function getStateColor(state) {
  const colors = {
    missing: 'text-red-600',
    needed: 'text-red-900',
    pending: 'text-orange-600',
    filled: 'text-yellow-600',
    finished: 'text-green-600'
  }
  return colors[state] || 'text-gray-600'
}

/**
 * Opens a document for viewing by fetching it from MinIO
 */
async function docOpen(docId) {
  if (!docId) {
    throw new Error('Document ID is required')
  }

  const bucket = useRuntimeConfig().public.buckets.companyFiles
  const path = `${company.value.id}/projects/${props.project.id}/${docId}`

  try {
    const minioUrl = await fetch(`/api/minio-get?path=${encodeURIComponent(path)}&bucket=${bucket}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to get presigned URL')
        }
        return res.json()
      })

    documentModal.url = minioUrl.url
    documentModal.docId = docId
    documentModal.show = true
  } catch (error) {
    console.error('Error opening document:', error)
  }
}

/**
 * Uploads a document to MinIO and updates document status
 */
async function docUpload(file, docId) {
  if (!(file instanceof File)) {
    return
  }
  
  try {
    // Get file MIME type
    const mimeType = file.type || 'application/octet-stream'
    
    // Convert DOCX, JPEG, or PNG files to PDF if needed
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'image/jpeg' || 
        mimeType === 'image/png') {

      const form = new FormData()
      form.append('file', file)

      const res = await fetch('/api/doc2pdf', {
        method: 'POST', 
        body: form
      })

      if (!res.ok) {
        throw new Error('Failed to convert file to PDF')
      }

      // Convert response to File object
      const pdfArrayBuffer = await res.arrayBuffer()
      const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' })
      file = new File([pdfBlob], file.name.replace(/\.[^.]+$/, '.pdf'), { type: 'application/pdf' })
    } else if (mimeType !== 'application/pdf') {
      throw new Error('Unsupported file type: ' + mimeType)
    }

    const bucket = useRuntimeConfig().public.buckets.companyFiles
    const path = `${company.value.id}/projects/${props.project.id}/${docId}`

    // Get presigned URL for file upload
    const minioUrl = await fetch(`/api/minio-put?path=${encodeURIComponent(path)}&bucket=${bucket}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to get presigned URL')
        }
        return res.json()
      })

    // Upload file to MinIO
    await fetch(minioUrl.url, {
      method:'PUT',
      body: file
    }).then(res => {
      if(!res.ok){
        throw new Error('Failed to upload file')
      }else{
        return true
      }
    }).catch(err => {
      console.err(err)
      throw new Error('MINIO ERROR')
    })

    // Update document status to modified if upload successful
    const docIndex = docs.value.findIndex(doc => doc.id === docId)
    if(docIndex !== -1 && docs.value[docIndex].state == 'missing'){
      await fetch(dbApi + '/data/projDocs/' + docId, {
        method: 'PATCH',
        body: JSON.stringify({
          data: {
            id: docId,
            attributes: {
              state: "pending"
            }
          }
        })
      }).then(res => {
        if (!res.ok) {
          throw new Error('Failed to update document')
        }
        docs.value[docIndex].isModified = '1'
      }).catch(err => {
        console.error('Failed to update document:', err)
        throw new Error('DB ERROR')
      })
    }

    // Show success message if upload completed
    success.value.message = "Document uploaded successfully"
  } catch (error) {
    console.error('Error uploading document:', error)
  }
}

/**
 * Updates document finish status
 */
async function finish(docId, isFinished = '1') {
  try {
    await fetch(dbApi + '/data/projDocs/' + docId, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          id: docId,
          attributes: {
            isFinished: isFinished,
            state: isFinished === '1' ? 'finished' : 'progress'
          }
        }
      })
    }).then(res => {
      if (!res.ok) {
        throw new Error('Failed to update document')
      }
      
      // Update local state
      const docIndex = docs.value.findIndex(doc => doc.id === docId)
      if (docIndex !== -1) {
        docs.value[docIndex].isFinished = isFinished
        docs.value[docIndex].state = isFinished === '1' ? 'finished' : 'progress'
      }
      
      // Update adjacent modal if open
      if (adjacentModal.show) {
        const adjacentIndex = adjacentModal.adjacentDocs.findIndex(doc => doc.id === docId)
        if (adjacentIndex !== -1) {
          adjacentModal.adjacentDocs[adjacentIndex].isFinished = isFinished
          adjacentModal.adjacentDocs[adjacentIndex].state = isFinished === '1' ? 'finished' : 'progress'
        }
      }
    })
  } catch (error) {
    console.error('Failed to update document:', error)
  }
}

/**
 * Fetch project documents and doc_packages data
 */
const fetchData = async () => {
  loading.value = true
  
  try {
    // Fetch project documents with document type information
    const docsResponse = await fetch(dbApi + '/data/projects/' + props.project.id + '/projDocs/?include=docType_id')
    if (!docsResponse.ok) throw new Error('Failed to fetch project documents')
    const docsData = await docsResponse.json()
    
    // Map documents with their document types
    docs.value = docsData.data.map(doc => {
      const docType = docsData.includes?.find(include => include.id === doc.relationships?.docType_id?.data?.id)
      return {
        ...doc.attributes,
        id: doc.id,
        docType_id: doc.relationships?.docType_id?.data?.id,
        docType: docType?.attributes
      }
    })
    
    // Fetch doc_packages data
    const packagesResponse = await fetch(dbApi + '/data/doc_packages')
    if (!packagesResponse.ok) throw new Error('Failed to fetch doc packages')
    const packagesData = await packagesResponse.json()
    
    docPackages.value = packagesData.data.map(pkg => ({
      id: pkg.id,
      main: pkg.relationships?.main?.data?.id,
      adjacent: pkg.relationships?.adjacent?.data?.id
    }))
    
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

// Watch for project changes and fetch data
watch(() => props.project.id, (newId) => {
  if (newId) {
    fetchData()
  }
}, { immediate: true })
</script>