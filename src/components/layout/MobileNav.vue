<script setup>
  import NavbarItem from "./NavbarItem.vue";

  defineProps({
    toolNavItems: {
      type: [
        {
          link: String,
          text: String,
          external: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    generalNavItems: {
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
  <div class="iati-mobile-nav js-iati-mobile-nav">
    <div class="iati-mobile-nav__overlay js-iati-mobile-overlay"></div>
    <nav class="iati-mobile-nav__menu">
      <div class="iati-mobile-nav__header">
        <h2 class="iati-mobile-nav__label">Menu</h2>
        <button class="iati-menu-toggle iati-menu-toggle--close js-iati-menu-toggle-close">
          <span>Close</span>
        </button>
      </div>
      <ul>
        <li v-for="({ link, text, external }, index) in toolNavItems" :key="index" class="iati-mobile-nav__item">
          <NavbarItem :link="link" classes="iati-mobile-nav__link" :external="external">{{ text }}</NavbarItem>
        </li>
      </ul>
      <ul>
        <li v-for="({ link, text, external }, index) in generalNavItems" :key="index" class="iati-mobile-nav__item">
          <NavbarItem :link="link" classes="iati-mobile-nav__link" :external="external">{{ text }}</NavbarItem>
        </li>
      </ul>
    </nav>
  </div>
</template>
