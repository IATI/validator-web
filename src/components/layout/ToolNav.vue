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
  <div class="iati-header__nav">
    <nav>
      <ul class="iati-tool-nav">
        <li v-for="({ link, text, external }, index) in items" :key="index">
          <NavbarItem :link="link" classes="iati-tool-nav-link" :external="external">{{ text }}</NavbarItem>
        </li>
      </ul>
    </nav>
  </div>
</template>
