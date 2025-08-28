<!--
  components/project/ProjectDocuments.vue
  ---------------------------------------
  Simplified document management component that renders main documents with progress bars
  and simple documents with direct actions. Uses modular components for clean architecture.
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
    
    <!-- Documents sections -->
    <div v-else-if="documents.length" class="space-y-8">
      <!-- Section 1: Documente Restante (Not Done) -->
      <div v-if="documentsNotDone.length" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Documente Restante</h2>
          <span class="text-sm text-gray-600">{{ documentsNotDone.length }} document{{ documentsNotDone.length !== 1 ? 'e' : '' }}</span>
        </div>
        
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <!-- Main Documents (needed or pending state) -->
          <MainDocumentCard
            v-for="doc in mainDocuments" 
            :key="`main-${doc.id}`"
            :document="doc"
            @open-modal="openMainDocModal"
          />
          
          <!-- Simple Documents (not done, other states) -->
          <SimpleDocumentCard
            v-for="doc in simpleDocumentsNotDone" 
            :key="`simple-not-done-${doc.id}`"
            :document="doc"
            @upload="openUploadModal"
            @view="docOpen"
            @edit="docEdit"
            @process-ai="processWithAI"
            @mark-done="markAsDone"
          />
        </div>
      </div>
      
      <!-- Section 2: Documente Depuse (Done) -->
      <div v-if="documentsDone.length" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Documente Depuse</h2>
          <span class="text-sm text-gray-600">{{ documentsDone.length }} document{{ documentsDone.length !== 1 ? 'e' : '' }}</span>
        </div>
        
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <!-- Done Documents -->
          <SimpleDocumentCard
            v-for="doc in simpleDocumentsDone" 
            :key="`simple-done-${doc.id}`"
            :document="doc"
            @upload="openUploadModal"
            @view="docOpen"
            @edit="docEdit"
            @process-ai="processWithAI"
            @mark-done="markAsDone"
          />
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else class="text-center py-8 text-gray-500">
      <p>No documents found</p>
    </div>

    <!-- Main Document Modal -->
    <MainDocModal
      v-if="mainDocModal.show"
      :main-document="mainDocModal.document"
      :adjacent-docs="mainDocModal.adjacentDocs"
      @close="mainDocModal.show = false"
      @upload="openUploadModal"
      @view="docOpen"
      @mark-sent="markAsSent"
      @edit="docEdit"
      @process-ai="processWithAI"
      @mark-done="markAsDone"
    />

    <!-- File upload modal -->
    <ModalsUploadFile 
      v-if="uploadModal && uploadModal.show" 
      :singleFile="true" 
      :docId="uploadModal.docId"
      @close="uploadModal && (uploadModal.show = false)" 
      @upload="(file) => docUpload(file, uploadModal.document)" 
    />

    <!-- Document viewing modal -->
    <ModalsFile
      v-if="documentModal && documentModal.show"
      :isPdf="documentModal.isPdf"
      :url="documentModal.url"
      :docId="documentModal.docId"
      @close="documentModal && (documentModal.show = false)"
      @change="(file) => docUpload(file, documentModal.document)"
    />
  </div>
</template>

<script setup>
// Import new components
import MainDocumentCard from './component/MainDocumentCard.vue'
import SimpleDocumentCard from './component/SimpleDocumentCard.vue'
import MainDocModal from './modal/MainDocModal.vue'

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
  docId: null,
  document: null
})
const documentModal = reactive({
  show: false,
  isPdf: true,
  url: null,
  docId: null,
  document: null
})
const mainDocModal = reactive({
  show: false,
  document: null,
  adjacentDocs: []
})

// Computed property for filtering documents
const documents = computed(() => {
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
  
  return allDocs
})

// Computed properties for documents sorted by completion status

// Documents that are NOT done (remaining work)
const documentsNotDone = computed(() => {
  return documents.value.filter(doc => doc.state !== 'done')
})

// Documents that ARE done (submitted/completed)
const documentsDone = computed(() => {
  return documents.value.filter(doc => doc.state === 'done')
})

