<template>
  <div class="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
    <!-- Chat header -->
    <div class="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
      <div class="max-w-4xl mx-auto px-6 py-4">
        <div class="flex items-center space-x-4">
          <button
            @click="navigateTo('/arhitect/chats')"
            class="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div class="p-2 bg-[#0743ae]/10 rounded-xl">
            <svg class="w-6 h-6 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900">{{ projectName }} Chat</h1>
            <p class="text-sm text-gray-500">Conversație proiect</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-6 py-6">
      <div class="max-w-4xl mx-auto space-y-4">
        <transition-group name="message-fade" tag="div">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'flex',
              msg.sentBy === currentUserId ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="[
                'max-w-[70%] rounded-2xl px-4 py-3 shadow-sm',
                msg.sentBy === currentUserId
                  ? 'bg-[#0743ae] text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              ]"
            >
              <div
                v-if="msg.sentBy !== currentUserId"
                class="text-xs font-medium mb-1 text-gray-500"
              >
                {{ msg.senderName || 'Utilizator' }}
              </div>
              <div class="text-sm leading-relaxed break-words">
                {{ msg.text }}
              </div>
              <div :class="[
                'text-xs mt-1',
                msg.sentBy === currentUserId ? 'text-blue-100' : 'text-gray-400'
              ]">
                {{ formatTimestamp(msg.sentAt) }}
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- Input area -->
    <div class="bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
      <div class="max-w-4xl mx-auto px-6 py-4">
        <div class="flex items-center space-x-3">
          <input
            v-model="message"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Scrie mesajul..."
            class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0743ae]"
          />
          <button
            @click="sendMessage"
            :disabled="!message.trim()"
            class="px-6 py-3 bg-[#0743ae] hover:bg-[#0743ae]/90 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0743ae] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" transform="rotate(90 12 12)"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { io } from 'socket.io-client'
    
    const route = useRoute()
    const chatRoom_id = route.params.id
    const message = ref('')
    const messages = ref([])
    const messagesContainer = ref(null)
    const projectName = ref('')

    const { auth, profile } = useUser()
    const config = useRuntimeConfig()
    const dbApi = config.public.dbApi
    const senderId = auth.value?.id
    const socket = io('http://localhost:3002')
    const currentUserId = computed(() => auth.value?.id)
    
    async function fetchProjectName() {
        try {
            const res = await fetch(dbApi + '/data/projects/' + chatRoom_id)
            if (res.ok) {
                const data = await res.json()
                console.log("❤️‍🩹")
                console.log(data)
                projectName.value = data.data.attributes.name
            }
        } catch (error) {
            console.error('Error fetching project name:', error)
        }
    }
    
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
                chatRoom_id: msg.attributes?.chatRoom_id,
                sentAt: msg.attributes?.sentAt || new Date().toISOString()
            }))
            
            // Scroll to bottom after messages load
            await nextTick()
            scrollToBottom()
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }
    
    function scrollToBottom() {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
    }
    
    function formatTimestamp(timestamp) {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        
        const timeStr = date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
        
        if (messageDate.getTime() === today.getTime()) {
            // Today - just show time
            return timeStr
        } else if (messageDate.getTime() === today.getTime() - 86400000) {
            // Yesterday
            return `Ieri, ${timeStr}`
        } else {
            // Older - show date and time
            const dateStr = date.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' })
            return `${dateStr}, ${timeStr}`
        }
    }
    
    onMounted(() => {
        fetchProjectName()
        socket.emit("join-room", chatRoom_id)
        fetchMessages()
        
        // Listen for new messages from socket
        socket.on("receive-message", (msg) => {
            messages.value.push({
                id: Date.now(),
                text: msg.text,
                sentBy: msg.senderId,
                senderName: msg.senderName  || 'Error loading sender name',
                chatRoom_id: chatRoom_id,
                sentAt: msg.sentAt || new Date().toISOString()
            })
            // Scroll to bottom when new message arrives
            nextTick(() => scrollToBottom())
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
        const now = new Date().toISOString()
        messages.value.push({
            id: Date.now(),
            text: message.value,
            sentBy: auth.value.id,
            senderName: profile.value.username,
            chatRoom_id: chatRoom_id,
            sentAt: now
        })

        message.value = ''
        // Scroll to bottom after sending
        await nextTick()
        scrollToBottom()
    }
</script>

<style scoped>
.message-fade-enter-active {
  transition: all 0.3s ease-out;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.message-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>