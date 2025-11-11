<!--
  components/modals/uploadFile.vue
  -------------------------------
  File upload modal component that supports single or multiple file uploads.
  Features drag-and-drop file selection with specific MIME type restrictions.
  Supports PDF, images, TXT, DOCX, and ODT file formats.
  Displays selected file names and provides upload/cancel actions.
  Includes form validation to ensure files are selected before upload.
  Emits events for file upload with single file or array based on configuration.
-->
<template>
  <!-- Modal overlay with semi-transparent backdrop -->
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <!-- Modal content container -->
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
      <!-- Modal header with dynamic title and close button -->
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800">Upload one {{ singleFile ? '' : 'or more' }} file {{ singleFile ? '' : 's' }} for <span class="text-blue-600">{{ fileName }}</span></h2>
        <!-- Close button with X icon -->
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <!-- File upload form -->
      <form @submit.prevent="handleUpload" class="p-4 space-y-4">
        <!-- File input with MIME type restrictions -->
        <div>
          <input
            type="file"
            :multiple="!singleFile"
            @change="onFileChange"
            accept=".pdf,image/*,.txt,.docx,.odt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text"
            class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
        </div>
        <!-- Selected files display -->
        <div v-if="files.length" class="bg-gray-50 border border-gray-200 rounded p-2 text-xs">
          <div v-for="file in files" :key="file.name" class="truncate">{{ file.name }}</div>
        </div>
        <!-- Form action buttons -->
        <div class="flex justify-end gap-2 pt-2">
          <!-- Cancel button -->
          <button type="button" @click="$emit('close')" class="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">Cancel</button>
          <!-- Upload button with disabled state when no files selected -->
          <button type="submit" :disabled="!files.length" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50">Upload</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
// Component props for upload configuration
const props = defineProps({
  singleFile: {
    type: Boolean,
    default: true
  },
  fileName: {
    type: String,
    default: 'document'
  },
  docId: {
    type: String,
    default: null
  }
})

// Component events
const emit = defineEmits(['close', 'upload'])

// Reactive array to store selected files
const files = ref([])

/**
 * Handles file selection from input element
 * Converts FileList to array and stores in reactive state
 * @param {Event} e - File input change event
 */
function onFileChange(e) {
  const fileList = e.target.files
  files.value = Array.from(fileList)
}

/**
 * Handles form submission for file upload
 * Emits single file or array based on singleFile prop
 * Closes modal after upload event emission
 */
function handleUpload() {
  if(props.singleFile){
    // Emit single file for single file mode
    emit('upload', files.value[0], props.docId)
  }else{
    // Emit array of files for multiple file mode
    emit('upload', files.value, props.docId)
  }
  emit('close')
}
</script>
