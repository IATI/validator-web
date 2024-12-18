<script setup>
  import IconChevron from "./IconChevron.vue";
  const emits = defineEmits(["next", "previous"]);
</script>

<template>
  <div class="px-4 text-center">
    <button class="mr-1 rounded-md border border-slate-200 p-4" aria-label="Previous" @click="emits('previous')">
      <IconChevron />
    </button>
    <slot />
    <button
      class="ml-1 rounded-md border border-slate-200 p-4"
      aria-label="Next"
      data-cy="next-page"
      @click="emits('next')"
    >
      <IconChevron direction="right" />
    </button>
  </div>
</template>
