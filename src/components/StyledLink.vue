<template>
  <router-link v-if="!external" :to="to" class="text-iati-green" :title="title"><slot /></router-link>
  <a v-else :href="to" target="_blank" class="text-iati-green" :title="title" @click.stop><slot /></a>
</template>

<script>
  export default {
    props: {
      to: { type: String, default: "#" },
      external: { type: Boolean, default: false },
      title: { type: String, default: "" },
    },
  };
</script>
