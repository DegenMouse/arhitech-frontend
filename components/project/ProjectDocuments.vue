<!--
  components/project/ProjectDocuments.vue
  ---------------------------------------
  Project documents panel component showing document categorization into Input/Output sections.
  Features document status-based grouping and management functionality.
  Handles document upload, viewing, and status updates with AI processing capabilities.
  Integrates with MinIO for file storage and retrieval using presigned URLs.
  Provides comprehensive document workflow management interface.
-->
<template>
  <!-- Documents Section - Table Layout -->
  <div class="bg-white rounded shadow p-4">
    <h2 class="text-base font-medium text-gray-700 mb-4">Project Documents</h2>
    
    <div class="grid gap-4" style="grid-template-columns: 1fr 1fr; grid-template-rows: auto auto auto auto auto;">
      <!-- Headers -->
      <h3 class="text-sm font-medium text-gray-700 mb-2 text-center">Input Documents</h3>
      <h3 class="text-sm font-medium text-gray-700 mb-2 text-center">Output Documents</h3>
      
      <!-- Row 1: Missing -->
      <div class="border border-gray-200 rounded p-3">
        <div class="text-xs text-gray-500 mb-2 font-medium">Missing</div>
        <div v-if="docsInput.missing.length">
          <div v-for="doc in docsInput.missing" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
            <div class="flex justify-end">
              <button @click="uploadModal.show = true; uploadModal.docId = doc.id;" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Upload</button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-2 text-gray-400 text-xs">
          <p>No documents</p>
        </div>
      </div>

      <div class="border border-gray-200 rounded p-3">
        <div class="text-xs text-gray-500 mb-2 font-medium">Missing</div>
        <div v-if="docsOutput.missing.length">
          <div v-for="doc in docsOutput.missing" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
            <div class="flex justify-end">
              <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-2 text-gray-400 text-xs">
          <p>No documents</p>
        </div>
      </div>

      <!-- Row 2: Progress -->
      <div class="border border-gray-200 rounded p-3">
        <div class="text-xs text-gray-500 mb-2 font-medium">Progress</div>
        <div v-if="docsInput.progress.length">
          <div v-for="doc in docsInput.progress" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
            <div class="flex justify-end">
              <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
              <button @click="uploadModal.show = true; uploadModal.docId = doc.id;" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">reUpload</button>
              <button @click="aiProcess(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">AI Process</button>
              <button @click="finish(doc.id, '1')" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs">Finish</button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-2 text-gray-400 text-xs">
          <p>No documents</p>
        </div>
      </div>

      <div class="border border-gray-200 rounded p-3">
        <div class="text-xs text-gray-500 mb-2 font-medium">Progress</div>
        <div v-if="docsOutput.progress.length">
          <div v-for="doc in docsOutput.progress" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
            <div class="flex justify-end">
              <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-2 text-gray-400 text-xs">
          <p>No documents</p>
        </div>
      </div>

      <!-- Row 3: Filled -->
      <div class="border border-gray-200 rounded p-3">
        <div class="text-xs text-gray-500 mb-2 font-medium">Filled</div>
        <div v-if="docsInput.filled.length">
          <div v-for="doc in docsInput.filled" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
            <div class="flex justify-end">
              <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
              <button class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Send</button>
              <button @click="finish(doc.id, '0')" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs">Unfinish</button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-2 text-gray-400 text-xs">
          <p>No documents</p>
        </div>
      </div>

      <div class="border border-gray-200 rounded p-3">
        <div class="text-xs text-gray-500 mb-2 font-medium">Filled</div>
        <div v-if="docsOutput.filled.length">
          <div v-for="doc in docsOutput.filled" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
            <div class="flex justify-end">
              <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-2 text-gray-400 text-xs">
          <p>No documents</p>
        </div>
      </div>

      <!-- Row 4: Pending -->
      <div class="border border-gray-200 rounded p-3">
        <div class="text-xs text-gray-500 mb-2 font-medium">Pending</div>
        <div v-if="docsInput.pending.length">
          <div v-for="doc in docsInput.pending" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
            <div class="flex justify-end">
              <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-2 text-gray-400 text-xs">
          <p>No documents</p>
        </div>
      </div>

      <div class="border border-gray-200 rounded p-3">
        <div class="text-xs text-gray-500 mb-2 font-medium">Pending</div>
        <div v-if="docsOutput.pending.length">
          <div v-for="doc in docsOutput.pending" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
            <div class="flex justify-end">
              <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-2 text-gray-400 text-xs">
          <p>No documents</p>
        </div>
      </div>

      <!-- Row 5: Finished -->
      <div class="border border-gray-200 rounded p-3">
        <div class="text-xs text-gray-500 mb-2 font-medium">Finished</div>
        <div v-if="docsInput.finished.length">
          <div v-for="doc in docsInput.finished" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
            <div class="flex justify-end">
              <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-2 text-gray-400 text-xs">
          <p>No documents</p>
        </div>
      </div>

      <div class="border border-gray-200 rounded p-3">
        <div class="text-xs text-gray-500 mb-2 font-medium">Finished</div>
        <div v-if="docsOutput.finished.length">
          <div v-for="doc in docsOutput.finished" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
            <div class="flex justify-end">
              <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-2 text-gray-400 text-xs">
          <p>No documents</p>
        </div>
      </div>
    </div>

    <!-- File upload modal -->
    <ModalsUploadFile 
      v-if="uploadModal.show" 
      :singleFile="true" 
      :docId="uploadModal.docId"
      @close="uploadModal.show = false" 
      @upload="docUpload" 
    />

    <!-- Document viewing modal -->
    <ModalsFile
      v-if="documentModal.show"
      :isPdf="documentModal.isPdf"
      :url="documentModal.url"
      :docId="documentModal.docId"
      @close="documentModal.show = false"
      @change="docUpload"
    />
  </div>
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

