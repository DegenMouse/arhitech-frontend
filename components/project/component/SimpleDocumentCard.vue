<template>
  <div :class="[
    'border rounded-lg p-4 hover:shadow-md transition-shadow',
    document.state === 'done' 
      ? 'border-green-200 bg-green-50' 
      : 'border-gray-200'
  ]">
    <div class="flex flex-col h-full">
      <!-- Document name and status row -->
      <div class="flex items-start justify-between gap-2 mb-3">
        <h3 class="font-medium text-gray-900 flex-1">{{ formatDocumentName(document.docType?.name) }}</h3>
        <span 
          :class="getStateColor(document.state)" 
          class="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0"
        >
          {{ document.state }}
        </span>
      </div>
      
      <!-- Spacer to push buttons to bottom -->
      <div class="flex-1"></div>
      
      <!-- Action buttons at bottom -->
      <div class="flex flex-wrap gap-2 mt-auto">
        <!-- Input Document Actions (isInput = 1) -->
        <template v-if="Number(document.docType?.isInput) === 1">
          <!-- Missing state: Upload button -->
          <button 
            v-if="document.state === 'missing'"
            @click="$emit('upload', document)"
            class="px-3 py-1 text-white text-sm rounded hover:opacity-90"
            style="background-color: #0c47b0;"
          >
            Upload
          </button>
          
          <!-- Done state: View + Re-upload buttons -->
          <template v-if="document.state === 'done'">
            <button 
              @click="$emit('view', document.id)"
              class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
            >
              View
            </button>
            <button 
              @click="$emit('upload', document)"
              class="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded"
            >
              Re-upload
            </button>
          </template>
        </template>
        
        <!-- Output Document Actions (isInput = 0) -->
        <template v-if="Number(document.docType?.isInput) === 0">
          <!-- Empty state: Generate button -->
          <button 
            v-if="document.state === 'inProgress'"
            @click="handleGenerate"
            class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
          >
            Edit
          </button>
          
          <!-- Done state: View button -->
          <button 
            v-if="document.state === 'done'"
            @click="$emit('view', document.id)"
            class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded"
          >
            View
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component props
const props = defineProps({
  document: {
    type: Object,
    required: true
  }
})

// Component emits
defineEmits(['upload', 'view'])

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
    done: 'text-green-600',
    empty: 'text-gray-600',
    processing: 'text-blue-600'
  }
  return colors[state] || 'text-gray-600'
}

function handleGenerate() {
  console.log('Hello 1')
}
</script>