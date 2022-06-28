<script setup>
  const props = defineProps({ severity: { type: Object, default: null } });
</script>
<template>
  <div :class="['bg-' + props.severity.id]" class="px-4 py-2 text-white">{{ props.severity.name }}</div>
</template>
