<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ModalsError 
    v-if="error.message"
    :title="error.title"
    :message="error.message"
    @close="error.title = 'An Error Occurred'; error.message = null"
  />
  <ModalsSuccess 
    v-if="success.message"
    :message="success.message"
    @close="success.message = null"
  />
  <ModalsConfirm
    v-if="confirmModal.show.value"
    :message="confirmModal.message.value"
    @close="confirmModal.onCancel"
    @confirm="confirmModal.onConfirm"
  />
</template>
<script setup>
const confirmModal = useConfirm()
const { error, success } = useUI()
</script>