<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Page header -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h1 class="text-3xl font-medium text-gray-900 mb-1">Documente</h1>
        <p class="text-gray-600">Toate documentele tale</p>
      </div>

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
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      <!-- Documents grouped by project -->
      <div v-else-if="projectsWithDocuments.length" class="space-y-8">
        <div v-for="projectGroup in projectsWithDocuments" :key="projectGroup.projectId" class="space-y-6">
          <!-- Project header (only show if multiple projects) -->
          <div v-if="projectsWithDocuments.length > 1" class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 class="text-xl font-semibold text-gray-900">{{ projectGroup.projectName }}</h2>
          </div>

          <!-- Section 1: Documente Restante (Not Done) -->
          <div v-if="projectGroup.documentsNotDone.length" class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Documente Restante</h2>
              <span class="text-sm text-gray-600">{{ projectGroup.documentsNotDone.length }} document{{ projectGroup.documentsNotDone.length !== 1 ? 'e' : '' }}</span>
            </div>
            
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <!-- Main Documents (needed or pending state) -->
              <MainDocumentCard
                v-for="doc in projectGroup.mainDocuments" 
                :key="`main-${doc.id}`"
                :document="doc"
                @open-modal="openMainDocModal"
              />
              
              <!-- Simple Documents (not done, other states) -->
              <SimpleDocumentCard
                v-for="doc in projectGroup.simpleDocumentsNotDone" 
                :key="`simple-not-done-${doc.id}`"
                :document="doc"
                :view-only="true"
                @view="docOpen"
              />
            </div>
          </div>
          
          <!-- Section 2: Documente Depuse (Done) -->
          <div v-if="projectGroup.documentsDone.length" class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Documente Depuse</h2>
              <span class="text-sm text-gray-600">{{ projectGroup.documentsDone.length }} document{{ projectGroup.documentsDone.length !== 1 ? 'e' : '' }}</span>
            </div>
            
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <!-- Done Documents -->
              <SimpleDocumentCard
                v-for="doc in projectGroup.simpleDocumentsDone" 
                :key="`simple-done-${doc.id}`"
                :document="doc"
                :view-only="true"
                @view="docOpen"
              />
            </div>
          </div>
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

      <!-- Main Document Modal -->
      <MainDocModal
        v-if="mainDocModal.show"
        :main-document="mainDocModal.document"
        :adjacent-docs="mainDocModal.adjacentDocs"
        :project-id="mainDocModal.projectId"
        :view-only="true"
        @close="mainDocModal.show = false"
        @view="docOpen"
      />

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
import MainDocumentCard from '@/components/project/component/MainDocumentCard.vue'
import MainDocModal from '@/components/modals/project/MainDocModal.vue'

definePageMeta({
  layout: 'client'
})

// Get runtime config and user data
const dbApi = useRuntimeConfig().public.dbApi
const { auth, company } = useUser()

// Reactive data
const docs = ref([])
const docPackages = ref([])
const projects = ref([])
const loading = ref(true)
const selectedTag = ref('')

// Modal state management
const documentModal = reactive({
  show: false,
  isPdf: true,
  url: null,
  docId: null,
  projectId: null,
  companyId: null
})
const mainDocModal = reactive({
  show: false,
  document: null,
  adjacentDocs: [],
  projectId: null
})

// Computed property for available tags
const availableTags = computed(() => {
  return ['avize', 'CU', 'studii']
})

// Computed property for filtering documents
const documents = computed(() => {
  // Get documents based on filter selection
  let allDocs = docs.value.filter(doc => {
    return doc.state // Any document with a state
  })
  
  // Apply tag filter if selected, or exclude 'needed' and 'pending' if showing all
  if (selectedTag.value) {
    // When specific tag is selected, show all documents with that tag
    allDocs = allDocs.filter(doc => doc.docType?.tag === selectedTag.value)
  } else {
    // When showing "Toate documentele", exclude 'needed' and 'pending' state documents
    allDocs = allDocs.filter(doc => doc.state !== 'needed' && doc.state !== 'pending')
  }
  
  return allDocs
})

