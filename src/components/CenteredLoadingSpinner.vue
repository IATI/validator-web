<script setup>
  import LoadingSpinner from "./LoadingSpinner.vue";
</script>

<template>
  <div class="flex flex-col items-center">
    <LoadingSpinner />
    <slot />
  </div>
</template>
