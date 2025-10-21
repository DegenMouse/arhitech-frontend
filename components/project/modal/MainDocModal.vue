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
            <div class="flex items-center justify-center gap-3">
              <span 
                :class="getStateColor(mainDocument?.state)"
                class="text-sm font-medium capitalize"
              >
                {{ formatState(mainDocument?.state) }}
              </span>
              
              <!-- Edit button for output documents in inProgress state -->
              <button 
                v-if="mainDocument?.state === 'inProgress' && Number(mainDocument?.docType?.isInput) === 0"
                @click="$emit('edit', mainDocument.id)" 
                class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
              >
                Edit
              </button>
              
              <!-- Process with AI button for AI-parsable output documents -->
              <button 
                v-if="mainDocument?.state === 'done' && Number(mainDocument?.docType?.isInput) === 0 && Number(mainDocument?.docType?.aiParsable) === 1"
                @click="$emit('process-ai', mainDocument)" 
                class="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded"
              >
                Process with AI
              </button>
              
              <!-- Mark as Done button for output documents that are not done -->
              <button 
                v-if="Number(mainDocument?.docType?.isInput) === 0 && mainDocument?.state !== 'done' && (mainDocument?.state === 'inProgress' || mainDocument?.state === 'processing')"
                @click="$emit('mark-done', mainDocument)" 
                class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
              >
                Mark as Done
              </button>
              
              <button 
                v-if="(mainDocument?.state === 'done' || mainDocument?.state === 'rejected')"
                @click="$emit('upload', mainDocument)" 
                class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
              >
                Re-upload
              </button>
            </div>
          </div>
          
<<<<<<< Updated upstream
=======
          <!-- Warning message for undefined documents -->
          <div v-if="Number(mainDocument?.docType?.defined) === 0" class="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div class="text-sm text-amber-700">
                <p class="font-medium mb-1">Document nedefinit în sistem</p>
                <p>Acest tip de document nu este încă disponibil în baza de date. Puteți încărca documentul manual sau așteptați până când un administrator îl va configura (de obicei în 24-48 ore).</p>
              </div>
            </div>
          </div>
          
          <!-- Warning message for undefined documents -->
          <div v-if="Number(mainDocument?.docType?.defined) === 0" class="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div class="text-sm text-amber-700">
                <p class="font-medium mb-1">Document nedefinit în sistem</p>
                <p>Acest tip de document nu este încă disponibil în baza de date. Puteți încărca documentul manual sau așteptați până când un administrator îl va configura (de obicei în 24-48 ore).</p>
              </div>
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="flex items-center gap-2 flex-wrap justify-start">
            <!-- Edit button for output documents in inProgress state -->
            <button 
              v-if="mainDocument?.state === 'inProgress' && Number(mainDocument?.docType?.isInput) === 0"
              @click="$emit('edit', mainDocument.id)" 
              class="px-3 py-2 bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-blue-200 min-w-[80px] flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit
            </button>
            
            <!-- Process with AI button for AI-parsable output documents -->
            <button 
              v-if="Number(mainDocument?.docType?.isInput) === 0 && Number(mainDocument?.docType?.aiParsable) === 1"
              @click="$emit('process-ai', mainDocument)" 
              class="px-3 py-2 bg-purple-50/80 hover:bg-purple-100 text-purple-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-purple-200 min-w-[120px] flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Process with AI
            </button>
            
            <!-- Mark as Done button for output documents that are not done -->
            <button 
              v-if="Number(mainDocument?.docType?.isInput) === 0 && mainDocument?.state !== 'done' && (mainDocument?.state === 'inProgress' || mainDocument?.state === 'processing')"
              @click="$emit('mark-done', mainDocument)" 
              class="px-3 py-2 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-emerald-200 min-w-[110px] flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Mark as Done
            </button>
            
            <button 
              v-if="(mainDocument?.state === 'done' || mainDocument?.state === 'rejected')"
              @click="$emit('upload', mainDocument)" 
              class="px-3 py-2 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-slate-200 min-w-[90px] flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              Re-upload
            </button>
          </div>
          