// Main documents (needed or pending or rejected state) from not-done documents - PROGRESS BAR
const mainDocuments = computed(() => {
  return documentsNotDone.value
    .filter(doc => doc.state === 'needed' || doc.state === 'pending' || doc.state === 'rejected')
    .map(doc => {
      // Calculate completion for main documents
      const relatedPackages = docPackages.value.filter(pkg => pkg.main === doc.docType_id)
      const adjacentDocTypeIds = relatedPackages.map(pkg => pkg.adjacent)
      const adjacentDocs = docs.value.filter(d => adjacentDocTypeIds.includes(d.docType_id))
      
      const mainCompleted = doc.state === 'done' ? 1 : 0
      const adjacentCompleted = adjacentDocs.filter(d => d.state === 'done').length
      const totalDocs = 1 + adjacentDocs.length
      const completedDocs = mainCompleted + adjacentCompleted
      
      return {
        ...doc,
        completedCount: completedDocs,
        totalCount: totalDocs,
        completionPercentage: totalDocs > 0 ? (completedDocs / totalDocs) * 100 : 0
      }
    })
})

// Simple documents from not-done documents (all other non-done states)
const simpleDocumentsNotDone = computed(() => {
  return documentsNotDone.value.filter(doc => doc.state !== 'needed' && doc.state !== 'pending' && doc.state !== 'rejected')
})

// Simple documents from done documents
const simpleDocumentsDone = computed(() => {
  return documentsDone.value
})

// Computed property for available tags
const availableTags = computed(() => {
  return ['avize', 'CU', 'studii']
})

/**
 * Opens the main document modal with adjacent documents
 */
function openMainDocModal(doc) {
  // Find ALL doc_packages for this document (there can be multiple)
  const relatedPackages = docPackages.value.filter(pkg => pkg.main === doc.docType_id)
  
  if (relatedPackages.length === 0) {
    mainDocModal.adjacentDocs = []
  } else {
    // Get all adjacent docType IDs for this document
    const adjacentDocTypeIds = relatedPackages.map(pkg => pkg.adjacent)
    
    // Find all adjacent documents
    mainDocModal.adjacentDocs = docs.value.filter(d => adjacentDocTypeIds.includes(d.docType_id))
  }
  
  mainDocModal.document = doc
  mainDocModal.show = true
}

/**
 * Opens upload modal for a document
 */
function openUploadModal(document) {
  // Close main modal if open
  mainDocModal.show = false
  
  uploadModal.docId = document.id
  uploadModal.document = document
  uploadModal.show = true
}

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
 * Opens a document for viewing by fetching it from MinIO
 */
async function docOpen(docId) {
  // Close main modal if open
  mainDocModal.show = false
  
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
 * Opens a document for editing by fetching it from MinIO
 */
async function docEdit(docId) {
  // Close main modal if open
  mainDocModal.show = false
  
  if (!docId) {
    throw new Error('Document ID is required')
  }

  // Find the document object
  const document = docs.value.find(doc => doc.id === docId)
  if (!document) {
    throw new Error('Document not found')
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

    // Store the document in documentModal (not uploadModal to avoid conflicts)
    documentModal.document = document
    
    // Open the edit modal
    documentModal.url = minioUrl.url
    documentModal.docId = docId
    documentModal.isPdf = true
    documentModal.show = true
  } catch (error) {
    console.error('Error opening document for editing:', error)
  }
}

/**
 * Helper function to update document state in database and local state
 */
async function updateDocumentState(docId, newState) {
  const docIndex = docs.value.findIndex(doc => doc.id === docId)
  if (docIndex === -1) return

  try {
    await fetch(dbApi + '/data/projDocs/' + docId, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          id: docId,
          attributes: {
            state: newState
          }
        }
      })
    }).then(res => {
      if (!res.ok) {
        throw new Error('Failed to update document state')
      }
      // Update local state to match
      docs.value[docIndex].state = newState
      
      // Update main modal if open and matches this document
      if (mainDocModal.show && mainDocModal.document?.id === docId) {
        console.log('UPDATING MODAL DOCUMENT STATE!')
        mainDocModal.document.state = newState
      }
    })
  } catch (error) {
    console.error('Failed to update document state:', error)
    throw new Error('DB ERROR')
  }
}

