<!--
  pages/project/[id].vue
  ---------------------
  Dynamic project detail page that displays project information and manages associated documents.
  Features document categorization into Input/Output sections with status-based grouping.
  Handles document upload, viewing, and status management (finish/unfinish).
  Integrates with MinIO for file storage and retrieval using presigned URLs.
  Provides comprehensive document workflow management with AI processing capabilities.
  Uses reactive modal states for upload, document viewing, and success notifications.
-->
<template>
  <!-- Main project container -->
  <div class="p-8">
    <!-- Project content when loaded -->
    <div v-if="project.instance">
      <!-- Project header with name and phase -->
      <div class="flex items-center gap-4 mb-6">
        <h1 class="text-2xl font-bold">{{ project.instance.attributes?.name || 'Unnamed Project' }}</h1>
        <div class="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium">
          Phase: {{ project.instance.relationships?.phase_id?.data?.id || 'No Phase' }}
        </div>
      </div>
      
      <!-- Input Documents Section -->
      <div class="bg-white rounded shadow p-4 mb-6">
        <h2 class="text-base font-medium text-gray-700 mb-2">Input Documents</h2>
        <!-- Input documents with status-based grouping -->
        <template v-if="docsInput.toUpload.length || docsInput.inProgress.length || docsInput.finished.length">
          <!-- To Upload documents -->
          <div v-if="docsInput.toUpload.length" class="mb-2">
            <div class="text-xs text-gray-500 mb-1">To Upload</div>
            <div>
              <div v-for="doc in docsInput.toUpload" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
                <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
                <div class="flex justify-end">
                  <button @click="uploadModal.show = true; uploadModal.docId = doc.id;" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Upload</button>
                </div>
              </div>
            </div>
          </div>
          <!-- In Progress documents -->
          <div v-if="docsInput.inProgress.length" class="mb-2">
            <div class="text-xs text-gray-500 mb-1">In Progress</div>
            <div>
              <div v-for="doc in docsInput.inProgress" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
                <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
                <div class="flex justify-end">
                  <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
                  <button @click="uploadModal.show = true; uploadModal.docId = doc.id;" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">reUpload</button>
                  <button @click="aiProcess(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">AI Process</button>
                  <button @click="finish(doc.id, '1')" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs">Finish</button>
                </div>
              </div>
            </div>
          </div>
          <!-- Finished documents -->
          <div v-if="docsInput.finished.length">
            <div class="text-xs text-gray-500 mb-1">Finished</div>
            <div>
              <div v-for="doc in docsInput.finished" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
                <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
                <div class="flex justify-end">
                  <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
                  <button class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Send</button>
                  <button @click="finish(doc.id, '0')" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs">Unfinish</button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- Empty state for input documents -->
        <div v-else class="text-center py-4 text-gray-400 text-sm">
          <p>No input documents found for this project.</p>
        </div>
      </div>

      <!-- Output Documents Section -->
      <div class="bg-white rounded shadow p-4">
        <h2 class="text-base font-medium text-gray-700 mb-2">Output Documents</h2>
        <!-- Output documents with status-based grouping -->
        <template v-if="docsOutput.toUpload.length || docsOutput.inProgress.length || docsOutput.finished.length">
          <!-- To Upload documents -->
          <div v-if="docsOutput.toUpload.length" class="mb-2">
            <div class="text-xs text-gray-500 mb-1">To Upload</div>
            <div>
              <div v-for="doc in docsOutput.toUpload" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
                <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
                <div class="flex justify-end">
                  <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
                </div>
              </div>
            </div>
          </div>
          <!-- In Progress documents -->
          <div v-if="docsOutput.inProgress.length" class="mb-2">
            <div class="text-xs text-gray-500 mb-1">In Progress</div>
            <div>
              <div v-for="doc in docsOutput.inProgress" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
                <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
                <div class="flex justify-end">
                  <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
                </div>
              </div>
            </div>
          </div>
          <!-- Finished documents -->
          <div v-if="docsOutput.finished.length">
            <div class="text-xs text-gray-500 mb-1">Finished</div>
            <div>
              <div v-for="doc in docsOutput.finished" :key="doc.id" class="bg-gray-50 border border-gray-200 rounded p-3 mb-2 flex items-center justify-between">
                <span class="text-sm font-semibold text-gray-800">{{ doc.docType?.name || 'Unknown Document Type' }}</span>
                <div class="flex justify-end">
                  <button @click="docOpen(doc.id)" class="w-24 px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded text-xs mr-1">Open</button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- Empty state for output documents -->
        <div v-else class="text-center py-4 text-gray-400 text-sm">
          <p>No output documents found for this project.</p>
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

      <!-- Success notification modal -->
      <ModalsSuccess
        v-if="successModal.show"
        :message="successModal.message"
        @close="successModal.show = false"
      />
    </div>
    
    <!-- Loading state -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600">Loading project...</p>
    </div>
  </div>
