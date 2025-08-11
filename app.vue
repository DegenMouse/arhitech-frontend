<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ModalsError 
    v-if="error.show"
    :title="error.title"
    :message="error.message"
    @close="error.show = false; error.title = null; error.message = null"
  />
  <ModalsSuccess 
    v-if="success.show"
    :message="success.message"
    @close="success.show = false; success.message = null"
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