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
    <!-- Filter dropdown -->
    <div class="mb-6">
      <label for="tag-filter" class="block text-sm font-medium text-gray-700 mb-2">
        Filtrează după tip document:
      </label>
      <select
        id="tag-filter"
        v-model="selectedTag"
        class="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">Toate documentele</option>
        <option v-for="tag in availableTags" :key="tag" :value="tag">
          {{ formatTagName(tag) }}
        </option>
      </select>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>
    
    <!-- Main documents grid -->
    <div v-if="mainDocuments.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="mainDoc in mainDocuments" 
        :key="mainDoc.id" 
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
        @click="mainDoc.isMainDocument ? openMainDocumentModal(mainDoc) : null"
      >
        <!-- Document layout with consistent structure -->
        <div class="flex flex-col h-full">
          <!-- Document name and status row -->
          <div class="flex items-start justify-between gap-2 mb-3">
            <h3 class="font-medium text-gray-900 flex-1">{{ formatDocumentName(mainDoc.docType?.name) }}</h3>
            <span 
              :class="getStateColor(mainDoc.state)" 
              class="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0"
            >
              {{ mainDoc.state }}
            </span>
          </div>
          
          <!-- Completion progress bar for main documents -->
          <div v-if="mainDoc.isMainDocument" class="space-y-2 mb-4">
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
          
          <!-- Spacer to push buttons to bottom -->
          <div class="flex-1"></div>
          
          <!-- Action buttons at bottom -->
          <div class="flex flex-wrap gap-2 mt-auto">
            <button 
              v-if="!mainDoc.isMainDocument && mainDoc.docType?.isInput === '0'"
              @click="docOpen(mainDoc.id)"
              class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
            >
              View
            </button>
            <button 
              v-if="!mainDoc.isMainDocument && mainDoc.state === 'progress' && mainDoc.docType?.isInput === '1'"
              @click="openUploadModal(mainDoc.id)"
              class="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded"
            >
              Re-upload
            </button>
            <button 
              v-if="!mainDoc.isMainDocument && mainDoc.state === 'progress'"
              @click="finish(mainDoc.id, '1')"
              class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
            >
              Finish
            </button>
            <button 
              v-if="!mainDoc.isMainDocument && mainDoc.state === 'finished'"
              @click="finish(mainDoc.id, '0')"
              class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
            >
              Unfinish
            </button>
            <button 
              v-if="!mainDoc.isMainDocument && (mainDoc.state === 'missing' || mainDoc.state === 'needed') && mainDoc.docType?.isInput === '1'"
              @click="openUploadModal(mainDoc.id)"
              class="px-3 py-1 text-white text-sm rounded hover:opacity-90"
              style="background-color: #0c47b0;"
            >
              Upload
            </button>
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
            <div class="font-medium text-gray-900 mb-1 flex-1">
              {{ formatDocumentName(adjacentModal?.mainDocument?.docType?.name) }}
            </div>
            <div class="flex items-center gap-2 ">
              <span 
                :class="getStateColor(adjacentModal?.mainDocument?.state)"
                class="text-sm font-medium capitalize mr-4"
              >
                {{ adjacentModal?.mainDocument?.state }}
              </span>
                <button 
                  v-if="(adjacentModal?.mainDocument?.state === 'needed' || adjacentModal?.mainDocument?.state === 'missing') && adjacentModal?.mainDocument?.docType?.isInput === '1'"
                  @click="openUploadModal(adjacentModal?.mainDocument?.id)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Upload
                </button>
                <button 
                  v-if="adjacentModal?.mainDocument?.docType?.isInput === '0'"
                  @click="docOpen(adjacentModal?.mainDocument?.id)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  View
                </button>
                <button 
                  v-if="adjacentModal?.mainDocument?.state === 'progress' && adjacentModal?.mainDocument?.docType?.isInput === '1'"
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
          
          <!-- Destination Section -->
          <div v-if="adjacentModal?.mainDocument?.docType?.destination" class="mt-3 px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg v-if="!isEmail(adjacentModal?.mainDocument?.docType?.destination)" class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span class="text-sm text-gray-700">
                  {{ isEmail(adjacentModal?.mainDocument?.docType?.destination) ? 'Trimite cererea pe email' : 'Completează cererea pe site-ul' }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  v-if="!isEmail(adjacentModal?.mainDocument?.docType?.destination)"
                  @click="openLink(adjacentModal?.mainDocument?.docType?.destination)" 
                  class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  Vizitează Link
                </button>
                <button 
                  v-else
                  @click="openEmail(adjacentModal?.mainDocument?.docType?.destination)" 
                  class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Trimite Email
                </button>
                <button 
                  class="px-3 py-1 bg-blue-800 hover:bg-blue-900 text-white text-sm rounded flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Marchează trimis
                </button>
              </div>
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
                  v-if="(doc.state === 'missing' || doc.state === 'needed') && doc.docType?.isInput === '1'"
                  @click="openUploadModal(doc.id)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Upload
                </button>
                <button 
                  v-if="doc.docType?.isInput === '0'"
                  @click="docOpen(doc.id)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  View
                </button>
                <button 
                  v-if="doc.state === 'progress' && doc.docType?.isInput === '1'"
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
        
        <!-- Undefined Document Warning (at bottom) -->
        <div v-if="adjacentModal?.mainDocument?.docType?.defined === 0 || adjacentModal?.mainDocument?.docType?.defined === '0'" class="border-t border-gray-200 p-4 bg-amber-50">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-4 h-4 text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-2">
              <p class="text-xs text-amber-700">
                <strong>Notă:</strong> Acest document nu există momentan în baza de date ArhiTech. Documentele asociate necesare nu sunt încă definite. Tipul de document va fi disponibil la următorul update.
              </p>
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
const selectedTag = ref('')

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

// Helper function to check if a document is a main document
function isMainDocument(doc) {
  return docPackages.value.some(pkg => pkg.main === doc.docType_id)
}

// Computed property for all documents (main + adjacent)
const mainDocuments = computed(() => {
  // Get documents based on filter selection
  let allDocs = docs.value.filter(doc => {
    return doc.state // Any document with a state
  })
  
      // Apply tag filter if selected, or exclude 'needed' if showing all
    if (selectedTag.value) {
      // When specific tag is selected, show all documents with that tag
      allDocs = allDocs.filter(doc => doc.docType?.tag === selectedTag.value)
  } else {
    // When showing "Toate documentele", exclude 'needed' state documents
    allDocs = allDocs.filter(doc => doc.state !== 'needed')
  }
  
  // Add completion data and document type info
  return allDocs.map(doc => {
    const isMain = isMainDocument(doc)
    
    if (isMain) {
      // For main documents, calculate completion based on adjacent docs
      const relatedPackages = docPackages.value.filter(pkg => pkg.main === doc.docType_id)
      
      if (relatedPackages.length === 0) {
        const isCompleted = doc.state === 'finished' ? 1 : 0
        return {
          ...doc,
          isMainDocument: true,
          completedCount: isCompleted,
          totalCount: 1,
          completionPercentage: isCompleted * 100
        }
      }
      
      const adjacentDocTypeIds = relatedPackages.map(pkg => pkg.adjacent)
      const adjacentDocs = docs.value.filter(d => adjacentDocTypeIds.includes(d.docType_id))
      const completedAdjacentDocs = adjacentDocs.filter(d => d.state === 'finished')
      
      const isMainCompleted = doc.state === 'finished' ? 1 : 0
      const totalDocs = adjacentDocs.length + 1
      const completedDocs = completedAdjacentDocs.length + isMainCompleted
      
      return {
        ...doc,
        isMainDocument: true,
        completedCount: completedDocs,
        totalCount: totalDocs,
        completionPercentage: (completedDocs / totalDocs) * 100
      }
    } else {
      // For adjacent documents, simple completion based on own state
      return {
        ...doc,
        isMainDocument: false,
        completedCount: doc.state === 'finished' ? 1 : 0,
        totalCount: 1,
        completionPercentage: doc.state === 'finished' ? 100 : 0
      }
    }
  })
})

/**
 * Opens the adjacent documents modal for a main document
 */
function openMainDocumentModal(mainDoc) {
  console.log('Opening modal for document:', mainDoc) // Debug log
  console.log('DocType defined value:', mainDoc.docType?.defined) // Debug log
  console.log('DocType isInput value:', mainDoc.docType?.isInput) // Debug log
  
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

// Computed property for available tags
const availableTags = computed(() => {
  return ['avize', 'CU', 'studii']
})


/**
 * Formats tag names for display
 */
function formatTagName(tag) {
  const tagNames = {
    'avize': 'Avize',
    'CU': 'Certificat de Urbanism',
    'studii': 'Studii'
  }
  return tagNames[tag] || tag
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
 * Checks if destination is an email address
 */
function isEmail(destination) {
  if (!destination) return false
  return destination.includes('@')
}

/**
 * Opens a link in a new tab
 */
function openLink(url) {
  if (!url) return
  
  // Add https:// if no protocol is specified
  let formattedUrl = url
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    formattedUrl = 'https://' + url
  }
  
  window.open(formattedUrl, '_blank')
}

/**
 * Opens default email client with email address
 */
function openEmail(email) {
  if (!email) return
  
  window.location.href = 'mailto:' + email
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
      console.log('DocType for document:', doc.id, docType?.attributes) // Debug log
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