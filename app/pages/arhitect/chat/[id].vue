<template>
    <div>
        <div>
            <div v-for="msg in messages" :key="msg.id">
                <div>
                    <strong>{{ msg.senderName || 'User' }}:</strong> {{ msg.text }}
                </div>
            </div>
        </div>
        
        <input v-model="message" type="text" placeholder="Scrie mesajul">
        <button @click="sendMessage"> 
            Click me
        </button>
    </div>
</template>

<script setup>
    import { io } from 'socket.io-client'
    
    const route = useRoute()
    const chatRoom_id = route.params.id
    const message = ref('')
    const messages = ref([])

    const { auth, profile } = useUser()
    const config = useRuntimeConfig()
    const dbApi = config.public.dbApi
    const senderId = auth.value.id
    const socket = io('http://localhost:3002')
    
    async function fetchMessages() {
        try {
            const res = await fetch(dbApi + '/data/chatMessages?filter=chatRoom_id=' + chatRoom_id + '&sort=sentAt', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            
            if (!res.ok) {
                throw new Error('Failed to fetch messages')
            }
            
            const data = await res.json()
            messages.value = data.data.map(msg => ({
                id: msg.id,
                text: msg.attributes?.text || '',
                sentBy: msg.attributes?.sentBy || '',
                senderName: msg.attributes?.senderName || profile.value.username || 'Error loading sender name',
                chatRoom_id: msg.attributes?.chatRoom_id
            }))
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }
    
    onMounted(() => {
        socket.emit("join-room", chatRoom_id)
        fetchMessages()
        
        // Listen for new messages from socket
        socket.on("receive-message", (msg) => {
            messages.value.push({
                id: Date.now(),
                text: msg.text,
                sentBy: msg.senderId,
                senderName: msg.senderName  || 'Error loading sender name',
                chatRoom_id: chatRoom_id
            })
        })
    })

    async function sendMessage() {
        if (!message.value.trim()) return   
        
        // socket io msg
        socket.emit("send-message", {
            roomId: chatRoom_id,
            text: message.value,
            senderId,
            senderName: profile.value.username
        });

        // save msg to db
        const res = await fetch(dbApi + '/data/chatMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: { attributes: { id: null, chatRoom_id, text: message.value, sentBy: auth.value.id, senderName: profile.value.username } }
            })
        })
        
        if (!res.ok) {
            console.log("💔")
            throw new Error("Failed to save message")
        }
        // add the msg the msg list instatnly
        messages.value.push({
            id: Date.now(),
            text: message.value,
            sentBy: auth.value.id,
            senderName: auth.value.username,
            chatRoom_id: chatRoom_id
        })

        message.value = ''
        // await fetchMessages()
    }
</script>