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
          
          <a href="/dashboard" class="px-4 py-2 text-blue-950 bg-white rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 inter-font text-sm">
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
          <span class="text-9xl block mt-2">ArhiTech</span>
        </h1>
        <p class="text-3xl bonbance-font mb-32">Noul tau sistem pentru organizarea si colaborarea proiectelor</p>
      </div>
    </div>
  </div>

  <!-- Second Section - Why ArhiTech -->
  <section class="py-24 relative bg-[#0c0407]">
    <div class="max-w-6xl mx-auto px-8">

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
          <div class="w-16 h-16 mx-auto mb-6 text-blue-300">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold mb-3 inter-font text-white">Economie masivă de timp</h3>
          <p class="text-blue-100 inter-font text-sm leading-relaxed">Automatizează procesul birocratic și elimină drumurile inutile la instituții.</p>
        </div>

        <div class="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
          <div class="w-16 h-16 mx-auto mb-6 text-blue-300">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold mb-3 inter-font text-white">Control complet asupra proiectelor</h3>
          <p class="text-blue-100 inter-font text-sm leading-relaxed">Vezi în timp real stadiul fiecărui document și pas din proiect.</p>
        </div>

        <div class="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
          <div class="w-16 h-16 mx-auto mb-6 text-blue-300">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold mb-3 inter-font text-white">Integrare cu Revit și ArchiCAD</h3>
          <p class="text-blue-100 inter-font text-sm leading-relaxed">Toată informația curge direct din/despre proiect, fără exporturi și importuri manuale.</p>
        </div>

        <div class="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
          <div class="w-16 h-16 mx-auto mb-6 text-blue-300">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.14 7H16c-1.65 0-3 1.35-3 3v6l-3-1.5V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v3h2V9h2v6.5L9.5 17 6 18.5V22h2v-2l4-1.5V22h8z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold mb-3 inter-font text-white">Colaborare transparentă cu clienții</h3>
          <p class="text-blue-100 inter-font text-sm leading-relaxed">Portal dedicat clienților pentru status, documente, timp și costuri.</p>
        </div>
      </div>
    </div>
  </section>  
  
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