<script setup>
  const props = defineProps({ severity: { type: Object, default: null } });
  const bgClass = {
    'bg-success': props.severity.id === 'success',
    'bg-warning': props.severity.id === 'warning',
    'bg-error': props.severity.id === 'error',
    'bg-critical': props.severity.id === 'critical',
  };
</script>
<template>
  <div :class="bgClass" class="px-4 py-2 text-white">{{ props.severity.name }}</div>
</template>
