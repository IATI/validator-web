<script setup>
  defineProps({
    link: { type: String, default: "#" },
    classes: { type: String, default: "" },
    external: { type: Boolean, default: false },
  });
</script>

<template>
  <router-link v-if="!external" :to="link" :class="classes">
    <slot />
  </router-link>
  <a v-else :href="link" :class="classes">
    <slot />
  </a>
</template>
