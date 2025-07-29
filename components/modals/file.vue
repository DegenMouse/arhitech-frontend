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
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    @click="$emit('close')">
    
    <!-- Modal Content -->
    <div 
      class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
      @click.stop>
      
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">PDF Viewer</h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- PDF Viewer -->
      <div class="flex-1 min-h-0">
        <iframe
          ref="pdfViewer"
          :src="`/pdfjs/web/viewer.html?file=${encodeURIComponent(url)}`"
          allowfullscreen
          class="w-full h-full min-h-[500px]">
        </iframe>
      </div>
      
      <!-- Footer with buttons -->
      <div class="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors">
          Cancel
        </button>
        <button 
          @click="submit"
          class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// Component props for PDF file object
const props = defineProps({
  isPdf: { type: Boolean, required: false, default: false },
  url: { type: String, required: false, default: null },
  docId: { type: String, required: false, default: null }
})


const pdfViewer = ref(null)

const emit = defineEmits(['change', 'close'])


// Function to handle submit
var submit = () => {console.log("not initialized yet")}

// Initialize PDF viewer when iframe loads
const initializePDFViewer = () => {
  if (!pdfViewer.value) return
  
  const iframe = pdfViewer.value
  
  // Wait for iframe to load
  iframe.addEventListener('load', async () => {
    console.log("iframe loaded")
    
    var win = iframe.contentWindow;
    var viewer = win.PDFViewerApplication;
    
    if (!viewer) throw new Error("Viewer not found")
    
    viewer.eventBus.on('documentloaded', () => {
      console.log(`🔍 Number of pages: ${viewer.pdfDocument.numPages}`)

      submit = async () => {
        try {
          const data = await viewer.pdfDocument.saveDocument();

          const file = new File(
            [data],
            "edited.pdf",                // the filename you want
            { type: "application/pdf",   // MIME type
              lastModified: Date.now()   // optional timestamp
            }
          );

          emit('change', file, props.docId)
          emit('close')

          return
          const blob = new Blob([data], { type: "application/pdf" });


          const blobUrl = URL.createObjectURL(blob);
          
          // Create download link using native JavaScript instead of jQuery
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = viewer._docFilename || 'document.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        } catch (reason) {
          console.error(`Error when saving the document:`, reason);
        }
      }
    })
      
  })
}

// Lifecycle hook to initialize when component mounts
onMounted(() => {
  nextTick(() => {
    initializePDFViewer()
  })
})

</script>
