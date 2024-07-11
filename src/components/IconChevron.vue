<script setup>
  const props = defineProps({ direction: { type: String, default: "left" } }); // values: left, right, up, down

  const classes = {
    "rotate-90": props.direction === "left",
    "-rotate-90": props.direction === "right",
    "rotate-180": props.direction === "up",
    "rotate-0": props.direction === "down",
  };
</script>
<template>
  <svg
    class="w-3 transform transition-all duration-200"
    :class="classes"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 10"
    aria-hidden="true"
  >
    <path d="M15 1.2l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
