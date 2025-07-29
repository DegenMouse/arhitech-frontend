<template>
  <div>
    <input type="file" @change="onFile" />
    <button @click="upload" :disabled="!file">Upload</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const file = ref(null);

function onFile(evt) {
  file.value = evt.target.files[0] || null;
}

async function upload() {
  if (!file.value) return;

  console.log("upload");

  const form = new FormData();
  form.append('file', file.value);

  const res = await fetch('/api/doc2pdf', {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    console.error('Upload failed:', await res.text());
    return;
  }

  // for demo: read back as ArrayBuffer
  const arrayBuffer = await res.arrayBuffer();
  // Create blob from array buffer
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
  
  // Create download link and trigger click
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = file.value.name.replace(/\.[^.]+$/, '.pdf');
  link.click();

  // Clean up
  URL.revokeObjectURL(link.href);
  console.log('Got PDF bytes:', new Uint8Array(arrayBuffer).length);
}
</script>
