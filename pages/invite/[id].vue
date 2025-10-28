<template>
    <button @click="handleInvite($route.params.id)">
        Click to join
    </button>
</template>

<script setup>
    const {profile,auth} = useUser();
    const route = useRoute();

    // this will need login check

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