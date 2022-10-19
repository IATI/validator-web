<template>
  <span>
    <font-awesome-icon :icon="icon" />
  </span>
</template>

<script>
  export default {
    props: {
      icon: { type: String, default: '' },
    },
  };
</script>
