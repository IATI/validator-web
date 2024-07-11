<script setup>
  import StyledLink from "./StyledLink.vue";

  const props = defineProps({
    to: { type: String, default: "#" },
    external: { type: Boolean, default: false },
  });
</script>

<template>
  <StyledLink
    class="mx-auto mt-auto inline-block bg-iati-green px-5 py-2 uppercase !text-white hover:bg-iati-blue"
    :to="props.to"
    :external="props.external"
    role="button"
  >
    <slot />
  </StyledLink>
</template>
