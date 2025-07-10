<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header with company name and leave button -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">{{ company.companyName }}</h1>
        <button 
          @click="showLeaveModal = true"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Leave Company
        </button>
      </div>
      
      <!-- Main content area -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            @click="manageTeam"
            class="p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            <div class="text-2xl mb-2">👥</div>
            <div class="font-semibold">Manage Team</div>
          </button>
          
          <button 
            @click="navigateTo('/company-settings')"
            class="p-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            <div class="text-2xl mb-2">⚙️</div>
            <div class="font-semibold">Company Settings</div>
          </button>
          
          <button 
            @click="navigateTo('/create-project')"
            class="p-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
          >
            <div class="text-2xl mb-2">📋</div>
            <div class="font-semibold">Create Project</div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Confirm Leave Company Modal -->
    <ModalsConfirm 
      v-if="showLeaveModal"
      title="Leave Company"
      message="Are you sure you want to leave this company? This will result in the deletion of your company if you are it's founder. This is a BUG and needs to be fixed."
      confirm-text="Leave Company"
      @close="showLeaveModal = false"
      @confirm="handleLeaveCompany"
    />
    
    <!-- Members List Modal -->
    <ModalsAdminManageMembers 
      v-if="showMembersModal"
      :members="members"
      @close="showMembersModal = false"
      @remove-member="handleRemoveMember"
    />
    
    <!-- Error Modal -->
    <ModalsError 
      v-if="error.show"
      :title="error.title"
      :message="error.message"
      @close="error.show = false"
    />
  </div>
</template>

<script setup>
const dbApi = useRuntimeConfig().public.dbApi
const { auth, company } = useUser()

const showLeaveModal = ref(false)
const showMembersModal = ref(false)
const members = ref([])

const error = reactive({
  show: false,
  title: '',
  message: ''
})

const handleLeaveCompany = async () => {
  console.log('Leaving company')
  await fetch(dbApi + '/data/users/' + auth.value.id, {
    method: 'PATCH',
    body: JSON.stringify({
        data: {
            id: auth.value.id,
            attributes: {
                company_id: null
            }
        }
    })
  }).then(res => {
    if(!res.ok){
      error.title = 'Failed to Leave Company'
      error.message = 'There was an error while trying to leave the company. Please try again.'
      error.show = true
      throw new Error('Failed to leave company')
    }
    return res.json()
  }).then(() => {
    fetchCompany().then(() => {
      navigateTo('/noComp')
    }).catch(err => {
      console.error('Failed to fetch company:', err)
      error.title = 'Error retrieving company'
      error.message = "This error might resolve with a page reload"
      error.show = true
      throw new Error('Failed to fetch company')
    })
  }).catch(err => {
    console.error(err)
    if (!error.show) {
      error.title = 'Network Error'
      error.message = 'Unable to connect to the server. Please check your internet connection and try again.'
      error.show = true
    }
  })
}

const manageTeam = () => {
  console.log('manageTeam')
  fetch(dbApi + '/data/admins/' + auth.value.id + '/company_id/?include=users').then(res => {
    if(!res.ok){
      throw new Error('Failed to fetch admins')
    }
    return res.json()
  }).then(data => {
    const provisoryMembers = data.includes;
    const index = provisoryMembers.findIndex(member => member.id === auth.value.id)
    if (index > -1) {
        provisoryMembers.splice(index, 1)
    }
    console.log(provisoryMembers)
    members.value = provisoryMembers;
    showMembersModal.value = true

    members.value.forEach(member => {
        // fetch(dbApi + '/data/users/' + member.id + '/company_id').then(res => {
    })
  }).catch(err => {
    console.error('Failed to fetch members:', err)
    error.title = 'Failed to Load Members'
    error.message = 'Unable to load team members. Please try again.'
    error.show = true
  })
}

const handleRemoveMember = (memberId) => {
  console.log('Removing member:', memberId)
  // TODO: Implement member removal logic
  // For now, just remove from the local array
//   const index = members.value.findIndex(member => member.id === memberId)
//   if (index > -1) {
//     members.value.splice(index, 1)
//   }
}
</script>
