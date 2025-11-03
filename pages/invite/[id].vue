<!--
  pages/invite/[id].vue
  ---------------------
  Invite acceptance page with modern UI design.
  Handles company and project invitations with Romanian text.
  Features entity type detection and appropriate messaging.
-->
<template>
  <!-- Enhanced main container with gradient background -->
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="w-full max-w-md">
      <!-- Enhanced app branding section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-[#0743ae] rounded-2xl mb-4">
          <div class="text-white text-3xl font-bold bonbance-font">A</div>
        </div>
        <h1 class="text-3xl font-light text-gray-900 mb-2">ArhiTech</h1>
        <p class="text-gray-600">Sistem de management documentar arhitectural</p>
      </div>
      
      <!-- Enhanced invite card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <!-- Invite icon -->
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Invite message based on entity type -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-3">
            {{ getInviteTitle() }}
          </h2>
          <p class="text-gray-600 text-base leading-relaxed mb-4">
            {{ getInviteMessage() }}
          </p>
          
          <!-- Prominent entity name display -->
          <div v-if="entityId" class="bg-gradient-to-r from-[#0743ae]/10 to-blue-100 rounded-2xl p-5 border-2 border-[#0743ae]/20">
            <div class="flex items-center justify-center space-x-3">
              <div class="p-2 bg-[#0743ae]/20 rounded-full">
                <svg v-if="entityType === 'company'" class="w-5 h-5 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <svg v-else-if="entityType === 'client'" class="w-5 h-5 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <div v-if="loading" class="text-lg font-medium text-gray-500">
                  Se încarcă...
                </div>
                <div v-else-if="entityName" class="text-xl font-bold text-[#0743ae]">
                  {{ entityName }}
                </div>
                <div v-else class="text-lg font-medium text-gray-500">
                  {{ entityType === 'company' ? 'Companie' : entityType === 'client' ? 'Proiect' : 'Entitate' }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ getEntitySubtitle() }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Join button -->
        <button 
          @click="handleInvite($route.params.id)"
          class="w-full bg-[#0743ae] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#0743ae]/90 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Alătură-te acum
        </button>

        <!-- Additional info -->
        <div class="text-center mt-6">
          <p class="text-sm text-gray-500">
            Apasă butonul pentru a accepta invitația și a te alătura {{ entityType === 'company' ? 'companiei' : 'proiectului' }}.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    
    definePageMeta({
        layout: false
    })
    
    const {profile,auth} = useUser();
    const route = useRoute();

    const entityType = route.query.enType;
    const entityId = route.query.enId;
    
    // Reactive data for entity names
    const entityName = ref('');
    const loading = ref(true);

    // Fetch entity name based on type
    async function fetchEntityName() {
      if (!entityId || !entityType) {
        loading.value = false;
        return;
      }

      try {
        const config = useRuntimeConfig();
        const dbApi = config.public.dbApi;
        
        if (entityType === 'company') {
          const res = await fetch(`${dbApi}/data/companies/${entityId}`);
          if (res.ok) {
            const data = await res.json();
            entityName.value = data.data.attributes.name;
          }
        } else if (entityType === 'client') {
          const res = await fetch(`${dbApi}/data/projects/${entityId}`);
          if (res.ok) {
            const data = await res.json();
            entityName.value = data.data.attributes.name;
          }
        }
      } catch (error) {
        console.error('Error fetching entity name:', error);
      } finally {
        loading.value = false;
      }
    }

    // Fetch entity name on component mount
    onMounted(() => {
      fetchEntityName();
    });

    // Helper functions for Romanian text
    function getInviteTitle() {
      if (entityType === 'company') {
        return 'Invitație la Companie'
      } else if (entityType === 'client') {
        return 'Invitație la Proiect'
      }
      return 'Invitație'
    }

    function getInviteMessage() {
      if (entityType === 'company') {
        return 'Ai fost invitat să te alături unei companii pe platforma ArhiTech. Acceptă invitația pentru a începe să colaborezi cu echipa.'
      } else if (entityType === 'client') {
        return 'Ai fost invitat să te alături unui proiect pe platforma ArhiTech. Acceptă invitația pentru a începe să lucrezi la acest proiect.'
      }
      return 'Ai fost invitat să te alături pe platforma ArhiTech.'
    }

    function getEntitySubtitle() {
      if (entityType === 'company') {
        return 'Companie'
      } else if (entityType === 'client') {
        return 'Proiect'
      }
      return 'Entitate'
    }

    function getEntityInfo() {
      if (entityType === 'company') {
        return entityName.value ? `Compania: ${entityName.value}` : `Compania: ${entityId}`
      } else if (entityType === 'client') {
        return entityName.value ? `Proiectul: ${entityName.value}` : `Proiectul: ${entityId}`
      }
      return entityName.value || entityId
    }

    async function handleInvite(token) {
        const res = await fetch('/api/validateInviteEmail', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            token: token,
            inviteType: "team-member",
            userEmail: profile.value.email,
            userId: auth.value.id
        })
      })
        if(!res.ok)
            console.log("Diddy works here");
        console.log(res.text)
    
    } 
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@font-face {
  font-family: 'Bonbance';
  src: url('/fonts/Bonbance-BoldCondensed.otf') format('opentype');
  font-weight: bold;
  font-style: normal;
}

.bonbance-font {
  font-family: 'Bonbance', sans-serif;
}

.inter-font {
  font-family: 'Inter', sans-serif;
}
</style>