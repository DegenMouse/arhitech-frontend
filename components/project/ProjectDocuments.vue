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
    
    <!-- Documents grid -->
    <div v-else-if="documents.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <!-- Main Documents (needed or pending state) -->
      <MainDocumentCard
        v-for="doc in mainDocuments" 
        :key="`main-${doc.id}`"
        :document="doc"
        @open-modal="openMainDocModal"
      />
      
      <!-- Simple Documents (all other states) -->
      <SimpleDocumentCard
        v-for="doc in simpleDocuments" 
        :key="`simple-${doc.id}`"
        :document="doc"
        @upload="openUploadModal"
        @view="docOpen"
      />
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
      @finish="finish"
    />

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
  docId: null
})
const documentModal = reactive({
  show: false,
  isPdf: true,
  url: null,
  docId: null
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

// Computed property for main documents (needed or pending state)
const mainDocuments = computed(() => {
  return documents.value
    .filter(doc => doc.state === 'needed' || doc.state === 'pending')
    .map(doc => {
      // Calculate completion for main documents
      const relatedPackages = docPackages.value.filter(pkg => pkg.main === doc.docType_id)
      const adjacentDocTypeIds = relatedPackages.map(pkg => pkg.adjacent)
      const adjacentDocs = docs.value.filter(d => adjacentDocTypeIds.includes(d.docType_id))
      
      const mainCompleted = doc.state === 'finished' ? 1 : 0
      const adjacentCompleted = adjacentDocs.filter(d => d.state === 'finished').length
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

// Computed property for simple documents (all other states)
const simpleDocuments = computed(() => {
  return documents.value.filter(doc => doc.state !== 'needed' && doc.state !== 'pending')
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
function openUploadModal(docId) {
  // Close main modal if open
  mainDocModal.show = false
  
  uploadModal.docId = docId
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

    // Update document status to pending if upload successful
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
        docs.value[docIndex].state = 'pending'
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
      
      // Update main modal if open
      if (mainDocModal.show) {
        const adjacentIndex = mainDocModal.adjacentDocs.findIndex(doc => doc.id === docId)
        if (adjacentIndex !== -1) {
          mainDocModal.adjacentDocs[adjacentIndex].isFinished = isFinished
          mainDocModal.adjacentDocs[adjacentIndex].state = isFinished === '1' ? 'finished' : 'progress'
        }
        // Update main document if it's the one being finished
        if (mainDocModal.document?.id === docId) {
          mainDocModal.document.isFinished = isFinished
          mainDocModal.document.state = isFinished === '1' ? 'finished' : 'progress'
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