<script setup>
  const props = defineProps({ icon: { type: String, default: "" } });
</script>

<template>
  <span class="inline-block h-3 w-3" :class="`bg-${props.icon}`"></span>
</template>