>>>>>>> Stashed changes
          <!-- Destination Section -->
          <div v-if="mainDocument?.docType?.destination" class="mt-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg v-if="!isEmail(mainDocument?.docType?.destination)" class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span class="text-sm text-gray-700">
                {{ isEmail(mainDocument?.docType?.destination) ? 'Trimite cererea pe email' : 'Completează cererea pe site-ul' }}
              </span>
            </div>
            <div class="flex items-center justify-center gap-2 flex-wrap">
              <!-- Destination buttons -->
              <button 
                v-if="!isEmail(mainDocument?.docType?.destination)"
                @click="openLink(mainDocument?.docType?.destination)" 
                class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Vizitează Link
              </button>
              <button 
                v-else
                @click="openEmail(mainDocument?.docType?.destination)" 
                class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Trimite Email
              </button>
              <button 
                @click="$emit('mark-sent', mainDocument?.id)"
                class="px-3 py-1 bg-blue-800 hover:bg-blue-900 text-white text-sm rounded flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Marchează trimis
              </button>
              
              <!-- Upload button for pending state -->
              <button 
                v-if="mainDocument?.state === 'pending'"
                @click="$emit('upload', mainDocument)" 
                class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
              >
                Upload
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
                  {{ formatState(doc.state) }}
                </span>
              </div>
              <div class="flex justify-center gap-2">
                <!-- Adjacent document action buttons -->
                <button 
                  v-if="(doc.state === 'missing' || doc.state === 'needed') && Number(doc.docType?.isInput) === 1"
                  @click="$emit('upload', doc)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Upload
                </button>
                
                <button 
                  v-if="Number(doc.docType?.isInput) === 1 && doc.state === 'done'"
                  @click="$emit('view', doc.id)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  View
                </button>
                
                <button 
                  v-if="doc.state === 'progress' && Number(doc.docType?.isInput) === 1"
                  @click="$emit('upload', doc)" 
                  class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
                >
                  Re-upload
                </button>
                
                <!-- Edit button for output documents in inProgress state -->
                <button 
                  v-if="doc.state === 'inProgress' && Number(doc.docType?.isInput) === 0"
                  @click="$emit('edit', doc.id)" 
                  class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
                >
                  Edit
                </button>
                
                <!-- Process with AI button for AI-parsable output documents -->
                <button 
                  v-if="doc.state === 'done' && Number(doc.docType?.isInput) === 0 && Number(doc.docType?.aiParsable) === 1"
                  @click="$emit('process-ai', doc)" 
                  class="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded"
                >
                  Process with AI
                </button>
                
                <!-- Mark as Done button for output documents that are not done -->
                <button 
                  v-if="Number(doc.docType?.isInput) === 0 && doc.state !== 'done' && (doc.state === 'inProgress' || doc.state === 'processing')"
                  @click="$emit('mark-done', doc)" 
                  class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                >
                  Mark as Done
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
defineEmits(['close', 'upload', 'view', 'mark-sent', 'edit', 'process-ai', 'mark-done'])

// Computed properties for progress tracking
const completedDocsCount = computed(() => {
  const mainCompleted = props.mainDocument?.state === 'done' ? 1 : 0
  const adjacentCompleted = props.adjacentDocs?.filter(doc => doc.state === 'done').length || 0
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
    needed: 'text-red-900',
    pending: 'text-orange-600',
    done: 'text-green-600',
    rejected: 'text-red-600',
    processing: 'text-blue-600',
    missing: 'text-red-600',
    inProgress: 'text-blue-600'
  }
  return colors[state] || 'text-gray-600'
}

function formatState(state) {
  if (!state) return ''
  
  // Convert camelCase to Title Case
  return state
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim()
}

function isEmail(destination) {
  if (!destination) return false
  return destination.includes('@')
}

function openLink(url) {
  if (!url) return
  
  // Add https:// if no protocol is specified
  let formattedUrl = url
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    formattedUrl = 'https://' + url
  }
  
  window.open(formattedUrl, '_blank')
}

function openEmail(email) {
  if (!email) return
  
  window.location.href = 'mailto:' + email
}
</script>