<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header with company name and leave button -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-800">{{ company.companyName }}</h1>
          <button 
            @click="showLeaveModal = true"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Leave Company
          </button>
        </div>
      </div>
      
      <!-- Main content area -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            @click="showMembersModal = true"
            class="p-6 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-center border border-gray-200"
          >
            <div class="font-semibold text-lg">Manage Team</div>
          </button>
          
          <button 
            @click="showManageProjectsModal = true"
            class="p-6 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-center border border-gray-200"
          >
            <div class="font-semibold text-lg">Manage Projects</div>
          </button>
          
          <button 
            @click="showCreateProjectModal = true"
            class="p-6 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-center border border-gray-200"
          >
            <div class="font-semibold text-lg">Create Project</div>
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

    <!-- Create Project Modal -->
    <ModalsAdminEditProject 
      v-if="showCreateProjectModal"
      :members="members"
      :isNew="true"
      @close="showCreateProjectModal = false"
      @create-project="handleCreateProject"
    />

    <!-- Manage Projects Modal -->
    <ModalsAdminManageProjects 
      v-if="showManageProjectsModal"
      :projects="projects"
      :members="members"
      @close="showManageProjectsModal = false"
      @reFetchProjects="fetchProjects"
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

//modal for leaving company
const showLeaveModal = ref(false)

//modal for managing members
const showMembersModal = ref(false)
const members = ref([])

//modal for creating a project
const showCreateProjectModal = ref(false)

//modal for managing projects
const showManageProjectsModal = ref(false)
const projects = ref([])

//error modal data
const error = reactive({
  show: false,
  title: '',
  message: ''
})

//fetch members and projects on mount
onMounted(() => {
  fetchMembers().then(() => {
    fetchProjects()
  })
})

const handleLeaveCompany = async () => {

  leaveCompany(error).then(() => {
      navigateTo('/noComp')
    }).catch(err => {
      console.error('Failed to leave company:', err)
    })
}

//fetch members that the company has
const fetchMembers = async () => {
  return fetch(dbApi + '/data/admins/' + auth.value.id + '/company_id/?include=users_in_company').then(res => {
    if(!res.ok){
      throw new Error('Failed to fetch users in company')
    }
    return res.json()
  }).then(async data => {
    const memberIds = data.includes.map(include => include.relationships.user_id.data.id);

    members.value = await Promise.all(memberIds.map(async memberId => {
      return await fetch(dbApi + '/data/users/' + memberId).then(res => {
        if(!res.ok){
          throw new Error('Failed to fetch user')
        }
        return res.json();
      }).then(data => {
        return data.data;
      })
    }));
  }).catch(err => {
    console.error('Failed to fetch members:', err)
    error.title = 'Failed to Load Members'
    error.message = 'Unable to load team members. Please try again.'
    error.show = true
  })
}

//fetch projects for the company
const fetchProjects = async () => {

  return fetch(dbApi + '/data/admins/' + auth.value.id + '/company_id/?include=projects')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }
    return response.json()
  })
  .then(async data => {
    const projs = data.includes || null
    if(!projs){
      console.log("no projects")
      projects.value = []
      return
    }
    
    const promises = []
      
    for (let i = 0; i < projs.length; i++) {
      const promise = fetch(dbApi + '/data/users_in_project/?filter=project_id=' + projs[i].id)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch users in project')
          }
          return response.json()
        })
        .then(data => {
          projs[i].users_in_project = data.data.map(user => {
            const userId = user.relationships.user_id.data.id
            return members.value.find(member => member.id === userId) || { id: userId, attributes: { username: 'Unknown User' } }
          })
        })
        .catch(err => {
          console.error('Failed to fetch users in project:', err)
        })
      
      promises.push(promise)
    }
    
    await Promise.all(promises)
    
    projects.value = projs
  })
  .catch(err => {
    console.error('Failed to fetch projects:', err)
    error.title = 'Failed to Load Projects'
    error.message = 'Unable to load projects. Please try again.'
    error.show = true
  })
}

// remove a member from the company
const handleRemoveMember = (memberId) => {

  fetch(dbApi + '/data/users_in_company/' + memberId, {
    method: 'DELETE'
  }).then(res => {
    if(!res.ok){
      error.title = 'Failed to Remove Member'
      error.message = 'Unable to remove member. Please try again.'
      error.show = true
      throw new Error('Failed to remove member')
    }
  }).then(() => {
    const index = members.value.findIndex(member => member.id === memberId)
    if (index > -1) {
      members.value.splice(index, 1)
    }
  })
}

//create a project
//TODO: make dynamic so that it can be used for editing projects as well
//TODO: the number of input fields should be dynamic 
// based on the number of editable fields in the db
const handleCreateProject = (project) => {
  fetch(dbApi + '/data/projects', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        attributes: {
          name: project.name,
          deadline: project.deadline,
          company_id: company.value.id,
          admin_id: auth.value.id
        }
      }
    })
  }).then(res => {
    if(!res.ok){
      throw new Error('Failed to create project')
    }
    return res.json()
  }).then(data => {
      const projectId = data.data.id
      project.usersInProject.forEach(userId => {
        fetch(dbApi + '/data/users_in_project', {
          method: 'POST',
          body: JSON.stringify({
            data: {
              attributes: {
                project_id: projectId,
                user_id: userId
              }
            }
          })
        }).then(res => {
          if(!res.ok){
            throw new Error('Failed to add user to project')
          }
        }).catch(err => {
          console.error('Failed to add user to project:', err)
        })
      })
    }).then(() => {
      fetchProjects()
    }).catch(err => {
      console.error('Failed to create project:', err)
    })
  
}
</script>
