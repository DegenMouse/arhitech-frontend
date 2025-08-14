<template>
  <div class="min-h-screen bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: 'url(/img/landingPage/lp1.png)' }">
    <!-- Transparent Navigation -->
    <nav class="absolute top-0 left-0 w-full z-10 py-4 px-8">
      <div class="flex items-center justify-center max-w-7xl mx-auto">
        <!-- Logo -->
        <div class="absolute left-0 text-white text-3xl font-bold bonbance-font -mt-3">
          <div class="w-12 h-12 rounded-full border-3 border-white flex items-center justify-center">
            A
          </div>
        </div>
        
        <!-- Center Navigation Links and Buttons -->
        <div class="flex gap-16 items-center inter-font">
          <button class="text-white hover:text-gray-300 transition-colors text-sm">De ce Arhitech</button>
          <button class="text-white hover:text-gray-300 transition-colors text-sm">Pentru cine</button>
          <button class="text-white hover:text-gray-300 transition-colors text-sm">Preturi</button>
          <button class="text-white hover:text-gray-300 transition-colors text-sm">Resurse</button>
          
          <a href="/login" class="px-4 py-2 text-blue-950 bg-white rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 inter-font text-sm">
            Dashboard Arhitect
          </a>
          <a href="http://localhost:3001/login" class="px-4 py-2 text-blue-950 bg-white rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 inter-font text-sm">
            Portal Client
          </a>
        </div>
      </div>
    </nav>

    <!-- Hero Content -->
    <div class="flex items-start justify-center pt-40">
      <div class="text-center text-white">
        <h1 class="text-6xl font-bold mb-6 bonbance-font">
          <span class="text-9xl block mt-2 select-none">ArhiTech</span>
        </h1>
        <p class="text-3xl bonbance-font mb-32 select-none">Noul tau sistem pentru organizarea si colaborarea proiectelor</p>
      </div>
    </div>
  </div>
</template>

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

<script setup>
definePageMeta({
  layout: false
})
</script>