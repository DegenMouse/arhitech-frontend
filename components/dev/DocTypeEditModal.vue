<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ isNew ? 'Add New DocType' : `Edit DocType "${docType?.name}"` }}
        </h3>
        
        <form @submit.prevent="saveDocType">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input :value="form.name"
                   @input="$emit('update:form', { ...form, name: $event.target.value })"
                   type="text"
                   required
                   class="block w-full border border-gray-300 rounded px-3 py-2">
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select :value="form.isInput"
                    @change="$emit('update:form', { ...form, isInput: parseInt($event.target.value) })"
                    class="block w-full border border-gray-300 rounded px-3 py-2">
              <option :value="1">Input Document</option>
              <option :value="0">Output Document</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tag (optional)
            </label>
            <select :value="form.tag"
                    @change="$emit('update:form', { ...form, tag: $event.target.value === 'null' ? null : $event.target.value })"
                    class="block w-full border border-gray-300 rounded px-3 py-2">
              <option :value="null">None</option>
              <option value="CU">CU (Construction Permit)</option>
              <option value="avize">Avize (Approvals)</option>
              <option value="studii">Studii (Studies)</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Location (optional)
            </label>
            <select :value="form.localitate_id"
                    @change="$emit('update:form', { ...form, localitate_id: $event.target.value === 'null' ? null : $event.target.value })"
                    class="block w-full border border-gray-300 rounded px-3 py-2">
              <option :value="null">General (all locations)</option>
              <option value="155243">Timișoara</option>
              <option value="155289">Ghiroda</option>
              <option value="155314">Giroc</option>
            </select>
          </div>


          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Is Null (optional document)
            </label>
            <select :value="form.isNull"
                    @change="$emit('update:form', { ...form, isNull: parseInt($event.target.value) })"
                    class="block w-full border border-gray-300 rounded px-3 py-2">
              <option :value="0">No</option>
              <option :value="1">Yes</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Required Documents Package
            </label>
            <div class="flex items-center space-x-2">
              <div class="flex-1">
                <input :value="requiredDocsText" 
                       type="text" 
                       readonly 
                       placeholder="No documents selected"
                       class="block w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-700">
              </div>
              <button type="button" 
                      @click="$emit('openRequiredDocsSelector')"
                      class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                {{ form.requiredDocs && form.requiredDocs.length > 0 ? 'Change' : 'Select' }}
              </button>
              <button v-if="form.requiredDocs && form.requiredDocs.length > 0" 
                      type="button" 
                      @click="clearRequiredDocs"
                      class="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">
                Clear
              </button>
            </div>
          </div>


          <!-- PDF Upload for new OUTPUT docTypes only -->
          <div v-if="isNew && form.isInput === 0" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Template PDF <span class="text-red-500">*</span>
            </label>
            <input type="file"
                   ref="pdfInput"
                   @change="handlePdfSelect"
                   accept=".pdf,application/pdf"
                   required
                   class="block w-full border border-gray-300 rounded px-3 py-2">
            <p class="text-sm text-gray-500 mt-1">Only PDF files are accepted for output documents</p>
            <p v-if="fileError" class="text-sm text-red-500 mt-1">{{ fileError }}</p>
          </div>
          
          <div class="flex items-center justify-end space-x-4">
            <button type="button" @click="$emit('close')" 
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" 
                    :disabled="saving"
                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {{ saving ? 'Saving...' : (isNew ? 'Create' : 'Save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  docType: {
    type: Object,
    default: null
  },
  isNew: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    required: true
  },
  selectedFile: {
    type: File,
    default: null
  },
  fileError: {
    type: String,
    default: null
  },
  saving: {
    type: Boolean,
    default: false
  },
  requiredDocsText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'close',
  'save',
  'openRequiredDocsSelector',
  'pdfSelect',
  'clearRequiredDocs',
  'update:form'
])

const pdfInput = ref(null)

function handlePdfSelect(event) {
  emit('pdfSelect', event)
}

function clearRequiredDocs() {
  emit('clearRequiredDocs')
}

function saveDocType() {
  emit('save')
}
</script>