// Reactive document data
const docs = ref([])

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

// Computed properties for document categorization
const docsInput = computed(() => {
  return {
    missing: docs.value.filter(doc => doc.docType?.isInput === '1' && doc.state === 'missing'),
    progress: docs.value.filter(doc => doc.docType?.isInput === '1' && doc.state === 'progress'),
    filled: docs.value.filter(doc => doc.docType?.isInput === '1' && doc.state === 'filled'),
    pending: docs.value.filter(doc => doc.docType?.isInput === '1' && doc.state === 'pending'),
    finished: docs.value.filter(doc => doc.docType?.isInput === '1' && doc.state === 'finished')
  }
})
const docsOutput = computed(() => {
  return {
    missing: docs.value.filter(doc => doc.docType?.isInput !== '1' && doc.state === 'missing'),
    progress: docs.value.filter(doc => doc.docType?.isInput !== '1' && doc.state === 'progress'),
    filled: docs.value.filter(doc => doc.docType?.isInput !== '1' && doc.state === 'filled'),
    pending: docs.value.filter(doc => doc.docType?.isInput !== '1' && doc.state === 'pending'),
    finished: docs.value.filter(doc => doc.docType?.isInput !== '1' && doc.state === 'finished')
  }
})

/**
 * Opens a document for viewing by fetching it from MinIO
 * Gets presigned URL and loads file as blob for display
 */
async function docOpen(docId) {
  if (!docId) {
    throw new Error('Document ID is required')
  }

  const bucket = useRuntimeConfig().public.buckets.companyFiles;
  const path = `${company.value.id}/projects/${props.project.id}/${docId}`;

  // Get presigned URL for file download
  const minioUrl = await fetch(`/api/minio-get?path=${encodeURIComponent(path)}&bucket=${bucket}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to get presigned URL')
      }
      return res.json()
    })

    console.log("minioUrl")
    console.log(minioUrl)

  documentModal.url = minioUrl.url
  documentModal.docId = docId
  documentModal.show = true
}

/**
 * Uploads a document to MinIO and updates document status
 * Uses presigned URL for direct upload and updates isModified flag
 */
async function docUpload(file, docId) {
  if(!(file instanceof File)){
    return
  }
  // Get file MIME type
  const mimeType = file.type || 'application/octet-stream';
  
  // Convert DOCX, JPEG, or PNG files to PDF if needed
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'image/jpeg' || 
      mimeType === 'image/png') {

    console.log("convert to pdf")
    
    const form = new FormData();
    form.append('file', file);

    const res = await fetch('/api/doc2pdf', {
      method: 'POST', 
      body: form
    });

    if (!res.ok) {
      throw new Error('Failed to convert file to PDF');
    }

    // Convert response to File object
    const pdfArrayBuffer = await res.arrayBuffer();
    const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
    file = new File([pdfBlob], file.name.replace(/\.[^.]+$/, '.pdf'), { type: 'application/pdf' });
  }else if(mimeType !== 'application/pdf'){
    throw new Error('Unsupported file type: ' + mimeType);
  }

  const bucket = useRuntimeConfig().public.buckets.companyFiles;
  const path = `${company.value.id}/projects/${props.project.id}/${docId}`;

  // Get presigned URL for file upload
  const minioUrl = await fetch(`/api/minio-put?path=${encodeURIComponent(path)}&bucket=${bucket}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to get presigned URL')
      }
      return res.json()
    })

  // Upload file to MinIO
  const ok = await fetch(minioUrl.url, {
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
    return false
  })

  // Update document status to modified if upload successful
  const docIndex = docs.value.findIndex(doc => doc.id === docId)
  if(ok && docIndex !== -1 && docs.value[docIndex].isModified != '1'){
    await fetch(dbApi + '/data/projDocs/' + docId, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          id: docId,
          attributes: {
            isModified: "1"
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
      ok = false
    })
  }

  // Show success message if upload completed
  if(ok){
    success.value.message = "Document uploaded successfully"
  }
}

/**
 * Updates document finish status (finish or unfinish)
 * Toggles isFinished flag between '0' and '1'
 */
async function finish(docId, isFinished = '1') {
  await fetch(dbApi + '/data/projDocs/' + docId, {
    method: 'PATCH',
    body: JSON.stringify({
      data: {
        id: docId,
        attributes: {
          isFinished: isFinished
        }
      }
    })
  }).then(res => {
    if (!res.ok) {
      throw new Error('Failed to update document')
    }
    // Update local state
    const docIndex = docs.value.findIndex(doc => doc.id === docId)
    if(docIndex !== -1){
      docs.value[docIndex].isFinished = isFinished
    }
  }).catch(err => {
    console.error('Failed to update document:', err)
  })
}

/**
 * Placeholder for AI processing functionality
 * TODO: Implement AI document processing
 */
async function aiProcess(docId) {
  console.log('AI Process' + docId)
}

/**
 * Fetch project documents with document type information
 */
const fetchDocuments = () => {
  fetch(dbApi + '/data/projects/' + props.project.id + '/projDocs/?include=docType_id')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch project documents')
      }
      return res.json()
    })
    .then(data => {
      // Map documents with their document types
      docs.value = data.data.map(doc => {
        return {
          ...doc.attributes,
          docType: data.includes.find(include => include.id === doc.relationships.docType_id.data.id)?.attributes,
        }
      })
    })
    .catch(err => {
      console.error('Failed to fetch project documents:', err)
    })
}

// Watch for project changes and fetch documents
watch(() => props.project.id, (newId) => {
  if (newId) {
    fetchDocuments()
  }
}, { immediate: true })
</script>