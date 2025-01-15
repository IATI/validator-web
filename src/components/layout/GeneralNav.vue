<script setup>
  import NavbarItem from "./NavbarItem.vue";

  defineProps({
    items: {
      type: [
        {
          link: String,
          text: String,
          external: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
  });
</script>

<template>
  <nav class="iati-header__general-nav">
    <ul class="iati-piped-list">
      <li v-for="({ link, text, external }, index) in items" :key="index">
        <NavbarItem :link="link" :external="external">{{ text }}</NavbarItem>
      </li>
    </ul>
  </nav>
</template>
