<!--
  pages/dashboard.vue
  -------------------
  Enhanced dashboard page with mock data and modern UI design.
  Features overview cards, recent activity, project stats, and quick actions.
  Provides a comprehensive view of user's work and company metrics.
-->
<template>
  <!-- Enhanced dashboard container with modern design -->
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Enhanced dashboard header -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-[#0743ae]/10 rounded-xl">
              <svg class="w-8 h-8 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-medium text-gray-900 mb-1">Dashboard</h1>
              <p class="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Active Projects Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-[#0743ae]/10 rounded-xl">
              <svg class="w-6 h-6 text-[#0743ae]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              +12% this month
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ stats.activeProjects }}</h3>
          <p class="text-sm text-gray-600">Active Projects</p>
        </div>

        <!-- Pending Documents Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-orange-100 rounded-xl">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
              Needs attention
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ stats.pendingDocs }}</h3>
          <p class="text-sm text-gray-600">Pending Documents</p>
        </div>

        <!-- Team Members Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-blue-100 rounded-xl">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              +2 this week
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ stats.teamMembers }}</h3>
          <p class="text-sm text-gray-600">Team Members</p>
        </div>

        <!-- Completion Rate Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-green-100 rounded-xl">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              +5% this week
            </div>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ stats.completionRate }}%</h3>
          <p class="text-sm text-gray-600">Completion Rate</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Activity -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <button class="text-[#0743ae] hover:text-[#0743ae]/80 text-sm font-medium">View All</button>
            </div>
            <div class="space-y-6">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-4">
                <div :class="activity.iconBg" class="p-2 rounded-xl flex-shrink-0">
                  <svg class="w-5 h-5" :class="activity.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="activity.icon"></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
                </div>
                <div v-if="activity.status" :class="activity.statusColor" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ activity.status }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- To-Do Panel -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">To-Do List</h3>
            <button class="text-[#0743ae] hover:text-[#0743ae]/80 text-sm font-medium">Add Task</button>
          </div>
          <div class="space-y-3">
            <div v-for="todo in todoList" :key="todo.id" class="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <input type="checkbox" :checked="todo.completed" class="w-4 h-4 text-[#0743ae] rounded focus:ring-[#0743ae] border-gray-300">
              <div class="flex-1 min-w-0">
                <p :class="todo.completed ? 'line-through text-gray-500' : 'text-gray-900'" class="text-sm font-medium">
                  {{ todo.task }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  <span :class="todo.priorityColor" class="px-2 py-1 rounded-full text-xs font-medium mr-2">
                    {{ todo.priority }}
                  </span>
                  Due {{ todo.dueDate }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Set page title
useHead({
  title: 'Dashboard - ArhiTech'
})

// Mock data for dashboard
const stats = ref({
  activeProjects: 8,
  pendingDocs: 23,
  teamMembers: 12,
  completionRate: 87
})

const recentActivity = ref([
  {
    id: 1,
    description: 'New project "Residential Complex A" was created',
    time: '2 hours ago',
    status: 'New',
    statusColor: 'bg-green-100 text-green-800',
    iconBg: 'bg-[#0743ae]/10',
    iconColor: 'text-[#0743ae]',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>'
  },
  {
    id: 2,
    description: 'Document "Building Permit Form" was uploaded',
    time: '4 hours ago',
    status: 'Uploaded',
    statusColor: 'bg-blue-100 text-blue-800',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>'
  },
  {
    id: 3,
    description: 'Maria Popescu joined the team',
    time: '1 day ago',
    status: 'Joined',
    statusColor: 'bg-green-100 text-green-800',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>'
  },
  {
    id: 4,
    description: 'Project "Office Building B" completed anteCU phase',
    time: '2 days ago',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-800',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
  },
  {
    id: 5,
    description: 'Document review pending for "Commercial Center"',
    time: '3 days ago',
    status: 'Pending',
    statusColor: 'bg-orange-100 text-orange-800',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
  }
])


// To-do list data
const todoList = ref([
  {
    id: 1,
    task: 'Review building permit documents for Residential Complex A',
    completed: false,
    priority: 'High',
    priorityColor: 'bg-red-100 text-red-800',
    dueDate: 'Today'
  },
  {
    id: 2,
    task: 'Schedule site inspection for Office Building B',
    completed: false,
    priority: 'Medium',
    priorityColor: 'bg-orange-100 text-orange-800',
    dueDate: 'Tomorrow'
  },
  {
    id: 3,
    task: 'Update project timeline for Commercial Center',
    completed: true,
    priority: 'Low',
    priorityColor: 'bg-green-100 text-green-800',
    dueDate: 'Yesterday'
  },
  {
    id: 4,
    task: 'Upload technical drawings to project repository',
    completed: false,
    priority: 'Medium',
    priorityColor: 'bg-orange-100 text-orange-800',
    dueDate: 'Friday'
  },
  {
    id: 5,
    task: 'Coordinate with structural engineer team',
    completed: false,
    priority: 'High',
    priorityColor: 'bg-red-100 text-red-800',
    dueDate: 'Next week'
  }
])
</script>