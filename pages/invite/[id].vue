<template>
    <button @click="handleInvite($route.params.id)">
        Click to join
    </button>
    <div>{{ entityId }}</div>
    <div>{{ entityType }}</div>
</template>

<script setup>
    
    definePageMeta({
        layout: false
    })
    
    const {profile,auth} = useUser();
    const route = useRoute();

    const entityType = route.query.enType;
    const entityId = route.query.enId;




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