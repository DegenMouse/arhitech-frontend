<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="emit('close')">
      <div class="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-semibold text-gray-800">Team Members</h3>
          <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
  
        <div class="space-y-4">
          <div v-if="members.length === 0" class="text-center text-gray-500 py-8">
            No members found
          </div>
          
          <div 
            v-for="member in members" 
            :key="member.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <!-- {{ member }} -->
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {{ member.attributes?.username?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <div>
                <div class="font-semibold text-gray-800">
                  {{ member.attributes?.username || 'Unknown User' }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ member.attributes?.email || 'No email' }}
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <span 
                v-if="Number(member.attributes?.isAdmin)" 
                class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
              >
                Admin
              </span>
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
  const props = defineProps({
    members: {
      type: Array,
      default: () => []
    }
  })
  
  const emit = defineEmits(['close', 'remove-member'])
  
  const removeMember = (memberId) => {
    emit('remove-member', memberId)
  }
  </script> 