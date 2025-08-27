<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">Notifications</h2>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="space-y-6">
      <div v-for="i in 3" :key="i" class="flex items-start space-x-4 animate-pulse">
        <div class="p-2 rounded-xl bg-gray-200 w-9 h-9"></div>
        <div class="flex-1">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="notifications.length === 0" class="text-center py-8">
      <div class="p-3 bg-gray-100 rounded-xl inline-flex mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      </div>
      <p class="text-gray-500 text-sm">No notifications at the moment</p>
    </div>
    
    <!-- Notifications list -->
    <div v-else class="space-y-6">
      <div v-for="notification in notifications" :key="notification.id" class="flex items-start space-x-4 border border-blue-200 rounded-xl p-4 bg-blue-50/30">
        <div class="p-2 rounded-xl bg-blue-100 border border-blue-200 flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">{{ notification.attributes.name }}</p>
          <p v-if="notification.docTypeName" class="text-sm text-blue-600 mt-1">{{ notification.docTypeName }}</p>
          <p v-if="notification.attributes.description" class="text-sm text-gray-700 mt-1">{{ notification.attributes.description }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ formatTime(notification.attributes.trigger_time) }}</p>
        </div>
        <button 
          @click="deleteNotification(notification.id)" 
          class="p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete notification"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { auth } = useUser()
const config = useRuntimeConfig()
const dbApi = config.public.dbApi

const notifications = ref([])
const loading = ref(true)

// Fetch notifications for current user with status 'sent'
const fetchNotifications = async () => {
  if (!auth.value.isLoggedIn) return
  
  try {
    loading.value = true
    const response = await fetch(`${dbApi}/data/users/${auth.value.id}/notifications?filter[status]=sent&include=docType_id`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch notifications')
    }
    
    const data = await response.json()
    notifications.value = data.data || []
    
    // Store included data for easy access
    if (data.included) {
      notifications.value.forEach(notification => {
        // Find the docType for this notification
        const docType = data.included.find(item =>
          item.type === 'docTypes' && item.id === notification.relationships?.docType_id?.data?.id
        )
        
        if (docType) {
          // Add docType name to notification for easy access
          notification.docTypeName = docType.attributes?.name
        }
      })
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    notifications.value = []
  } finally {
    loading.value = false
  }
}

// Get notification icon based on notification name/type
const getNotificationIcon = (name) => {
  const nameStr = name?.toLowerCase() || ''
  
  if (nameStr.includes('project')) {
    return {
      iconBg: 'bg-[#0743ae]/10',
      iconColor: 'text-[#0743ae]',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>'
    }
  }
  
  if (nameStr.includes('document')) {
    return {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>'
    }
  }
  
  // Default notification icon (bell)
  return {
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>'
  }
}

// Format time for display
const formatTime = (dateString) => {
  if (!dateString) return 'Unknown time'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now - date
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString()
}

// Delete notification function
const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(`${dbApi}/data/notifications/${notificationId}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete notification')
    }
    
    // Remove from UI immediately
    notifications.value = notifications.value.filter(n => n.id !== notificationId)
  } catch (error) {
    console.error('Error deleting notification:', error)
  }
}

// Fetch notifications on component mount
onMounted(() => {
  fetchNotifications()
})

// Watch for auth changes to refetch notifications
watch(() => auth.value.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    fetchNotifications()
  } else {
    notifications.value = []
  }
})
</script>