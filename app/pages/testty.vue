<template>
    <div class="relative w-full h-screen bg-gray-100 flex items-center justify-center overflow-hidden">
  
      <!-- SVG layer for all arrows -->
      <svg ref="svg" class="absolute top-0 left-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrow-head" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="black" /> <!--ARROW head-->
          </marker>
        </defs>
  
        <!-- Draw all connections -->
        <line
          v-for="(conn, i) in connections"
          :key="i"
          :x1="conn.x1"
          :y1="conn.y1"
          :x2="conn.x2"
          :y2="conn.y2"
          :stroke="conn.color"
          :stroke-width="conn.width"
          :stroke-dasharray="conn.dashed ? '6 3' : null"
          marker-end="url(#arrow-head)"
        />
      </svg>
  
      <!-- Render all boxes -->
      <div
        v-for="box in boxes"
        :key="box.id"
        :ref="el => (boxRefs[box.id] = el)"
        :class="['absolute text-white px-6 py-4 rounded-lg shadow-lg select-none transition-transform', box.color]"
        :style="{ top: box.top, left: box.left }"
      >
        {{ box.label }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
  
  // 🟩 Example boxes
  const boxes = reactive([
    { id: 'a1', label: 'Request 1', top: '25%', left: '10%', color: 'bg-blue-500' },
    { id: 'b1', label: 'Response 1', top: '25%', left: '70%', color: 'bg-green-500' },
    { id: 'a2', label: 'Request 2', top: '65%', left: '10%', color: 'bg-blue-500' },
    { id: 'b2', label: 'Response 2', top: '65%', left: '70%', color: 'bg-green-500' }
  ])
  
  // 🧭 Which boxes connect
  const connections = reactive([
    { from: 'a1', to: 'b1', color: 'blue', width: 2, dashed: true, x1: 0, y1: 0, x2: 0, y2: 0 },
    { from: 'b2', to: 'a2', color: 'red', width: 3, dashed: false, x1: 0, y1: 0, x2: 0, y2: 0 }
  ])
  
  const boxRefs = reactive({})
  const svg = ref(null)
  
  function updateConnections() {
    connections.forEach(conn => {
      const from = boxRefs[conn.from]
      const to = boxRefs[conn.to]
      if (!from || !to) return
  
      const fromRect = from.getBoundingClientRect()
      const toRect = to.getBoundingClientRect()
      const svgRect = svg.value.getBoundingClientRect()
  
      conn.x1 = fromRect.right - svgRect.left
      conn.y1 = fromRect.top + fromRect.height / 2 - svgRect.top
      conn.x2 = toRect.left - svgRect.left
      conn.y2 = toRect.top + toRect.height / 2 - svgRect.top
    })
  }
  
  onMounted(async () => {
    await nextTick()
    updateConnections()
    window.addEventListener('resize', updateConnections)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateConnections)
  })
  </script>
  