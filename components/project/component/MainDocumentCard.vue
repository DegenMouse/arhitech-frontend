<template>
  <div 
    class="border-2 border-gray-400 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-gray-500"
    @click="$emit('open-modal', document)"
  >
    <div class="flex flex-col h-full">
      <!-- Document name and status row -->
      <div class="flex items-start gap-2 mb-3">
        <h3 class="font-medium text-gray-900 flex-1">{{ formatDocumentName(document.docType?.name) }}</h3>
        <span 
          :class="getStateStyle(document.state)" 
          class="px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 border transition-all duration-200 flex items-center gap-1.5"
        >
          <!-- State icons -->
          <svg v-if="document.state === 'needed' || document.state === 'missing'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <svg v-else-if="document.state === 'pending'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg v-else-if="document.state === 'done'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg v-else-if="document.state === 'rejected'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg v-else-if="document.state === 'processing'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <svg v-else-if="document.state === 'inProgress'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ formatState(document.state) }}
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

function getStateStyle(state) {
  const styles = {
    needed: 'text-red-700 bg-red-50/80 border-red-200 hover:bg-red-100/80',
    pending: 'text-amber-700 bg-amber-50/80 border-amber-200 hover:bg-amber-100/80',
    done: 'text-emerald-700 bg-white border-emerald-200 hover:bg-emerald-50/80',
    rejected: 'text-rose-700 bg-rose-50/80 border-rose-200 hover:bg-rose-100/80',
    processing: 'text-blue-700 bg-blue-50/80 border-blue-200 hover:bg-blue-100/80',
    inProgress: 'text-indigo-700 bg-indigo-50/80 border-indigo-200 hover:bg-indigo-100/80'
  }
  return styles[state] || 'text-gray-700 bg-gray-50/80 border-gray-200 hover:bg-gray-100/80'
}

function formatState(state) {
  if (!state) return ''
  
  // Convert camelCase to Title Case
  return state
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim()
}
</script>