<script setup>
  import { ref } from "vue";

  const props = defineProps({ open: { type: Boolean, default: false } });

  const isOpen = ref(props.open);

  const toggleAccordion = () => {
    isOpen.value = !isOpen.value;
  };
</script>

<template>
  <div v-auto-animate class="w-full">
    <button
      class="relative flex w-full items-center space-x-3 p-0 border-none"
      :aria-expanded="isOpen"
      @click="toggleAccordion()"
    >
      <slot name="title" />

      <svg
        class="absolute right-4 w-3 transform transition-all duration-200"
        :class="{
          'rotate-180': isOpen,
          'rotate-0': !isOpen,
        }"
        fill="none"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 10"
        aria-hidden="true"
      >
        <path d="M15 1.2l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div v-if="isOpen">
      <slot name="content" />
    </div>
  </div>
</template>
