<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Page header -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h1 class="text-3xl font-medium text-gray-900 mb-1">Documente</h1>
        <p class="text-gray-600">Toate documentele tale</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <!-- Documents grid -->
      <div v-else-if="allDocuments.length" class="space-y-8">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SimpleDocumentCard
            v-for="doc in allDocuments"
            :key="`doc-${doc.projectId}-${doc.id}`"
            :document="doc"
            @view="docOpen"
          />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-16">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <p class="text-gray-500 text-lg">Nu există documente disponibile</p>
      </div>

      <!-- Document viewing modal -->
      <ModalsFile
        v-if="documentModal && documentModal.show"
        :isPdf="documentModal.isPdf"
        :url="documentModal.url"
        :docId="documentModal.docId"
        @close="documentModal && (documentModal.show = false)"
      />
    </div>
  </div>
</template>

<script setup>
import SimpleDocumentCard from '@/components/project/component/SimpleDocumentCard.vue'

definePageMeta({
  layout: 'client'
})

// Get runtime config and user data
const dbApi = useRuntimeConfig().public.dbApi
const { auth, company } = useUser()

// Reactive data
const allDocuments = ref([])
const loading = ref(true)
const documentModal = reactive({
  show: false,
  isPdf: true,
  url: null,
  docId: null,
  projectId: null,
  companyId: null
})

/**
 * Fetch client projects from clients_in_project table
 */
async function fetchClientProjects() {
  try {
    const userId = auth.value.id
    
    if (!userId) {
      console.error('User ID is missing')
      loading.value = false
      return
    }

    const res = await fetch(dbApi + `/data/clients_in_project/?filter=user_id=${userId}&include=project_id`)
    
    if (!res.ok) {
      throw new Error('Failed to fetch client projects')
    }

    const data = await res.json()
    
    // Extract project IDs from the response
    const projectIds = data.data.map(item => item.relationships?.project_id?.data?.id).filter(Boolean)
    
    if (projectIds.length === 0) {
      loading.value = false
      return
    }

    // Fetch full project data with company_id for each project
    const projectsData = await Promise.all(
      projectIds.map(async (projectId) => {
        const projectRes = await fetch(dbApi + `/data/projects/${projectId}?include=company_id`)
        if (!projectRes.ok) {
          return { id: projectId, companyId: company.value.id }
        }
        const projectData = await projectRes.json()
        return {
          id: projectId,
          companyId: projectData.data?.relationships?.company_id?.data?.id || company.value.id,
          name: projectData.data?.attributes?.name || 'Unknown Project'
        }
      })
    )

    // Fetch documents for each project
    await fetchDocumentsForProjects(projectsData)
  } catch (error) {
    console.error('Error fetching client projects:', error)
    loading.value = false
  }
}

/**
 * Fetch documents for all projects
 */
async function fetchDocumentsForProjects(projectsData) {
  try {
    const documentsPromises = projectsData.map(async (project) => {
      const docsResponse = await fetch(dbApi + `/data/projects/${project.id}/projDocs/?include=docType_id`)
      
      if (!docsResponse.ok) {
        throw new Error(`Failed to fetch documents for project ${project.id}`)
      }
      
      const docsData = await docsResponse.json()
      
      // Map documents with their document types and project info
      return docsData.data.map(doc => {
        const docType = docsData.includes?.find(include => include.id === doc.relationships?.docType_id?.data?.id)
        return {
          ...doc.attributes,
          id: doc.id,
          docType_id: doc.relationships?.docType_id?.data?.id,
          docType: docType?.attributes,
          projectId: project.id,
          companyId: project.companyId,
          projectName: project.name
        }
      })
    })

    const documentsArrays = await Promise.all(documentsPromises)
    allDocuments.value = documentsArrays.flat()
  } catch (error) {
    console.error('Error fetching documents:', error)
  } finally {
    loading.value = false
  }
}

/**
 * Opens a document for viewing by fetching it from MinIO
 */
async function docOpen(docId) {
  if (!docId) {
    throw new Error('Document ID is required')
  }

  // Find the document to get project and company info
  const document = allDocuments.value.find(doc => doc.id === docId)
  if (!document) {
    console.error('Document not found')
    return
  }

  const bucket = useRuntimeConfig().public.buckets.companyFiles
  const path = `${document.companyId}/projects/${document.projectId}/${docId}`

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
    documentModal.projectId = document.projectId
    documentModal.companyId = document.companyId
    documentModal.show = true
  } catch (error) {
    console.error('Error opening document:', error)
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchClientProjects()
})
</script>
