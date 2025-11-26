<template>
  <div :class="[
    'border-2 rounded-lg p-4 hover:shadow-md transition-shadow',
    document.state === 'done' 
      ? 'border-green-300 bg-green-50 hover:border-green-400' 
      : 'border-gray-300 hover:border-gray-400'
  ]">
    <div class="flex flex-col h-full">
      <!-- Document name and status row -->
      <div class="flex items-start justify-between gap-2 mb-3">
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
      
      <!-- Spacer to push buttons to bottom -->
      <div class="flex-1"></div>
      
      <!-- Action buttons at bottom -->
      <div class="flex flex-wrap gap-2 mt-auto justify-start">
        <!-- View-only mode: Only show view button if document is done -->
        <template v-if="viewOnly">
          <button 
            v-if="document.state === 'done'"
            @click="$emit('view', document.id)"
            class="px-4 py-2 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-slate-200 min-w-[80px] flex items-center justify-center gap-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            View
          </button>
        </template>
        
        <!-- Full mode: Show all actions -->
        <template v-else>
          <!-- Input Document Actions (isInput = 1) -->
          <template v-if="Number(document.docType?.isInput) === 1">
            <!-- Missing state: Upload button -->
            <button 
              v-if="document.state === 'missing'"
              @click="$emit('upload', document)"
              class="px-4 py-2 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-slate-200 min-w-[80px] flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              Upload
            </button>
            
            <!-- Done state: View + Re-upload buttons -->
            <template v-if="document.state === 'done' && Number(document.docType?.isInput) === 1">
              <button 
                @click="$emit('view', document.id)"
                class="px-4 py-2 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-slate-200 min-w-[80px] flex items-center justify-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                View
              </button>
              <button 
                @click="$emit('upload', document)"
                class="px-4 py-2 bg-orange-50/80 hover:bg-orange-100 text-orange-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-orange-200 min-w-[80px] flex items-center justify-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
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
              class="px-4 py-2 bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-blue-200 min-w-[80px] flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit
            </button>
            
            <!-- Done state: Edit button -->
            <button 
              v-if="document.state === 'done'"
              @click="$emit('edit', document.id)"
              class="px-4 py-2 bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-blue-200 min-w-[80px] flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Edit
            </button>
            
            <!-- Process with AI button (for AI parsable output documents) -->
            <button 
              v-if="Number(document.docType?.aiParsable) === 1"
              @click="$emit('process-ai', document)"
              class="px-4 py-2 bg-purple-50/80 hover:bg-purple-100 text-purple-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-purple-200 min-w-[100px] flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Process with AI
            </button>
            
            <!-- Mark as Done button (for output documents that are not done) -->
            <button 
              v-if="document.state !== 'done' && (document.state === 'inProgress' || document.state === 'processing')"
              @click="$emit('mark-done', document)"
              class="px-4 py-2 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border border-emerald-200 min-w-[100px] flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Mark as Done
            </button>
          </template>
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
  },
  viewOnly: {
    type: Boolean,
    default: false
  }
})

// Component emits
const emit = defineEmits(['upload', 'view', 'edit', 'process-ai', 'mark-done'])

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
    missing: 'text-red-700 bg-red-50/80 border-red-200 hover:bg-red-100/80',
    needed: 'text-red-700 bg-red-50/80 border-red-200 hover:bg-red-100/80',
    pending: 'text-amber-700 bg-amber-50/80 border-amber-200 hover:bg-amber-100/80',
    done: 'text-emerald-700 bg-white border-emerald-200 hover:bg-emerald-50/80',
    rejected: 'text-rose-700 bg-rose-50/80 border-rose-200 hover:bg-rose-100/80',
    empty: 'text-gray-700 bg-gray-50/80 border-gray-200 hover:bg-gray-100/80',
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

function handleGenerate() {
  // Emit edit event with document id
  emit('edit', props.document.id)
}
</script>