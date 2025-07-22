<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @mousedown.self="$emit('close')">
    <div class="bg-white w-full max-w-3xl max-h-[90vh] flex flex-col relative shadow-xl rounded-lg">
      <div class="flex justify-end p-4">
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>
      <div class="flex-1 overflow-auto px-4 pb-4">
        <iframe
          v-if="pdfUrl"
          :src="pdfUrl"
          class="w-full h-[70vh] border rounded"
        />
      </div>
      <div class="flex justify-end p-4">
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-lg">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  fileObj: { type: Blob, required: true }
})

if (props.fileObj.type !== 'application/pdf') {
  throw new Error('Only PDF files are supported')
}

const pdfUrl = URL.createObjectURL(props.fileObj)
</script>
