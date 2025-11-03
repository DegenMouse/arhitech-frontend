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

        <!-- Enhanced invite section -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h4 class="text-lg font-semibold text-gray-800 mb-4">Invite New Member</h4>
          
          <!-- Enhanced email input field -->
          <div class="space-y-4">
            <div>
              <label for="email-input" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <input
                  id="email-input"
                  v-model="email"
                  type="email"
                  placeholder="Enter member's email address"
                  class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0743ae] focus:outline-none focus:ring-2 focus:ring-[#0743ae] focus:ring-offset-2 transition-all duration-100 hover:border-gray-300"
                />
              </div>
            </div>
            
            <!-- Enhanced invite button -->
            <button 
              @click="handleSendEmail(email)"
              :disabled="!email.trim()"
              class="w-full bg-[#0743ae] hover:bg-[#0743ae]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all duration-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0743ae] focus:ring-offset-2 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              Send Invitation
            </button>
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
  
  const email = ref('')
  
  const props = defineProps({
    members: {
      type: Array,
      default: () => []
    }
  })



  async function handleSendEmail(email) {
    
    const { company } = useUser();
    
    const inviteType = "team-member"
    const entityId = company.value.id;
    const res = await fetch('/api/sendInviteEmail', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, inviteType, entityId})
      })
    if(!res.ok)
      console.log("Diddy works here");
    
  }

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