<template>
  <div class="w-full">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p class="mt-2 text-sm text-gray-500">Se încarcă cererile...</p>
    </div>

    <!-- Two column layout -->
    <div v-else class="grid grid-cols-2 gap-6">
      <!-- First column: Requests -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">Cereri</h2>
        
        <!-- Empty state -->
        <div v-if="requests.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-sm">Nu există cereri pentru acest proiect</p>
        </div>

        <!-- Requests list -->
        <div v-else class="space-y-3">
          <div
            v-for="request in requests"
            :key="request.id"
            class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex flex-col gap-2">
              <div class="font-medium text-gray-900">
                {{ formatDocumentName(request.docType?.name) || 'Cerere necunoscută' }}
              </div>
              <div class="text-sm text-gray-600">
                <span v-if="Number(request.attributes?.isSent) === 1" class="text-green-600 font-medium">
                  Trimis
                </span>
                <span v-else class="text-amber-600 font-medium">
                  Netrimis
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Second column: Empty placeholder -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">Emailuri</h2>
        <div class="text-center py-8 text-gray-400">
          <p class="text-sm">În curând...</p>
        </div>
      </div>
    </div>
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

// Get runtime config
const dbApi = useRuntimeConfig().public.dbApi

// Reactive data
const requests = ref([])
const loading = ref(true)

/**
 * Format document name similar to MainDocModal.vue
 */
function formatDocumentName(name) {
  if (!name) return 'Unknown Document'
  
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Fetch requests filtered by project_id with docType names included
 */
async function fetchRequests() {
  loading.value = true
  
  try {
    const projectId = props.project.id
    
    if (!projectId) {
      console.error('Project ID is missing')
      loading.value = false
      return
    }

    const res = await fetch(dbApi + `/data/requests?filter=project_id=${projectId}&include=docType_id`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!res.ok) {
      throw new Error('Failed to fetch requests')
    }

    const data = await res.json()

    // Map requests with their docType names from the includes array
    requests.value = data.data.map(request => {
      const docType = data.includes?.find(include => include.id === request.relationships?.docType_id?.data?.id)
      return {
        id: request.id,
        attributes: request.attributes,
        docType_id: request.relationships?.docType_id?.data?.id,
        docType: docType?.attributes
      }
    })
  } catch (error) {
    console.error('Error fetching requests:', error)
    requests.value = []
  } finally {
    loading.value = false
  }
}

// Watch for project changes and fetch data
watch(() => props.project.id, (newId) => {
  if (newId) {
    fetchRequests()
  }
}, { immediate: true })
</script>