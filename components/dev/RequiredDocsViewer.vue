<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Required Documents
        </h3>
        
        <div v-if="requiredDocs?.length > 0" class="space-y-2">
          <div v-for="reqDoc in requiredDocs" :key="reqDoc.id" 
               class="flex items-center p-3 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ reqDoc.name }}</p>
              <p class="text-xs text-gray-500">ID: {{ reqDoc.id }}</p>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-4 text-gray-500">
          No required documents
        </div>
        
        <div class="flex justify-end mt-6">
          <button @click="emit('close')" 
                  class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  requiredDocs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

</script>