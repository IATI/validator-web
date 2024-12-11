<script setup>
  const props = defineProps({ heading: { type: String, default: "" } });
</script>

<template>
  <div
    class="m-2.5 flex shrink grow basis-auto flex-col border-0 border-t-4 border-solid border-t-iati-green p-5 shadow-lg"
  >
    <h2 class="mb-2 border-0 border-b border-dashed border-b-iati-green bg-white pb-2 text-center text-xl">
      {{ props.heading }}
    </h2>
    <slot />
  </div>
</template>
