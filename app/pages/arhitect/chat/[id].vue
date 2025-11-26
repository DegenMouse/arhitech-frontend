<template>
    <div>
        {{ $route.params.id }}
    </div>
</template>

<script setup>
    const roomId = $route.params.id
</script>