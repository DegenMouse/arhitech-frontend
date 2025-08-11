<!--
  components/modals/admin/manageMembers.vue
  -----------------------------------------
  Modal component for managing team members in the admin interface.
  Displays a list of company members with their profile information.
  Shows admin badges for administrators and remove buttons for regular members.
  Features click-outside-to-close functionality and responsive design.
  Emits events for member removal actions.
  Provides visual user avatars with initials and member status indicators.
-->
<template>
    <!-- Modal overlay with click-outside-to-close -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="emit('close')">
      <!-- Modal content container with click stop propagation -->
      <div class="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" @click.stop>
        <!-- Modal header with title and close button -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-semibold text-gray-800">Team Members</h3>
          <!-- Close button with X icon -->
          <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
  
        <!-- Members list container -->
        <div class="space-y-4">
          <!-- Empty state when no members -->
          <div v-if="members.length === 0" class="text-center text-gray-500 py-8">
            No members found
          </div>
          
          <!-- Individual member card -->
          <div 
            v-for="member in members" 
            :key="member.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <!-- {{ member }} -->
            <!-- Member information section -->
            <div class="flex items-center space-x-4">
              <!-- User avatar with initials -->
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {{ member.username?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <!-- Member details -->
              <div>
                <div class="font-semibold text-gray-800">
                  {{ member.username || 'Unknown User' }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ member.email || 'No email' }}
                </div>
              </div>
            </div>
            
            <!-- Member actions section -->
            <div class="flex items-center space-x-2">
              <!-- Admin badge for administrators -->
              <span 
                v-if="Number(member.isAdmin)" 
                class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
              >
                Admin
              </span>
              <!-- Remove button for regular members -->
              <button 
                v-else
                @click="removeMember(member.id)"
                class="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
  
        <!-- Modal footer with close button -->
        <div class="mt-6 flex justify-end">
          <button 
            @click="emit('close')"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // Component props for members list
  const props = defineProps({
    members: {
      type: Array,
      default: () => []
    }
  })

  onMounted(() => {
    console.log(props.members)
  })
  
  // Component events
  const emit = defineEmits(['close', 'remove-member'])
  
  /**
   * Handles member removal by emitting the member ID
   * @param {string} memberId - The ID of the member to remove
   */
  const removeMember = (memberId) => {
    emit('remove-member', memberId)
  }
  </script> 