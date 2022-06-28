<script setup>
  const props = defineProps({ category: { type: Object, default: null } });

  console.log(props.category);
</script>
<template><div>Category Goes Here</div></template>
