<!--
  components/modals/file.vue
  -------------------------
  Simple PDF viewer modal component for displaying PDF files in full-screen.
  Features iframe-based PDF rendering with click-outside-to-close functionality.
  Restricts file types to PDF only with runtime validation.
  Provides clean, minimal interface focused on PDF viewing.
  Uses blob URLs for file display and includes close button for dismissal.
-->
<template>
  <!-- Modal overlay with click-outside-to-close -->
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @mousedown.self="$emit('close')">
    <!-- Modal content container -->
    <div class="bg-white w-full max-w-3xl max-h-[90vh] flex flex-col relative shadow-xl rounded-lg">
      <!-- Modal header with close button -->
      <div class="flex justify-end p-4">
        <!-- Close button with X symbol -->
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>
      <!-- PDF viewer content area -->
      <div class="flex-1 overflow-auto px-4 pb-4">
        <!-- PDF iframe for file display -->
        <iframe
          v-if="pdfUrl"
          :src="pdfUrl"
          class="w-full h-[70vh] border rounded"
        />
      </div>
      <!-- Modal footer with close button -->
      <div class="flex justify-end p-4">
        <!-- Close button -->
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-lg">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component props for PDF file object
const props = defineProps({
  fileObj: { type: Blob, required: true }
})

// Runtime validation to ensure only PDF files are supported
if (props.fileObj.type !== 'application/pdf') {
  throw new Error('Only PDF files are supported')
}

// Create blob URL for PDF display
const pdfUrl = URL.createObjectURL(props.fileObj)
</script>
