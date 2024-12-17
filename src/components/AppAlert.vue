<script setup>
  const props = defineProps({ variant: { type: String, default: "default" } });

  const borderColour = {
    "border-iati-blue": props.variant === "default",
    "border-success": props.variant === "success",
    "border-advisory": props.variant === "advisory",
    "border-warning": props.variant === "warning",
    "border-error": props.variant === "error",
    "border-critical": props.variant === "critical",
  };
</script>

<template>
  <div class="border-solid border-0 border-l-[6px] bg-slate-100 p-3" :class="borderColour"><slot /></div>
</template>