/**
 * Uploads a document to MinIO and updates document status
 */
async function docUpload(file, document) {
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
    const path = `${company.value.id}/projects/${props.project.id}/${document.id}`

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
    console.log("document.id", document.id)
    // Determine new state based on document type and AI parsability
    let newState = 'done' // Default state
    
    if(Number(document.docType?.isInput) === 1){
      // Input document - check if AI parsable
      if (Number(document.docType?.aiParsable) === 1) {
        // This document type is AI parsable
        newState = 'processing'
        
        // Trigger AI processing based on docType ID
        let payload
        if (Number(document.docType_id) === 55 || Number(document.docType_id) === 38) {
          // CU task for specific document types
          payload = {
            "task": "CU",
            "data": {
              "company_id": company.value.id,
              "project_id": props.project.id,
              "projDoc_id": document.id,
              "docType": "certificat_urbanistic"
            }
          }
        } else {
          // Data extraction for all other AI documents
          payload = {
            "task": "dataExtraction",
            "data": {
              "company_id": company.value.id,
              "project_id": props.project.id,
              "projDoc_id": document.id,
              "docType": document.docType?.name
            }
          }
        }

        // Call AI processing API (non-blocking to avoid CORS issues stopping upload)
        fetch('http://gamma.softaccel.net/api/docs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(error => {
          console.error('AI processing trigger failed:', error)
          console.log("Failed payload:", payload)
        })
      } else {
        // Input document that is NOT AI parsable - set to done
        newState = 'done'
      }
      
      // Update document state for input documents
      await updateDocumentState(document.id, newState)
    }
    // For output documents (isInput === 0), we don't change the state on upload

    // Show success message if upload completed
    success.value.message = "Document uploaded successfully"
  } catch (error) {
    console.error('Error uploading document:', error)
  }
}

/**
 * Marks document as sent (sets state to pending)
 */
async function markAsSent(docId) {
  try {
    await updateDocumentState(docId, 'pending')
    
    // Show success message
    success.value.message = "Document marked as sent successfully"
  } catch (error) {
    console.error('Failed to mark document as sent:', error)
  }
}

/**
 * Process document with AI (for output documents that are AI parsable)
 */
async function processWithAI(document) {
  if (!document || !document.id) {
    console.error('Invalid document provided to processWithAI')
    return
  }

  try {
    // Update document state to processing
    await updateDocumentState(document.id, 'processing')
    
    // Create payload for pdfFilling task
    const payload = {
      "task": "pdfFilling",
      "data": {
        "company_id": company.value.id,
        "project_id": props.project.id,
        "projDoc_id": document.id
      }
    }
    
    // Call AI processing API
    const response = await fetch('http://gamma.softaccel.net/api/docs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error('AI processing request failed')
    }
    
    // Show success message
    success.value.message = "Document sent for AI processing"
    await updateDocumentState(document.id, 'inProgress')
    
  } catch (error) {
    console.error('Failed to process document with AI:', error)
    console.log("Failed payload:", {
      "task": "pdfFilling",
      "data": {
        "company_id": company.value.id,
        "project_id": props.project.id,
        "projDoc_id": document.id
      }
    })
    
    // Revert state if processing failed
    await updateDocumentState(document.id, 'inProgress')
    
    // Show error message
    if (error.value) {
      error.value.message = "Failed to process document with AI"
    }
  }
}

/**
 * Mark document as done (for output documents)
 */
async function markAsDone(document) {
  if (!document || !document.id) {
    console.error('Invalid document provided to markAsDone')
    return
  }

  try {
    // Update document state to done
    await updateDocumentState(document.id, 'done')
    
    // Show success message
    success.value.message = "Document marked as done successfully"
    
  } catch (error) {
    console.error('Failed to mark document as done:', error)
    
    // Show error message
    if (error.value) {
      error.value.message = "Failed to mark document as done"
    }
  }
}

/**
 * Fetch project documents and doc_packages data
 */
const fetchData = async () => {
  // Set loading state
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
    
    // Fetch doc_packages data for adjacent document relationships
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