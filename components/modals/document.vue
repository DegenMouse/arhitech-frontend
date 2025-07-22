<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800">View Document <span class="text-blue-600">{{ fileName }}</span></h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="p-4">
        <!-- PDF editable mode (demo: just one input for now) -->
        <template v-if="blobUrl && fileType === 'pdf' && editable">
          <div class="mb-2">
            <iframe :src="blobUrl" class="w-full min-h-[60vh] mb-2" />
            <input v-model="pdfInput" class="border rounded px-2 py-1 w-full mb-2" placeholder="Demo PDF input field" />
            <button @click="submitPdfEdit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Save</button>
          </div>
        </template>
        <!-- PDF view only -->
        <template v-else-if="blobUrl && fileType === 'pdf'">
          <iframe :src="blobUrl" class="w-full min-h-[60vh]" />
        </template>
        <!-- TXT editable -->
        <template v-else-if="blobUrl && fileType === 'txt' && editable">
          <textarea v-model="textContent" class="bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto text-xs max-h-[60vh] w-full mb-2" rows="16"></textarea>
          <button @click="submitTextEdit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Save</button>
        </template>
        <!-- TXT view only -->
        <template v-else-if="blobUrl && fileType === 'txt'">
          <pre class="bg-gray-50 border border-gray-200 rounded p-2 overflow-x-auto text-xs max-h-[60vh]">{{ textContent }}</pre>
        </template>
        <!-- Images -->
        <template v-else-if="blobUrl && fileType === 'image'">
          <img :src="blobUrl" class="max-w-full max-h-[60vh] mx-auto" />
        </template>
        <!-- DOCX/ODT: download only -->
        <template v-else-if="blobUrl && (fileType === 'docx' || fileType === 'odt')">
          <div class="flex flex-col items-center justify-center">
            <span class="mb-2 text-gray-600">Preview not supported. Download to view.</span>
            <a :href="blobUrl" :download="fileName" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Download</a>
          </div>
        </template>
        <!-- Other types -->
        <template v-else-if="blobUrl">
          <div class="flex flex-col items-center justify-center">
            <span class="mb-2 text-gray-600">Preview not supported. Download to view.</span>
            <a :href="blobUrl" :download="fileName" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Download</a>
          </div>
        </template>
        <template v-else>
          <div class="text-center text-gray-400">No document to display.</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
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
const emit = defineEmits(['close', 'submit'])
const blobUrl = computed(() => props.blob ? URL.createObjectURL(props.blob) : null)
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
const textContent = ref('')
const pdfInput = ref('')

watchEffect(() => {
  if (fileType.value === 'txt' && props.blob) {
    props.blob.text().then(txt => {
      textContent.value = txt
    })
  }
})

function submitTextEdit() {
  const newBlob = new Blob([textContent.value], { type: props.blob.type })
  emit('submit', newBlob)
}

function submitPdfEdit() {
  // For demo: just emit the input value as a text blob (real PDF editing would require a PDF library)
  const newBlob = new Blob([pdfInput.value], { type: 'application/pdf' })
  emit('submit', newBlob)
}
</script>
