<script setup>
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import Logo from '../AppLogo.vue';
  import NavbarItem from './NavbarItem.vue';
  import NavbarTogo from './NavbarTogo.vue';

  const route = useRoute();
  const path = ref(route.path);
  const showMobileNav = ref(false);
  watch(
    () => route.path,
    async (_path) => (path.value = _path)
  );
</script>

<template>
  <nav
    class="relative z-5 mx-0 my-12 flex max-w-[1200px] flex-wrap items-center justify-between overflow-hidden bg-white p-4 shadow-md sm:py-4 sm:px-12 lg:mx-auto lg:flex-nowrap"
  >
    <div class="flex w-full justify-between lg:w-auto">
      <Logo />
      <NavbarTogo @toggle-navbar="showMobileNav = !showMobileNav" />
    </div>
    <div
      class="grow basis-full items-center transition-height duration-500 ease-in-out lg:block lg:h-auto"
      :class="[showMobileNav ? 'h-60' : 'h-0']"
    >
      <div class="mt-6 flex cursor-pointer flex-col lg:flex-row lg:justify-end">
        <NavbarItem link="/" classes="ml-0" :active="path === '/'">Home</NavbarItem>
        <NavbarItem link="/validate" classes="ml-5" :active="path === '/validate'">Check data</NavbarItem>
        <NavbarItem link="/organisations" classes="ml-5" :active="path === '/organisations'">
          Public data viewer
        </NavbarItem>
        <NavbarItem
          link="https://developer.iatistandard.org/api-details#api=iati-validator-v2"
          classes="ml-5"
          :external="true"
        >
          Public API
        </NavbarItem>
        <NavbarItem link="https://docs.validator.iatistandard.org" classes="ml-5" :external="true">About Validator</NavbarItem>
      </div>
    </div>
  </nav>
</template>
