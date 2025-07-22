<template>
  <div class="p-8">
    <div v-if="project.instance">
      <div class="flex items-center gap-4 mb-6">
        <h1 class="text-2xl font-bold">{{ project.instance.attributes?.name || 'Unnamed Project' }}</h1>
        <div class="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium">
          Phase: {{ project.instance.relationships?.phase_id?.data?.id || 'No Phase' }}
        </div>
      </div>
      
      <!-- Input Documents -->
      <div class="bg-white rounded shadow p-4 mb-6">
        <h2 class="text-base font-medium text-gray-700 mb-2">Input Documents</h2>
        <template v-if="docsInput.toUpload.length || docsInput.inProgress.length || docsInput.finished.length">
          <!-- To Upload -->
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
          <!-- In Progress -->
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
          <!-- Finished -->
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
        <div v-else class="text-center py-4 text-gray-400 text-sm">
          <p>No input documents found for this project.</p>
        </div>
      </div>

      <!-- Output Documents -->
      <div class="bg-white rounded shadow p-4">
        <h2 class="text-base font-medium text-gray-700 mb-2">Output Documents</h2>
        <template v-if="docsOutput.toUpload.length || docsOutput.inProgress.length || docsOutput.finished.length">
          <!-- To Upload -->
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
          <!-- In Progress -->
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
          <!-- Finished -->
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
        <div v-else class="text-center py-4 text-gray-400 text-sm">
          <p>No output documents found for this project.</p>
        </div>
      </div>

      <ModalsUploadFile 
        v-if="uploadModal.show" 
        :singleFile="true" 
        @close="uploadModal.show = false" 
        @upload="docUpload" />

      <!-- <ModalsDocument
        v-if="documentModal.show"
        :blob="documentModal.blob"
        :fileName="documentModal.fileName"
        @close="documentModal.show = false"
      /> -->

      <ModalsFile
        v-if="documentModal.show"
        :fileObj="documentModal.blob"
        @close="documentModal.show = false"
      />

      <ModalsSuccess
        v-if="successModal.show"
        :message="successModal.message"
        @close="successModal.show = false"
      />
    </div>
    
    <div v-else class="text-center py-8">
      <p class="text-gray-600">Loading project...</p>
    </div>
  </div>
</template>

<script setup>
const { company } = useUser()

const route = useRoute()
const dbApi = useRuntimeConfig().public.dbApi

const project = ref({
  id: null,
  instance: null,
  docs: []
})
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
  fileName: null,
  blob: null
})


async function docOpen(docId) {
  if (!docId) {
    throw new Error('Document ID is required')
  }

  const bucket = useRuntimeConfig().public.buckets.companyFiles;
  const path = `${company.value.id}/projects/${project.value.id}/${docId}`;

  const minioUrl = await fetch(`/api/minio-get?path=${encodeURIComponent(path)}&bucket=${bucket}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to get presigned URL')
      }
      return res.json()
    })

  documentModal.blob = await fetch(minioUrl.url).then(res => {
    if (!res.ok) {
      throw new Error('Failed to download file')
    }
    return res.blob()
  })

  documentModal.show = true
  const doc = project.value.docs.find(doc => doc.id === docId)
  documentModal.fileName = doc.docType?.name || 'Unknown Document'
}

async function docUpload(file) {
  if(!(file instanceof File)){
    return
  }

  const bucket = useRuntimeConfig().public.buckets.companyFiles;
  const path = `${company.value.id}/projects/${project.value.id}/${uploadModal.docId}`;

  const minioUrl = await fetch(`/api/minio-put?path=${encodeURIComponent(path)}&bucket=${bucket}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to get presigned URL')
      }
      return res.json()
    })

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

  const docIndex = project.value.docs.findIndex(doc => doc.id === uploadModal.docId)
  if(ok && docIndex !== -1 && project.value.docs[docIndex].isModified != '1'){
    await fetch(dbApi + '/data/projDocs/' + uploadModal.docId, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          id: uploadModal.docId,
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

  if(ok){
    successModal.show = true
    successModal.message = "Document uploaded successfully"
  }
}

//function for finishing or unfinishing a document
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
    const docIndex = project.value.docs.findIndex(doc => doc.id === docId)
    if(docIndex !== -1){
      project.value.docs[docIndex].isFinished = isFinished
    }
  }).catch(err => {
    console.error('Failed to update document:', err)
  })
}

async function aiProcess(docId) {
  console.log('AI Process' + docId)
}

onMounted(() => {
  project.value.id = route.params.id
  
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

  fetch(dbApi + '/data/projects/' + project.value.id + '/projDocs/?include=docTypes_id')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch project documents')
      }
      return res.json()
    })
    .then(data => {
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
