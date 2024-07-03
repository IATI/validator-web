<script setup>
  const props = defineProps({ outline: { type: Boolean, default: false } });
  const emit = defineEmits(["click"]);

  const classes = {
    "bg-iati-green !text-white hover:bg-iati-blue": !props.outline,
    "bg-white !text-iati-green hover:bg-iati-green hover:!text-white border-iati-green border border-solid":
      props.outline,
  };
</script>

<template>
  <button
    class="mx-auto mt-auto inline-block px-5 py-2 disabled:cursor-not-allowed disabled:opacity-75"
    :class="classes"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
