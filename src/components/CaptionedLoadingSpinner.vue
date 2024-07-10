<script setup>
  import CenteredLoadingSpinner from "./CenteredLoadingSpinner.vue";
</script>

<template>
  <CenteredLoadingSpinner>
    <div class="pt-2"><slot /></div>
  </CenteredLoadingSpinner>
</template>
