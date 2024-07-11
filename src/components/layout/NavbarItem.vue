<template>
  <router-link v-if="!external" :to="link" :class="[classes, mainClasses, afterClasses, active && activeClasses]">
    <slot />
  </router-link>
  <a v-else :href="link" target="_blank" :class="[classes, mainClasses, afterClasses]">
    <slot />
  </a>
</template>

<script>
  export default {
    props: {
      link: { type: String, default: "#" },
      active: { type: Boolean, default: false },
      classes: { type: String, default: "" },
      external: { type: Boolean, default: false },
    },
    setup() {
      const mainClasses = "relative mb-5 block p-0 text-center text-base uppercase tracking-widest text-gray-7 lg:mb-0";
      const afterClasses =
        "after:absolute after:-bottom-5 after:left-0 after:h-1 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-iati-blue after:transition-transform after:duration-300 after:ease-out after:hover:origin-bottom-left after:hover:scale-x-100";
      const activeClasses = "origin-bottom-left scale-x-100 after:origin-bottom-left after:scale-x-100";

      return { mainClasses, afterClasses, activeClasses };
    },
  };
</script>
