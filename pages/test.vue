<template>
  <div>
    <input type="file" ref="fileInput" />
    <button @click="upload">Upload</button>
    <p v-if="message">{{ message }}</p>
  </div>

  <div class="flex gap-2">
    <input type="text" v-model="inputText" class="border rounded px-2 py-1" />
    <button @click="download(inputText)" class="bg-blue-500 text-white px-4 py-1 rounded">Submit</button>
  </div>
</template>


<script setup lang="js">
const fileInput = ref(null)
const message = ref('')
const inputText = ref('')

async function upload() {
  const file = fileInput.value.files?.[0]
  if (!file) {
    message.value = 'Select a file first'
    return
  }

  // 1) Get a presigned URL from your server
  const res = await fetch(`/api/minio-put?key=${encodeURIComponent(file.name)}`)
  if (!res.ok) {
    message.value = 'Error getting URL'
    return
  }
  const { url } = await res.json()

  // 2) Upload directly to MinIO
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

async function download(key) {
  // 1) get presigned GET URL
  const { url } = await fetch(`/api/minio-get?key=${encodeURIComponent(key)}`)
                      .then(r => r.json()).catch(e => {
                        console.log("error")
                        console.log(e)
                      })
  // 2) fetch the file
  console.log("url")
  console.log(url)
  const res = await fetch(url)
  if (!res.ok) return alert('Download failed')
  const blob = await res.blob()
  // 3) trigger browser download
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = key
  a.click()
}
</script>
