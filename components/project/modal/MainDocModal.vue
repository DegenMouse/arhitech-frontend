<template>
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <!-- Modal header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ formatDocumentName(mainDocument?.docType?.name) || 'Main Document' }}
          </h2>
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="text-sm text-gray-600">
          [ {{ completedDocsCount }}/{{ totalDocsCount }} Confirmate ]
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
              {{ formatDocumentName(mainDocument?.docType?.name) }}
            </div>
            <div class="flex items-center gap-2">
              <span 
                :class="getStateColor(mainDocument?.state)"
                class="text-sm font-medium capitalize mr-4"
              >
                {{ mainDocument?.state }}
              </span>
              
              <!-- Main document action buttons -->
              <button 
                v-if="mainDocument?.state === 'needed'"
                @click="$emit('upload', mainDocument?.id)" 
                class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
              >
                Upload
              </button>
              
              <button 
                v-if="(mainDocument?.state === 'done' || mainDocument?.state === 'rejected')"
                @click="$emit('upload', mainDocument?.id)" 
                class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
              >
                Re-upload
              </button>
              
              <button 
                v-if="mainDocument?.state === 'progress'"
                @click="$emit('finish', mainDocument?.id, '1')" 
                class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
              >
                Finish
              </button>
            </div>
          </div>
        </div>
        
        <!-- Adjacent Documents Section -->
        <div v-if="adjacentDocs && adjacentDocs.length" class="p-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-lg">📑</span>
            <h3 class="font-semibold text-gray-900">Documente necesare</h3>
          </div>
          <div class="border-b border-gray-200 mb-4"></div>
          
          <div class="space-y-3">
            <div 
              v-for="doc in adjacentDocs" 
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
                <!-- Adjacent document action buttons -->
                <button 
                  v-if="(doc.state === 'missing' || doc.state === 'needed') && Number(doc.docType?.isInput) === 1"
                  @click="$emit('upload', doc.id)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Upload
                </button>
                
                <button 
                  v-if="Number(doc.docType?.isInput) === 0"
                  @click="$emit('view', doc.id)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  View
                </button>
                
                <button 
                  v-if="doc.state === 'progress' && Number(doc.docType?.isInput) === 1"
                  @click="$emit('upload', doc.id)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Re-upload
                </button>
                
                <button 
                  v-if="doc.state === 'progress'"
                  @click="$emit('finish', doc.id, '1')" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Finish
                </button>
                
                <button 
                  v-if="doc.state === 'finished'"
                  @click="$emit('finish', doc.id, '0')" 
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
</template>

<script setup>
// Component props
const props = defineProps({
  mainDocument: {
    type: Object,
    required: true
  },
  adjacentDocs: {
    type: Array,
    default: () => []
  }
})

// Component emits
defineEmits(['close', 'upload', 'view', 'finish'])

// Computed properties for progress tracking
const completedDocsCount = computed(() => {
  const mainCompleted = props.mainDocument?.state === 'finished' ? 1 : 0
  const adjacentCompleted = props.adjacentDocs?.filter(doc => doc.state === 'finished').length || 0
  return mainCompleted + adjacentCompleted
})

const totalDocsCount = computed(() => {
  return 1 + (props.adjacentDocs?.length || 0)
})

// Helper functions
function formatDocumentName(name) {
  if (!name) return 'Unknown Document'
  
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function getStateColor(state) {
  const colors = {
    missing: 'text-red-600',
    needed: 'text-red-900',
    pending: 'text-orange-600',
    filled: 'text-yellow-600',
    finished: 'text-green-600',
    progress: 'text-blue-600'
  }
  return colors[state] || 'text-gray-600'
}
</script>