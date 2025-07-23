<!--
  components/modals/document.vue
  ------------------------------
  Document viewer modal component that supports multiple file types and editing modes.
  Features PDF, TXT, image, DOCX, and ODT file viewing with type-specific handling.
  Includes editable modes for PDF (demo) and TXT files with save functionality.
  Uses blob URLs for file display and supports download for unsupported formats.
  Provides responsive design with proper file type detection and content rendering.
  Emits events for document editing submissions and modal closing.
-->
<template>
  <!-- Modal overlay with semi-transparent backdrop -->
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <!-- Modal content container -->
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Modal header with filename and close button -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800">View Document <span class="text-blue-600">{{ fileName }}</span></h2>
        <!-- Close button with X icon -->
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- Document content area -->
      <div class="p-4">
        <!-- PDF editable mode (demo: just one input for now) -->
        <template v-if="blobUrl && fileType === 'pdf' && editable">
          <div class="mb-2">
            <!-- PDF iframe viewer -->
            <iframe :src="blobUrl" class="w-full min-h-[60vh] mb-2" />
            <!-- Demo PDF input field -->
            <input v-model="pdfInput" class="border rounded px-2 py-1 w-full mb-2" placeholder="Demo PDF input field" />
            <!-- Save button for PDF edits -->
            <button @click="submitPdfEdit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Save</button>
          </div>
        </template>
        <!-- PDF view only mode -->
        <template v-else-if="blobUrl && fileType === 'pdf'">
          <iframe :src="blobUrl" class="w-full min-h-[60vh]" />
        </template>
        <!-- TXT editable mode -->
        <template v-else-if="blobUrl && fileType === 'txt' && editable">
          <!-- Editable textarea for TXT files -->
          <textarea v-model="textContent" class="bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto text-xs max-h-[60vh] w-full mb-2" rows="16"></textarea>
          <!-- Save button for text edits -->
          <button @click="submitTextEdit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Save</button>
        </template>
        <!-- TXT view only mode -->
        <template v-else-if="blobUrl && fileType === 'txt'">
          <!-- Read-only text display -->
          <pre class="bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto text-xs max-h-[60vh]">{{ textContent }}</pre>
        </template>
        <!-- Image display mode -->
        <template v-else-if="blobUrl && fileType === 'image'">
          <img :src="blobUrl" class="max-w-full max-h-[60vh] mx-auto" />
        </template>
        <!-- DOCX/ODT: download only mode -->
        <template v-else-if="blobUrl && (fileType === 'docx' || fileType === 'odt')">
          <div class="flex flex-col items-center justify-center">
            <span class="mb-2 text-gray-600">Preview not supported. Download to view.</span>
            <!-- Download link for office documents -->
            <a :href="blobUrl" :download="fileName" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Download</a>
          </div>
        </template>
        <!-- Other file types: download only -->
        <template v-else-if="blobUrl">
          <div class="flex flex-col items-center justify-center">
            <span class="mb-2 text-gray-600">Preview not supported. Download to view.</span>
            <!-- Download link for unsupported types -->
            <a :href="blobUrl" :download="fileName" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Download</a>
          </div>
        </template>
        <!-- Empty state when no document -->
        <template v-else>
          <div class="text-center text-gray-400">No document to display.</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component props for document data and behavior
const props = defineProps({
  blob: {
    type: Object,
    required: true
  },
  fileName: {
    type: String,
    default: ''
  },
  editable: {
    type: Boolean,
    default: false
  }
})

// Component events
const emit = defineEmits(['close', 'submit'])

// Computed blob URL for file display
const blobUrl = computed(() => props.blob ? URL.createObjectURL(props.blob) : null)

// Computed file type detection based on MIME type
const fileType = computed(() => {
  if (!props.blob) return null
  const type = props.blob.type
  if (type.includes('pdf')) return 'pdf'
  if (type.includes('text')) return 'txt'
  if (type.startsWith('image/')) return 'image'
  if (type.includes('msword') || type.includes('officedocument') || type.includes('docx')) return 'docx'
  if (type.includes('opendocument.text') || type.includes('odt')) return 'odt'
  return 'other'
})

// Reactive form data for editing
const textContent = ref('')
const pdfInput = ref('')

// Watch for blob changes to load text content
watchEffect(() => {
  if (fileType.value === 'txt' && props.blob) {
    props.blob.text().then(txt => {
      textContent.value = txt
    })
  }
})

/**
 * Handles text file editing submission
 * Creates new blob with edited content and emits submit event
 */
function submitTextEdit() {
  const newBlob = new Blob([textContent.value], { type: props.blob.type })
  emit('submit', newBlob)
}

/**
 * Handles PDF editing submission (demo implementation)
 * For demo: just emit the input value as a text blob
 * Real PDF editing would require a PDF library
 */
function submitPdfEdit() {
  // For demo: just emit the input value as a text blob (real PDF editing would require a PDF library)
  const newBlob = new Blob([pdfInput.value], { type: 'application/pdf' })
  emit('submit', newBlob)
}
</script>
