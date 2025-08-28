<template>
  <div 
    class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    @click="$emit('open-modal', document)"
  >
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
      
      <!-- Progress bar for main documents -->
      <div class="space-y-2 mb-4">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Documente necesare</span>
          <span class="font-medium text-gray-900">
            {{ document.completedCount }}/{{ document.totalCount }}
          </span>
        </div>
        
        <!-- Progress bar -->
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all duration-300"
            :class="document.completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'"
            :style="`width: ${document.completionPercentage}%`"
          ></div>
        </div>
        
        <div class="text-xs text-gray-500">
          {{ Math.round(document.completionPercentage) }}% Complete
        </div>
      </div>
      <!-- Spacer to push content to bottom -->
      <div class="flex-1"></div>
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
defineEmits(['open-modal'])

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
    processing: 'text-blue-600'
  }
  return colors[state] || 'text-gray-600'
}
</script>