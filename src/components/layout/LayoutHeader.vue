<script setup>
  import { inject } from "vue";
  import LayoutNavbar from "./LayoutNavbar.vue";

  const layout = inject("layout");
</script>

<template>
  <div
    class="relative mb-4 -mt-48 bg-gradient-iati pb-8 pt-36 after:absolute after:top-0 after:right-0 after:block after:h-full after:w-full after:bg-header-image after:bg-90% after:bg-right-top after:bg-no-repeat after:opacity-25 lg:after:bg-50%"
  >
    <LayoutNavbar />
    <div class="mx-auto max-w-[1200px] pl-3.5 lg:pl-0">
      <div class="border-l-4 border-solid border-iati-blue pl-4">
        <h1 class="text-left text-4xl text-white"><b>IATI Validator</b></h1>
        <h2 v-if="layout.title" class="mt-4 text-left text-2xl text-white">{{ layout.title }}</h2>
      </div>
    </div>
  </div>
</template>