// Group documents by project and compute sections
const projectsWithDocuments = computed(() => {
  // Group documents by project_id
  const groupedByProject = {}
  
  documents.value.forEach(doc => {
    const projectId = doc.project_id || doc.projectId
    if (!groupedByProject[projectId]) {
      const project = projects.value.find(p => p.id === projectId)
      groupedByProject[projectId] = {
        projectId: projectId,
        projectName: project?.name || 'Unknown Project',
        documents: []
      }
    }
    groupedByProject[projectId].documents.push(doc)
  })
  
  // Process each project group
  return Object.values(groupedByProject).map(projectGroup => {
    const projectDocs = projectGroup.documents
    
    // Documents that are NOT done (remaining work)
    const documentsNotDone = projectDocs.filter(doc => doc.state !== 'done')
    
    // Documents that ARE done (submitted/completed)
    const documentsDone = projectDocs.filter(doc => doc.state === 'done')
    
    // Main documents (needed or pending or rejected state) from not-done documents - PROGRESS BAR
    const mainDocuments = documentsNotDone
      .filter(doc => doc.state === 'needed' || doc.state === 'pending' || doc.state === 'rejected')
      .map(doc => {
        // Calculate completion for main documents
        const relatedPackages = docPackages.value.filter(pkg => pkg.main === doc.docType_id)
        const adjacentDocTypeIds = relatedPackages.map(pkg => pkg.adjacent)
        const adjacentDocs = docs.value.filter(d => 
          adjacentDocTypeIds.includes(d.docType_id) && 
          (d.project_id === doc.project_id || d.projectId === doc.project_id)
        )
        
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
    
    // Simple documents from not-done documents (all other non-done states)
    const simpleDocumentsNotDone = documentsNotDone.filter(doc => 
      doc.state !== 'needed' && doc.state !== 'pending' && doc.state !== 'rejected'
    )
    
    // Simple documents from done documents
    const simpleDocumentsDone = documentsDone
    
    return {
      ...projectGroup,
      documentsNotDone,
      documentsDone,
      mainDocuments,
      simpleDocumentsNotDone,
      simpleDocumentsDone
    }
  })
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
    
    // Find all adjacent documents from the same project
    mainDocModal.adjacentDocs = docs.value.filter(d => 
      adjacentDocTypeIds.includes(d.docType_id) && 
      (d.project_id === doc.project_id || d.projectId === doc.project_id)
    )
  }
  
  mainDocModal.document = doc
  mainDocModal.projectId = doc.project_id || doc.projectId
  mainDocModal.show = true
}

/**
 * Opens a document for viewing by fetching it from MinIO
 */
async function docOpen(docId) {
  if (!docId) {
    throw new Error('Document ID is required')
  }

  // Find the document to get project and company info
  const document = docs.value.find(doc => doc.id === docId)
  if (!document) {
    console.error('Document not found')
    return
  }

  const projectId = document.project_id || document.projectId
  const companyId = document.companyId || company.value.id
  const bucket = useRuntimeConfig().public.buckets.companyFiles
  const path = `${companyId}/projects/${projectId}/${docId}`

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
    documentModal.projectId = projectId
    documentModal.companyId = companyId
    documentModal.show = true
  } catch (error) {
    console.error('Error opening document:', error)
  }
}

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

    const res = await fetch(dbApi + `/data/clients_in_project/?include=project_id&filter=user_id=${userId}`)
    
    if (!res.ok) {
      throw new Error('Failed to fetch client projects')
    }

    const data = await res.json()
    
    // Extract project IDs and project data from the response
    const projectData = data.includes || []
    
    if (projectData.length === 0) {
      loading.value = false
      return
    }

    // Store projects with their IDs and names
    projects.value = projectData.map(project => ({
      id: project.id,
      name: project.attributes?.name || 'Unknown Project'
    }))

    // Fetch documents for each project
    await fetchDocumentsForProjects(projectData.map(p => p.id))
  } catch (error) {
    console.error('Error fetching client projects:', error)
    loading.value = false
  }
}

/**
 * Fetch documents for all projects
 */
async function fetchDocumentsForProjects(projectIds) {
  try {
    // Fetch doc_packages data for main document relationships
    const packagesResponse = await fetch(dbApi + '/data/doc_packages')
    if (packagesResponse.ok) {
      const packagesData = await packagesResponse.json()
      docPackages.value = packagesData.data.map(pkg => ({
        id: pkg.id,
        main: pkg.relationships?.main?.data?.id,
        adjacent: pkg.relationships?.adjacent?.data?.id
      }))
    }

    const documentsPromises = projectIds.map(async (projectId) => {
      const docsResponse = await fetch(dbApi + `/data/projects/${projectId}/projDocs/?include=docType_id`)
      
      if (!docsResponse.ok) {
        throw new Error(`Failed to fetch documents for project ${projectId}`)
      }
      
      const docsData = await docsResponse.json()
      
      // Map documents with their document types and project info
      return docsData.data.map(doc => {
        const docType = docsData.includes?.find(include => include.id === doc.relationships?.docType_id?.data?.id)
        const project = projects.value.find(p => p.id === projectId)
        return {
          ...doc.attributes,
          id: doc.id,
          docType_id: doc.relationships?.docType_id?.data?.id,
          docType: docType?.attributes,
          project_id: projectId,
          projectId: projectId,
          companyId: company.value.id,
          projectName: project?.name || 'Unknown Project'
        }
      })
    })

    const documentsArrays = await Promise.all(documentsPromises)
    docs.value = documentsArrays.flat()
  } catch (error) {
    console.error('Error fetching documents:', error)
  } finally {
    loading.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchClientProjects()
})
</script>

