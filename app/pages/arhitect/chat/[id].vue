<template>
    <button @click="sendMessage"> 
        Click me
    </button>
</template>

<script setup>
    import { io } from 'socket.io-client'
    
    const route = useRoute()
    const roomId = route.params.id

    const { auth } = useUser()
    const senderId = auth.value.id
    const socket = io('http://localhost:3002')
    
    onMounted(() => {
        
        socket.emit("join-room", roomId)

    })

    function sendMessage() {
        socket.emit("send-message", {
        roomId,
        text: "Hello!",
        senderId
});
    }

</script>