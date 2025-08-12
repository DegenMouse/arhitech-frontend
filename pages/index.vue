<template>
  <div class="min-h-screen bg-cover bg-center bg-no-repeat flex items-start justify-center pt-20" :style="{ backgroundImage: 'url(/img/landingPage/lp1.png)' }">
    <div class="text-center text-white">
      <h1 class="text-6xl font-bold mb-6 bonbance-font">
        <span class="text-9xl block mt-2">ArhiTech</span>
      </h1>
      <p class="text-3xl bonbance-font mb-32">Noul tau sistem pentru organizarea si colaborarea proiectelor</p>
      <div class="flex gap-6 justify-center">
        <button class="px-8 py-4 text-xl border-4 border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors rounded-full inter-font">
          Pentru Arhitecti
        </button>
        <button class="px-8 py-4 text-xl border-4 border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors rounded-full inter-font">
          Pentru Clienti
        </button>
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