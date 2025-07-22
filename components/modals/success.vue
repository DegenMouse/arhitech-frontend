<template>
  <transition name="fade">
    <div v-if="visible" class="fixed top-6 right-6 z-50">
      <div class="bg-green-500 text-white px-6 py-3 rounded shadow-lg flex items-center min-w-[220px] backdrop-blur-sm">
        <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 mr-3">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
            <path d="M8 12.5l2.5 2.5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          </svg>
        </span>
        <span class="text-sm">{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['close'])
const visible = ref(false)
onMounted(() => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
    setTimeout(() => emit('close'), 600)
  }, 1800)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  /* transition: opacity 0.9s cubic-bezier(0.4,0,0.2,1); */
  transition: opacity 0.6s cubic-bezier(0,0,1,1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
