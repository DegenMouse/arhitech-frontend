<!--
  pages/test.vue
  --------------
  Test page for MinIO file upload and download functionality.
  Provides a simple interface to test file operations with presigned URLs.
  Features file upload with direct MinIO integration and file download with browser download trigger.
  Used for development and testing of MinIO server API endpoints.
  Demonstrates the complete file upload/download workflow using presigned URLs.
-->
<template>
  <!-- File upload section -->
  <div>
    <!-- File input for selecting files to upload -->
    <input type="file" ref="fileInput" />
    <!-- Upload button to trigger file upload process -->
    <button @click="upload">Upload</button>
    <!-- Status message display -->
    <p v-if="message">{{ message }}</p>
  </div>

  <!-- File download section -->
  <div class="flex gap-2">
    <!-- Text input for entering file key/name to download -->
    <input type="text" v-model="inputText" class="border rounded px-2 py-1" />
    <!-- Download button to trigger file download process -->
    <button @click="download(inputText)" class="bg-blue-500 text-white px-4 py-1 rounded">Submit</button>
  </div>
</template>


<script setup lang="js">
// Template refs and reactive state
const fileInput = ref(null) // Reference to file input element
const message = ref('') // Status message for upload operations
const inputText = ref('') // Text input for download file key

/**
 * Handles file upload to MinIO using presigned URLs
 * Gets presigned URL from server and uploads directly to MinIO
 */
async function upload() {
  const file = fileInput.value.files?.[0]
  if (!file) {
    message.value = 'Select a file first'
    return
  }

  // Step 1: Get a presigned URL from the server
  const res = await fetch(`/api/minio-put?key=${encodeURIComponent(file.name)}`)
  if (!res.ok) {
    message.value = 'Error getting URL'
    return
  }
  const { url } = await res.json()

  // Step 2: Upload directly to MinIO using the presigned URL
  const put = await fetch(url, {
    method: 'PUT',
    body: file
  })
  if (!put.ok) {
    const err = await put.text()
    console.error(err)
    message.value = 'Upload failed'
    return
  }

  message.value = 'Upload successful!'
}

/**
 * Handles file download from MinIO using presigned URLs
 * Gets presigned URL and triggers browser download
 */
async function download(key) {
  // Step 1: Get presigned GET URL from server
  const { url } = await fetch(`/api/minio-get?key=${encodeURIComponent(key)}`)
                      .then(r => r.json()).catch(e => {
                        console.log("error")
                        console.log(e)
                      })
  // Step 2: Fetch the file using the presigned URL
  console.log("url")
  console.log(url)
  const res = await fetch(url)
  if (!res.ok) return alert('Download failed')
  const blob = await res.blob()
  // Step 3: Trigger browser download using blob URL
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = key
  a.click()
}
</script>
