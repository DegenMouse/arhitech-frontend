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
  <!-- Enhanced success notification with modern design -->
  <transition name="slide-fade">
    <div v-if="visible" class="fixed top-6 right-6 z-50">
      <!-- Enhanced success notification container -->
      <div class="bg-white border-l-4 border-green-500 rounded-xl shadow-lg border border-gray-100 px-6 py-4 flex items-center min-w-[300px] backdrop-blur-sm">
        <!-- Enhanced checkmark icon -->
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 mr-4">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div class="flex-1">
          <!-- Success title -->
          <p class="text-sm font-medium text-gray-900">Success!</p>
          <!-- Success message -->
          <p class="text-sm text-gray-600 mt-0.5">{{ message }}</p>
        </div>
        <!-- Close button -->
        <button @click="visible = false" class="ml-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-100">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
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
/* Enhanced slide-fade transition for modern effect */
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
