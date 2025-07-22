<!--
  components/modals/success.vue
  ----------------------------
  Transient success notification component that appears in the top-right corner.
  Features auto-dismissing behavior with smooth fade transitions.
  Displays success messages with a checkmark icon in a green notification.
  Uses backdrop blur for modern glass-morphism effect.
  Automatically closes after 1.8 seconds with 0.6 second fade transition.
  Provides non-intrusive feedback for successful operations.
-->
<template>
  <!-- Success notification with fade transition -->
  <transition name="fade">
    <div v-if="visible" class="fixed top-6 right-6 z-50">
      <!-- Success notification container with glass effect -->
      <div class="bg-green-500 text-white px-6 py-3 rounded shadow-lg flex items-center min-w-[220px] backdrop-blur-sm">
        <!-- Checkmark icon in circular background -->
        <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 mr-3">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
            <path d="M8 12.5l2.5 2.5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          </svg>
        </span>
        <!-- Success message text -->
        <span class="text-sm">{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
// Component props for success message
const props = defineProps({
  message: {
    type: String,
    required: true
  }
})

// Component events
const emit = defineEmits(['close'])

// Visibility state for transition control
const visible = ref(false)

// Auto-dismiss functionality on component mount
onMounted(() => {
  // Show notification immediately
  visible.value = true
  // Hide after 1.8 seconds, then emit close after transition
  setTimeout(() => {
    visible.value = false
    setTimeout(() => emit('close'), 600)
  }, 1800)
})
</script>

<style scoped>
/* Fade transition styles for smooth appearance/disappearance */
.fade-enter-active, .fade-leave-active {
  /* transition: opacity 0.9s cubic-bezier(0.4,0,0.2,1); */
  transition: opacity 0.6s cubic-bezier(0,0,1,1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
