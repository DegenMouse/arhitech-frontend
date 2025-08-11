<!--
  pages/index.vue
  ---------------
  Landing page for ArhiTech - Romanian architectural document management system.
  Features sleek design showcasing platform capabilities and value proposition.
  Includes two navigation buttons: Company Dashboard and Client Portal.
  Highlights key features like time/money savings, BIM integration, and project tools.
-->
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <!-- Navigation Header -->
    <nav class="relative z-10 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white">ArhiTech</h1>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <!-- Background decorative elements -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div class="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-6 py-20">
        <div class="text-center">
          <!-- Main headline -->
          <h2 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Romanian Architecture
            <span class="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h2>
          
          <!-- Subtitle -->
          <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            The complete digital platform for managing construction permits, documentation workflows, and project collaboration in Romania's architectural landscape.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              @click="navigateTo('/login')"
              class="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <span class="relative z-10 flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 8v10l4-4 4 4V8"></path>
                </svg>
                <span>Arhitect Platform</span>
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              @click="openClientPortal"
              class="group relative px-8 py-4 bg-transparent border-2 border-gray-400 text-gray-300 font-semibold rounded-xl hover:border-cyan-400 hover:text-cyan-400 transform hover:scale-105 transition-all duration-300"
            >
              <span class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Client Portal</span>
              </span>
            </button>
          </div>

          <!-- Value proposition stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div class="text-center">
              <div class="text-4xl font-bold text-cyan-400 mb-2">80%</div>
              <div class="text-gray-300">Time Saved</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-blue-400 mb-2">65%</div>
              <div class="text-gray-300">Cost Reduction</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-cyan-400 mb-2">100%</div>
              <div class="text-gray-300">Digital Workflow</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-white/5 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-20">
        <div class="text-center mb-16">
          <h3 class="text-4xl font-bold text-white mb-6">Everything You Need</h3>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            A comprehensive platform that streamlines every aspect of architectural project management
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Document Management -->
          <div class="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h4 class="text-xl font-bold text-white mb-4">Smart Documentation</h4>
            <p class="text-gray-300">
              Automated document generation, version control, and permit workflow management with AI-powered processing.
            </p>
          </div>

          <!-- Project Management -->
          <div class="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <h4 class="text-xl font-bold text-white mb-4">Project Tools</h4>
            <p class="text-gray-300">
              Advanced to-do lists, time tracking, budget management, and milestone tracking for complete project oversight.
            </p>
          </div>

          <!-- BIM Integration -->
          <div class="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
            <h4 class="text-xl font-bold text-white mb-4">BIM Integration</h4>
            <p class="text-gray-300">
              Seamless integration with Revit and ArchiCAD through powerful extensions and automated model processing.
            </p>
          </div>

          <!-- Client Portal -->
          <div class="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <h4 class="text-xl font-bold text-white mb-4">Client Interface</h4>
            <p class="text-gray-300">
              Beautiful, intuitive client portal for real-time project status updates and transparent communication.
            </p>
          </div>

          <!-- Money Tracking -->
          <div class="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h4 class="text-xl font-bold text-white mb-4">Financial Control</h4>
            <p class="text-gray-300">
              Advanced budget tracking, expense management, and financial reporting with automated cost calculations.
            </p>
          </div>

          <!-- Compliance -->
          <div class="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h4 class="text-xl font-bold text-white mb-4">Romanian Compliance</h4>
            <p class="text-gray-300">
              Built specifically for Romanian architectural regulations with automatic compliance checking and validation.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="max-w-7xl mx-auto px-6 py-20">
      <div class="text-center">
        <h3 class="text-4xl font-bold text-white mb-6">Ready to Transform Your Workflow?</h3>
        <p class="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join leading Romanian architectural firms who have already revolutionized their project management with ArhiTech.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            @click="navigateTo('/login')"
            class="group px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
          >
            Start Your Journey
          </button>
          
          <button
            @click="openClientPortal"
            class="px-10 py-4 border-2 border-gray-400 text-gray-300 font-bold rounded-xl hover:border-cyan-400 hover:text-cyan-400 transform hover:scale-105 transition-all duration-300"
          >
            View Client Demo
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center space-x-2 mb-4 md:mb-0">
            <div class="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-400 rounded"></div>
            <span class="text-white font-bold">ArhiTech</span>
          </div>
          <div class="text-gray-400 text-sm">
            © 2024 ArhiTech. Romanian architectural document management system.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Disable default layout for landing page
definePageMeta({
  layout: false
})

/**
 * Redirect to client portal
 */
function openClientPortal() {
  window.location.href = 'http://localhost:3001'
}

// Set page title and meta for SEO
useHead({
  title: 'ArhiTech - Romanian Architecture Made Simple',
  meta: [
    {
      name: 'description',
      content: 'Complete digital platform for Romanian architectural document management, construction permits, and project collaboration. Save time and money with automated workflows.'
    },
    {
      property: 'og:title',
      content: 'ArhiTech - Romanian Architecture Made Simple'
    },
    {
      property: 'og:description',
      content: 'Streamline your architectural workflow with smart documentation, BIM integration, and client management tools.'
    }
  ]
})
</script>