</template>

<script setup>
// Get user company data and route information
const { company } = useUser()
const route = useRoute()
const dbApi = useRuntimeConfig().public.dbApi

// Reactive project data structure
const project = ref({
  id: null,
  instance: null,
  docs: []
})

// Computed properties for document categorization
const docsInput = computed(() => {
  return {
    toUpload: project.value.docs.filter(doc => doc.docType?.isInput === '1' && doc.isModified === '0'),
    inProgress: project.value.docs.filter(doc => doc.docType?.isInput === '1' && doc.isModified === '1' && doc.isFinished === '0'),
    finished: project.value.docs.filter(doc => doc.docType?.isInput === '1' && doc.isFinished === '1')
  }
})
const docsOutput = computed(() => {
  return {
    toUpload: project.value.docs.filter(doc => doc.docType?.isInput !== '1' && doc.isModified === '0'),
    inProgress: project.value.docs.filter(doc => doc.docType?.isInput !== '1' && doc.isModified === '1' && doc.isFinished === '0'),
    finished: project.value.docs.filter(doc => doc.docType?.isInput !== '1' && doc.isFinished === '1')
  }
})

// Modal state management
const uploadModal = reactive({
  show: false,
  docId: null
})
const successModal = reactive({
  show: false,
  message: null
})
const documentModal = reactive({
  show: false,
  isPdf: true,
  url: null,
  docId: null
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
  const path = `${company.value.id}/projects/${project.value.id}/${docId}`;

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
  // Download file as blob
  // documentModal.blob = await fetch(minioUrl.url).then(res => {
  //   if (!res.ok) {
  //     throw new Error('Failed to download file')
  //   }
  //   return res.blob()
  // })

  // Show document modal
  documentModal.show = true
  // const doc = project.value.docs.find(doc => doc.id === docId)
  // documentModal.fileName = doc.docType?.name || 'Unknown Document'
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
  const path = `${company.value.id}/projects/${project.value.id}/${docId}`;

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
  const docIndex = project.value.docs.findIndex(doc => doc.id === docId)
  if(ok && docIndex !== -1 && project.value.docs[docIndex].isModified != '1'){
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
      project.value.docs[docIndex].isModified = '1'
    }).catch(err => {
      console.error('Failed to update document:', err)
      ok = false
    })
  }

  // Show success message if upload completed
  if(ok){
    successModal.show = true
    successModal.message = "Document uploaded successfully"
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
    const docIndex = project.value.docs.findIndex(doc => doc.id === docId)
    if(docIndex !== -1){
      project.value.docs[docIndex].isFinished = isFinished
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

// Initialize project data on component mount
onMounted(() => {
  project.value.id = route.params.id
  
  // Fetch project details with phase information
  fetch(dbApi + '/data/projects/' + project.value.id + '?include=phase_id')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch project')
      }
      return res.json()
    })
    .then(data => {
      project.value.instance = data.data
    })
    .catch(err => {
      console.error('Failed to fetch project:', err)
    })

  // Fetch project documents with document type information
  fetch(dbApi + '/data/projects/' + project.value.id + '/projDocs/?include=docTypes_id')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch project documents')
      }
      return res.json()
    })
    .then(data => {
      // Map documents with their document types
      project.value.docs = data.data.map(doc => {
        return {
          ...doc.attributes,
          docType: data.includes.find(include => include.id === doc.relationships.docTypes_id.data.id)?.attributes,
        }
      })
    })
    .catch(err => {
      console.error('Failed to fetch project documents:', err)
    })
})
</script>
